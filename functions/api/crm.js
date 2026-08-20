const allowedEntities = new Set(['leads', 'tasks', 'financeInvoices', 'financeExpenses', 'websiteEnquiries']);
const allowedActions = new Set(['bootstrap', 'list', 'create', 'upsert', 'delete', 'remove']);

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store'
    }
  });
}

function getSheetsUrl(env) {
  return (env.GOOGLE_SHEETS_WEB_APP_URL || env.SHEETS_WEB_APP_URL || '').trim();
}

function validateSheetsUrl(url) {
  if (!url) {
    return 'Set GOOGLE_SHEETS_WEB_APP_URL in Cloudflare Pages environment variables';
  }

  if (!url.includes('script.google.com/macros/s/') || !url.endsWith('/exec')) {
    return 'GOOGLE_SHEETS_WEB_APP_URL must be the Apps Script Web app /exec URL, not the Apps Script editor URL, deployment ID, /dev URL, or Google Sheet URL.';
  }

  return '';
}

async function fetchWithTimeout(url, options, timeoutMs = 90000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Apps Script request timed out. Google Sheets may be busy; try again in a moment.');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function describeInvalidResponse(text, status, contentType) {
  const trimmed = text.trim();
  const looksLikeHtml = trimmed.startsWith('<!DOCTYPE') || trimmed.startsWith('<html');
  if (looksLikeHtml) {
    return 'Apps Script returned an HTML page. In Apps Script deploy the Web app with access set to Anyone, then paste the latest /exec URL into GOOGLE_SHEETS_WEB_APP_URL.';
  }

  const preview = trimmed.replace(/\s+/g, ' ').slice(0, 120);
  const details = [`status ${status}`];
  if (contentType) details.push(contentType);
  if (preview) details.push(`body: ${preview}`);
  return `Apps Script returned a non-JSON response (${details.join(', ')}).`;
}

async function callAppsScript(sheetsUrl, outbound) {
  const response = await fetchWithTimeout(sheetsUrl, {
    method: 'POST',
    headers: { 'content-type': 'text/plain; charset=utf-8' },
    body: JSON.stringify(outbound)
  });
  const text = await response.text();
  const contentType = response.headers.get('content-type') || '';

  try {
    return { response, result: JSON.parse(text) };
  } catch {
    return {
      response,
      result: {
        ok: false,
        error: describeInvalidResponse(text, response.status, contentType)
      },
      invalidJson: true
    };
  }
}

export async function onRequestGet({ env }) {
  const sheetsUrl = getSheetsUrl(env);
  const setupError = validateSheetsUrl(sheetsUrl);
  const configured = !setupError;
  return json({
    ok: configured,
    configured,
    spreadsheetId: env.CRM_SPREADSHEET_ID || '1jyrihEYdXq4Mz_Exerbl1GlA8wmdH3jQFr1fbuBWKo4',
    error: configured ? null : setupError
  }, configured ? 200 : 501);
}

export async function onRequestPost({ request, env }) {
  const sheetsUrl = getSheetsUrl(env);
  const setupError = validateSheetsUrl(sheetsUrl);
  if (setupError) {
    return json({
      ok: false,
      configured: false,
      error: setupError
    }, 501);
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, error: 'Invalid JSON request' }, 400);
  }

  if (!allowedActions.has(payload.action)) {
    return json({ ok: false, error: 'Unsupported CRM action' }, 400);
  }

  if (payload.action !== 'bootstrap' && !allowedEntities.has(payload.entity)) {
    return json({ ok: false, error: 'Unsupported CRM sheet entity' }, 400);
  }

  const outbound = {
    ...payload,
    secret: env.SHEETS_SHARED_SECRET || ''
  };

  try {
    let { response, result, invalidJson } = await callAppsScript(sheetsUrl, outbound);
    if (invalidJson && payload.action === 'bootstrap') {
      await sleep(1200);
      ({ response, result } = await callAppsScript(sheetsUrl, outbound));
    }

    if (!response.ok || result.ok === false) {
      return json({ ok: false, error: result.error || 'Google Sheets request failed' }, 502);
    }

    return json(result);
  } catch (error) {
    return json({ ok: false, error: error.message || 'Google Sheets request failed' }, 502);
  }
}

const allowedEntities = new Set(['leads', 'tasks', 'financeInvoices', 'financeExpenses', 'websiteEnquiries']);
const allowedActions = new Set(['list', 'create', 'upsert', 'delete']);

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
  return env.GOOGLE_SHEETS_WEB_APP_URL || env.SHEETS_WEB_APP_URL || '';
}

export async function onRequestGet({ env }) {
  const configured = Boolean(getSheetsUrl(env));
  return json({
    ok: configured,
    configured,
    spreadsheetId: env.CRM_SPREADSHEET_ID || '1jyrihEYdXq4Mz_Exerbl1GlA8wmdH3jQFr1fbuBWKo4',
    error: configured ? null : 'Set GOOGLE_SHEETS_WEB_APP_URL in Cloudflare Pages environment variables'
  }, configured ? 200 : 501);
}

export async function onRequestPost({ request, env }) {
  const sheetsUrl = getSheetsUrl(env);
  if (!sheetsUrl) {
    return json({
      ok: false,
      configured: false,
      error: 'Google Sheets is not connected. Set GOOGLE_SHEETS_WEB_APP_URL in Cloudflare Pages.'
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

  if (!allowedEntities.has(payload.entity)) {
    return json({ ok: false, error: 'Unsupported CRM sheet entity' }, 400);
  }

  const outbound = {
    ...payload,
    secret: env.SHEETS_SHARED_SECRET || ''
  };

  try {
    const response = await fetch(sheetsUrl, {
      method: 'POST',
      headers: { 'content-type': 'text/plain; charset=utf-8' },
      body: JSON.stringify(outbound)
    });
    const text = await response.text();
    const result = JSON.parse(text);

    if (!response.ok || result.ok === false) {
      return json({ ok: false, error: result.error || 'Google Sheets request failed' }, 502);
    }

    return json(result);
  } catch (error) {
    return json({ ok: false, error: error.message || 'Google Sheets request failed' }, 502);
  }
}

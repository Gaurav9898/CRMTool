const CONFIG = {
  spreadsheetId: '1jyrihEYdXq4Mz_Exerbl1GlA8wmdH3jQFr1fbuBWKo4',
  enquirySpreadsheetId: '19Wm3dqs5d6f4AFiEGk7A_g_DGsQ2FrYQ_LWvafFnMbU',
  enquirySheetNames: ['Form Response 1', 'Form Responses 1', 'Form_Responses'],
  invoiceFolderId: '17rULGT6_AlXiy8u2zTvctmcBUODiskoY',
  expenseFolderId: '1eCWxjdT2j4bJc_hiK8r4nfk3pjM8MZPh',
  logoUrl: 'https://strongher-crm-tool.pages.dev/strongher-logo.png',
  businessName: 'StrongHer By Seema',
  businessEmail: 'strongherseema@gmail.com',
  businessPhone: '+91 98296 39773',
  businessOwner: 'Seema Suthar',
  sharedSecret: ''
};

const ENTITY_CONFIG = {
  leads: {
    sheetName: 'Leads',
    idColumn: 'leadId',
    headers: ['leadId', 'enquiryRowId', 'submittedAt', 'fullName', 'age', 'city', 'whatsappNumber', 'email', 'heardAbout', 'primaryGoals', 'trainingExperience', 'lookingFor', 'healthNotes', 'consultationDate', 'consultationTime', 'source', 'program', 'stage', 'priority', 'owner', 'expectedAmount', 'paidAmount', 'nextFollowUp', 'lastActivity', 'createdAt', 'updatedAt'],
    toSheet(record) {
      return {
        leadId: record.id,
        enquiryRowId: record.enquiryRowId || '',
        submittedAt: record.submittedAt || record.createdAt || now_(),
        fullName: record.name || '',
        age: record.age || '',
        city: record.city || '',
        whatsappNumber: record.phone || '',
        email: record.email || '',
        heardAbout: record.source || '',
        primaryGoals: record.goal || '',
        trainingExperience: record.trainingExperience || '',
        lookingFor: record.program || '',
        healthNotes: record.healthNotes || '',
        consultationDate: record.consultationDate || '',
        consultationTime: record.consultationTime || '',
        source: record.source || '',
        program: record.program || '',
        stage: record.stage || 'OPEN_LEAD',
        priority: record.priority || 'Warm',
        owner: record.owner || 'Team',
        expectedAmount: record.value || 0,
        paidAmount: record.paid || 0,
        nextFollowUp: record.nextFollowUp || '',
        lastActivity: record.lastActivity || '',
        createdAt: record.createdAt || now_(),
        updatedAt: record.updatedAt || now_()
      };
    },
    fromSheet(row) {
      return {
        id: row.leadId,
        name: row.fullName,
        age: Number(row.age || 0),
        city: row.city,
        phone: row.whatsappNumber,
        email: row.email,
        source: row.source || row.heardAbout,
        goal: row.primaryGoals,
        program: row.program || row.lookingFor,
        stage: row.stage || 'OPEN_LEAD',
        priority: row.priority || 'Warm',
        owner: row.owner || 'Team',
        value: Number(row.expectedAmount || 0),
        paid: Number(row.paidAmount || 0),
        nextFollowUp: row.nextFollowUp,
        healthNotes: row.healthNotes,
        lastActivity: row.lastActivity,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt
      };
    }
  },
  tasks: {
    sheetName: 'Tasks',
    idColumn: 'taskId',
    headers: ['taskId', 'leadId', 'title', 'type', 'owner', 'dueDate', 'status', 'createdAt', 'updatedAt', 'completedAt', 'notes'],
    toSheet(record) {
      return {
        taskId: record.id,
        leadId: record.leadId || '-',
        title: record.title || '',
        type: record.type || '',
        owner: record.owner || 'Team',
        dueDate: record.due || '',
        status: record.status || 'Upcoming',
        createdAt: record.createdAt || now_(),
        updatedAt: record.updatedAt || now_(),
        completedAt: record.status === 'Completed' ? now_() : '',
        notes: record.notes || ''
      };
    },
    fromSheet(row) {
      return {
        id: row.taskId,
        leadId: row.leadId || '-',
        title: row.title,
        type: row.type,
        owner: row.owner || 'Team',
        due: row.dueDate,
        status: row.status || 'Upcoming',
        createdAt: row.createdAt,
        updatedAt: row.updatedAt
      };
    }
  },
  financeInvoices: {
    sheetName: 'FinanceInvoices',
    idColumn: 'invoiceId',
    headers: ['invoiceId', 'clientId', 'leadId', 'clientName', 'clientPhone', 'clientEmail', 'billingAddress', 'program', 'description', 'amount', 'discountLabel', 'discountAmount', 'subtotal', 'taxRate', 'taxAmount', 'total', 'paid', 'status', 'invoiceDate', 'paymentDate', 'dueDate', 'validFrom', 'validUntil', 'createdAt', 'updatedAt', 'paymentMode', 'notes', 'pdfFileId', 'pdfUrl', 'pdfError'],
    toSheet(record) {
      const amount = Number(record.amount || 0);
      const discountAmount = Math.min(Number(record.discountAmount || 0), amount);
      const subtotal = Math.max(amount - discountAmount, 0);
      const taxRate = Number(record.taxRate || 0);
      const taxAmount = Math.round((subtotal * taxRate) / 100);
      const total = subtotal + taxAmount;
      const paid = Math.min(Number(record.paid || 0), total);
      return {
        invoiceId: record.id,
        clientId: record.clientId || invoiceClientId_(record),
        leadId: record.leadId || '-',
        clientName: record.client || '',
        clientPhone: record.clientPhone || '',
        clientEmail: record.clientEmail || '',
        billingAddress: record.billingAddress || '',
        program: record.program || '',
        description: record.description || record.program || '',
        amount,
        discountLabel: record.discountLabel || '',
        discountAmount,
        subtotal,
        taxRate,
        taxAmount,
        total,
        paid,
        status: record.status || 'Pending',
        invoiceDate: record.invoiceDate || normalizeDateValue_(record.createdAt) || normalizeDateValue_(now_()),
        paymentDate: record.paymentDate || '',
        dueDate: record.due || '',
        validFrom: record.validFrom || '',
        validUntil: record.validUntil || '',
        createdAt: record.createdAt || now_(),
        updatedAt: record.updatedAt || now_(),
        paymentMode: record.paymentMode || '',
        notes: record.notes || '',
        pdfFileId: record.pdfFileId || '',
        pdfUrl: record.pdfUrl || '',
        pdfError: record.pdfError || ''
      };
    },
    fromSheet(row) {
      const amount = Number(row.amount || 0);
      const discountAmount = Number(row.discountAmount || 0);
      const subtotal = Number(row.subtotal || Math.max(amount - discountAmount, 0));
      const taxRate = Number(row.taxRate || 0);
      const taxAmount = Number(row.taxAmount || Math.round((subtotal * taxRate) / 100));
      const total = Number(row.total || subtotal + taxAmount);
      return {
        id: row.invoiceId,
        clientId: row.clientId || invoiceClientId_({
          leadId: row.leadId,
          client: row.clientName,
          clientPhone: row.clientPhone,
          clientEmail: row.clientEmail
        }),
        leadId: row.leadId || '-',
        client: row.clientName,
        clientPhone: row.clientPhone,
        clientEmail: row.clientEmail,
        billingAddress: row.billingAddress,
        program: row.program,
        description: row.description,
        amount,
        discountLabel: row.discountLabel,
        discountAmount,
        subtotal,
        taxRate,
        taxAmount,
        total,
        paid: Number(row.paid || 0),
        status: row.status || 'Pending',
        invoiceDate: row.invoiceDate,
        paymentDate: row.paymentDate,
        due: row.dueDate,
        validFrom: row.validFrom,
        validUntil: row.validUntil,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        paymentMode: row.paymentMode,
        notes: row.notes,
        pdfFileId: row.pdfFileId,
        pdfUrl: row.pdfUrl,
        pdfError: row.pdfError
      };
    }
  },
  financeExpenses: {
    sheetName: 'FinanceExpenses',
    idColumn: 'expenseId',
    headers: ['expenseId', 'category', 'description', 'amount', 'taxRate', 'status', 'date', 'createdAt', 'updatedAt', 'paymentMode', 'notes', 'attachmentFileName', 'attachmentMimeType', 'attachmentFileId', 'attachmentUrl', 'attachmentError'],
    toSheet(record) {
      return {
        expenseId: record.id,
        category: record.category || '',
        description: record.description || '',
        amount: record.amount || 0,
        taxRate: record.taxRate || 18,
        status: record.status || 'Pending',
        date: record.date || '',
        createdAt: record.createdAt || now_(),
        updatedAt: record.updatedAt || now_(),
        paymentMode: record.paymentMode || '',
        notes: record.notes || '',
        attachmentFileName: record.attachmentFileName || '',
        attachmentMimeType: record.attachmentMimeType || '',
        attachmentFileId: record.attachmentFileId || '',
        attachmentUrl: record.attachmentUrl || '',
        attachmentError: record.attachmentError || ''
      };
    },
    fromSheet(row) {
      return {
        id: row.expenseId,
        category: row.category,
        description: row.description,
        amount: Number(row.amount || 0),
        taxRate: Number(row.taxRate || 18),
        status: row.status || 'Pending',
        date: row.date,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        paymentMode: row.paymentMode,
        notes: row.notes,
        attachmentFileName: row.attachmentFileName,
        attachmentMimeType: row.attachmentMimeType,
        attachmentFileId: row.attachmentFileId,
        attachmentUrl: row.attachmentUrl,
        attachmentError: row.attachmentError
      };
    }
  }
};

function authorizeStrongHerCRM() {
  const crmSpreadsheet = SpreadsheetApp.openById(CONFIG.spreadsheetId);
  const enquirySpreadsheet = SpreadsheetApp.openById(CONFIG.enquirySpreadsheetId);
  const invoiceFolder = DriveApp.getFolderById(CONFIG.invoiceFolderId);
  const expenseFolder = DriveApp.getFolderById(CONFIG.expenseFolderId);
  const invoiceAuthFile = invoiceFolder.createFile(
    Utilities.newBlob('StrongHer CRM authorization check', 'text/plain', 'strongher-crm-invoice-auth-check.txt')
  );
  const expenseAuthFile = expenseFolder.createFile(
    Utilities.newBlob('StrongHer CRM authorization check', 'text/plain', 'strongher-crm-expense-auth-check.txt')
  );
  invoiceAuthFile.setTrashed(true);
  expenseAuthFile.setTrashed(true);
  UrlFetchApp.fetch(CONFIG.logoUrl, { muteHttpExceptions: true });

  return [
    `CRM sheet: ${crmSpreadsheet.getName()}`,
    `Enquiry sheet: ${enquirySpreadsheet.getName()}`,
    `Invoice folder: ${invoiceFolder.getName()}`,
    `Expense folder: ${expenseFolder.getName()}`,
    'StrongHer CRM authorization is ready.'
  ].join('\n');
}

function doGet() {
  setupSheets_();
  return json_({ ok: true, configured: true });
}

function doPost(event) {
  try {
    const body = JSON.parse((event.postData && event.postData.contents) || '{}');
    if (CONFIG.sharedSecret && body.secret !== CONFIG.sharedSecret) {
      throw new Error('Invalid shared secret');
    }

    if (body.action === 'bootstrap') {
      return json_({ ok: true, data: bootstrap_() });
    }

    setupSheets_();

    if (body.action === 'list') {
      return json_({ ok: true, records: list_(body.entity) });
    }

    if (body.action === 'create') {
      return json_({ ok: true, record: append_(body.entity, body.record) });
    }

    if (body.action === 'upsert') {
      return json_({ ok: true, record: upsert_(body.entity, body.record) });
    }

    if (body.action === 'delete' || body.action === 'remove') {
      return json_({ ok: true, deleted: delete_(body.entity, body.id) });
    }

    throw new Error('Unsupported action');
  } catch (error) {
    return json_({ ok: false, error: error.message });
  }
}

function setupSheets_() {
  const spreadsheet = SpreadsheetApp.openById(CONFIG.spreadsheetId);
  Object.keys(ENTITY_CONFIG).forEach((entity) => {
    const config = ENTITY_CONFIG[entity];
    let sheet = spreadsheet.getSheetByName(config.sheetName);
    if (!sheet) {
      sheet = spreadsheet.insertSheet(config.sheetName);
    }
    ensureSheetHeaders_(sheet, config.headers);
  });

  let historySheet = spreadsheet.getSheetByName('LeadStatusHistory');
  if (!historySheet) {
    historySheet = spreadsheet.insertSheet('LeadStatusHistory');
  }
  const historyHeaders = ['historyId', 'leadId', 'previousStage', 'newStage', 'changedBy', 'changedAt', 'note', 'nextFollowUp'];
  ensureSheetHeaders_(historySheet, historyHeaders);
}

function ensureSheetHeaders_(sheet, headers) {
  const width = Math.max(sheet.getLastColumn(), headers.length);
  const existingHeaders = sheet.getRange(1, 1, 1, width).getValues()[0].filter(Boolean);
  if (existingHeaders.length === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
    return;
  }

  const missingHeaders = headers.filter((header) => existingHeaders.indexOf(header) === -1);
  if (missingHeaders.length > 0) {
    sheet.getRange(1, existingHeaders.length + 1, 1, missingHeaders.length).setValues([missingHeaders]);
  }
  sheet.setFrozenRows(1);
}

function bootstrap_() {
  setupSheets_();
  return {
    leads: list_('leads'),
    tasks: list_('tasks'),
    financeInvoices: list_('financeInvoices'),
    financeExpenses: list_('financeExpenses'),
    websiteEnquiries: listWebsiteEnquiries_()
  };
}

function list_(entity) {
  if (entity === 'websiteEnquiries' || entity === 'websiteEnquiry' || entity === 'enquiries') {
    return listWebsiteEnquiries_();
  }

  const config = getConfig_(entity);
  const sheet = SpreadsheetApp.openById(CONFIG.spreadsheetId).getSheetByName(config.sheetName);
  const rows = readRows_(sheet);
  return rows.map((row) => config.fromSheet(row)).filter((record) => record.id);
}

function listWebsiteEnquiries_() {
  const spreadsheet = SpreadsheetApp.openById(CONFIG.enquirySpreadsheetId);
  const sheet = getFirstMatchingSheet_(spreadsheet, CONFIG.enquirySheetNames);
  const lastRow = sheet.getLastRow();
  const lastColumn = sheet.getLastColumn();
  if (lastRow < 2 || lastColumn < 1) return [];

  const values = sheet.getRange(1, 1, lastRow, lastColumn).getValues();
  const headers = values[0].map((header) => normalizeHeader_(header));
  const rows = values.slice(1);

  return rows.map((row, index) => {
    const rowNumber = index + 2;
    const rowData = headers.reduce((acc, header, columnIndex) => {
      acc[header] = row[columnIndex];
      return acc;
    }, {});
    const submittedAt = pick_(rowData, ['receivedat', 'timestamp', 'submittedat']);
    const email = pick_(rowData, ['emailaddress', 'email']);
    const fullName = pick_(rowData, ['fullname', 'name']);
    const age = pick_(rowData, ['age']);
    const city = pick_(rowData, ['city']);
    const phone = pick_(rowData, ['whatsappnumber', 'phone', 'mobilenumber']);
    const heardAbout = pick_(rowData, ['howdidyouhearaboutstrongher', 'heardabout', 'source']);
    const primaryGoals = pick_(rowData, ['primarygoals', 'goal', 'goals']);
    const trainingExperience = pick_(rowData, ['trainingexperience', 'fitnessexperience', 'experience']);
    const lookingFor = pick_(rowData, ['lookingfor', 'program', 'service']);
    const healthNotes = pick_(rowData, ['healthnotes', 'medicalhistory', 'injuries', 'issues']);
    const consultationDate = pick_(rowData, ['consultationdate', 'preferreddate']);
    const consultationTime = pick_(rowData, ['consultationtime', 'preferredtime']);

    return {
      id: `ENQ-${rowNumber}`,
      enquiryRowId: String(rowNumber),
      submittedAt: formatValue_(submittedAt),
      name: formatValue_(fullName) || 'Website enquiry',
      age: Number(age || 0),
      city: formatValue_(city),
      phone: formatValue_(phone),
      email: formatValue_(email),
      source: formatValue_(heardAbout) || 'Website Enquiry',
      goal: formatValue_(primaryGoals),
      program: formatValue_(lookingFor) || 'Consultation',
      stage: 'OPEN_LEAD',
      priority: 'Warm',
      owner: 'Team',
      value: 0,
      paid: 0,
      nextFollowUp: normalizeDateValue_(consultationDate) || normalizeDateValue_(submittedAt) || '',
      healthNotes: formatValue_(healthNotes) || formatValue_(trainingExperience),
      lastActivity: 'Imported from website enquiry sheet.',
      sourceKind: 'Website Enquiry',
      consultationDate: normalizeDateValue_(consultationDate),
      consultationTime: formatValue_(consultationTime),
      createdAt: formatValue_(submittedAt),
      updatedAt: now_()
    };
  }).filter((record) => record.name || record.email || record.phone);
}

function getFirstMatchingSheet_(spreadsheet, sheetNames) {
  for (let index = 0; index < sheetNames.length; index += 1) {
    const sheet = spreadsheet.getSheetByName(sheetNames[index]);
    if (sheet) return sheet;
  }
  return spreadsheet.getSheets()[0];
}

function append_(entity, record) {
  const config = getConfig_(entity);
  const sheet = SpreadsheetApp.openById(CONFIG.spreadsheetId).getSheetByName(config.sheetName);
  const sheetHeaders = getSheetHeaders_(sheet);
  let nextRecord = { ...record, createdAt: record.createdAt || now_(), updatedAt: now_() };
  if (entity === 'financeInvoices') {
    nextRecord = {
      ...nextRecord,
      id: uniqueInvoiceId_(sheet, sheetHeaders, nextRecord.id),
      clientId: nextRecord.clientId || invoiceClientId_(nextRecord)
    };
    nextRecord = attachInvoicePdf_(nextRecord);
  }
  if (entity === 'financeExpenses') {
    nextRecord = attachExpenseFile_(nextRecord);
  }
  const row = config.toSheet(nextRecord);
  sheet.appendRow(sheetHeaders.map((header) => row[header] ?? ''));
  if (entity === 'leads') {
    appendLeadHistory_('', nextRecord.stage || 'OPEN_LEAD', nextRecord);
  }
  return config.fromSheet(row);
}

function uniqueInvoiceId_(sheet, headers, requestedId) {
  const existingIds = getColumnValues_(sheet, headers, 'invoiceId');
  if (requestedId && existingIds.indexOf(String(requestedId)) === -1) return requestedId;

  const maxNumber = existingIds.reduce((max, id) => {
    const match = String(id || '').match(/INV-(\d+)$/);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 300);
  return `INV-${maxNumber + 1}`;
}

function getColumnValues_(sheet, headers, columnName) {
  const columnIndex = headers.indexOf(columnName) + 1;
  if (columnIndex < 1 || sheet.getLastRow() < 2) return [];
  return sheet.getRange(2, columnIndex, sheet.getLastRow() - 1, 1).getValues().flat().map((value) => String(value || ''));
}

function upsert_(entity, record) {
  const config = getConfig_(entity);
  const spreadsheet = SpreadsheetApp.openById(CONFIG.spreadsheetId);
  const sheet = spreadsheet.getSheetByName(config.sheetName);
  const sheetHeaders = getSheetHeaders_(sheet);
  const rowNumber = findRowNumber_(sheet, sheetHeaders, config.idColumn, record.id);
  if (!rowNumber) {
    return append_(entity, record);
  }

  const previousRow = rowObject_(sheet.getRange(rowNumber, 1, 1, sheetHeaders.length).getValues()[0], sheetHeaders);
  let nextRecord = { ...record, updatedAt: now_() };
  if (entity === 'financeInvoices') {
    nextRecord = attachInvoicePdf_(nextRecord);
  }
  if (entity === 'financeExpenses') {
    nextRecord = attachExpenseFile_(nextRecord);
  }
  const row = config.toSheet(nextRecord);
  sheet.getRange(rowNumber, 1, 1, sheetHeaders.length).setValues([sheetHeaders.map((header) => row[header] ?? '')]);

  if (entity === 'leads' && previousRow.stage !== row.stage) {
    appendLeadHistory_(previousRow.stage || '', row.stage || '', nextRecord);
  }

  return config.fromSheet(row);
}

function attachInvoicePdf_(record) {
  try {
    const row = ENTITY_CONFIG.financeInvoices.toSheet(record);
    const normalized = ENTITY_CONFIG.financeInvoices.fromSheet(row);
    const pdf = createInvoicePdf_(normalized);
    return {
      ...record,
      subtotal: normalized.subtotal,
      taxAmount: normalized.taxAmount,
      total: normalized.total,
      pdfFileId: pdf.fileId,
      pdfUrl: pdf.url,
      pdfError: ''
    };
  } catch (error) {
    return {
      ...record,
      pdfError: error.message || 'Invoice PDF could not be created'
    };
  }
}

function attachExpenseFile_(record) {
  const attachment = record.attachment;
  if (!attachment || !attachment.base64) {
    return record;
  }

  try {
    const folder = DriveApp.getFolderById(CONFIG.expenseFolderId);
    const fileName = sanitizeFileName_(`${record.id || 'Expense'} - ${attachment.name || 'receipt'}`);
    const bytes = Utilities.base64Decode(attachment.base64);
    const blob = Utilities.newBlob(bytes, attachment.mimeType || MimeType.PDF, fileName);
    const file = folder.createFile(blob);
    return {
      ...record,
      attachment: '',
      attachmentFileName: file.getName(),
      attachmentMimeType: blob.getContentType(),
      attachmentFileId: file.getId(),
      attachmentUrl: file.getUrl(),
      attachmentError: ''
    };
  } catch (error) {
    return {
      ...record,
      attachment: '',
      attachmentError: error.message || 'Expense attachment could not be uploaded'
    };
  }
}

function createInvoicePdf_(invoice) {
  const folder = DriveApp.getFolderById(CONFIG.invoiceFolderId);
  const fileName = sanitizeFileName_(`${invoice.id || 'Invoice'} - ${invoice.client || 'Client'}.pdf`);
  const html = invoiceHtml_(invoice);
  const pdfBlob = Utilities
    .newBlob(html, 'text/html', `${fileName}.html`)
    .getAs(MimeType.PDF)
    .setName(fileName);
  const file = folder.createFile(pdfBlob);
  return { fileId: file.getId(), url: file.getUrl() };
}

function invoiceHtml_(invoice) {
  const invoiceDate = formatInvoiceDate_(invoice.invoiceDate || invoice.createdAt);
  const dueDate = formatInvoiceDate_(invoice.due);
  const paymentDate = formatInvoiceDate_(invoice.paymentDate);
  const validFrom = formatInvoiceDate_(invoice.validFrom);
  const validUntil = formatInvoiceDate_(invoice.validUntil);
  const discountLabel = invoice.discountLabel || '-';
  const taxLabel = Number(invoice.taxRate || 0) > 0 ? `${invoice.taxRate}%` : 'NA';
  const logoUrl = logoDataUri_();
  const paid = Number(invoice.paid || 0);
  const balance = Math.max(Number(invoice.total || 0) - paid, 0);

  return `<!doctype html>
<html>
  <head>
    <meta charset="UTF-8">
    <style>
      body { margin: 0; padding: 44px 48px; color: #14110f; background: #f7f6f3; font-family: Arial, Helvetica, sans-serif; font-size: 12px; }
      .page { max-width: 720px; margin: 0 auto; position: relative; overflow: hidden; }
      .content { position: relative; z-index: 1; }
      .watermark { position: absolute; top: 168px; left: 50%; transform: translateX(-50%); width: 420px; height: 420px; opacity: 0.045; z-index: 0; text-align: center; }
      .watermark img { width: 100%; height: 100%; object-fit: contain; }
      .rule { height: 1px; background: #292524; margin: 0 0 14px; opacity: 0.7; }
      .header { display: flex; align-items: center; justify-content: space-between; min-height: 146px; padding-bottom: 14px; border-bottom: 1px solid #292524; }
      .invoice-title { letter-spacing: 7px; font-size: 24px; }
      .brand { display: flex; align-items: center; justify-content: flex-end; text-align: right; }
      .brand img { width: 138px; height: 138px; object-fit: contain; border-radius: 16px; background: #fff; }
      .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 42px; margin-top: 28px; }
      .meta p { margin: 0 0 8px; letter-spacing: 2px; text-transform: uppercase; }
      .meta strong { font-weight: 600; }
      .client-lines { line-height: 1.7; margin-top: 8px; }
      .items { width: 100%; border-collapse: collapse; margin-top: 34px; border-top: 1px solid #292524; border-bottom: 1px solid #292524; }
      .items th { padding: 13px 10px; border-bottom: 1px solid #292524; letter-spacing: 1px; font-size: 11px; text-transform: uppercase; font-weight: 500; }
      .items td { padding: 20px 10px 30px; text-align: center; vertical-align: top; line-height: 1.35; }
      .description { width: 36%; }
      .validity { display: block; margin-top: 18px; font-size: 11px; }
      .totals { display: grid; grid-template-columns: 1fr 210px; gap: 28px; margin-top: 34px; min-height: 210px; }
      .thanks-stamp { align-self: end; width: 176px; height: 176px; margin-left: 4px; border: 14px solid #f1ebe8; border-radius: 44% 56% 47% 53% / 55% 43% 57% 45%; background: #fffaf7; display: table; text-align: center; color: #050505; }
      .thanks-stamp div { display: table-cell; vertical-align: middle; font-size: 44px; line-height: 0.96; font-weight: 300; }
      .summary { display: grid; gap: 14px; align-content: start; }
      .summary div { display: flex; justify-content: space-between; gap: 18px; }
      .summary .total-line span { font-weight: 700; }
      .summary strong { font-size: 14px; }
      .footer { display: grid; grid-template-columns: 1fr 210px; gap: 28px; margin-top: 24px; }
      .signature { align-self: end; line-height: 1.9; }
      .signature strong { display: inline-block; margin-bottom: 16px; text-decoration: underline; font-weight: 500; }
      .note { color: #57534e; font-size: 11px; line-height: 1.5; }
    </style>
  </head>
  <body>
    <main class="page">
      <div class="watermark"><img src="${escapeHtml_(logoUrl)}" alt=""></div>
      <div class="content">
        <div class="rule"></div>
        <section class="header">
          <div class="invoice-title">INVOICE</div>
          <div class="brand">
            <img src="${escapeHtml_(logoUrl)}" alt="StrongHer logo">
          </div>
        </section>

        <section class="meta">
          <div>
            <p>NO. <strong>${escapeHtml_(invoice.id)}</strong></p>
            <p>INVOICE TO:</p>
            <div class="client-lines">
              ${escapeHtml_(invoice.client)}<br>
              ${escapeHtml_(invoice.clientPhone || '')}<br>
              ${escapeHtml_(invoice.clientEmail || '')}<br>
              ${lineBreaks_(invoice.billingAddress || '')}
            </div>
          </div>
          <div>
            <p>INVOICE DATE : <strong>${invoiceDate}</strong></p>
            <p>PAYMENT STATUS : <strong>${escapeHtml_(invoice.status || 'Pending')}</strong></p>
            ${paymentDate ? `<p>PAYMENT DATE : <strong>${paymentDate}</strong></p>` : ''}
            ${dueDate ? `<p>DUE DATE : <strong>${dueDate}</strong></p>` : ''}
            ${invoice.paymentMode ? `<p>PAYMENT MODE : <strong>${escapeHtml_(invoice.paymentMode)}</strong></p>` : ''}
          </div>
        </section>

        <table class="items">
          <thead>
            <tr>
              <th class="description">Description</th>
              <th>Price</th>
              <th>Discount</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="description">
                ${escapeHtml_(invoice.description || invoice.program || 'StrongHer coaching package')}
                ${validFrom || validUntil ? `<span class="validity">Validity:<br>${validFrom || '-'} - ${validUntil || '-'}</span>` : ''}
              </td>
              <td>${formatCurrency_(invoice.amount)}</td>
              <td>${escapeHtml_(discountLabel)}<br>${Number(invoice.discountAmount || 0) ? formatCurrency_(invoice.discountAmount) : ''}</td>
              <td>${formatCurrency_(invoice.subtotal)}</td>
            </tr>
          </tbody>
        </table>

        <section class="totals">
          <div class="thanks-stamp"><div>Thank<br>you</div></div>
          <div class="summary">
            <div><span>Sub-total :</span><strong>${formatCurrency_(invoice.subtotal)}</strong></div>
            <div><span>taxes :</span><strong>${taxLabel}${Number(invoice.taxAmount || 0) ? ` / ${formatCurrency_(invoice.taxAmount)}` : ''}</strong></div>
            <div class="total-line"><span>Total :</span><strong>${formatCurrency_(invoice.total)}</strong></div>
            <div><span>Paid :</span><strong>${formatCurrency_(invoice.paid)}</strong></div>
            <div><span>Balance Due :</span><strong>${formatCurrency_(balance)}</strong></div>
          </div>
        </section>

        <section class="footer">
          <div class="note">${lineBreaks_(invoice.notes || '')}</div>
          <div class="signature">
            <strong>${escapeHtml_(CONFIG.businessOwner)}</strong><br>
            ${escapeHtml_(CONFIG.businessEmail)}<br>
            ${escapeHtml_(CONFIG.businessPhone)}
          </div>
        </section>
      </div>
    </main>
  </body>
</html>`;
}

function logoDataUri_() {
  try {
    const response = UrlFetchApp.fetch(CONFIG.logoUrl, { muteHttpExceptions: true });
    if (response.getResponseCode() < 200 || response.getResponseCode() >= 300) {
      return CONFIG.logoUrl;
    }
    const blob = response.getBlob();
    return `data:${blob.getContentType()};base64,${Utilities.base64Encode(blob.getBytes())}`;
  } catch (error) {
    return CONFIG.logoUrl;
  }
}

function formatInvoiceDate_(value) {
  const normalized = normalizeDateValue_(value);
  if (!normalized) return '';
  const date = new Date(`${normalized}T00:00:00`);
  return Utilities.formatDate(date, Session.getScriptTimeZone(), 'MMMM d, yyyy');
}

function formatCurrency_(value) {
  const amount = Number(value || 0);
  return `${amount.toLocaleString('en-IN')}/-`;
}

function invoiceClientId_(record) {
  if (record.clientId) return record.clientId;
  if (record.leadId && record.leadId !== '-') return record.leadId;
  if (record.clientEmail) return `EMAIL-${stableKey_(record.clientEmail)}`;
  if (record.clientPhone) return `PHONE-${stableKey_(record.clientPhone)}`;
  return `CLIENT-${stableKey_(record.client || 'unknown')}`;
}

function stableKey_(value) {
  const normalized = String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .slice(0, 36);
  return normalized || 'unknown';
}

function lineBreaks_(value) {
  return escapeHtml_(value).replace(/\n/g, '<br>');
}

function escapeHtml_(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function sanitizeFileName_(value) {
  return String(value || 'Invoice.pdf').replace(/[\\/:*?"<>|]/g, '-');
}

function appendLeadHistory_(previousStage, newStage, record) {
  const sheet = SpreadsheetApp.openById(CONFIG.spreadsheetId).getSheetByName('LeadStatusHistory');
  sheet.appendRow([
    `LSH-${Date.now()}`,
    record.id || '',
    previousStage,
    newStage,
    record.owner || 'Seema',
    now_(),
    record.lastActivity || 'Lead status updated from CRM',
    record.nextFollowUp || ''
  ]);
}

function delete_(entity, id) {
  if (!id) throw new Error('Missing record id');
  if (entity === 'leads') return deleteLead_(id);
  if (entity === 'tasks') return deleteRecord_(entity, id);
  throw new Error(`Delete is not supported for ${entity}`);
}

function deleteLead_(id) {
  const spreadsheet = SpreadsheetApp.openById(CONFIG.spreadsheetId);
  const leadConfig = ENTITY_CONFIG.leads;
  const leadSheet = spreadsheet.getSheetByName(leadConfig.sheetName);
  const leadHeaders = getSheetHeaders_(leadSheet);
  const leadRowNumber = findRowNumber_(leadSheet, leadHeaders, leadConfig.idColumn, id);
  let enquiryRowId = extractEnquiryRowId_(id);
  let leadDeleted = false;

  if (leadRowNumber) {
    const leadRow = rowObject_(leadSheet.getRange(leadRowNumber, 1, 1, leadHeaders.length).getValues()[0], leadHeaders);
    enquiryRowId = enquiryRowId || leadRow.enquiryRowId;
    leadSheet.deleteRow(leadRowNumber);
    leadDeleted = true;
  }

  const taskSheet = spreadsheet.getSheetByName(ENTITY_CONFIG.tasks.sheetName);
  const invoiceSheet = spreadsheet.getSheetByName(ENTITY_CONFIG.financeInvoices.sheetName);
  const taskDeletes = deleteRowsByValue_(taskSheet, getSheetHeaders_(taskSheet), 'leadId', id);
  const invoiceDeletes = deleteRowsByValue_(invoiceSheet, getSheetHeaders_(invoiceSheet), 'leadId', id);
  const historySheet = spreadsheet.getSheetByName('LeadStatusHistory');
  const historyDeletes = historySheet ? deleteRowsByValue_(historySheet, getSheetHeaders_(historySheet), 'leadId', id) : 0;
  const enquiryDeleted = enquiryRowId ? deleteWebsiteEnquiry_(enquiryRowId) : false;

  if (!leadDeleted && !enquiryDeleted) {
    throw new Error(`Record not found: ${id}`);
  }

  return {
    id,
    leadDeleted,
    enquiryDeleted,
    linkedTasksDeleted: taskDeletes,
    linkedInvoicesDeleted: invoiceDeletes,
    historyRowsDeleted: historyDeletes
  };
}

function deleteRecord_(entity, id) {
  const config = getConfig_(entity);
  const sheet = SpreadsheetApp.openById(CONFIG.spreadsheetId).getSheetByName(config.sheetName);
  const rowNumber = findRowNumber_(sheet, getSheetHeaders_(sheet), config.idColumn, id);
  if (!rowNumber) throw new Error(`Record not found: ${id}`);
  sheet.deleteRow(rowNumber);
  return { id };
}

function deleteRowsByValue_(sheet, headers, columnName, value) {
  const columnIndex = headers.indexOf(columnName);
  if (!sheet || columnIndex === -1 || sheet.getLastRow() < 2) return 0;
  const values = sheet.getRange(2, columnIndex + 1, sheet.getLastRow() - 1, 1).getValues();
  let deleted = 0;
  for (let index = values.length - 1; index >= 0; index -= 1) {
    if (String(values[index][0]) === String(value)) {
      sheet.deleteRow(index + 2);
      deleted += 1;
    }
  }
  return deleted;
}

function deleteWebsiteEnquiry_(rowId) {
  const rowNumber = Number(rowId);
  if (!Number.isFinite(rowNumber) || rowNumber < 2) return false;
  const spreadsheet = SpreadsheetApp.openById(CONFIG.enquirySpreadsheetId);
  const sheet = getFirstMatchingSheet_(spreadsheet, CONFIG.enquirySheetNames);
  if (sheet.getLastRow() < rowNumber) return false;
  sheet.deleteRow(rowNumber);
  return true;
}

function extractEnquiryRowId_(id) {
  const match = String(id || '').match(/^ENQ-(\d+)$/);
  return match ? match[1] : '';
}

function getConfig_(entity) {
  const config = ENTITY_CONFIG[entity];
  if (!config) throw new Error(`Unsupported entity: ${entity}`);
  return config;
}

function readRows_(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  const headers = getSheetHeaders_(sheet);
  const values = sheet.getRange(2, 1, lastRow - 1, headers.length).getValues();
  return values.map((row) => rowObject_(row, headers));
}

function getSheetHeaders_(sheet) {
  if (!sheet || sheet.getLastColumn() < 1) return [];
  return sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].filter(Boolean);
}

function rowObject_(row, headers) {
  return headers.reduce((acc, header, index) => {
    acc[header] = row[index];
    return acc;
  }, {});
}

function findRowNumber_(sheet, headers, idColumn, id) {
  const idIndex = headers.indexOf(idColumn);
  if (idIndex === -1 || !id || sheet.getLastRow() < 2) return 0;
  const values = sheet.getRange(2, idIndex + 1, sheet.getLastRow() - 1, 1).getValues();
  const matchIndex = values.findIndex((row) => String(row[0]) === String(id));
  return matchIndex === -1 ? 0 : matchIndex + 2;
}

function now_() {
  return new Date().toISOString();
}

function normalizeHeader_(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function pick_(rowData, keys) {
  for (let index = 0; index < keys.length; index += 1) {
    const value = rowData[keys[index]];
    if (value !== '' && value !== null && typeof value !== 'undefined') {
      return value;
    }
  }
  return '';
}

function normalizeDateValue_(value) {
  if (!value) return '';
  if (Object.prototype.toString.call(value) === '[object Date]' && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  const text = String(value);
  const isoMatch = text.match(/\d{4}-\d{2}-\d{2}/);
  if (isoMatch) return isoMatch[0];
  const slashMatch = text.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (slashMatch) {
    return `${slashMatch[3]}-${slashMatch[1].padStart(2, '0')}-${slashMatch[2].padStart(2, '0')}`;
  }
  return '';
}

function formatValue_(value) {
  if (Object.prototype.toString.call(value) === '[object Date]' && !Number.isNaN(value.getTime())) {
    return value.toISOString();
  }
  return String(value || '').trim();
}

function json_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

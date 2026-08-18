const CONFIG = {
  spreadsheetId: '1jyrihEYdXq4Mz_Exerbl1GlA8wmdH3jQFr1fbuBWKo4',
  enquirySpreadsheetId: '19Wm3dqs5d6f4AFiEGk7A_g_DGsQ2FrYQ_LWvafFnMbU',
  enquirySheetNames: ['Form Response 1', 'Form Responses 1', 'Form_Responses'],
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
    headers: ['invoiceId', 'leadId', 'clientName', 'program', 'amount', 'paid', 'taxRate', 'status', 'dueDate', 'createdAt', 'updatedAt', 'paymentMode', 'notes'],
    toSheet(record) {
      return {
        invoiceId: record.id,
        leadId: record.leadId || '-',
        clientName: record.client || '',
        program: record.program || '',
        amount: record.amount || 0,
        paid: record.paid || 0,
        taxRate: record.taxRate || 18,
        status: record.status || 'Pending',
        dueDate: record.due || '',
        createdAt: record.createdAt || now_(),
        updatedAt: record.updatedAt || now_(),
        paymentMode: record.paymentMode || '',
        notes: record.notes || ''
      };
    },
    fromSheet(row) {
      return {
        id: row.invoiceId,
        leadId: row.leadId || '-',
        client: row.clientName,
        program: row.program,
        amount: Number(row.amount || 0),
        paid: Number(row.paid || 0),
        taxRate: Number(row.taxRate || 18),
        status: row.status || 'Pending',
        due: row.dueDate,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt
      };
    }
  },
  financeExpenses: {
    sheetName: 'FinanceExpenses',
    idColumn: 'expenseId',
    headers: ['expenseId', 'category', 'description', 'amount', 'taxRate', 'status', 'date', 'createdAt', 'updatedAt', 'paymentMode', 'notes'],
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
        notes: record.notes || ''
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
        updatedAt: row.updatedAt
      };
    }
  }
};

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
    const width = Math.max(sheet.getLastColumn(), config.headers.length);
    const existingHeaders = sheet.getRange(1, 1, 1, width).getValues()[0].filter(Boolean);
    if (existingHeaders.length === 0) {
      sheet.getRange(1, 1, 1, config.headers.length).setValues([config.headers]);
      sheet.setFrozenRows(1);
    }
  });

  let historySheet = spreadsheet.getSheetByName('LeadStatusHistory');
  if (!historySheet) {
    historySheet = spreadsheet.insertSheet('LeadStatusHistory');
  }
  const historyHeaders = ['historyId', 'leadId', 'previousStage', 'newStage', 'changedBy', 'changedAt', 'note', 'nextFollowUp'];
  const historyWidth = Math.max(historySheet.getLastColumn(), historyHeaders.length);
  const existingHistoryHeaders = historySheet.getRange(1, 1, 1, historyWidth).getValues()[0].filter(Boolean);
  if (existingHistoryHeaders.length === 0) {
    historySheet.getRange(1, 1, 1, historyHeaders.length).setValues([historyHeaders]);
    historySheet.setFrozenRows(1);
  }
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
  const rows = readRows_(sheet, config.headers);
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
  const nextRecord = { ...record, createdAt: record.createdAt || now_(), updatedAt: now_() };
  const row = config.toSheet(nextRecord);
  sheet.appendRow(config.headers.map((header) => row[header] ?? ''));
  if (entity === 'leads') {
    appendLeadHistory_('', nextRecord.stage || 'OPEN_LEAD', nextRecord);
  }
  return config.fromSheet(row);
}

function upsert_(entity, record) {
  const config = getConfig_(entity);
  const spreadsheet = SpreadsheetApp.openById(CONFIG.spreadsheetId);
  const sheet = spreadsheet.getSheetByName(config.sheetName);
  const rowNumber = findRowNumber_(sheet, config.headers, config.idColumn, record.id);
  if (!rowNumber) {
    return append_(entity, record);
  }

  const previousRow = rowObject_(sheet.getRange(rowNumber, 1, 1, config.headers.length).getValues()[0], config.headers);
  const nextRecord = { ...record, updatedAt: now_() };
  const row = config.toSheet(nextRecord);
  sheet.getRange(rowNumber, 1, 1, config.headers.length).setValues([config.headers.map((header) => row[header] ?? '')]);

  if (entity === 'leads' && previousRow.stage !== row.stage) {
    appendLeadHistory_(previousRow.stage || '', row.stage || '', nextRecord);
  }

  return config.fromSheet(row);
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
  const leadRowNumber = findRowNumber_(leadSheet, leadConfig.headers, leadConfig.idColumn, id);
  let enquiryRowId = extractEnquiryRowId_(id);
  let leadDeleted = false;

  if (leadRowNumber) {
    const leadRow = rowObject_(leadSheet.getRange(leadRowNumber, 1, 1, leadConfig.headers.length).getValues()[0], leadConfig.headers);
    enquiryRowId = enquiryRowId || leadRow.enquiryRowId;
    leadSheet.deleteRow(leadRowNumber);
    leadDeleted = true;
  }

  const taskDeletes = deleteRowsByValue_(spreadsheet.getSheetByName(ENTITY_CONFIG.tasks.sheetName), ENTITY_CONFIG.tasks.headers, 'leadId', id);
  const invoiceDeletes = deleteRowsByValue_(spreadsheet.getSheetByName(ENTITY_CONFIG.financeInvoices.sheetName), ENTITY_CONFIG.financeInvoices.headers, 'leadId', id);
  const historySheet = spreadsheet.getSheetByName('LeadStatusHistory');
  const historyDeletes = historySheet ? deleteRowsByValue_(historySheet, ['historyId', 'leadId', 'previousStage', 'newStage', 'changedBy', 'changedAt', 'note', 'nextFollowUp'], 'leadId', id) : 0;
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
  const rowNumber = findRowNumber_(sheet, config.headers, config.idColumn, id);
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

function readRows_(sheet, headers) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  const values = sheet.getRange(2, 1, lastRow - 1, headers.length).getValues();
  return values.map((row) => rowObject_(row, headers));
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

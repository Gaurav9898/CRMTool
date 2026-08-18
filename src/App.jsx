import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  BadgeIndianRupee,
  BarChart3,
  CalendarCheck,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Download,
  Dumbbell,
  FileText,
  Filter,
  Flame,
  LayoutDashboard,
  Mail,
  Menu,
  MessageCircle,
  Plus,
  ReceiptText,
  Search,
  Settings,
  Target,
  UserRound,
  UsersRound,
  Wallet,
  X
} from 'lucide-react';

const stages = [
  { code: 'OPEN_LEAD', label: 'Open Lead', color: '#1890ff' },
  { code: 'AWARENESS', label: 'Awareness', color: '#13c2c2' },
  { code: 'INTEREST', label: 'Interest', color: '#1890ff' },
  { code: 'CONSIDERATION', label: 'Consideration', color: '#722ed1' },
  { code: 'JUNK_LEAD', label: 'Junk Lead', color: '#8c8c8c' },
  { code: 'NOT_FOUND', label: 'Not Found', color: '#fa8c16' },
  { code: 'OPEN', label: 'Open', color: '#1890ff' },
  { code: 'CONTACTED', label: 'Contacted', color: '#13c2c2' },
  { code: 'QUOTATION_SENT', label: 'Quotation Sent', color: '#722ed1' },
  { code: 'NEGOTIATION', label: 'Negotiation', color: '#eb2f96' },
  { code: 'PAYMENT_PENDING', label: 'Payment Pending', color: '#faad14' },
  { code: 'PAYMENT_RECEIVED', label: 'Payment Received', color: '#52c41a' },
  { code: 'LEAD_CONVERTED', label: 'Lead Converted', color: '#52c41a' },
  { code: 'LEAD_LOST', label: 'Lead Lost', color: '#f5222d' },
  { code: 'FOLLOW_UP', label: 'Follow Up', color: '#fa8c16' },
  { code: 'ON_HOLD', label: 'On Hold', color: '#8c8c8c' }
];

const stageLookup = Object.fromEntries(stages.map((stage) => [stage.code, stage]));
const priorities = ['Hot', 'Warm', 'Cold'];
const programs = ['Online Coaching', '1:1 Live Training', 'In-Person Training', 'Habit Coaching', 'Special Conditions'];

const integrationPlan = {
  enquirySheet: {
    spreadsheetId: '19Wm3dqs5d6f4AFiEGk7A_g_DGsQ2FrYQ_LWvafFnMbU',
    gid: '1770350818',
    sourceUrl: 'https://docs.google.com/spreadsheets/d/19Wm3dqs5d6f4AFiEGk7A_g_DGsQ2FrYQ_LWvafFnMbU/edit?gid=1770350818#gid=1770350818',
    mode: 'Google Sheets now, PostgreSQL later'
  },
  crmWorkbook: {
    spreadsheetId: '1jyrihEYdXq4Mz_Exerbl1GlA8wmdH3jQFr1fbuBWKo4',
    gid: '539139390',
    sourceUrl: 'https://docs.google.com/spreadsheets/d/1jyrihEYdXq4Mz_Exerbl1GlA8wmdH3jQFr1fbuBWKo4/edit?gid=539139390#gid=539139390',
    mode: 'CRM data workbook for leads, status history, tasks, finance, reminders, clients, and settings'
  },
  crmSheets: [
    { name: 'Leads', purpose: 'Normalized enquiry records and stage ownership' },
    { name: 'Tasks', purpose: 'Follow-ups, calls, admin work, and reviews' },
    { name: 'Finance', purpose: 'Invoices, payments, dues, taxes, and profit' },
    { name: 'Expenses', purpose: 'Marketing, tools, operations, payouts, taxes, and other costs' },
    { name: 'Reminders', purpose: 'Gmail and Google Calendar reminder queue' },
    { name: 'Clients', purpose: 'Converted leads and active coaching journeys' },
    { name: 'Reports', purpose: 'Snapshot metrics for dashboards and exports' }
  ],
  reminderProviders: ['Gmail', 'Google Calendar'],
  userMode: 'Single user: Seema',
  hosting: 'Deploy on Cloudflare Pages with login access later, no custom domain yet'
};

const seedLeads = [
  {
    id: 'SH-1001',
    name: 'Aarohi Mehta',
    age: 29,
    city: 'Jodhpur',
    phone: '+91 98290 11002',
    email: 'aarohi@example.com',
    source: 'Instagram',
    goal: 'Fat Loss',
    program: 'Online Coaching',
    stage: 'FOLLOW_UP',
    priority: 'Hot',
    owner: 'Seema',
    value: 18000,
    paid: 0,
    nextFollowUp: '2026-08-19',
    healthNotes: 'Lower-back tightness, beginner strength training.',
    lastActivity: 'Booked consult for Wednesday evening.'
  },
  {
    id: 'SH-1002',
    name: 'Nisha Rathore',
    age: 34,
    city: 'Jaipur',
    phone: '+91 98290 22003',
    email: 'nisha@example.com',
    source: 'Referral',
    goal: 'Strength',
    program: '1:1 Live Training',
    stage: 'QUOTATION_SENT',
    priority: 'Hot',
    owner: 'Seema',
    value: 36000,
    paid: 12000,
    nextFollowUp: '2026-08-18',
    healthNotes: 'Wants three live sessions per week.',
    lastActivity: 'Shared 3-month package options.'
  },
  {
    id: 'SH-1003',
    name: 'Mitali Jain',
    age: 26,
    city: 'Singapore',
    phone: '+65 8899 1200',
    email: 'mitali@example.com',
    source: 'Existing Client',
    goal: 'Muscle Gain',
    program: 'Online Coaching',
    stage: 'LEAD_CONVERTED',
    priority: 'Warm',
    owner: 'Seema',
    value: 24000,
    paid: 24000,
    nextFollowUp: '2026-08-25',
    healthNotes: 'International client, prefers async check-ins.',
    lastActivity: 'Payment received and onboarding completed.'
  },
  {
    id: 'SH-1004',
    name: 'Pooja Soni',
    age: 41,
    city: 'Jodhpur',
    phone: '+91 98290 44005',
    email: 'pooja@example.com',
    source: 'Event/Workshop',
    goal: 'Posture/Mobility',
    program: 'Special Conditions',
    stage: 'CONTACTED',
    priority: 'Warm',
    owner: 'Team',
    value: 15000,
    paid: 0,
    nextFollowUp: '2026-08-17',
    healthNotes: 'Knee discomfort; wants safe movement plan.',
    lastActivity: 'Asked for medical history before call.'
  },
  {
    id: 'SH-1005',
    name: 'Rhea Sharma',
    age: 23,
    city: 'Mumbai',
    phone: '+91 98290 55006',
    email: 'rhea@example.com',
    source: 'Protein Plate',
    goal: 'General Health',
    program: 'Habit Coaching',
    stage: 'OPEN_LEAD',
    priority: 'Cold',
    owner: 'Team',
    value: 9000,
    paid: 0,
    nextFollowUp: '2026-08-21',
    healthNotes: 'Needs consistency and food routine support.',
    lastActivity: 'Website enquiry captured.'
  }
];

const seedTasks = [
  { id: 'T-201', title: 'Call Nisha about live package', leadId: 'SH-1002', owner: 'Seema', due: '2026-08-18', status: 'Due Today', type: 'Call' },
  { id: 'T-202', title: 'Review Pooja medical notes', leadId: 'SH-1004', owner: 'Seema', due: '2026-08-17', status: 'Overdue', type: 'Review' },
  { id: 'T-203', title: 'Send onboarding checklist to Mitali', leadId: 'SH-1003', owner: 'Team', due: '2026-08-20', status: 'Upcoming', type: 'WhatsApp' },
  { id: 'T-204', title: 'Confirm Aarohi consultation timing', leadId: 'SH-1001', owner: 'Team', due: '2026-08-19', status: 'Upcoming', type: 'WhatsApp' },
  { id: 'T-205', title: 'Update August finance sheet', leadId: '-', owner: 'Admin', due: '2026-08-18', status: 'Completed', type: 'Finance' }
];

const seedPayments = [
  { id: 'INV-301', leadId: 'SH-1003', client: 'Mitali Jain', program: 'Online Coaching', amount: 24000, paid: 24000, due: '2026-08-15', status: 'Paid' },
  { id: 'INV-302', leadId: 'SH-1002', client: 'Nisha Rathore', program: '1:1 Live Training', amount: 36000, paid: 12000, due: '2026-08-20', status: 'Part Paid' },
  { id: 'INV-303', leadId: 'SH-1001', client: 'Aarohi Mehta', program: 'Online Coaching', amount: 18000, paid: 0, due: '2026-08-22', status: 'Draft' },
  { id: 'INV-304', leadId: 'SH-1004', client: 'Pooja Soni', program: 'Special Conditions', amount: 15000, paid: 0, due: '2026-08-25', status: 'Pending' }
];

const seedExpenses = [
  { id: 'EXP-401', category: 'Tools & Software', description: 'CRM, scheduler and file storage', amount: 4200, date: '2026-08-04', taxRate: 18, status: 'Paid' },
  { id: 'EXP-402', category: 'Marketing', description: 'Instagram campaign for consultations', amount: 8500, date: '2026-08-10', taxRate: 18, status: 'Paid' },
  { id: 'EXP-403', category: 'Operations', description: 'Studio utilities and admin support', amount: 6500, date: '2026-08-14', taxRate: 12, status: 'Pending' },
  { id: 'EXP-404', category: 'Professional Fees', description: 'Accounting and tax filing reserve', amount: 5000, date: '2026-08-18', taxRate: 18, status: 'Planned' }
];

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'leads', label: 'Leads', icon: UsersRound },
  { id: 'tasks', label: 'Tasks', icon: ClipboardList },
  { id: 'reminders', label: 'Reminders', icon: CalendarCheck },
  { id: 'finance', label: 'Finance', icon: Wallet },
  { id: 'clients', label: 'Clients', icon: UserRound },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings }
];

const today = '2026-08-18';
const demoMode = import.meta.env.VITE_ENABLE_DEMO_DATA === 'true';
const initialLeads = demoMode ? seedLeads : [];
const initialTasks = demoMode ? seedTasks : [];
const initialPayments = demoMode ? seedPayments : [];
const initialExpenses = demoMode ? seedExpenses : [];

const crmEntities = {
  leads: 'leads',
  tasks: 'tasks',
  payments: 'financeInvoices',
  expenses: 'financeExpenses',
  websiteEnquiries: 'websiteEnquiries'
};

function formatMoney(value) {
  return `Rs ${value.toLocaleString('en-IN')}`;
}

function formatChartValue(value) {
  if (!value) return '0';
  if (value >= 100000) return `${Math.round(value / 100000)}L`;
  if (value >= 1000) return `${Math.round(value / 1000)}k`;
  return String(value);
}

function nextId(prefix, list) {
  const ids = list
    .map((item) => Number(String(item.id).split('-').pop()))
    .filter((value) => Number.isFinite(value));
  const next = Math.max(0, ...ids) + 1;
  return `${prefix}-${next}`;
}

function classNameFor(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

function stageLabel(code) {
  return stageLookup[code]?.label || code.replace(/_/g, ' ');
}

function stageStyle(code) {
  const color = stageLookup[code]?.color;
  return color ? { color, backgroundColor: `${color}16`, borderColor: `${color}33` } : undefined;
}

function clampMoney(value) {
  return Math.max(0, Number(value || 0));
}

function readAttachmentFile(file) {
  if (!file || typeof file === 'string' || !file.name || file.size === 0) {
    return Promise.resolve(null);
  }

  const maxSize = 8 * 1024 * 1024;
  if (file.size > maxSize) {
    return Promise.reject(new Error('Attachment must be 8 MB or smaller.'));
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || '');
      resolve({
        name: file.name,
        mimeType: file.type || 'application/octet-stream',
        base64: result.includes(',') ? result.split(',').pop() : result
      });
    };
    reader.onerror = () => reject(new Error('Could not read the selected attachment.'));
    reader.readAsDataURL(file);
  });
}

function cleanPhone(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  if (digits.length === 10) return `91${digits}`;
  return digits;
}

function whatsappUrl(lead, message = '') {
  const phone = cleanPhone(lead?.phone);
  const text = message || `Hi ${lead?.name || ''}, this is Seema from StrongHer. I wanted to follow up with you about your fitness coaching enquiry.`;
  return phone ? `https://wa.me/${phone}?text=${encodeURIComponent(text)}` : '#';
}

function gmailUrl({ to, subject, body }) {
  const params = new URLSearchParams({
    view: 'cm',
    fs: '1',
    to: to || '',
    su: subject || '',
    body: body || ''
  });
  return `https://mail.google.com/mail/?${params.toString()}`;
}

function calendarUrl({ title, date, details }) {
  const dateOnly = normalizeDateOnly(date);
  const start = dateOnly.replace(/-/g, '');
  const nextDate = new Date(`${dateOnly}T00:00:00`);
  nextDate.setDate(nextDate.getDate() + 1);
  const end = nextDate.toISOString().slice(0, 10).replace(/-/g, '');
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title || 'StrongHer follow-up',
    dates: `${start}/${end}`,
    details: details || ''
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function normalizeDateOnly(value, fallback = today) {
  if (!value) return fallback;
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }

  const text = String(value);
  const isoMatch = text.match(/\d{4}-\d{2}-\d{2}/);
  if (isoMatch) return isoMatch[0];

  const slashMatch = text.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (slashMatch) {
    const [, month, day, year] = slashMatch;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  return fallback;
}

function displayDate(value) {
  return normalizeDateOnly(value, '');
}

function addDays(dateText, days) {
  const date = new Date(`${normalizeDateOnly(dateText, today)}T00:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function isSameDate(value, expectedDate) {
  return normalizeDateOnly(value, '') === expectedDate;
}

function mergeLeadsWithEnquiries(sheetLeads, websiteEnquiries) {
  const seen = new Set();
  const merged = [];

  [...sheetLeads, ...websiteEnquiries].forEach((lead) => {
    const identity = lead.enquiryRowId || lead.id || `${lead.email}-${lead.phone}`;
    if (seen.has(identity)) return;
    seen.add(identity);
    merged.push(lead);
  });

  return merged;
}

async function optionalCrmRequest(action, entity, payload = {}, options = {}) {
  try {
    return await crmRequest(action, entity, payload, options);
  } catch (error) {
    return { ok: false, records: [], error: error.message };
  }
}

function compactLoadError(message) {
  if (!message) return 'failed to load';
  if (message.includes('timed out')) return 'timed out';
  return message;
}

function leadOptionLabel(lead) {
  return `${lead.name} (${lead.id})`;
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 45000) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Google Sheets request timed out. Apps Script may still be running; refresh in a moment.');
    }
    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
}

async function crmRequest(action, entity, payload = {}, options = {}) {
  const requestBody = { action, ...payload };
  if (entity) requestBody.entity = entity;

  const response = await fetchWithTimeout('/api/crm', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(requestBody)
  }, options.timeoutMs);
  const result = await response.json().catch(() => ({}));
  if (!response.ok || result.ok === false) {
    throw new Error(result.error || 'Sheet save failed');
  }
  return result;
}

function isoNow() {
  return new Date().toISOString();
}

function monthKey(value) {
  const normalized = normalizeDateOnly(value, today);
  return normalized.slice(0, 7);
}

function monthLabel(key) {
  return new Date(`${key}-01T00:00:00`).toLocaleString('en-IN', { month: 'short' });
}

function buildRevenueTrend(payments) {
  const base = new Date(`${today}T00:00:00`);
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(base);
    date.setMonth(base.getMonth() - (5 - index));
    const key = date.toISOString().slice(0, 7);
    return { key, label: monthLabel(key), value: 0 };
  });

  const monthMap = new Map(months.map((item) => [item.key, item]));
  payments.forEach((payment) => {
    const paid = clampMoney(payment.paid);
    if (!paid) return;
    const key = monthKey(payment.paidAt || payment.date || payment.due || payment.createdAt);
    const month = monthMap.get(key);
    if (month) month.value += paid;
  });

  return months;
}

function App() {
  const [active, setActive] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(() => window.matchMedia('(min-width: 861px)').matches);
  const [leads, setLeads] = useState(initialLeads);
  const [tasks, setTasks] = useState(initialTasks);
  const [payments, setPayments] = useState(initialPayments);
  const [expenses, setExpenses] = useState(initialExpenses);
  const [syncStatus, setSyncStatus] = useState({ state: 'checking', message: 'Checking Google Sheets' });
  const [query, setQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadSheets() {
      try {
        const healthResponse = await fetchWithTimeout('/api/crm', {}, 12000);
        const health = await healthResponse.json();
        if (!health.configured) {
          throw new Error(health.error || 'Google Sheets API is not configured');
        }

        const loadErrors = [];
        let sheetLeads = [];
        let websiteEnquiries = [];

        setSyncStatus({ state: 'checking', message: 'Loading CRM leads' });
        try {
          const result = await crmRequest('list', crmEntities.leads, {}, { timeoutMs: 35000 });
          sheetLeads = result.records || [];
          if (!cancelled) setLeads(sheetLeads);
        } catch (error) {
          loadErrors.push(`CRM leads ${compactLoadError(error.message)}`);
        }

        setSyncStatus({ state: 'checking', message: 'Loading website enquiries' });
        const enquiryResult = await optionalCrmRequest('list', crmEntities.websiteEnquiries, {}, { timeoutMs: 35000 });
        if (enquiryResult.ok === false) {
          loadErrors.push(`Website enquiries ${compactLoadError(enquiryResult.error)}`);
        } else {
          websiteEnquiries = enquiryResult.records || [];
        }
        if (!cancelled) setLeads(mergeLeadsWithEnquiries(sheetLeads, websiteEnquiries));

        setSyncStatus({ state: 'checking', message: 'Loading tasks' });
        try {
          const result = await crmRequest('list', crmEntities.tasks, {}, { timeoutMs: 35000 });
          if (!cancelled) setTasks(result.records || []);
        } catch (error) {
          loadErrors.push(`Tasks ${compactLoadError(error.message)}`);
        }

        setSyncStatus({ state: 'checking', message: 'Loading finance' });
        try {
          const result = await crmRequest('list', crmEntities.payments, {}, { timeoutMs: 35000 });
          if (!cancelled) setPayments(result.records || []);
        } catch (error) {
          loadErrors.push(`Invoices ${compactLoadError(error.message)}`);
        }

        try {
          const result = await crmRequest('list', crmEntities.expenses, {}, { timeoutMs: 35000 });
          if (!cancelled) setExpenses(result.records || []);
        } catch (error) {
          loadErrors.push(`Expenses ${compactLoadError(error.message)}`);
        }

        if (cancelled) return;
        setSyncStatus(
          loadErrors.length
            ? { state: 'warning', message: `Loaded available sheet data. Slow sheets: ${loadErrors.join(', ')}` }
            : { state: 'connected', message: 'Google Sheets connected' }
        );
      } catch (error) {
        if (cancelled) return;
        setLeads([]);
        setTasks([]);
        setPayments([]);
        setExpenses([]);
        setSyncStatus({ state: 'setup', message: error.message });
      }
    }

    loadSheets();

    return () => {
      cancelled = true;
    };
  }, []);

  const persistRecord = async (entity, record) => {
    if (!['connected', 'warning'].includes(syncStatus.state)) {
      throw new Error('Google Sheets is not connected yet');
    }

    setSyncStatus({ state: 'saving', message: 'Saving to Google Sheets' });
    const result = await crmRequest('upsert', entity, { record });
    setSyncStatus({ state: 'connected', message: 'Saved to Google Sheets' });
    return result.record || record;
  };

  const createRecord = async (entity, record) => {
    if (!['connected', 'warning'].includes(syncStatus.state)) {
      throw new Error('Google Sheets is not connected yet');
    }

    setSyncStatus({ state: 'saving', message: 'Saving to Google Sheets' });
    const result = await crmRequest('create', entity, { record });
    setSyncStatus({ state: 'connected', message: 'Saved to Google Sheets' });
    return result.record || record;
  };

  const deleteRecord = async (entity, id) => {
    if (!['connected', 'warning'].includes(syncStatus.state)) {
      throw new Error('Google Sheets is not connected yet');
    }

    setSyncStatus({ state: 'saving', message: 'Deleting from Google Sheets' });
    const result = await crmRequest('remove', entity, { id });
    setSyncStatus({ state: 'connected', message: 'Deleted from Google Sheets' });
    return result.deleted;
  };

  const handleSyncError = (error) => {
    setSyncStatus({ state: 'error', message: error.message || 'Google Sheets save failed' });
  };

  const metrics = useMemo(() => {
    const totalValue = leads.reduce((sum, lead) => sum + lead.value, 0);
    const revenue = payments.reduce((sum, item) => sum + item.paid, 0);
    const outstanding = payments.reduce((sum, item) => sum + Math.max((item.total || item.amount) - item.paid, 0), 0);
    const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
    const taxReserve = [...payments, ...expenses].reduce((sum, item) => {
      const taxableBase = item.paid ?? item.amount;
      return sum + Math.round((taxableBase * (item.taxRate ?? 18)) / 100);
    }, 0);
    const profit = revenue - totalExpenses - taxReserve;
    const converted = leads.filter((lead) => ['LEAD_CONVERTED', 'PAYMENT_RECEIVED'].includes(lead.stage)).length;
    const hot = leads.filter((lead) => lead.priority === 'Hot').length;
    const overdueTasks = tasks.filter((task) => task.status === 'Overdue').length;
    const dueToday = tasks.filter((task) => isSameDate(task.due, today) && task.status !== 'Completed').length;

    return {
      totalLeads: leads.length,
      activeLeads: leads.filter((lead) => !['LEAD_CONVERTED', 'LEAD_LOST', 'JUNK_LEAD'].includes(lead.stage)).length,
      conversionRate: leads.length ? Math.round((converted / leads.length) * 100) : 0,
      hot,
      totalValue,
      revenue,
      outstanding,
      totalExpenses,
      taxReserve,
      profit,
      overdueTasks,
      dueToday
    };
  }, [expenses, leads, payments, tasks]);

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesQuery = [lead.name, lead.city, lead.phone, lead.email, lead.goal, lead.program]
        .join(' ')
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesStage = stageFilter === 'All' || lead.stage === stageFilter;
      const matchesPriority = priorityFilter === 'All' || lead.priority === priorityFilter;
      return matchesQuery && matchesStage && matchesPriority;
    });
  }, [leads, priorityFilter, query, stageFilter]);

  const revenueTrend = useMemo(() => buildRevenueTrend(payments), [payments]);

  const stageCounts = stages.map((stage) => ({
    ...stage,
    count: leads.filter((lead) => lead.stage === stage.code).length
  }));

  const programMix = programs.map((program) => ({
    program,
    count: leads.filter((lead) => lead.program === program).length
  }));

  const sourcePerformance = ['Instagram', 'Referral', 'Protein Plate', 'Existing Client', 'Event/Workshop'].map((source) => {
    const sourceLeads = leads.filter((lead) => lead.source === source);
    const converted = sourceLeads.filter((lead) => ['LEAD_CONVERTED', 'PAYMENT_RECEIVED'].includes(lead.stage)).length;
    return {
      source,
      leads: sourceLeads.length,
      converted,
      value: sourceLeads.reduce((sum, lead) => sum + lead.value, 0)
    };
  });

  const updateLead = async (id, field, value) => {
    const currentLead = leads.find((lead) => lead.id === id);
    if (!currentLead) return;
    const nextLead = {
      ...currentLead,
      [field]: field === 'value' ? clampMoney(value) : value,
      updatedAt: isoNow()
    };

    try {
      const saved = await persistRecord(crmEntities.leads, nextLead);
      setLeads((current) => current.map((lead) => (lead.id === id ? saved : lead)));
    } catch (error) {
      handleSyncError(error);
    }
  };

  const deleteLead = async (lead) => {
    const confirmed = window.confirm(`Delete ${lead.name}? This removes the lead from CRM sheets, linked tasks, linked invoices, status history, and the enquiry sheet if this came from a website enquiry.`);
    if (!confirmed) return;

    try {
      await deleteRecord(crmEntities.leads, lead.id);
      setLeads((current) => current.filter((item) => item.id !== lead.id));
      setTasks((current) => current.filter((task) => task.leadId !== lead.id));
      setPayments((current) => current.filter((payment) => payment.leadId !== lead.id));
    } catch (error) {
      handleSyncError(error);
    }
  };

  const updateTask = async (id, status) => {
    const currentTask = tasks.find((task) => task.id === id);
    if (!currentTask) return;
    const nextTask = { ...currentTask, status, updatedAt: isoNow() };

    try {
      const saved = await persistRecord(crmEntities.tasks, nextTask);
      setTasks((current) => current.map((task) => (task.id === id ? saved : task)));
    } catch (error) {
      handleSyncError(error);
    }
  };

  const deleteTask = async (task) => {
    const confirmed = window.confirm(`Delete task "${task.title}"? This removes it from the Tasks sheet.`);
    if (!confirmed) return;

    try {
      await deleteRecord(crmEntities.tasks, task.id);
      setTasks((current) => current.filter((item) => item.id !== task.id));
    } catch (error) {
      handleSyncError(error);
    }
  };

  const updatePayment = async (id, field, value) => {
    const currentPayment = payments.find((payment) => payment.id === id);
    if (!currentPayment) return;
    const nextValue = ['amount', 'paid', 'taxRate', 'discountAmount'].includes(field) ? clampMoney(value) : value;
    const nextPayment = {
      ...currentPayment,
      [field]: nextValue,
      updatedAt: isoNow()
    };
    const amount = clampMoney(nextPayment.amount);
    const discountAmount = Math.min(clampMoney(nextPayment.discountAmount || 0), amount);
    const subtotal = Math.max(amount - discountAmount, 0);
    const taxRate = clampMoney(nextPayment.taxRate || 0);
    const taxAmount = Math.round((subtotal * taxRate) / 100);
    const total = subtotal + taxAmount;
    nextPayment.discountAmount = discountAmount;
    nextPayment.subtotal = subtotal;
    nextPayment.taxAmount = taxAmount;
    nextPayment.total = total;
    nextPayment.paid = Math.min(clampMoney(nextPayment.paid), total);

    try {
      const saved = await persistRecord(crmEntities.payments, nextPayment);
      setPayments((current) => current.map((payment) => (payment.id === id ? saved : payment)));
    } catch (error) {
      handleSyncError(error);
    }
  };

  const updateExpense = async (id, field, value) => {
    const currentExpense = expenses.find((expense) => expense.id === id);
    if (!currentExpense) return;
    const nextExpense = {
      ...currentExpense,
      [field]: ['amount', 'taxRate'].includes(field) ? clampMoney(value) : value,
      updatedAt: isoNow()
    };

    try {
      const saved = await persistRecord(crmEntities.expenses, nextExpense);
      setExpenses((current) => current.map((expense) => (expense.id === id ? saved : expense)));
    } catch (error) {
      handleSyncError(error);
    }
  };

  const addLead = async (event) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const newLead = {
      id: nextId('SH', leads),
      name: form.get('name'),
      age: Number(form.get('age') || 0),
      city: form.get('city'),
      phone: form.get('phone'),
      email: form.get('email'),
      source: form.get('source'),
      goal: form.get('goal'),
      program: form.get('program'),
      stage: 'OPEN_LEAD',
      priority: form.get('priority'),
      owner: form.get('owner') || 'Team',
      value: clampMoney(form.get('value')),
      paid: 0,
      nextFollowUp: form.get('nextFollowUp'),
      healthNotes: form.get('healthNotes'),
      lastActivity: 'Lead added manually.',
      createdAt: isoNow(),
      updatedAt: isoNow()
    };

    try {
      const saved = await createRecord(crmEntities.leads, newLead);
      setLeads((current) => [saved, ...current]);
      setShowLeadForm(false);
      formElement.reset();
    } catch (error) {
      handleSyncError(error);
    }
  };

  const addTask = async (event) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const newTask = {
      id: nextId('T', tasks),
      title: form.get('title'),
      leadId: form.get('leadId') || '-',
      owner: form.get('owner') || 'Team',
      due: form.get('due'),
      status: form.get('status'),
      type: form.get('type'),
      createdAt: isoNow(),
      updatedAt: isoNow()
    };

    try {
      const saved = await createRecord(crmEntities.tasks, newTask);
      setTasks((current) => [saved, ...current]);
      setShowTaskForm(false);
      formElement.reset();
    } catch (error) {
      handleSyncError(error);
    }
  };

  const addPayment = async (event) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const amount = clampMoney(form.get('amount'));
    const discountAmount = Math.min(clampMoney(form.get('discountAmount')), amount);
    const taxRate = clampMoney(form.get('taxRate') || 0);
    const subtotal = Math.max(amount - discountAmount, 0);
    const taxAmount = Math.round((subtotal * taxRate) / 100);
    const total = subtotal + taxAmount;
    const paid = Math.min(clampMoney(form.get('paid')), total);
    const paymentStatus = form.get('status') || (paid >= total ? 'Paid' : paid > 0 ? 'Part Paid' : 'Pending');
    const newPayment = {
      id: nextId('INV', payments),
      leadId: form.get('leadId') || '-',
      client: form.get('client'),
      clientPhone: form.get('clientPhone'),
      clientEmail: form.get('clientEmail'),
      billingAddress: form.get('billingAddress'),
      program: form.get('program'),
      description: form.get('description'),
      amount,
      discountLabel: form.get('discountLabel'),
      discountAmount,
      subtotal,
      taxAmount,
      total,
      paid,
      invoiceDate: form.get('invoiceDate'),
      paymentDate: form.get('paymentDate'),
      due: form.get('due'),
      validFrom: form.get('validFrom'),
      validUntil: form.get('validUntil'),
      taxRate,
      status: paymentStatus,
      paymentMode: form.get('paymentMode'),
      notes: form.get('notes'),
      createdAt: isoNow(),
      updatedAt: isoNow()
    };

    try {
      const saved = await createRecord(crmEntities.payments, newPayment);
      setPayments((current) => [saved, ...current]);
      setShowPaymentForm(false);
      formElement.reset();
    } catch (error) {
      handleSyncError(error);
    }
  };

  const addExpense = async (event) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    try {
      const attachment = await readAttachmentFile(form.get('receiptFile'));
      const newExpense = {
        id: nextId('EXP', expenses),
        category: form.get('category'),
        description: form.get('description'),
        amount: clampMoney(form.get('amount')),
        date: form.get('date'),
        taxRate: clampMoney(form.get('taxRate') || 18),
        status: form.get('status'),
        paymentMode: form.get('paymentMode'),
        notes: form.get('notes'),
        attachment,
        createdAt: isoNow(),
        updatedAt: isoNow()
      };
      const saved = await createRecord(crmEntities.expenses, newExpense);
      setExpenses((current) => [saved, ...current]);
      setShowExpenseForm(false);
      formElement.reset();
    } catch (error) {
      handleSyncError(error);
    }
  };

  const downloadCSV = () => {
    const rows = filteredLeads.map((lead) => [
      lead.id,
      lead.name,
      lead.phone,
      lead.email,
      lead.city,
      lead.source,
      lead.goal,
      lead.program,
      lead.stage,
      lead.priority,
      lead.owner,
      lead.value
    ]);
    const headers = ['ID', 'Name', 'Phone', 'Email', 'City', 'Source', 'Goal', 'Program', 'Stage', 'Priority', 'Owner', 'Value'];
    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `strongher-leads-${today}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const currentTitle = navItems.find((item) => item.id === active)?.label || 'Dashboard';

  return (
    <div className={`crm-shell ${sidebarOpen ? 'nav-open' : 'nav-closed'}`}>
      <aside className="sidebar">
        <div className="sidebar-head">
          <div className="brand-lockup">
            <img src="/strongher-logo.png" alt="StrongHer" />
            <div>
              <strong>StrongHer</strong>
              <span>CRM Studio</span>
            </div>
          </div>
        </div>
        <nav className="nav-list" aria-label="CRM sections">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                className={active === item.id ? 'active' : ''}
                onClick={() => {
                  setActive(item.id);
                  if (window.matchMedia('(max-width: 860px)').matches) {
                    setSidebarOpen(false);
                  }
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="sidebar-summary">
          <span>Pipeline Value</span>
          <strong>{formatMoney(metrics.totalValue)}</strong>
          <small>{metrics.hot} hot leads need attention</small>
        </div>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <button className={`icon-button mobile-menu ${sidebarOpen ? 'active' : ''}`} type="button" onClick={() => setSidebarOpen((open) => !open)} aria-label={sidebarOpen ? 'Close menu' : 'Open menu'} aria-expanded={sidebarOpen}>
            <Menu size={20} />
          </button>
          <div>
            <h1>{currentTitle}</h1>
          </div>
          <div className="topbar-actions">
            <button className="ghost-button" type="button" onClick={() => setActive('reports')}>
              <FileText size={16} />
              Report
            </button>
            <button className="primary-button" type="button" onClick={() => setShowLeadForm(true)}>
              <Plus size={16} />
              Lead
            </button>
          </div>
        </header>

        <SyncNotice status={syncStatus} />

        {active === 'dashboard' && (
          <Dashboard
            metrics={metrics}
            stageCounts={stageCounts}
            programMix={programMix}
            monthRevenue={revenueTrend}
            leads={leads}
            tasks={tasks}
            setActive={setActive}
          />
        )}

        {active === 'leads' && (
          <LeadsView
            query={query}
            setQuery={setQuery}
            stageFilter={stageFilter}
            setStageFilter={setStageFilter}
            priorityFilter={priorityFilter}
            setPriorityFilter={setPriorityFilter}
            leads={filteredLeads}
            updateLead={updateLead}
            deleteLead={deleteLead}
            onAdd={() => setShowLeadForm(true)}
            onDownload={downloadCSV}
          />
        )}

        {active === 'tasks' && (
          <TasksView tasks={tasks} leads={leads} updateTask={updateTask} deleteTask={deleteTask} onAdd={() => setShowTaskForm(true)} />
        )}

        {active === 'finance' && (
          <FinanceView
            payments={payments}
            expenses={expenses}
            metrics={metrics}
            monthRevenue={revenueTrend}
            updatePayment={updatePayment}
            updateExpense={updateExpense}
            onAddInvoice={() => setShowPaymentForm(true)}
            onAddExpense={() => setShowExpenseForm(true)}
          />
        )}

        {active === 'clients' && <ClientsView leads={leads.filter((lead) => ['LEAD_CONVERTED', 'PAYMENT_RECEIVED'].includes(lead.stage))} />}

        {active === 'reminders' && <RemindersView leads={leads} tasks={tasks} />}

        {active === 'reports' && (
          <ReportsView metrics={metrics} stageCounts={stageCounts} sourcePerformance={sourcePerformance} programMix={programMix} />
        )}

        {active === 'settings' && <SettingsView />}
      </main>

      {showLeadForm && <LeadModal onClose={() => setShowLeadForm(false)} onSubmit={addLead} />}
      {showTaskForm && <TaskModal onClose={() => setShowTaskForm(false)} onSubmit={addTask} leads={leads} />}
      {showPaymentForm && <PaymentModal onClose={() => setShowPaymentForm(false)} onSubmit={addPayment} leads={leads} />}
      {showExpenseForm && <ExpenseModal onClose={() => setShowExpenseForm(false)} onSubmit={addExpense} />}
    </div>
  );
}

function Dashboard({ metrics, stageCounts, programMix, monthRevenue, leads, tasks, setActive }) {
  const maxRevenue = Math.max(...monthRevenue.map((item) => item.value), 1);
  const maxProgram = Math.max(...programMix.map((item) => item.count), 1);
  const priorityLeads = leads.filter((lead) => lead.priority === 'Hot').slice(0, 3);

  return (
    <section className="screen-grid">
      <div className="metric-grid">
        <Metric icon={UsersRound} label="Total Leads" value={metrics.totalLeads} note={`${metrics.activeLeads} active`} tone="rose" />
        <Metric icon={Target} label="Conversion" value={`${metrics.conversionRate}%`} note="Closed leads" tone="green" />
        <Metric icon={BadgeIndianRupee} label="Revenue" value={formatMoney(metrics.revenue)} note={`${formatMoney(metrics.outstanding)} due`} tone="amber" />
        <Metric icon={CalendarCheck} label="Tasks Today" value={metrics.dueToday} note={`${metrics.overdueTasks} overdue`} tone="ink" />
      </div>

      <div className="dashboard-layout">
        <section className="panel large">
          <div className="panel-title">
            <div>
              <span>Performance</span>
              <h2>Revenue Trend</h2>
            </div>
            <button className="ghost-button compact" type="button" onClick={() => setActive('finance')}>
              <Wallet size={15} />
              Finance
            </button>
          </div>
          <div className="bar-chart">
            {monthRevenue.map((item) => (
              <div className="bar-column" key={item.label}>
                <div className="bar-track">
                  <div className="bar-fill" style={{ height: item.value > 0 ? `${Math.max((item.value / maxRevenue) * 100, 8)}%` : '0%' }} />
                </div>
                <strong>{item.label}</strong>
                <span>{formatChartValue(item.value)}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panel-title">
            <div>
              <span>Pipeline</span>
              <h2>Lead Funnel</h2>
            </div>
          </div>
          <div className="funnel-list">
            {stageCounts.map((item) => (
              <div className="funnel-row" key={item.code}>
                <div>
                  <strong>{item.label}</strong>
                  <span>{item.count} leads</span>
                </div>
                <div className="funnel-meter">
                  <i style={{ width: `${Math.max(item.count * 18, 8)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="three-column">
        <section className="panel">
          <div className="panel-title">
            <div>
              <span>Attention</span>
              <h2>Hot Leads</h2>
            </div>
            <Flame size={18} />
          </div>
          <div className="stack-list">
            {priorityLeads.map((lead) => (
              <article className="mini-row" key={lead.id}>
                <div>
                  <strong>{lead.name}</strong>
                  <span>{lead.program}</span>
                </div>
                <StatusPill value={lead.stage} />
              </article>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panel-title">
            <div>
              <span>Tasks</span>
              <h2>Today Queue</h2>
            </div>
            <ClipboardList size={18} />
          </div>
          <div className="stack-list">
            {tasks.filter((task) => isSameDate(task.due, today) || task.status === 'Overdue').slice(0, 4).map((task) => (
              <article className="mini-row" key={task.id}>
                <div>
                  <strong>{task.title}</strong>
                  <span>{task.owner} / {task.type}</span>
                </div>
                <StatusPill value={task.status} />
              </article>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panel-title">
            <div>
              <span>Programs</span>
              <h2>Demand Mix</h2>
            </div>
            <Dumbbell size={18} />
          </div>
          <div className="program-mix">
            {programMix.map((item) => (
              <div key={item.program}>
                <div>
                  <span>{item.program}</span>
                  <strong>{item.count}</strong>
                </div>
                <i style={{ width: `${Math.max((item.count / maxProgram) * 100, 8)}%` }} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}

function LeadsView({ query, setQuery, stageFilter, setStageFilter, priorityFilter, setPriorityFilter, leads, updateLead, deleteLead, onAdd, onDownload }) {
  return (
    <section className="screen-grid">
      <div className="toolbar">
        <label className="search-box">
          <Search size={17} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search leads" />
        </label>
        <SelectField
          icon={Filter}
          value={stageFilter}
          onChange={setStageFilter}
          options={[{ value: 'All', label: 'All Stages' }, ...stages.map((stage) => ({ value: stage.code, label: stage.label }))]}
          ariaLabel="Filter by stage"
        />
        <SelectField icon={Flame} value={priorityFilter} onChange={setPriorityFilter} options={['All', ...priorities]} ariaLabel="Filter by priority" />
        <button className="ghost-button" type="button" onClick={onDownload}>
          <Download size={16} />
          CSV
        </button>
        <button className="primary-button" type="button" onClick={onAdd}>
          <Plus size={16} />
          Lead
        </button>
      </div>

      <section className="lead-grid">
        {leads.length === 0 && (
          <EmptyState title="No leads loaded" message="Connect or redeploy the Apps Script to show CRM and website enquiry leads here." />
        )}
        {leads.map((lead) => (
          <article className="lead-card" key={lead.id}>
            <div className="lead-card-top">
              <span>{lead.id}</span>
              <div className="card-actions">
                <PriorityPill value={lead.priority} />
                <button className="delete-button" type="button" onClick={() => deleteLead(lead)} aria-label={`Delete ${lead.name}`}>
                  <X size={15} />
                </button>
              </div>
            </div>
            <h2>{lead.name}</h2>
            <p>{lead.goal} / {lead.program}</p>
            <div className="lead-facts">
              <span>{lead.city}</span>
              <span>{lead.phone}</span>
              <span>{lead.source}</span>
              {lead.sourceKind && <span>{lead.sourceKind}</span>}
            </div>
            <div className="lead-note">{lead.healthNotes}</div>
            <div className="lead-controls">
              <select value={lead.stage} onChange={(event) => updateLead(lead.id, 'stage', event.target.value)}>
                {stages.map((stage) => <option key={stage.code} value={stage.code}>{stage.label}</option>)}
              </select>
              <select value={lead.priority} onChange={(event) => updateLead(lead.id, 'priority', event.target.value)}>
                {priorities.map((priority) => <option key={priority}>{priority}</option>)}
              </select>
            </div>
            <div className="lead-footer">
              <label className="inline-money-field">
                <span>Amount</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={lead.value}
                  onChange={(event) => updateLead(lead.id, 'value', event.target.value)}
                  aria-label={`Expected package amount for ${lead.name}`}
                />
              </label>
              <span>Follow-up {displayDate(lead.nextFollowUp) || '-'}</span>
            </div>
          </article>
        ))}
      </section>
    </section>
  );
}

function TasksView({ tasks, leads, updateTask, deleteTask, onAdd }) {
  const columns = ['Overdue', 'Due Today', 'Upcoming', 'Completed'];
  const leadLookup = Object.fromEntries(leads.map((lead) => [lead.id, lead]));

  return (
    <section className="screen-grid">
      <div className="toolbar align-end">
        <button className="primary-button" type="button" onClick={onAdd}>
          <Plus size={16} />
          Task
        </button>
      </div>
      <div className="task-board">
        {tasks.length === 0 && (
          <EmptyState title="No tasks loaded" message="Tasks will appear after the Tasks sheet has rows." />
        )}
        {columns.map((column) => (
          <section className="task-column" key={column}>
            <div className="column-title">
              <strong>{column}</strong>
              <span>{tasks.filter((task) => task.status === column).length}</span>
            </div>
            {tasks.filter((task) => task.status === column).map((task) => (
              <article className="task-card" key={task.id}>
                <div className="task-card-top">
                  <div>
                    <strong>{task.title}</strong>
                    <span>{leadLookup[task.leadId]?.name || 'General'} / {task.type}</span>
                  </div>
                  <button className="delete-button" type="button" onClick={() => deleteTask(task)} aria-label={`Delete task ${task.title}`}>
                    <X size={15} />
                  </button>
                </div>
                <div className="task-meta">
                  <span>{task.owner}</span>
                  <span>{displayDate(task.due) || '-'}</span>
                </div>
                <select value={task.status} onChange={(event) => updateTask(task.id, event.target.value)}>
                  {columns.map((status) => <option key={status}>{status}</option>)}
                </select>
              </article>
            ))}
          </section>
        ))}
      </div>
    </section>
  );
}

function FinanceView({ payments, expenses, metrics, monthRevenue, updatePayment, updateExpense, onAddInvoice, onAddExpense }) {
  const maxRevenue = Math.max(...monthRevenue.map((item) => item.value), 1);

  return (
    <section className="screen-grid">
      <div className="metric-grid">
        <Metric icon={Wallet} label="Collected" value={formatMoney(metrics.revenue)} note="All payments" tone="green" />
        <Metric icon={ReceiptText} label="Outstanding" value={formatMoney(metrics.outstanding)} note="Pending balances" tone="amber" />
        <Metric icon={BadgeIndianRupee} label="Expenses" value={formatMoney(metrics.totalExpenses)} note="Ops, ads, tools" tone="rose" />
        <Metric icon={CheckCircle2} label="Profit" value={formatMoney(metrics.profit)} note={`${formatMoney(metrics.taxReserve)} tax reserve`} tone="ink" />
      </div>

      <section className="panel">
        <div className="panel-title">
          <div>
            <span>Finance</span>
            <h2>Monthly Collection</h2>
          </div>
          <div className="panel-actions">
            <button className="ghost-button compact" type="button" onClick={onAddExpense}>
              <Plus size={15} />
              Expense
            </button>
            <button className="primary-button compact" type="button" onClick={onAddInvoice}>
              <Plus size={15} />
              Invoice
            </button>
          </div>
        </div>
        <div className="line-bars">
          {monthRevenue.map((item) => (
            <div key={item.label}>
              <span>{item.label}</span>
              <i style={{ width: item.value > 0 ? `${Math.max((item.value / maxRevenue) * 100, 8)}%` : '0%' }} />
              <strong>{formatMoney(item.value)}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="table-panel">
        <div className="table-row table-head">
          <span>Invoice</span>
          <span>Client</span>
          <span>Program</span>
          <span>Amount</span>
          <span>Paid</span>
          <span>Status</span>
          <span>PDF</span>
        </div>
        {payments.length === 0 && <EmptyTableRow message="No invoices loaded from FinanceInvoices." />}
        {payments.map((item) => (
          <div className="table-row" key={item.id}>
            <span>{item.id}</span>
            <strong>{item.client}</strong>
            <span>{item.program}</span>
            <InlineMoneyInput value={item.amount} onChange={(value) => updatePayment(item.id, 'amount', value)} ariaLabel={`Invoice amount for ${item.client}`} />
            <InlineMoneyInput value={item.paid} onChange={(value) => updatePayment(item.id, 'paid', value)} ariaLabel={`Paid amount for ${item.client}`} />
            <InlineSelect
              value={item.status}
              options={['Draft', 'Pending', 'Part Paid', 'Paid', 'Cancelled']}
              onChange={(value) => updatePayment(item.id, 'status', value)}
              ariaLabel={`Invoice status for ${item.client}`}
            />
            {item.pdfUrl ? (
              <a className="inline-link" href={item.pdfUrl} target="_blank" rel="noreferrer">Open</a>
            ) : item.pdfError ? (
              <span className="muted-cell error-cell" title={item.pdfError}>PDF error</span>
            ) : (
              <span className="muted-cell">Not created</span>
            )}
          </div>
        ))}
      </section>

      <section className="table-panel">
        <div className="expense-row table-head">
          <span>Expense</span>
          <span>Category</span>
          <span>Description</span>
          <span>Amount</span>
          <span>Tax</span>
          <span>Status</span>
          <span>Attachment</span>
        </div>
        {expenses.length === 0 && <EmptyTableRow message="No expenses loaded from FinanceExpenses." type="expense" />}
        {expenses.map((item) => (
          <div className="expense-row" key={item.id}>
            <span>{item.id}</span>
            <strong>{item.category}</strong>
            <span>{item.description}</span>
            <InlineMoneyInput value={item.amount} onChange={(value) => updateExpense(item.id, 'amount', value)} ariaLabel={`Expense amount for ${item.description}`} />
            <InlinePercentInput value={item.taxRate} onChange={(value) => updateExpense(item.id, 'taxRate', value)} ariaLabel={`Expense tax rate for ${item.description}`} />
            <InlineSelect
              value={item.status}
              options={['Planned', 'Pending', 'Paid', 'Cancelled']}
              onChange={(value) => updateExpense(item.id, 'status', value)}
              ariaLabel={`Expense status for ${item.description}`}
            />
            {item.attachmentUrl ? (
              <a className="inline-link" href={item.attachmentUrl} target="_blank" rel="noreferrer">Open</a>
            ) : item.attachmentError ? (
              <span className="muted-cell error-cell" title={item.attachmentError}>Upload error</span>
            ) : (
              <span className="muted-cell">None</span>
            )}
          </div>
        ))}
      </section>
    </section>
  );
}

function RemindersView({ leads, tasks }) {
  const reminderRows = tasks
    .filter((task) => task.status !== 'Completed')
    .map((task) => {
      const lead = leads.find((item) => item.id === task.leadId);
      const subject = lead ? `StrongHer follow-up: ${task.title}` : `StrongHer task: ${task.title}`;
      const dueDate = displayDate(task.due) || today;
      const body = lead
        ? `Hi ${lead.name},\n\nThis is Seema from StrongHer. I wanted to follow up about ${lead.program} and your goal: ${lead.goal}.\n\nTask: ${task.title}\nDue: ${dueDate}\n\nRegards,\nSeema`
        : `Task: ${task.title}\nDue: ${dueDate}`;
      return {
        ...task,
        lead,
        dueDate,
        leadName: lead?.name || 'General',
        phone: lead?.phone || '-',
        email: lead?.email || '-',
        gmailHref: gmailUrl({ to: lead?.email, subject, body }),
        calendarHref: calendarUrl({
          title: task.title,
          date: dueDate,
          details: `${lead ? `${lead.name} / ${lead.phone} / ${lead.email}\n` : ''}${task.type} reminder from StrongHer CRM.`
        })
      };
    });

  return (
    <section className="screen-grid">
      <div className="metric-grid">
        <Metric icon={Mail} label="Gmail" value={reminderRows.length} note="Follow-up emails" tone="rose" />
        <Metric icon={CalendarCheck} label="Calendar" value={reminderRows.length} note="Events to create" tone="amber" />
        <Metric icon={ClipboardList} label="Overdue" value={tasks.filter((task) => task.status === 'Overdue').length} note="Needs action" tone="ink" />
        <Metric icon={FileText} label="Templates" value="4" note="Call, invoice, onboarding, review" tone="green" />
      </div>

      <section className="table-panel">
        <div className="reminder-row table-head">
          <span>Task</span>
          <span>Lead</span>
          <span>Due</span>
          <span>Gmail</span>
          <span>Calendar</span>
        </div>
        {reminderRows.length === 0 && <EmptyTableRow message="No pending reminders loaded from Tasks." type="reminder" />}
        {reminderRows.map((item) => (
          <div className="reminder-row" key={item.id}>
            <strong>{item.title}</strong>
            <span>{item.leadName}</span>
            <span>{item.dueDate}</span>
            <a className="ghost-button compact" href={item.gmailHref} target="_blank" rel="noreferrer">
              <Mail size={15} />
              Send
            </a>
            <a className="ghost-button compact" href={item.calendarHref} target="_blank" rel="noreferrer">
              <CalendarCheck size={15} />
              Add
            </a>
          </div>
        ))}
      </section>

      <section className="panel wide-copy">
        <div className="panel-title">
          <div>
            <span>Automation</span>
            <h2>Reminder Channels</h2>
          </div>
        </div>
        <div className="question-list">
          <article><Mail size={18} /><span>Gmail reminders are planned for package proposals, invoices, consultation confirmations, and onboarding checklists.</span></article>
          <article><CalendarCheck size={18} /><span>Calendar events are planned for consultation calls, reviews, and recurring client check-ins.</span></article>
        </div>
      </section>
    </section>
  );
}

function ClientsView({ leads }) {
  return (
    <section className="screen-grid">
      <section className="lead-grid">
        {leads.length === 0 && (
          <EmptyState title="No active clients loaded" message="Converted leads will appear here." />
        )}
        {leads.map((client) => (
          <article className="lead-card client-card" key={client.id}>
            <div className="lead-card-top">
              <span>{client.id}</span>
              <StatusPill value="Active Client" />
            </div>
            <h2>{client.name}</h2>
            <p>{client.program}</p>
            <div className="lead-facts">
              <span>{client.city}</span>
              <span>{client.goal}</span>
              <span>{client.owner}</span>
            </div>
            <div className="client-progress">
              <div>
                <span>Payment</span>
                <strong>{formatMoney(client.paid)}</strong>
              </div>
              <div>
                <span>Next Review</span>
                <strong>{displayDate(client.nextFollowUp) || '-'}</strong>
              </div>
            </div>
            <a
              className="ghost-button full"
              href={whatsappUrl(client, `Hi ${client.name}, this is Seema from StrongHer. Checking in on your ${client.program} progress and next review.`)}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={16} />
              WhatsApp
            </a>
          </article>
        ))}
      </section>
    </section>
  );
}

function ReportsView({ metrics, stageCounts, sourcePerformance, programMix }) {
  const maxSource = Math.max(...sourcePerformance.map((item) => item.value), 1);

  return (
    <section className="screen-grid">
      <div className="metric-grid">
        <Metric icon={Activity} label="Active Pipeline" value={metrics.activeLeads} note="Open opportunities" tone="rose" />
        <Metric icon={Target} label="Win Rate" value={`${metrics.conversionRate}%`} note="Current pipeline" tone="green" />
        <Metric icon={Flame} label="Hot Leads" value={metrics.hot} note="High intent" tone="amber" />
        <Metric icon={ReceiptText} label="Due Amount" value={formatMoney(metrics.outstanding)} note="Collectable" tone="ink" />
      </div>

      <div className="reports-grid">
        <section className="panel">
          <div className="panel-title">
            <div>
              <span>Stages</span>
              <h2>Lead Distribution</h2>
            </div>
          </div>
          <div className="report-list">
            {stageCounts.map((item) => (
              <div key={item.code}>
                <span>{item.label}</span>
                <strong>{item.count}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panel-title">
            <div>
              <span>Sources</span>
              <h2>Performance</h2>
            </div>
          </div>
          <div className="source-list">
            {sourcePerformance.map((item) => (
              <div key={item.source}>
                <div>
                  <strong>{item.source}</strong>
                  <span>{item.leads} leads / {item.converted} converted</span>
                </div>
                <i style={{ width: `${Math.max((item.value / maxSource) * 100, 8)}%` }} />
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panel-title">
            <div>
              <span>Programs</span>
              <h2>Demand</h2>
            </div>
          </div>
          <div className="report-list">
            {programMix.map((item) => (
              <div key={item.program}>
                <span>{item.program}</span>
                <strong>{item.count}</strong>
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}

function SettingsView() {
  const decisions = [
    `Website enquiries will come from Google Sheets for now, with a clean migration path to PostgreSQL later.`,
    `${integrationPlan.userMode}, so the app stays fast and simple before role-based access is needed.`,
    'Lead stages use your full CRM code list, including awareness, quotation, payment, converted, lost, follow-up, and hold stages.',
    'Finance tracks invoices, payments, expenses, pending dues, estimated tax reserve, and profit.',
    'Reminder planning uses Gmail and Google Calendar.',
    integrationPlan.hosting
  ];

  return (
    <section className="screen-grid">
      <section className="panel wide-copy">
        <div className="panel-title">
          <div>
            <span>Setup</span>
            <h2>Confirmed Build Direction</h2>
          </div>
        </div>
        <div className="question-list">
          {decisions.map((decision) => (
            <article key={decision}>
              <CheckCircle2 size={18} />
              <span>{decision}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="panel wide-copy">
        <div className="panel-title">
          <div>
            <span>Google Sheets</span>
            <h2>Enquiry Source</h2>
          </div>
        </div>
        <div className="integration-card">
          <div>
            <span>Spreadsheet ID</span>
            <strong>{integrationPlan.enquirySheet.spreadsheetId}</strong>
          </div>
          <div>
            <span>Sheet GID</span>
            <strong>{integrationPlan.enquirySheet.gid}</strong>
          </div>
          <a className="ghost-button full" href={integrationPlan.enquirySheet.sourceUrl} target="_blank" rel="noreferrer">
            <FileText size={16} />
            Open Enquiry Sheet
          </a>
        </div>
      </section>

      <section className="panel wide-copy">
        <div className="panel-title">
          <div>
            <span>Google Sheets</span>
            <h2>CRM Data Workbook</h2>
          </div>
        </div>
        <div className="integration-card">
          <div>
            <span>Spreadsheet ID</span>
            <strong>{integrationPlan.crmWorkbook.spreadsheetId}</strong>
          </div>
          <div>
            <span>Sheet GID</span>
            <strong>{integrationPlan.crmWorkbook.gid}</strong>
          </div>
          <a className="ghost-button full" href={integrationPlan.crmWorkbook.sourceUrl} target="_blank" rel="noreferrer">
            <FileText size={16} />
            Open CRM Workbook
          </a>
        </div>
      </section>

      <section className="panel wide-copy">
        <div className="panel-title">
          <div>
            <span>Google Sheets</span>
            <h2>Expected Lead Columns</h2>
          </div>
        </div>
        <div className="sheet-columns">
          {['submittedAt', 'fullName', 'age', 'city', 'whatsappNumber', 'email', 'heardAbout', 'primaryGoals', 'trainingExperience', 'lookingFor', 'healthNotes', 'consultationDate', 'consultationTime', 'stage', 'priority', 'value'].map((column) => (
            <span key={column}>{column}</span>
          ))}
        </div>
      </section>

      <section className="panel wide-copy">
        <div className="panel-title">
          <div>
            <span>CRM Sheets</span>
            <h2>Tabs To Create</h2>
          </div>
        </div>
        <div className="crm-sheet-list">
          {integrationPlan.crmSheets.map((sheet) => (
            <article key={sheet.name}>
              <strong>{sheet.name}</strong>
              <span>{sheet.purpose}</span>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}

function Metric({ icon: Icon, label, value, note, tone }) {
  return (
    <article className={`metric-card ${tone}`}>
      <div>
        <Icon size={20} />
      </div>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{note}</small>
    </article>
  );
}

function EmptyState({ title, message }) {
  return (
    <article className="empty-state">
      <strong>{title}</strong>
      <span>{message}</span>
    </article>
  );
}

function EmptyTableRow({ message, type = 'invoice' }) {
  const className = type === 'expense' ? 'expense-row empty-row' : type === 'reminder' ? 'reminder-row empty-row' : 'table-row empty-row';
  return (
    <div className={className}>
      <span>{message}</span>
    </div>
  );
}

function SyncNotice({ status }) {
  if (status.state === 'connected') return null;

  return (
    <div className={`sync-notice ${status.state}`} role="status">
      <span>{status.message}</span>
    </div>
  );
}

function SelectField({ icon: Icon, value, onChange, options, ariaLabel }) {
  return (
    <label className="select-shell">
      <Icon size={16} />
      <select value={value} onChange={(event) => onChange(event.target.value)} aria-label={ariaLabel}>
        {options.map((option) => {
          const normalized = typeof option === 'string' ? { value: option, label: option } : option;
          return <option key={normalized.value} value={normalized.value}>{normalized.label}</option>;
        })}
      </select>
      <ChevronDown size={16} />
    </label>
  );
}

function StatusPill({ value }) {
  return <span className={`status-pill ${classNameFor(value)}`} style={stageStyle(value)}>{stageLabel(value)}</span>;
}

function PriorityPill({ value }) {
  return <span className={`priority-pill ${classNameFor(value)}`}>{value}</span>;
}

function InlineMoneyInput({ value, onChange, ariaLabel }) {
  return (
    <label className="inline-edit-field money">
      <span>Rs</span>
      <input type="number" min="0" step="1" value={value} onChange={(event) => onChange(event.target.value)} aria-label={ariaLabel} />
    </label>
  );
}

function InlinePercentInput({ value, onChange, ariaLabel }) {
  return (
    <label className="inline-edit-field percent">
      <input type="number" min="0" step="0.1" value={value} onChange={(event) => onChange(event.target.value)} aria-label={ariaLabel} />
      <span>%</span>
    </label>
  );
}

function InlineSelect({ value, options, onChange, ariaLabel }) {
  return (
    <select className="inline-select-field" value={value} onChange={(event) => onChange(event.target.value)} aria-label={ariaLabel}>
      {options.map((option) => <option key={option}>{option}</option>)}
    </select>
  );
}

function ModalShell({ title, children, onClose }) {
  return (
    <div className="modal-layer">
      <button className="modal-scrim" type="button" onClick={onClose} aria-label="Close modal" />
      <section className="modal-card">
        <div className="modal-head">
          <h2>{title}</h2>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}

function LeadModal({ onClose, onSubmit }) {
  return (
    <ModalShell title="Add Lead" onClose={onClose}>
      <form className="modal-form" onSubmit={onSubmit}>
        <Input name="name" label="Full Name" required />
        <Input name="age" label="Age" type="number" min="1" required />
        <Input name="city" label="City" required />
        <Input name="phone" label="WhatsApp Number" required />
        <Input name="email" label="Email" type="email" required />
        <Input name="goal" label="Primary Goal" required />
        <Select name="source" label="Source" options={['Instagram', 'Referral', 'Protein Plate', 'Existing Client', 'Event/Workshop', 'Other']} />
        <Select name="program" label="Program" options={programs} />
        <Select name="priority" label="Priority" options={priorities} />
        <Input name="owner" label="Owner" />
        <Input name="value" label="Expected Package Amount (Rs)" type="number" min="0" step="1" required />
        <Input name="nextFollowUp" label="Next Follow-up" type="date" required />
        <label className="field full-field">
          <span>Health Notes</span>
          <textarea name="healthNotes" rows="3" required />
        </label>
        <div className="modal-actions">
          <button className="ghost-button" type="button" onClick={onClose}>Cancel</button>
          <button className="primary-button" type="submit">
            <Plus size={16} />
            Save Lead
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

function TaskModal({ onClose, onSubmit, leads }) {
  const leadOptions = [{ value: '-', label: 'General task' }, ...leads.map((lead) => ({ value: lead.id, label: leadOptionLabel(lead) }))];

  return (
    <ModalShell title="Add Task" onClose={onClose}>
      <form className="modal-form" onSubmit={onSubmit}>
        <Input name="title" label="Task" required />
        <Select name="leadId" label="Lead" options={leadOptions} />
        <Select name="type" label="Type" options={['Call', 'WhatsApp', 'Review', 'Finance', 'Admin']} />
        <Select name="status" label="Status" options={['Overdue', 'Due Today', 'Upcoming', 'Completed']} />
        <Input name="owner" label="Owner" />
        <Input name="due" label="Due Date" type="date" required />
        <div className="modal-actions">
          <button className="ghost-button" type="button" onClick={onClose}>Cancel</button>
          <button className="primary-button" type="submit">
            <Plus size={16} />
            Save Task
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

function PaymentModal({ onClose, onSubmit, leads }) {
  const leadOptions = [{ value: '-', label: 'No linked lead' }, ...leads.map((lead) => ({ value: lead.id, label: leadOptionLabel(lead) }))];
  const [leadId, setLeadId] = useState('-');
  const selectedLead = leads.find((lead) => lead.id === leadId);
  const defaultAmount = selectedLead?.value || 0;
  const defaultDescription = selectedLead ? `${selectedLead.program} for ${selectedLead.goal}` : 'Online coaching package';
  const validFrom = today;

  return (
    <ModalShell title="Add Invoice" onClose={onClose}>
      <form className="modal-form" onSubmit={onSubmit} noValidate>
        <Select name="leadId" label="Lead" options={leadOptions} value={leadId} onChange={(event) => setLeadId(event.target.value)} />
        <Input key={`client-${leadId}`} name="client" label="Invoice To" defaultValue={selectedLead?.name || ''} required />
        <Input key={`phone-${leadId}`} name="clientPhone" label="Client Phone" defaultValue={selectedLead?.phone || ''} />
        <Input key={`email-${leadId}`} name="clientEmail" label="Client Email" defaultValue={selectedLead?.email || ''} />
        <label key={`address-${leadId}`} className="field full-field">
          <span>Billing Address</span>
          <textarea name="billingAddress" rows="2" defaultValue={selectedLead?.city || ''} />
        </label>
        <Select key={`program-${leadId}`} name="program" label="Program" options={programs} defaultValue={selectedLead?.program || programs[0]} />
        <Input key={`description-${leadId}`} name="description" label="Description" defaultValue={defaultDescription} required />
        <Input key={`amount-${leadId}`} name="amount" label="Price (Rs)" type="number" min="0" step="1" defaultValue={defaultAmount} required />
        <Input name="discountLabel" label="Discount / Offer" defaultValue="Referral Offer" />
        <Input name="discountAmount" label="Discount Amount (Rs)" type="number" min="0" step="1" defaultValue="0" />
        <Input name="taxRate" label="Tax Rate %" type="number" min="0" step="0.1" defaultValue="0" />
        <Input name="paid" label="Paid (Rs)" type="number" min="0" step="1" defaultValue="0" required />
        <Select name="status" label="Payment Status" options={['Pending', 'Part Paid', 'Paid', 'Draft', 'Cancelled']} />
        <Input name="paymentMode" label="Payment Mode" defaultValue="UPI / Bank Transfer" />
        <Input name="invoiceDate" label="Invoice Date" type="date" defaultValue={today} required />
        <Input name="paymentDate" label="Payment Date" type="date" />
        <Input name="due" label="Due Date" type="date" defaultValue={addDays(today, 7)} required />
        <Input name="validFrom" label="Validity From" type="date" defaultValue={validFrom} required />
        <Input name="validUntil" label="Validity Until" type="date" defaultValue={addDays(validFrom, 30)} required />
        <label className="field full-field">
          <span>Notes</span>
          <textarea name="notes" rows="2" defaultValue="Thank you for choosing StrongHer." />
        </label>
        <div className="modal-actions">
          <button className="ghost-button" type="button" onClick={onClose}>Cancel</button>
          <button className="primary-button" type="submit">
            <Plus size={16} />
            Save Invoice PDF
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

function ExpenseModal({ onClose, onSubmit }) {
  return (
    <ModalShell title="Add Expense" onClose={onClose}>
      <form className="modal-form" onSubmit={onSubmit}>
        <Select name="category" label="Category" options={['Marketing', 'Tools & Software', 'Operations', 'Professional Fees', 'Payouts', 'Taxes', 'Other']} />
        <Input name="description" label="Description" required />
        <Input name="amount" label="Amount (Rs)" type="number" min="0" step="1" required />
        <Input name="taxRate" label="Tax Rate %" type="number" min="0" step="0.1" />
        <Input name="date" label="Date" type="date" required />
        <Select name="status" label="Status" options={['Paid', 'Pending', 'Planned']} />
        <Input name="paymentMode" label="Payment Mode" defaultValue="UPI / Bank Transfer" />
        <Input name="receiptFile" label="Upload Invoice / Receipt" type="file" accept="application/pdf,image/*" />
        <label className="field full-field">
          <span>Notes</span>
          <textarea name="notes" rows="2" />
        </label>
        <div className="modal-actions">
          <button className="ghost-button" type="button" onClick={onClose}>Cancel</button>
          <button className="primary-button" type="submit">
            <Plus size={16} />
            Save Expense
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

function Input({ name, label, type = 'text', required = false, ...props }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input name={name} type={type} required={required} {...props} />
    </label>
  );
}

function Select({ name, label, options, ...props }) {
  return (
    <label className="field">
      <span>{label}</span>
      <select name={name} {...props}>
        {options.map((option) => {
          const normalized = typeof option === 'string' ? { value: option, label: option } : option;
          return <option key={normalized.value} value={normalized.value}>{normalized.label}</option>;
        })}
      </select>
    </label>
  );
}

export default App;

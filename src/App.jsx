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
  hosting: 'Deploy online with login access, no custom domain yet'
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

const monthRevenue = [
  { label: 'Mar', value: 42000 },
  { label: 'Apr', value: 58000 },
  { label: 'May', value: 52000 },
  { label: 'Jun', value: 76000 },
  { label: 'Jul', value: 84000 },
  { label: 'Aug', value: 97000 }
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

function formatMoney(value) {
  return `Rs ${value.toLocaleString('en-IN')}`;
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

function useStoredState(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

function App() {
  const [active, setActive] = useState('dashboard');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [leads, setLeads] = useStoredState('strongher-crm-leads', seedLeads);
  const [tasks, setTasks] = useStoredState('strongher-crm-tasks', seedTasks);
  const [payments, setPayments] = useStoredState('strongher-crm-payments', seedPayments);
  const [expenses, setExpenses] = useStoredState('strongher-crm-expenses', seedExpenses);
  const [query, setQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);

  const metrics = useMemo(() => {
    const totalValue = leads.reduce((sum, lead) => sum + lead.value, 0);
    const revenue = payments.reduce((sum, item) => sum + item.paid, 0);
    const outstanding = payments.reduce((sum, item) => sum + Math.max(item.amount - item.paid, 0), 0);
    const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
    const taxReserve = [...payments, ...expenses].reduce((sum, item) => {
      const taxableBase = item.paid ?? item.amount;
      return sum + Math.round((taxableBase * (item.taxRate ?? 18)) / 100);
    }, 0);
    const profit = revenue - totalExpenses - taxReserve;
    const converted = leads.filter((lead) => ['LEAD_CONVERTED', 'PAYMENT_RECEIVED'].includes(lead.stage)).length;
    const hot = leads.filter((lead) => lead.priority === 'Hot').length;
    const overdueTasks = tasks.filter((task) => task.status === 'Overdue').length;
    const dueToday = tasks.filter((task) => task.due === today && task.status !== 'Completed').length;

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

  const updateLead = (id, field, value) => {
    setLeads((current) => current.map((lead) => (lead.id === id ? { ...lead, [field]: value } : lead)));
  };

  const updateTask = (id, status) => {
    setTasks((current) => current.map((task) => (task.id === id ? { ...task, status } : task)));
  };

  const addLead = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
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
      value: Number(form.get('value') || 0),
      paid: 0,
      nextFollowUp: form.get('nextFollowUp'),
      healthNotes: form.get('healthNotes'),
      lastActivity: 'Lead added manually.'
    };
    setLeads((current) => [newLead, ...current]);
    setShowLeadForm(false);
    event.currentTarget.reset();
  };

  const addTask = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const newTask = {
      id: nextId('T', tasks),
      title: form.get('title'),
      leadId: form.get('leadId') || '-',
      owner: form.get('owner') || 'Team',
      due: form.get('due'),
      status: form.get('status'),
      type: form.get('type')
    };
    setTasks((current) => [newTask, ...current]);
    setShowTaskForm(false);
    event.currentTarget.reset();
  };

  const addPayment = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const amount = Number(form.get('amount') || 0);
    const paid = Number(form.get('paid') || 0);
    const newPayment = {
      id: nextId('INV', payments),
      leadId: form.get('leadId') || '-',
      client: form.get('client'),
      program: form.get('program'),
      amount,
      paid,
      due: form.get('due'),
      taxRate: Number(form.get('taxRate') || 18),
      status: paid >= amount ? 'Paid' : paid > 0 ? 'Part Paid' : 'Pending'
    };
    setPayments((current) => [newPayment, ...current]);
    setShowPaymentForm(false);
    event.currentTarget.reset();
  };

  const addExpense = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const newExpense = {
      id: nextId('EXP', expenses),
      category: form.get('category'),
      description: form.get('description'),
      amount: Number(form.get('amount') || 0),
      date: form.get('date'),
      taxRate: Number(form.get('taxRate') || 18),
      status: form.get('status')
    };
    setExpenses((current) => [newExpense, ...current]);
    setShowExpenseForm(false);
    event.currentTarget.reset();
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
    <div className="crm-shell">
      <aside className={`sidebar ${mobileNavOpen ? 'open' : ''}`}>
        <div className="brand-lockup">
          <img src="/strongher-logo.png" alt="StrongHer" />
          <div>
            <strong>StrongHer</strong>
            <span>CRM Studio</span>
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
                  setMobileNavOpen(false);
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
          <button className="icon-button mobile-menu" type="button" onClick={() => setMobileNavOpen(true)} aria-label="Open menu">
            <Menu size={20} />
          </button>
          <div>
            <p>StrongHer by Seema</p>
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

        {active === 'dashboard' && (
          <Dashboard
            metrics={metrics}
            stageCounts={stageCounts}
            programMix={programMix}
            monthRevenue={monthRevenue}
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
            onAdd={() => setShowLeadForm(true)}
            onDownload={downloadCSV}
          />
        )}

        {active === 'tasks' && (
          <TasksView tasks={tasks} updateTask={updateTask} onAdd={() => setShowTaskForm(true)} />
        )}

        {active === 'finance' && (
          <FinanceView
            payments={payments}
            expenses={expenses}
            metrics={metrics}
            monthRevenue={monthRevenue}
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

      {mobileNavOpen && <button className="nav-scrim" type="button" aria-label="Close menu" onClick={() => setMobileNavOpen(false)} />}
      {showLeadForm && <LeadModal onClose={() => setShowLeadForm(false)} onSubmit={addLead} />}
      {showTaskForm && <TaskModal onClose={() => setShowTaskForm(false)} onSubmit={addTask} leads={leads} />}
      {showPaymentForm && <PaymentModal onClose={() => setShowPaymentForm(false)} onSubmit={addPayment} leads={leads} />}
      {showExpenseForm && <ExpenseModal onClose={() => setShowExpenseForm(false)} onSubmit={addExpense} />}
    </div>
  );
}

function Dashboard({ metrics, stageCounts, programMix, monthRevenue, leads, tasks, setActive }) {
  const maxRevenue = Math.max(...monthRevenue.map((item) => item.value));
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
                  <div className="bar-fill" style={{ height: `${Math.max((item.value / maxRevenue) * 100, 8)}%` }} />
                </div>
                <strong>{item.label}</strong>
                <span>{Math.round(item.value / 1000)}k</span>
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
            {tasks.filter((task) => task.due === today || task.status === 'Overdue').slice(0, 4).map((task) => (
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

function LeadsView({ query, setQuery, stageFilter, setStageFilter, priorityFilter, setPriorityFilter, leads, updateLead, onAdd, onDownload }) {
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
        {leads.map((lead) => (
          <article className="lead-card" key={lead.id}>
            <div className="lead-card-top">
              <span>{lead.id}</span>
              <PriorityPill value={lead.priority} />
            </div>
            <h2>{lead.name}</h2>
            <p>{lead.goal} / {lead.program}</p>
            <div className="lead-facts">
              <span>{lead.city}</span>
              <span>{lead.phone}</span>
              <span>{lead.source}</span>
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
              <span>{formatMoney(lead.value)}</span>
              <span>Follow-up {lead.nextFollowUp}</span>
            </div>
          </article>
        ))}
      </section>
    </section>
  );
}

function TasksView({ tasks, updateTask, onAdd }) {
  const columns = ['Overdue', 'Due Today', 'Upcoming', 'Completed'];

  return (
    <section className="screen-grid">
      <div className="toolbar align-end">
        <button className="primary-button" type="button" onClick={onAdd}>
          <Plus size={16} />
          Task
        </button>
      </div>
      <div className="task-board">
        {columns.map((column) => (
          <section className="task-column" key={column}>
            <div className="column-title">
              <strong>{column}</strong>
              <span>{tasks.filter((task) => task.status === column).length}</span>
            </div>
            {tasks.filter((task) => task.status === column).map((task) => (
              <article className="task-card" key={task.id}>
                <div>
                  <strong>{task.title}</strong>
                  <span>{task.leadId} / {task.type}</span>
                </div>
                <div className="task-meta">
                  <span>{task.owner}</span>
                  <span>{task.due}</span>
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

function FinanceView({ payments, expenses, metrics, monthRevenue, onAddInvoice, onAddExpense }) {
  const maxRevenue = Math.max(...monthRevenue.map((item) => item.value));

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
              <i style={{ width: `${Math.max((item.value / maxRevenue) * 100, 8)}%` }} />
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
        </div>
        {payments.map((item) => (
          <div className="table-row" key={item.id}>
            <span>{item.id}</span>
            <strong>{item.client}</strong>
            <span>{item.program}</span>
            <span>{formatMoney(item.amount)}</span>
            <span>{formatMoney(item.paid)}</span>
            <StatusPill value={item.status} />
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
        </div>
        {expenses.map((item) => (
          <div className="expense-row" key={item.id}>
            <span>{item.id}</span>
            <strong>{item.category}</strong>
            <span>{item.description}</span>
            <span>{formatMoney(item.amount)}</span>
            <span>{item.taxRate}%</span>
            <StatusPill value={item.status} />
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
      return {
        ...task,
        leadName: lead?.name || 'General',
        phone: lead?.phone || '-',
        email: lead?.email || '-'
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
        {reminderRows.map((item) => (
          <div className="reminder-row" key={item.id}>
            <strong>{item.title}</strong>
            <span>{item.leadName}</span>
            <span>{item.due}</span>
            <button className="ghost-button compact" type="button">
              <Mail size={15} />
              Send
            </button>
            <button className="ghost-button compact" type="button">
              <CalendarCheck size={15} />
              Add
            </button>
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
                <strong>{client.nextFollowUp}</strong>
              </div>
            </div>
            <button className="ghost-button full" type="button">
              <MessageCircle size={16} />
              WhatsApp
            </button>
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
        <Input name="age" label="Age" type="number" required />
        <Input name="city" label="City" required />
        <Input name="phone" label="WhatsApp Number" required />
        <Input name="email" label="Email" type="email" required />
        <Input name="goal" label="Primary Goal" required />
        <Select name="source" label="Source" options={['Instagram', 'Referral', 'Protein Plate', 'Existing Client', 'Event/Workshop', 'Other']} />
        <Select name="program" label="Program" options={programs} />
        <Select name="priority" label="Priority" options={priorities} />
        <Input name="owner" label="Owner" />
        <Input name="value" label="Lead Value" type="number" required />
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
  return (
    <ModalShell title="Add Task" onClose={onClose}>
      <form className="modal-form" onSubmit={onSubmit}>
        <Input name="title" label="Task" required />
        <Select name="leadId" label="Lead" options={['-', ...leads.map((lead) => lead.id)]} />
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
  return (
    <ModalShell title="Add Invoice" onClose={onClose}>
      <form className="modal-form" onSubmit={onSubmit}>
        <Input name="client" label="Client Name" required />
        <Select name="leadId" label="Lead" options={['-', ...leads.map((lead) => lead.id)]} />
        <Select name="program" label="Program" options={programs} />
        <Input name="amount" label="Amount" type="number" required />
        <Input name="paid" label="Paid" type="number" required />
        <Input name="taxRate" label="Tax Rate %" type="number" />
        <Input name="due" label="Due Date" type="date" required />
        <div className="modal-actions">
          <button className="ghost-button" type="button" onClick={onClose}>Cancel</button>
          <button className="primary-button" type="submit">
            <Plus size={16} />
            Save Invoice
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
        <Input name="amount" label="Amount" type="number" required />
        <Input name="taxRate" label="Tax Rate %" type="number" />
        <Input name="date" label="Date" type="date" required />
        <Select name="status" label="Status" options={['Paid', 'Pending', 'Planned']} />
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

function Input({ name, label, type = 'text', required = false }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input name={name} type={type} required={required} />
    </label>
  );
}

function Select({ name, label, options }) {
  return (
    <label className="field">
      <span>{label}</span>
      <select name={name}>
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}

export default App;

# StrongHer CRM Tool

Private CRM for StrongHer lead, task, reminder, finance, client, and report workflows.

## Local

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The static app is built into `dist`.

## Cloudflare Pages

Use Cloudflare Pages with:

- Build command: `npm run build`
- Output directory: `dist`
- Project name: `strongher-crm-tool`

CLI deploy:

```bash
npm run deploy:cloudflare
```

## Data Storage

Right now, the CRM stores records in browser `localStorage` so the UI can be reviewed quickly.

For real use, create a Google Spreadsheet named `StrongHer CRM Data` and import the CSV files from:

`sheet-templates/`

Those tabs will become the first real CRM database:

- `Leads`
- `LeadStatusHistory`
- `Tasks`
- `FinanceInvoices`
- `FinanceExpenses`
- `Reminders`
- `Clients`
- `Settings`

After you share that spreadsheet link, the app can be connected through Google Apps Script. Later, the same structure can be migrated to PostgreSQL.

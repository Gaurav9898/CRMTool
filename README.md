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
- Project name: `crm-tool`

CLI deploy:

```bash
npm run deploy:cloudflare
```

## Data Storage

The CRM is now built to use Google Sheets through a Cloudflare Pages API route:

- Browser app → `/api/crm`
- Cloudflare Pages Function → Google Apps Script
- Google Apps Script → CRM workbook

For real use, connect the Google Spreadsheet:

`https://docs.google.com/spreadsheets/d/1jyrihEYdXq4Mz_Exerbl1GlA8wmdH3jQFr1fbuBWKo4/edit?gid=539139390#gid=539139390`

If rebuilding the workbook, import the CSV files from:

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

### Google Apps Script setup

1. Open the CRM workbook.
2. Go to `Extensions > Apps Script`.
3. Paste the file from `google-apps-script/StrongHerCRM.gs`.
4. Save, then run `setupSheets_` once and approve Google permissions.
5. Deploy with `Deploy > New deployment > Web app`.
6. Set access to `Anyone` and copy the Web app URL.

### Cloudflare Pages variables

In Cloudflare, open `crm-tool > Settings > Environment variables` and add:

```bash
GOOGLE_SHEETS_WEB_APP_URL=your_apps_script_web_app_url
CRM_SPREADSHEET_ID=1jyrihEYdXq4Mz_Exerbl1GlA8wmdH3jQFr1fbuBWKo4
```

Optional shared secret:

```bash
SHEETS_SHARED_SECRET=choose_a_private_value
```

If you set `SHEETS_SHARED_SECRET`, also put the same value in `CONFIG.sharedSecret` inside `google-apps-script/StrongHerCRM.gs`, then redeploy the Apps Script.

Later, the same sheet structure can be migrated to PostgreSQL.

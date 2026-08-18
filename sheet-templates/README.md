# StrongHer CRM Google Sheets Template

Create one Google Spreadsheet named `StrongHer CRM Data`, then create/import these tabs with the exact tab names below.

Use the existing website enquiry sheet as the raw source:

- Spreadsheet ID: `19Wm3dqs5d6f4AFiEGk7A_g_DGsQ2FrYQ_LWvafFnMbU`
- GID: `1770350818`

## Tabs

1. `Leads`
2. `LeadStatusHistory`
3. `Tasks`
4. `FinanceInvoices`
5. `FinanceExpenses`
6. `Reminders`
7. `Clients`
8. `Settings`

After you create/upload these tabs in Google Drive, share the spreadsheet link with me. I will connect the CRM to that sheet through Google Apps Script first, and later we can migrate the same structure to PostgreSQL.

Current app storage note: until that connection is added, the app stores edits in the browser's `localStorage`, so it is only prototype/local data.

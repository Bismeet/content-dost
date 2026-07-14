# Administrator Portal Guide

This guide is for administrators to log in and use the secure leads triage portal.

---

## 1. Accessing the Portal

The administrator portal is completely isolated and hidden from public visitors:
- There are no links or buttons on the main website referencing the admin page.
- Navigate directly in your browser to:
  `https://your-domain.com/admin/login`
- Log in using the email and password you created during the Supabase Auth setup.

---

## 2. Admin Leads Dashboard

Upon successful login, you are redirected to `/admin/leads`, which displays:

### 2.1 Global Statistics
- **Total Leads**: Number of all submissions stored in your database (including spam and archived).
- **Active Leads**: Total count excluding spam and archived leads.
- **Triage Breakdown**: Individual counts of leads labeled as `new`, `contacted`, `qualified`, `won`, etc.

### 2.2 Leads Filter & Controls
- **Search Bar**: Search database fields instantly by client name, email, or company name. The query is safely escaped on the server to prevent wildcard injections.
- **Status Filter**: Dropdown menu to filter leads by their current triage stage (e.g. show only `new` leads).
- **Table Headers**: Click any column header (Date, Name, Email, Company, Budget, Status) to toggle sorting in ascending or descending order. Sorted values are verified against a strict allowlist.
- **Sync Button**: Refresh current listings manually.
- **Export CSV**: Download a spreadsheet of your leads applying all current filters.

---

## 3. Triage & Detail Panel

Clicking any row in the table opens the **Lead Details** side panel:

### 3.1 Secure Lead Details
- All lead details (Name, Company, Details, Notes) are rendered as plain text. This protects you from cross-site scripting (XSS) or HTML injection from client inputs.
- **Clickable Email**: Click the client's email to draft a message immediately using your default mail app (`mailto:`).
- **Secure Profile Links**: Website or social profile links are parsed and validated. Only standard `http:` or `https:` protocols will render as clickable links. Clicking them opens in a new tab (`target="_blank"`) with security parameters (`rel="noopener noreferrer"`) to prevent reverse tab-jacking. Other protocols are rendered as plain text.

### 3.2 Update Status & Notes
1. Modify the dropdown selector to transition the lead's status (e.g., from `new` to `contacted`).
2. Add administrative details in the **Internal Notes** field (limited to 5,000 characters).
3. Click **Save Changes** to commit.

### 3.3 Soft Archiving
- To delete or clean up the dashboard, click the **Archive** button.
- An alert box will prompt you for confirmation.
- Confirming updates the lead status to `archived`, removing it from the active listings. No records are deleted from the database.

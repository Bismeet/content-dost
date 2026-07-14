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
- **Table Headers**: Click any column header (Date, Name, Email, Company, Status) to toggle sorting in ascending or descending order. Sorted values are verified against a strict allowlist.
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
- To mark a lead as processed or completed in a business context, click the **Archive** button. This updates the lead's status to `archived`. It remains in the database and active metrics under "Total", but is removed from the default "Active Leads" view.

### 3.4 Move to Trash
- To remove spam, duplicate, or junk leads from the active dashboard completely, click **Move to Trash**.
- A confirmation dialog will explain that the lead will be moved to the Trash view but can be restored later.
- Moving a lead to Trash excludes it entirely from all active dashboard lists and statistics counters.

---

## 4. Trash & Lead Recovery

### 4.1 Accessing the Trash Tab
- A navigation tab selector at the top of the dashboard allows you to switch between the active **Leads** view and the **Trash** view.
- The **Trash** tab displays a count badge showing how many leads are currently trashed.

### 4.2 Restoring a Lead
- Select a lead in the **Trash** list and click the **Restore Lead** button.
- A confirmation dialog will appear. Confirming will clear the trash flags and return the lead to the active dashboard. All original status designations and internal notes are fully preserved.

### 4.3 Permanent Deletion
- To permanently delete a lead, click **Permanently Delete** inside the Trash detail panel.
- A destructive confirmation dialog will open. Because permanent deletion is irreversible and completely purges all client data and notes from the database, **you must type the exact word `DELETE` (in uppercase) to enable the confirmation button**.
- Click the confirm button to execute the delete. Exactly one row is purged from the database. Active leads cannot be permanently deleted by bypassing this workflow.
- No automatic cron cleanup currently runs; all trash items remain in the Trash indefinitely until manually reviewed and permanently deleted.

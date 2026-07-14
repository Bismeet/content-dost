# Backend and Infrastructure Setup Guide

This guide provides step-by-step instructions to configure the Supabase database, Upstash Redis rate-limiter, Resend email provider, local environment variables, and Vercel hosting from scratch.

---

## 1. Supabase (Database & Authentication)

### Step 1.1: Create a Supabase Project
1. Visit [Supabase](https://supabase.com) and log in or sign up.
2. Click **New Project** and select your organization.
3. Configure project details:
   - **Name**: `Content Dost Backend`
   - **Database Password**: *Generate and save a strong password safely.*
   - **Region**: Select a region close to your target audience (e.g. `us-east-1` or your local region).
   - **Pricing Plan**: Select the **Free** tier (or appropriate paid tier).
4. Click **Create new project** and wait for provisioning to complete (typically 1-2 minutes).

### Step 1.2: Run the SQL Migrations
1. In your Supabase dashboard, click on the **SQL Editor** icon in the left navigation sidebar (resembles `[SQL]` terminal icon).
2. Click **New Query** to create a blank editor.
3. Copy the entire contents of the initial migration file located in this repository at:
   [001_create_leads.sql](file:///c:/Users/as360/Documents/anunay%20landing%20page/supabase/migrations/001_create_leads.sql)
4. Paste the SQL query into the editor window and click **Run**.
5. Click **New Query** again to create another blank editor.
6. Copy the entire contents of the soft-delete/trash migration file located in this repository at:
   [003_add_lead_trash.sql](file:///c:/Users/as360/Documents/anunay%20landing%20page/supabase/migrations/003_add_lead_trash.sql)
7. Paste it into the editor window and click **Run**.
8. Click **New Query** again to create another blank editor.
9. Copy the entire contents of the budget removal migration file located in this repository at:
   [004_remove_budget_from_leads.sql](file:///c:/Users/as360/Documents/anunay%20landing%20page/supabase/migrations/004_remove_budget_from_leads.sql)
10. Paste it into the editor window and click **Run**.
11. Verify all migrations execute successfully, and confirm that the `budget` column no longer exists in `public.leads`. This sets up the database table structure, indexes, soft-delete fields, triggers, and drops the budget field constraint.

### Step 1.3: Disable Public User Signup
1. Navigate to **Authentication** (User icon in left sidebar) -> **Providers** -> **Email**.
2. Find the **Confirm email** or **Allow new users to sign up** options.
3. Toggle off **Allow new users to sign up** to prevent public registrations on your Supabase endpoint.
4. Click **Save** at the bottom of the page.

### Step 1.4: Create the Single Administrator Account
1. Under **Authentication**, navigate to the **Users** tab.
2. Click **Add User** -> **Create User**.
3. Enter the administrator's email and password.
4. Toggle **Auto-confirm User** to `ON` so they do not need to confirm their email address.
5. Click **Create User**.
6. Copy the **User ID** (UUID format: e.g. `a1b2c3d4-e5f6-7a8b-9c0d-1234567890ab`) of the newly created user. This will be your `ADMIN_USER_ID` environment variable.

### Step 1.5: Retrieve API Credentials
1. Go to **Project Settings** (Gear icon in left sidebar) -> **API**.
2. Under **Project API keys**, locate and copy:
   - **Project URL** (`SUPABASE_URL`)
   - **anon public** (`SUPABASE_ANON_KEY`)
   - **service_role secret** (`SUPABASE_SERVICE_ROLE_KEY`) *WARNING: Keep this private; never share it.*

---

## 2. Upstash (Redis Rate Limiting)

### Step 2.1: Create Upstash Database
1. Visit [Upstash Console](https://console.upstash.com) and sign in.
2. Click **Create Database**.
3. Enter details:
   - **Name**: `content-dost-limiter`
   - **Type**: `Global` or regional matching your Vercel deployment.
4. Click **Create**.

### Step 2.2: Retrieve REST Keys
1. In the database dashboard, scroll down to the **REST API** section.
2. Copy the following keys:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

---

## 3. Resend (Email Notifications)

### Step 3.1: Create Resend Account
1. Visit [Resend](https://resend.com) and sign up.
2. Go to **API Keys** in the sidebar.
3. Click **Create API Key**.
   - **Name**: `CD Backend Key`
   - **Permissions**: Full Access
4. Copy the generated key. This is `RESEND_API_KEY`.

### Step 3.2: Verify Sender Domain (Optional but Recommended)
1. Go to **Domains** in the sidebar.
2. Click **Add Domain** and enter your domain name (e.g. `yourdomain.com`).
3. Copy the generated DNS records (MX, TXT, SPF) and add them to your domain registrar (e.g. GoDaddy, Namecheap, Route 53).
4. Click **Verify** in Resend once records propagate.
5. Once verified, you can send emails from any address ending in `@yourdomain.com` (configured in `RESEND_FROM_EMAIL`). If not verified, you are limited to sending from `onboarding@resend.dev` to your own registered account email only.

---

## 4. Local Environment Configuration

1. Create a `.env` file in the root of your local repository.
2. Populate the file with keys retrieved in earlier steps:

```env
SUPABASE_URL=https://yourproject.supabase.co
SUPABASE_ANON_KEY=youranonpublickey
SUPABASE_SERVICE_ROLE_KEY=yourservicerolesecretkey
ADMIN_USER_ID=your-admin-uuid-from-step-1-4

UPSTASH_REDIS_REST_URL=https://yourredis.upstash.io
UPSTASH_REDIS_REST_TOKEN=yourredistoken
IP_HASH_SECRET=generate-a-long-random-hash-secret-here-to-secure-ip-hashes

RESEND_API_KEY=re_yourapikey
RESEND_FROM_EMAIL=Content Dost <onboarding@yourdomain.com>
LEAD_NOTIFICATION_EMAIL=hello@contentdost.agency

APP_ORIGIN=http://localhost:3000
ADDITIONAL_ALLOWED_ORIGINS=http://localhost:5173
```

---

## 5. Running Locally with Vercel CLI

Vercel functions run in Node.js serverless runtimes. To test backend API endpoints locally alongside the Vite frontend:

### Step 5.1: Install Vercel CLI
If you do not have the Vercel CLI installed globally, install it:
```bash
npm install -g vercel
```

### Step 5.2: Link and Run Dev Server
1. Open your terminal in the root of this repository.
2. Run `vercel dev` to start the serverless router:
   ```bash
   npm run dev:vercel
   ```
3. Follow the prompt to log in and link to a new Vercel project if requested.
4. The CLI will bind the functions and frontend together, launching your site locally (usually at `http://localhost:3000`).

---

## 6. Deployment to Vercel Production

### Step 6.1: Connect GitHub to Vercel
1. Go to [Vercel](https://vercel.com) and click **Add New** -> **Project**.
2. Select your imported GitHub repository containing the Content Dost code.
3. Under **Configure Project**:
   - Vercel automatically detects the **Vite** framework. Leave default settings.
   - Do NOT override build or output directories.

### Step 6.2: Configure Environment Variables
1. Scroll down to the **Environment Variables** section in the project configuration panel.
2. Add each key from your `.env` file. Do not include `APP_ORIGIN` as localhost; set `APP_ORIGIN` to your production URL (e.g. `https://your-app.vercel.app`).
3. Click **Deploy**.

### Step 6.3: Post-Deployment Check
1. Once deployed, verify pages load.
2. Test submitting a valid inquiry on the main page to verify Supabase storage and Resend notification delivery.
3. Visit `/admin/login` directly in your browser, log in, and verify cookie persistence and leads listing.
4. Refresh `/admin/leads` to confirm that the `vercel.json` rewrites are routing correctly without showing 404.

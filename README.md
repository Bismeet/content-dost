# Content Dost | Premium Creative Content Engine

Content Dost is a premium creative content partner for internet elite founders, creators, and brands. This repository holds the high-performance landing page integrated with a secure lead-capture backend and an isolated administrator portal.

---

## Technical Stack

- **Frontend**: React 19, Vite 8, TypeScript, Tailwind CSS v4, Framer Motion, GSAP, Pixi.js, Lenis Scroll.
- **Routing**: React Router (isolated routes for administrator pages).
- **Backend API**: Vercel Serverless Functions (Node.js).
- **Database**: Supabase PostgreSQL (secured via Row Level Security).
- **Authentication**: Supabase Auth (session management stored in HttpOnly secure cookies).
- **Rate Limiting**: Upstash Redis sliding-window.
- **Email Delivery**: Resend (plain-text notifications).
- **Validation**: Zod (strict schemas for all public and admin mutations).
- **Testing Suite**: Vitest (extensive security, schema, and API helper unit tests).

---

## Documentation Links

For detailed guides, please refer to:
1. **[Backend Infrastructure Setup Guide](file:///c:/Users/as360/Documents/anunay%20landing%20page/BACKEND_SETUP.md)**: Setup instructions for Supabase, Upstash Redis, Resend, local development with Vercel CLI, and production hosting config.
2. **[Administrator Portal Guide](file:///c:/Users/as360/Documents/anunay%20landing%20page/ADMIN_GUIDE.md)**: Step-by-step documentation for triage dashboard operations, filtering, internal notes, and data export.

---

## Local Development Commands

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and populate your secrets:
```bash
cp .env.example .env
```

### 3. Run the Development Server
To run the full stack (Vite frontend + Serverless backend functions locally):
```bash
npm run dev:vercel
```
*Requires the Vercel CLI (`npm install -g vercel`) installed.*

---

## Verification & Build Checks

Before committing or deploying, run the verification checks:

```bash
# 1. Lint the codebase
npm run lint

# 2. Type-check serverless API code
npm run typecheck:server

# 3. Run automated tests
npm run test

# 4. Compile and verify production build
npm run build
```

# portfolio

Unified Next.js App Router portfolio with a built-in API.

## Stack

- Frontend: Next.js App Router, React 19, Tailwind CSS v4, Framer Motion
- Backend: Next.js Route Handlers, PostgreSQL (Supabase), Resend
- Deployment: Vercel (single project)

## Project Structure

```text
.
├─ app/
│  ├─ (public)/
│  ├─ admin/
│  └─ api/
├─ components/
├─ context/
├─ data/
├─ features/
├─ lib/
├─ public/
├─ middleware.js
├─ next.config.mjs
├─ postcss.config.cjs
├─ tailwind.config.js
├─ eslint.config.js
├─ package.json
└─ package-lock.json
```

## Local Development

### Prerequisites

- Node.js 22.x
- npm 10+
- Supabase PostgreSQL project
- Resend credentials (optional for contact emails)

### Install

From the repository root:

```bash
npm install
```

### Environment

```bash
cp .env.example .env
```

Set at least:

- `SUPABASE_PROJECT_ID`, `SUPABASE_SERVICE_ROLE_KEY`
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`
- `MAIL_FROM`, `CONTACT_TO_EMAIL` (if you want email delivery)

Optional:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_API_BASE_URL` (leave empty for same-origin `/api`)

### Run

```bash
npm run dev
```

Default local URL:

- App: `http://localhost:3000`

## Runtime Flow

- Public site renders via App Router.
- API routes live under `app/api/*`.
- Admin routes are protected by `middleware.js` using HttpOnly cookies.
- Swagger UI is available at `/api/docs` and OpenAPI at `/api/openapi.json`.

## Database Schema

The PostgreSQL schema used by the API remains in `backend/schema.sql` until the legacy folders are removed.

## Contact

- Email: hieutm.site@gmail.com
- GitHub: @Tmh3101

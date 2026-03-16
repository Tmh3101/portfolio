# 🚀 Professional Portfolio Monolith

A high-performance, SEO-optimized professional portfolio built as a modern **Next.js Monolith**. This project features a public-facing frontend and a secure, built-in **Admin CMS** powered by **Supabase**.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-CMS-3ECF8E?style=for-the-badge&logo=supabase)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel)

---

## 🏗️ Architecture Overview

This project has been refactored from a split-repo architecture into a **unified Next.js 15 App Router Monolith**.

- **Frontend:** React 19, Tailwind CSS v4, and Framer Motion for rich, fluid animations.
- **Backend:** Next.js Route Handlers (API) providing a robust backend layer.
- **CMS:** Supabase (PostgreSQL) for dynamic content management with **React Server Components (RSC)** and **Incremental Static Regeneration (ISR)** for blazing-fast performance.
- **Security:** Secure Admin dashboard protected by Middleware and HttpOnly cookies.

---

## ✨ Key Features

### 🌐 Public Portfolio

- **Dynamic Content:** Hero section, projects, experiences, and skills are all fetched dynamically from Supabase.
- **High Performance:** Optimized images and ISR (revalidation every 1 hour) for near-instant page loads.
- **Multilingual Support:** Full support for English and Vietnamese (VI/EN).
- **Interactive Terminal:** A built-in "Quick Terminal" for developer-friendly site navigation.
- **SEO Ready:** Complete metadata management and OpenGraph support.

### 🔐 Admin CMS

- **Content Management:** Full CRUD interfaces for Projects, Experiences, Skills, Stats, and Approaches.
- **Settings Editor:** Manage global SEO, site titles, and social links without touching code.
- **Image Uploader:** Direct integration with Supabase Storage for project thumbnails and profile images.
- **Markdown Editor:** Rich text support for project and experience descriptions.
- **Visitor Analytics:** Overview of site visits and contact form submissions.

---

## 🛠️ Getting Started

### Prerequisites

- **Node.js:** 22.x or higher
- **npm:** 10.x or higher
- **Supabase Account:** Required for database and storage features.

### 1. Clone & Install

```bash
git clone https://github.com/Tmh3101/portfolio.git
cd portfolio
npm install
```

### 2. Supabase Setup

1. **Database Schema:**
   - Go to your Supabase Dashboard -> SQL Editor.
   - Copy the contents of `supabase/migrations/0001_initial_schema.sql` and run it.
2. **Storage Setup:**
   - Create a new public bucket named `portfolio-assets`.
   - Ensure policies allow **Public Read** and **Authenticated Upload/Delete**.
   - Refer to `supabase/STORAGE_SETUP.md` for detailed SQL policies.

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Fill in the following required variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Auth & Security
JWT_ACCESS_SECRET=your-random-secret
JWT_REFRESH_SECRET=your-random-secret

# Email (Resend)
MAIL_FROM="Your Name <noreply@yourdomain.com>"
CONTACT_TO_EMAIL=your-email@gmail.com
RESEND_API_KEY=re_your_api_key
```

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

---

## 📂 Project Structure

```text
.
├── app/                # Next.js App Router (Public, Admin, API)
│   ├── (public)/       # Public portfolio pages
│   ├── admin/          # Protected Admin CMS pages
│   ├── api/            # Backend Route Handlers
│   └── login/          # Auth pages
├── components/         # Shared UI components
│   └── admin/          # CMS-specific components (Uploader, Table, etc.)
├── context/            # React Context (Language, Toast, etc.)
├── features/           # Domain-driven logic (Admin/Public state)
├── lib/                # Shared utilities, services, and Supabase clients
├── public/             # Static assets (optimized images)
├── supabase/           # Migrations and storage setup guides
├── middleware.js       # Route protection & security
└── next.config.mjs     # Next.js configuration
```

---

## 📩 Contact

- **Email:** hieutm.site@gmail.com
- **GitHub:** [@Tmh3101](https://github.com/Tmh3101)

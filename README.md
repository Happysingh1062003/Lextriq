# <img src="public/logo.svg" width="32" height="32" alt="Lextriq Logo" /> Lextriq — The AI Prompt Library

**Discover, save, and share high-quality AI prompts.** Lextriq is a community-driven platform where creators upload battle-tested prompts for ChatGPT, Claude, Gemini, Midjourney, and 40+ AI tools — organized by category, upvoted by the community.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=flat-square&logo=prisma)](https://prisma.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)

---

## ✨ Features

### Core Platform
- **📝 Upload & Share Prompts** — Rich editor with category, AI tool tags, difficulty level, and output examples
- **🔍 Smart Search** — Multi-word AND search across titles, descriptions, content, tags, and author names
- **🔥 Trending Feed** — Composite ranking by upvotes, copies, views, and bookmarks
- **📂 Discover** — Browse by category, AI tool, difficulty, with infinite scroll
- **⬆️ Upvote & Bookmark** — Community voting + personal prompt library
- **💬 Comments** — Threaded discussion on every prompt
- **📊 User Dashboard** — Personal stats (prompts, upvotes, views, copies)

### Growth & SEO
- **🖼️ Dynamic OG Images** — Auto-generated branded 1200×630 social share cards via Edge runtime
- **🔒 Logged-Out Friction** — Blurred prompts for anonymous visitors with signup CTA
- **📈 Programmatic SEO** — Auto-generated `/prompts/[tool]/[category]` landing pages (e.g., "Top ChatGPT Prompts for Marketing")
- **🗺️ Sitemap & Robots** — Auto-generated `sitemap.xml` and `robots.txt`
- **📋 JSON-LD** — Structured data for rich Google snippets

### UX & Psychology
- **🧠 Onboarding Progress** — 3-step Zeigarnik Effect progress bar for new users
- **💚 Dopamine Micro-Interactions** — Green pulse animation + ROI-reinforcing copy toast
- **⚡ Cached Feeds** — ISR with 60-second revalidation via `unstable_cache`
- **📱 Responsive** — Mobile-first design with slide-in drawer sidebar

### Authentication
- **🔐 Email OTP Login** — Passwordless magic code via Gmail SMTP (Nodemailer)
- **🔑 OAuth** — Google & GitHub sign-in via NextAuth.js v5
- **👤 User Profiles** — Avatar, bio, and prompt history

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Language** | TypeScript 5 |
| **UI** | React 19, Tailwind CSS 4, Framer Motion |
| **Components** | Radix UI, shadcn/ui, Lucide Icons |
| **Database** | PostgreSQL + Prisma ORM 7 |
| **Auth** | NextAuth.js v5 (OAuth + Email OTP) |
| **Email** | Nodemailer + Gmail SMTP |
| **File Upload** | UploadThing |
| **Forms** | React Hook Form + Zod validation |
| **Deployment** | Vercel (Edge + Serverless) |

---

## 📁 Project Structure

```
prompt-vault/
├── app/
│   ├── (auth)/              # Login / Signup pages
│   ├── (dashboard)/         # Authenticated dashboard layout
│   │   └── dashboard/
│   │       ├── discover/    # Browse & filter prompts
│   │       ├── my-prompts/  # User's uploaded prompts
│   │       ├── prompt/[id]/ # Prompt detail page
│   │       ├── saved/       # Bookmarked prompts
│   │       ├── settings/    # User profile settings
│   │       └── upload/      # Upload new prompt
│   ├── api/
│   │   ├── auth/            # NextAuth + OTP endpoints
│   │   ├── og/              # Dynamic OG image generation (Edge)
│   │   ├── prompts/         # CRUD + upvote/bookmark/copy/comment APIs
│   │   └── users/           # User profile & stats APIs
│   ├── prompts/             # Public SEO pages
│   │   ├── [tool]/[category]/ # Programmatic SEO routes
│   │   └── page.tsx         # Prompt library hub
│   ├── sitemap.ts           # Dynamic sitemap
│   └── robots.ts            # Robots.txt config
├── components/              # Reusable UI components
├── lib/
│   ├── auth.ts              # NextAuth configuration
│   ├── prisma.ts            # Prisma client singleton
│   └── queries.ts           # Cached database queries
├── prisma/
│   └── schema.prisma        # Database schema
└── types/
    └── index.ts             # TypeScript types + constants
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **PostgreSQL** database (local or hosted — [Neon](https://neon.tech), [Supabase](https://supabase.com), etc.)
- **Gmail account** with [App Password](https://myaccount.google.com/apppasswords) enabled (for OTP emails)
- **UploadThing** account for file uploads ([uploadthing.com](https://uploadthing.com))

### 1. Clone & Install

```bash
git clone https://github.com/your-username/lextriq.git
cd lextriq
npm install
```

### 2. Environment Variables

Create a `.env` file in the root:

```env
# Database (get a free one at https://neon.tech)
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"   # Change to your domain in production
NEXTAUTH_SECRET="your-random-secret-key"

# OAuth (optional — skip for email/password login)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"

# Gmail SMTP (for OTP emails)
SMTP_USER="your-gmail@gmail.com"
SMTP_PASS="xxxx xxxx xxxx xxxx"   # Google App Password, NOT your login password

# UploadThing
UPLOADTHING_TOKEN="your-uploadthing-token"
```

> **Note:** Generate `NEXTAUTH_SECRET` with: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`
> 
> **Note:** Get a Gmail App Password at [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords) (requires 2-Step Verification enabled).

### 3. Database Setup

```bash
npx prisma generate
npx prisma db push
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you're live.

### 5. Production Build

```bash
npm run build
npm start
```

---

## 📊 Database Schema

```
User ──┬── Prompt ──┬── Upvote
       │            ├── Bookmark
       │            ├── Comment
       │            └── Result (output examples)
       ├── Account (OAuth)
       ├── Session
       └── EmailOtp (passwordless login)
```

**Key models:** `User`, `Prompt`, `Upvote`, `Bookmark`, `Comment`, `Result`
**Indexes:** Optimized composite indexes on `[published, createdAt]`, `[published, category]`, `[authorId, createdAt]`

---

## ⚡ Performance

| Metric | Target | How |
|---|---|---|
| **TTFB** | < 200ms | `unstable_cache` with 60s ISR on feed queries |
| **LCP** | < 2.5s | Streamed shell + Suspense boundaries |
| **Bundle** | Minimal | Turbopack + tree-shaking |
| **Static Pages** | 50+ pre-rendered | `generateStaticParams` for SEO routes |

---

## 🌐 SEO

- **Dynamic Meta Tags** — Every prompt page has unique `title`, `description`, and OG image
- **Programmatic Pages** — 25+ pre-rendered tool×category landing pages
- **Structured Data** — JSON-LD `Article` schema on prompt detail pages
- **Internal Linking Hub** — `/prompts` page distributes link equity across all SEO pages
- **Sitemap** — Auto-generated and submitted to search engines

---

## 📄 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/prompts` | List prompts (search, filter, paginate) |
| `POST` | `/api/prompts` | Create a new prompt |
| `GET` | `/api/prompts/[id]` | Get prompt details |
| `DELETE` | `/api/prompts/[id]` | Delete a prompt (owner only) |
| `POST` | `/api/prompts/[id]/upvote` | Toggle upvote |
| `POST` | `/api/prompts/[id]/bookmark` | Toggle bookmark |
| `POST` | `/api/prompts/[id]/copy` | Track copy event |
| `POST` | `/api/prompts/[id]/comments` | Add a comment |
| `GET` | `/api/og?title=...&category=...` | Generate OG image (Edge) |
| `GET` | `/api/users/me` | Get current user profile |

---

## 🤝 Contributing

1. Fork the repository
2. Create your branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">
  Built with ☕ and obsession by the Lextriq team.
</p>

# Youth Development Program (YDP) — Official Website

> **Empowering Youth – Shaping the Future**

A complete, production-ready website for the Youth Development Program (YDP), Pakistan's premier national youth-led organisation. Built with Next.js 14, TypeScript, Tailwind CSS, Prisma, and MySQL.

---

## 🌟 Features

### Public Website
- 🏠 **Home Page** — Hero, Mission/Vision, Statistics, Leadership, Events, News, Gallery, Partners, Newsletter
- 👥 **About** — Full history, mission, vision, values, org structure, founder message
- 🗺️ **5 Province Pages** — Punjab, KPK, Sindh, Balochistan, Kashmir (leadership, districts, activities)
- 📅 **Events** — Upcoming/past events with registration system
- 📰 **News & Blog** — Rich articles with categories, tags, search
- 🖼️ **Gallery** — Albums, lightbox, photos and videos
- 📄 **Resources** — PDF downloads, reports, forms, brochures
- 💳 **Membership** — Multi-step registration, digital card, QR verification
- ❤️ **Volunteer** — Application form with approval workflow
- 📧 **Contact** — Form, FAQ, map

### Admin Panel (`/admin`)
- 📊 **Dashboard** — Stats, charts, recent activity
- 👤 **Members** — Approve, reject, search, export, digital card
- 📅 **Events** — CRUD, registrations, certificates
- 📰 **News** — Rich editor, categories, SEO fields
- 🖼️ **Gallery** — Album management, drag-and-drop upload
- 🏆 **Certificates** — Generate, QR code, email, bulk issue
- ❤️ **Volunteers** — Review applications, approve/reject
- 👑 **Leadership** — Profile management, reordering
- 📧 **Contacts** — Inbox, reply, archive
- ⚙️ **Settings** — Site config, SEO, social links

### Security
- ✅ CSRF protection (Next.js built-in)
- ✅ XSS sanitization
- ✅ SQL injection prevention (Prisma parameterised queries)
- ✅ Rate limiting on forms
- ✅ JWT authentication (NextAuth.js)
- ✅ Role-based access control (8 roles)
- ✅ Bcrypt password hashing
- ✅ Secure HTTP headers

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, Framer Motion |
| Backend | Next.js API Routes |
| Database | MySQL + Prisma ORM |
| Authentication | NextAuth.js v5 (JWT) |
| Email | Nodemailer (SMTP) |
| Rich Text | TipTap Editor |
| Charts | Recharts |
| File Upload | Local filesystem |
| PDF/Certificates | jsPDF + Canvas |
| QR Codes | qrcode library |

---

## 📁 Project Structure

```
ydp-website/
├── app/
│   ├── (public)/          # Public website pages
│   │   ├── page.tsx       # Home page
│   │   ├── about/
│   │   ├── leadership/
│   │   ├── provinces/
│   │   │   └── [province]/
│   │   ├── departments/
│   │   │   └── [slug]/
│   │   ├── events/
│   │   │   └── [slug]/
│   │   ├── news/
│   │   │   └── [slug]/
│   │   ├── gallery/
│   │   ├── membership/
│   │   ├── volunteer/
│   │   ├── resources/
│   │   ├── contact/
│   │   └── verify/[code]/
│   ├── (auth)/            # Auth pages (login, reset)
│   ├── admin/             # Admin panel
│   └── api/               # API routes
├── components/
│   ├── public/            # Navbar, Footer, etc.
│   ├── admin/             # Admin UI components
│   └── ui/                # Shared UI primitives
├── lib/                   # Prisma, auth, email, utils
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Seed data
├── public/
│   ├── images/            # YDP photos and logos
│   └── uploads/           # User uploaded files
├── .env.example           # Environment template
├── INSTALLATION.md        # Setup guide
└── DEPLOYMENT.md          # Deployment guide
```

---

## 🚀 Quick Start

See [INSTALLATION.md](./INSTALLATION.md) for full setup instructions.

```bash
# 1. Copy environment file
cp .env.example .env

# 2. Configure your database and email in .env

# 3. Install dependencies
npm install

# 4. Push database schema
npm run db:push

# 5. Seed with YDP data
npm run db:seed

# 6. Start development server
npm run dev
```

**Admin login after seeding:**
- Email: `admin@ydp.pk`
- Password: `xyz!`

⚠️ **Change the admin password immediately after first login!**

---

## 🎨 Brand Colors

| Color | Hex | Usage |
|---|---|---|
| YDP Navy | `#1B2A6B` | Primary — headers, CTA, sidebar |
| YDP Cyan | `#00BCD4` | Secondary — accents, links |
| YDP Green | `#4CAF50` | Success, welfare, positive |
| YDP Gold | `#FFC107` | Awards, highlights, badges |

---

## 📧 Contact

- **Email**: infoyda2024@gmail.com
- **Phone**: +92 311 9250771

---

## 📄 License

© 2024 Youth Development Program (YDP). All Rights Reserved.

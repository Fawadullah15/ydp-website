# YDP Website — Installation Guide

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** v18.17 or later — [Download](https://nodejs.org/)
- **npm** v9+ or **yarn** (comes with Node.js)
- **MySQL** 8.0 or later — [Download](https://dev.mysql.com/downloads/)
- **Git** (optional) — [Download](https://git-scm.com/)

---

## Step 1: Set Up the Database

1. Open MySQL and create a new database:

```sql
CREATE DATABASE ydp_website CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'ydp_user'@'localhost' IDENTIFIED BY 'your_password_here';
GRANT ALL PRIVILEGES ON ydp_website.* TO 'ydp_user'@'localhost';
FLUSH PRIVILEGES;
```

---

## Step 2: Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` and fill in your values:

```env
# Database — use the credentials from Step 1
DATABASE_URL="mysql://ydp_user:your_password_here@localhost:3306/ydp_website"

# NextAuth Secret — generate a random 32+ character string
# You can use: openssl rand -base64 32
NEXTAUTH_SECRET="paste-your-random-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Email — use Gmail with App Password or any SMTP provider
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-gmail@gmail.com"
SMTP_PASS="your-gmail-app-password"
SMTP_FROM="Youth Development Program <infoyda2024@gmail.com>"

# App URL (change for production)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Getting a Gmail App Password:
1. Go to your Google Account → Security → 2-Step Verification → App Passwords
2. Generate an app password for "Mail"
3. Paste it as `SMTP_PASS`

---

## Step 3: Install Dependencies

```bash
npm install
```

This will install all packages listed in `package.json`.

---

## Step 4: Set Up the Database Schema

```bash
# Push the Prisma schema to MySQL
npm run db:push

# OR use migrations (recommended for production)
npm run db:migrate
```

---

## Step 5: Seed the Database

```bash
npm run db:seed
```

This will populate the database with:
- ✅ Super Admin user
- ✅ All 5 provinces (Punjab, KPK, Sindh, Balochistan, Kashmir)
- ✅ All district data
- ✅ All 14 leadership profiles from the PDF
- ✅ All 7 departments
- ✅ News categories
- ✅ Sample testimonials
- ✅ Default site settings

---

## Step 6: Upload Images

Copy the provided images to the correct locations:

```
public/
├── images/
│   ├── ydp-logo.png              ← YDP main logo
│   ├── hwo-logo.png              ← HWO logo
│   ├── leadership/
│   │   └── hamza-rehman.jpg      ← Founder photo
│   └── gallery/
│       ├── group-photo-1.jpg
│       ├── group-photo-2.jpg
│       ├── meeting-photo.jpg
│       ├── media-appearance.jpg
│       ├── event-photo-1.jpg
│       └── event-photo-2.jpg
```

---

## Step 7: Run the Development Server

```bash
npm run dev
```

Open your browser at: **http://localhost:3000**

### Admin Panel:
URL: **http://localhost:3000/admin**
- Email: `admin@ydp.pk`
- Password: `YDP@Admin2024!`

> ⚠️ **IMPORTANT**: Change the admin password immediately after first login!

---

## Step 8: Build for Production

```bash
npm run build
npm run start
```

---

## Troubleshooting

### Database Connection Error
- Verify MySQL is running
- Check `DATABASE_URL` in `.env` matches your MySQL credentials

### Prisma Error
```bash
npm run db:generate  # Regenerate Prisma client
npm run db:push      # Push schema again
```

### Port Already in Use
```bash
npm run dev -- -p 3001  # Use port 3001 instead
```

### Email Not Sending
- Check SMTP credentials in `.env`
- Gmail: ensure "Less secure app access" or App Passwords are configured
- Check spam folder for test emails

---

## Next Steps

After installation:
1. Log into the admin panel
2. Change the default admin password
3. Upload YDP logo and photos via Settings
4. Add your first news article
5. Create an upcoming event
6. Start approving member applications

See [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment instructions.

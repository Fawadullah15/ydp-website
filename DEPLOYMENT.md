# YDP Website — Deployment Guide

## Option A: VPS / Dedicated Server (Recommended)

### Requirements
- Ubuntu 20.04+ or CentOS 8+
- Node.js 18.17+
- MySQL 8.0+
- Nginx (reverse proxy)
- PM2 (process manager)
- SSL certificate (Let's Encrypt)

### Step 1: Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MySQL
sudo apt install -y mysql-server
sudo mysql_secure_installation

# Install PM2
npm install -g pm2

# Install Nginx
sudo apt install -y nginx
```

### Step 2: Upload Project

```bash
# On your local machine, build first:
npm run build

# Upload the following to your server:
# - .next/
# - public/
# - prisma/
# - package.json
# - next.config.js
# - .env (with production values)

# Or use git:
git clone your-repo /var/www/ydp-website
cd /var/www/ydp-website
```

### Step 3: Configure Production .env

```env
DATABASE_URL="mysql://ydp_user:STRONG_PASSWORD@localhost:3306/ydp_website"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-64"
NEXTAUTH_URL="https://www.yourydpdomain.com"
NEXT_PUBLIC_APP_URL="https://www.yourydpdomain.com"
SMTP_HOST="your-smtp-host"
SMTP_PORT="587"
SMTP_USER="your-email"
SMTP_PASS="your-smtp-password"
```

### Step 4: Install & Build on Server

```bash
cd /var/www/ydp-website
npm install --production
npm run db:push
npm run db:seed
npm run build
```

### Step 5: Configure PM2

Create `/var/www/ydp-website/ecosystem.config.js`:
```js
module.exports = {
  apps: [{
    name: 'ydp-website',
    script: 'node_modules/.bin/next',
    args: 'start',
    cwd: '/var/www/ydp-website',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
  }],
}
```

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Step 6: Configure Nginx

Create `/etc/nginx/sites-available/ydp-website`:

```nginx
server {
    listen 80;
    server_name yourydpdomain.com www.yourydpdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourydpdomain.com www.yourydpdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourydpdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourydpdomain.com/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Proxy to Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Serve static files directly
    location /_next/static {
        alias /var/www/ydp-website/.next/static;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }

    location /public {
        alias /var/www/ydp-website/public;
        expires 30d;
        add_header Cache-Control "public";
    }

    # File upload limit
    client_max_body_size 10M;
}
```

```bash
sudo ln -s /etc/nginx/sites-available/ydp-website /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 7: SSL Certificate

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourydpdomain.com -d www.yourydpdomain.com
```

---

## Option B: Shared Hosting with Apache

### Requirements
- cPanel shared hosting with Node.js support
- MySQL database (via cPanel)
- Node.js 18+ (via cPanel "Node.js App" feature)

### Steps

1. **Create MySQL Database** in cPanel → MySQL Databases
2. **Upload files** via cPanel File Manager or FTP to your domain folder
3. **Configure `.env`** with cPanel MySQL credentials
4. **Create Node.js App** in cPanel:
   - Node.js version: 18
   - Application root: `/home/yourusername/public_html`
   - Application URL: your domain
   - Application startup file: `server.js`
5. **Create `server.js`** in project root:
   ```js
   const { createServer } = require('http')
   const { parse } = require('url')
   const next = require('next')
   
   const app = next({ dev: false })
   const handle = app.getRequestHandler()
   
   app.prepare().then(() => {
     createServer((req, res) => {
       const parsedUrl = parse(req.url, true)
       handle(req, res, parsedUrl)
     }).listen(process.env.PORT || 3000, () => {
       console.log('YDP Website running')
     })
   })
   ```
6. **Install dependencies** via SSH: `npm install`
7. **Build**: `npm run build`
8. **Seed**: `npm run db:seed`
9. **Start the app** via cPanel Node.js App Manager

### `.htaccess` for Apache (if needed)

The included `.htaccess` handles URL rewriting for Apache environments.

---

## Option C: Cloud Platforms

### Vercel (Easiest)
```bash
npm install -g vercel
vercel
```
Set environment variables in Vercel dashboard.
Use PlanetScale or Railway for MySQL.

### Railway
1. Connect GitHub repo
2. Add MySQL service
3. Set env vars
4. Deploy automatically

### DigitalOcean App Platform
1. Connect repo
2. Add MySQL managed database
3. Set env vars
4. Deploy

---

## Post-Deployment Checklist

- [ ] Change admin password at `/admin/settings`
- [ ] Upload YDP logo at `/admin/settings`
- [ ] Upload all leadership photos at `/admin/leadership`
- [ ] Verify email delivery (send test contact form)
- [ ] Test membership registration flow
- [ ] Test certificate generation
- [ ] Set up Google Analytics ID in settings
- [ ] Submit sitemap to Google Search Console: `yourdomain.com/sitemap.xml`
- [ ] Test all province pages
- [ ] Test mobile responsiveness
- [ ] Set up database backup cron job
- [ ] Configure domain email (MX records) if needed

---

## Database Backup

```bash
# Manual backup
mysqldump -u ydp_user -p ydp_website > backup_$(date +%Y%m%d).sql

# Automated daily backup (add to crontab)
0 2 * * * mysqldump -u ydp_user -pPASSWORD ydp_website > /backups/ydp_$(date +\%Y\%m\%d).sql
```

---

## Support

For technical issues:
- Email: infoyda2024@gmail.com
- Phone: +92 311 9250771

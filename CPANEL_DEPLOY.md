# Hostinger cPanel Deployment Guide
# SunischistInsurance → insurance.careerxera.com

---

## Overview

| Part     | Technology      | Location on Hostinger                              |
|----------|-----------------|-----------------------------------------------------|
| Frontend | Next.js (Node)  | Node.js App Manager → `insurance.careerxera.com`   |
| Backend  | PHP 8.2 / Apache| Subdomain `api.insurance.careerxera.com`           |
| Database | MySQL 8         | cPanel → MySQL Databases                           |

---

## STEP 1 — Create Subdomains in cPanel

1. Log in to Hostinger hPanel → **Domains → Subdomains**
2. Create **`api`** subdomain for `insurance.careerxera.com`
   - Document root: `/home/<cpanel_user>/api.insurance.careerxera.com`
3. The main domain `insurance.careerxera.com` will be used by the Node.js app (step 4).

---

## STEP 2 — Create MySQL Database

1. cPanel → **MySQL Databases**
2. Create database: `<cpanel_user>_tiles`  
   *(Hostinger prefixes with your cPanel username automatically, e.g. `u123456789_tiles`)*
3. Create a DB user: `<cpanel_user>_insuser` with a strong password
4. Add user to database with **All Privileges**
5. Note down: `DB_NAME`, `DB_USER`, `DB_PASS`

### Import Schema
1. cPanel → **phpMyAdmin** → select your new database
2. Click **Import** → choose `/tiles/database/schema.sql`
3. Click **Go**

---

## STEP 3 — Deploy PHP Backend

### 3a. Upload files
1. cPanel → **File Manager** → navigate to `/home/<cpanel_user>/api.insurance.careerxera.com/`
2. Upload the entire `backend/` folder contents (NOT the folder itself, the contents inside)
   - Everything in `/tiles/backend/` goes directly into the subdomain root

### 3b. Create backend `.env`
1. In File Manager, inside `api.insurance.careerxera.com/`, create a new file named `.env`
2. Paste the following (fill in your values):

```
APP_ENV=production
APP_URL=https://api.insurance.careerxera.com
FRONTEND_URL=https://insurance.careerxera.com

DB_HOST=localhost
DB_NAME=u123456789_tiles
DB_USER=u123456789_insuser
DB_PASS=YOUR_STRONG_PASSWORD_HERE

JWT_SECRET=REPLACE_WITH_64_CHAR_RANDOM_STRING
```

> Generate JWT_SECRET with: `openssl rand -hex 32`

### 3c. Set file permissions
- `.env` → chmod **600**
- `config/` folder → chmod **750**
- All `.php` files → chmod **644**

### 3d. Test backend
Visit `https://api.insurance.careerxera.com/api/health` — should return:
```json
{"status":"ok","db":"connected"}
```

---

## STEP 4 — Build & Deploy Next.js Frontend

### 4a. Build locally
Run the build script from the project root:
```bash
chmod +x build-for-cpanel.sh
./build-for-cpanel.sh
```
This creates `cpanel-deploy.zip` in the project root.

### 4b. Set up Node.js App in Hostinger
1. hPanel → **Advanced → Node.js**  
   *(or cPanel → Software → Setup Node.js App)*
2. Click **Create Application**
   - Node.js version: **20.x** (or latest LTS)
   - Application mode: **Production**
   - Application root: `insurance.careerxera.com`  
     *(maps to `/home/<cpanel_user>/insurance.careerxera.com/`)*
   - Application URL: `insurance.careerxera.com`
   - Application startup file: **`server.js`**
3. Click **Create**

### 4c. Upload build files
1. cPanel → **File Manager** → `/home/<cpanel_user>/insurance.careerxera.com/`
2. Upload `cpanel-deploy.zip`
3. Extract it — you should see `server.js`, `ecosystem.config.js`, `.next/`, `public/`

### 4d. Start the app
1. Go back to **Node.js App Manager**
2. Click **Run NPM Install** (even if no package.json, just to confirm)
3. Click **Restart** (or **Run** if first time)

> The standalone `server.js` listens on the port Hostinger assigns via `$PORT`.  
> Hostinger proxies the domain to that port automatically.

---

## STEP 5 — Enable SSL (AutoSSL)

1. cPanel → **Security → SSL/TLS** → **Run AutoSSL**
2. Make sure both domains are covered:
   - `insurance.careerxera.com` ✅
   - `api.insurance.careerxera.com` ✅
3. AutoSSL installs Let's Encrypt certificates automatically.

---

## STEP 6 — Verify Deployment

| Check | URL | Expected |
|-------|-----|----------|
| Backend health | `https://api.insurance.careerxera.com/api/health` | `{"status":"ok","db":"connected"}` |
| Frontend home | `https://insurance.careerxera.com` | SunischistInsurance homepage |
| Register page | `https://insurance.careerxera.com/register` | Registration form |
| Contact page | `https://insurance.careerxera.com/contact` | Contact form |

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `500` on backend | Check `.env` DB credentials; check PHP error log in cPanel Logs |
| `CORS error` in browser | Ensure `FRONTEND_URL` in backend `.env` matches exactly (with `https://`) |
| Frontend shows blank page | Check Node.js app is running in App Manager; check `server.js` is in root |
| DB connection failed | Verify DB name includes cPanel prefix (`u123456789_tiles`) |
| `.env` readable by browser | Ensure `.htaccess` `RewriteRule ^\.env - [F,L]` is present |
| API calls fail | Confirm `NEXT_PUBLIC_API_URL` in `next.config.js` is `https://api.insurance.careerxera.com` |

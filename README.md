# 🛡️ Tiles Insurance Platform

A full-stack, production-ready insurance platform with three panels: **Customer**, **Agent**, and **Admin**.

## Tech Stack
- **Frontend:** Next.js 14, TypeScript, Tailwind CSS, Framer Motion, Zustand, Recharts
- **Backend:** PHP 8.2 REST API + MySQL 8.0
- **Auth:** Phone OTP + JWT
- **Infra:** Docker + Nginx

## Quick Start

```bash
cp .env.example .env  # Fill in DB_PASS, JWT_SECRET, MYSQL_ROOT_PASSWORD
docker compose up --build -d
open http://localhost
```

**Local dev:**
```bash
cd frontend && npm install && npm run dev    # → http://localhost:3000
cd backend  && php -S localhost:8000         # → API at :8000
mysql -u root -p < database/schema.sql
```

## Panels
- **Customer** — Landing, premium calculator, plan comparison, 5-step purchase, OTP login, dashboard
- **Agent** — Lead CRM (table+kanban), commissions, training academy
- **Admin** — KPIs, KYC queue, claims workflow, analytics

## Key API Routes
- `POST /api/auth/send-otp` + `verify-otp` → JWT
- `GET /api/insurance/{category}/plans`
- `POST /api/policies` + `POST /api/claims`
- `GET /api/agent/dashboard` + `GET /api/admin/dashboard`
- `PATCH /api/admin/kyc/{id}` + `PATCH /api/admin/claims/{id}`

## License
MIT

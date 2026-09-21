# Investment Risk Prediction Platform (RiskWise)

> **"Know Your Risk. Understand Your Investment Profile."**  
> A modern, production-grade full-stack financial technology application for psychometric and quantitative investment risk profiling, telemetry tracking, and personalized asset allocation modeling.

[![CI - Test & Build](https://github.com/elumalaiv235/investment_risk_prediction/actions/workflows/ci.yml/badge.svg)](https://github.com/elumalaiv235/investment_risk_prediction/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-cyan.svg)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-indigo.svg)](https://www.prisma.io/)

---

## 🌟 Key Features

1. **Multivariate Explainable Risk Prediction Engine**
   - Combines quantitative capacity (cashflow surplus, liquid reserves, debt burden, horizon) with behavioral psychology (downturn reaction, loss aversion, financial literacy).
   - Generates normalized 0–100 scores calibrated across four distinct risk tiers: **LOW RISK**, **MODERATE RISK**, **HIGH RISK**, **VERY HIGH RISK**.
   - Identifies positive risk factors, flags vectors requiring attention, and produces actionable educational suggestions.
   - Modular, pluggable architecture ready for Machine Learning models (Random Forest, XGBoost, etc.).

2. **Personalized Dashboard & Interactive Data Visualizations**
   - **Risk Score History Line Chart** (Chronological risk drift tracking).
   - **Risk Category Distribution Donut** (Portfolio tier breakdown).
   - **Factor Diagnostic Bar Chart & Multi-Axis Radar Chart** (Granular 5-pillar balance).
   - Real-time database telemetry aggregation.

3. **Complete Assessment History & Audit Trail**
   - Filter by risk level, search by goal or time horizon, sort by date or score, and pagination.
   - Preserves complete telemetry snapshots so users can audit the exact financial numbers that produced historical predictions.

4. **Printable / PDF Assessment Reports**
   - One-click clean printable reports with institutional reference IDs, factor matrix, benchmark asset allocation, and legal compliance disclaimers.

5. **Security & Data Isolation**
   - Cryptographic password hashing using `bcryptjs`.
   - JWT session management with HTTP-only cookies and Authorization header support.
   - Strict tenant-level isolation preventing cross-user data leakage.
   - Zod request payload schema validation & rate limiting.

6. **Admin Management Console**
   - Role-based access control (`ADMIN` vs `USER`).
   - Platform-wide aggregate metrics, anonymous risk tier distribution, and user registry management.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, TypeScript, Tailwind CSS, React Router v6, Recharts, Lucide React |
| **Backend** | Node.js, Express.js, TypeScript, Zod, Helmet, Express Rate Limit |
| **Database & ORM** | PostgreSQL / SQLite (Out-of-the-box zero config), Prisma ORM |
| **Authentication** | JWT, HTTP-only Cookies, Bcrypt Password Hashing |
| **Testing** | Vitest Test Suite |
| **Deployment** | Vercel (Frontend), Render / Railway / Docker (Backend), Supabase / Neon (Database) |

---

## 📐 Scoring Formula & Weighting Matrix

The RiskWise engine computes a normalized weighted score ($0 \le S \le 100$) based on 9 core parameters:

$$Score = \sum_{i=1}^{9} (w_i \times s_i)$$

| Dimension | Weight ($w_i$) | Core Evaluated Factors |
|---|---|---|
| **Financial Capacity** | 20% | Net monthly savings rate, disposable income surplus, planned investment ratio |
| **Emergency Savings** | 15% | Months of living expenses covered in liquid cash reserves ($\ge 6$ months is optimal) |
| **Time Horizon** | 15% | Planned investment timeframe ($<1$ yr vs $1-3$ yrs vs $3-5$ yrs vs $5-10$ yrs vs $>10$ yrs) |
| **Debt-to-Asset Burden** | 10% | Debt liabilities relative to annual income and investment portfolio |
| **Market Knowledge** | 10% | Self-assessed investor literacy across standard asset classes |
| **Volatility Tolerance** | 10% | Behavioral reaction during a 20% temporary market correction |
| **Age & Life Stage** | 10% | Life stage and years remaining in capital accumulation phase |
| **Investment Goal** | 5% | Wealth Creation, Retirement, Education, Home Purchase, Emergency Fund |
| **Prior Experience** | 5% | Years of active investing and capital preservation priority level |

### Classification Tiers:
- **0 – 30**: **LOW RISK** (Capital Preservation Focus; 15-25% Equities / 60-70% Fixed Income / 15% Cash)
- **31 – 60**: **MODERATE RISK** (Balanced Growth; 50-65% Equities / 25-35% Fixed Income / 10% Cash)
- **61 – 80**: **HIGH RISK** (Capital Appreciation; 75-85% Equities / 10-20% Fixed Income / 5% Cash)
- **81 – 100**: **VERY HIGH RISK** (Aggressive Compounding; 85-95% Equities / 0-10% Fixed Income / 5-15% Alts)

---

## 🚀 Quick Start Guide (Local Development)

### 1. Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- Git

### 2. Clone and Install Dependencies
```bash
git clone https://github.com/elumalaiv235/investment_risk_prediction.git
cd investment_risk_prediction

# Install dependencies in root, backend, and frontend:
npm install
cd backend && npm install
cd ../frontend && npm install
cd ..
```

### 3. Database Initialization & Seeding
```bash
# Push Prisma schema and seed demo accounts:
cd backend
npx prisma db push
npm run seed
cd ..
```

### 4. Run Development Servers
```bash
# Run both backend and frontend concurrently:
npm run dev

# Or run separately:
# Terminal 1: Backend API (Port 5000)
npm run dev:backend

# Terminal 2: Frontend Client (Port 5173)
npm run dev:frontend
```

Open your browser at **`http://localhost:5173`**

---

## 🔑 Pre-Seeded Test Credentials

| Account Role | Email Address | Password | Details |
|---|---|---|---|
| **Demo Investor** | `demo@riskwise.com` | `Demo@12345` | Pre-loaded with profile and 4 historical assessments over past 6 months |
| **Admin Officer** | `admin@riskwise.com` | `Admin@12345` | Chief Risk Officer with access to Admin Console & user registry |

*(Quick-login buttons are also conveniently embedded directly on the `/login` screen)*

---

## 🧪 Running Automated Tests

```bash
cd backend
npm test
```
Runs Vitest unit tests for:
- 9-Factor mathematical scoring engine and boundary conditions ($0 \le S \le 100$)
- Password hashing & verification
- JWT generation & payload extraction
- Zod schema validation rules

---

## ☁️ Production Deployment Guide

Since this application is a **full-stack application** with user authentication, database persistence, risk history, and personalized dashboards, it requires:
1. **Frontend Hosting**: [Vercel](https://vercel.com) or [Netlify](https://netlify.com)
2. **Backend API Hosting**: [Render](https://render.com), [Railway](https://railway.app), or Docker container
3. **Database**: [Supabase](https://supabase.com), [Neon](https://neon.tech), or Render PostgreSQL

*(Note: GitHub Pages alone cannot host dynamic backend APIs and database operations, though it can host a static frontend build connected to a hosted backend).*

### Step 1: Deploy PostgreSQL Database
Create a free database on Supabase or Neon, and copy your PostgreSQL connection string:
```
postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres?sslmode=require
```

### Step 2: Deploy Backend to Render / Railway
1. Connect your GitHub repository `https://github.com/elumalaiv235/investment_risk_prediction`.
2. Set the Root Directory to `backend`.
3. Set Build Command: `npm install && npx prisma generate && npm run build`
4. Set Start Command: `npm start`
5. Configure Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `5000` (or leave default on Render/Railway)
   - `DATABASE_URL`: `postgresql://...` (your PostgreSQL connection string)
   - `JWT_SECRET`: A strong random 64-character secret
   - `SESSION_SECRET`: A strong random 64-character secret
   - `CLIENT_URL`: `https://your-frontend.vercel.app`

### Step 3: Deploy Frontend to Vercel
1. Import the repository in Vercel.
2. Set Root Directory to `frontend`.
3. Set Framework Preset: `Vite`.
4. Configure Environment Variables:
   - `VITE_API_URL`: `https://your-backend-api.onrender.com/api`
5. Deploy! Vercel will automatically use `vercel.json` for SPA client-side routing.

---

## 📁 Project Structure

```
investment_risk_prediction/
├── .github/
│   └── workflows/
│       └── ci.yml             # GitHub Actions automated test & build pipeline
├── package.json               # Root scripts
├── README.md                  # Comprehensive Documentation
├── .env.example               # Root environment template
├── .gitignore                 # Root git ignore rules
├── backend/
│   ├── .env.example           # Backend environment template
│   ├── .gitignore             # Backend git ignore rules
│   ├── Dockerfile             # Multi-stage production Dockerfile
│   ├── prisma/
│   │   ├── schema.prisma      # Prisma schema (User, Profile, Assessment, Factor)
│   │   └── seed.ts            # Realistic demo data seeding
│   ├── src/
│   │   ├── config/            # DB & Environment config
│   │   ├── controllers/       # Auth, Profile, Risk, Dashboard, Admin controllers
│   │   ├── middleware/        # Auth, Validation, Error, Rate Limiting middleware
│   │   ├── routes/            # REST API route endpoints
│   │   ├── services/          # Business logic & RiskPredictionService
│   │   ├── tests/             # Vitest test suite
│   │   ├── utils/             # Tokens, Passwords, API Response helpers
│   │   ├── validators/        # Zod request validators
│   │   └── index.ts           # Express entry point
│   └── package.json
└── frontend/
    ├── .env.example           # Frontend environment template
    ├── .gitignore             # Frontend git ignore rules
    ├── vercel.json            # Vercel SPA routing configuration
    ├── public/
    │   └── _redirects         # Netlify SPA routing rules
    ├── src/
    │   ├── components/
    │   │   ├── charts/        # Trend, Donut, Factor Bar, Radar Charts
    │   │   ├── common/        # Navbar, Sidebar, Card, ScoreGauge, Modal
    │   │   └── risk/          # Multi-Step Questionnaire, Printable Report
    │   ├── contexts/          # AuthContext, ThemeContext
    │   ├── layouts/           # PublicLayout, DashboardLayout
    │   ├── pages/             # Landing, Login, Register, Dashboard, History, etc.
    │   ├── services/          # Typed API Client
    │   ├── types/             # TypeScript definitions
    │   ├── utils/             # Formatters, Category metadata
    │   ├── App.tsx            # React Router v6 setup
    │   ├── main.tsx           # React bootstrap
    │   └── index.css          # Tailwind CSS & Print rules
    └── package.json
```

---

## ⚖️ Financial & Legal Disclaimer

> **IMPORTANT DISCLAIMER:**  
> This investment risk assessment is provided for educational and informational purposes only. It is not financial, investment, tax, or legal advice and does not guarantee investment performance or future returns. Users should evaluate their individual circumstances and consult a qualified, licensed financial professional before making any investment decisions.

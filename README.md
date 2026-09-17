# Wema CashFlow — Banking Intelligence Platform

> **Tagline:** *Turn your transactions into financial intelligence.*  
> **Core Principle:** RAW TRANSACTION DATA → ORGANIZED DATA → FINANCIAL UNDERSTANDING → ACTIONABLE INSIGHTS.

Wema CashFlow is a comprehensive financial intelligence platform designed for individuals and SMEs. It transforms messy transaction records, statements, and receipts into clear cash-flow summaries, automatic category assignments, recurring payment tracking, anomaly alerts, 30-day balance forecasts, and conversational financial explanations.

---

## 🏛️ Platform Architecture

```
                                Wema CashFlow Architecture
                                
       ┌────────────────────────────┐              ┌────────────────────────────┐
       │     Mobile (Flutter)       │              │       Web (Next.js 16)     │
       │  • Material 3 Wema Theme   │              │  • Turbopack + React 19    │
       │  • 5-Tab Financial Shell   │              │  • Pure SVG Visualizations │
       │  • Simulated OCR Pipeline  │              │  • Personal vs SME Switch  │
       └──────────────┬─────────────┘              └──────────────┬─────────────┘
                      │                                           │
                      │               REST API (JSON)             │
                      └─────────────────────┬─────────────────────┘
                                            ▼
                               ┌─────────────────────────┐
                               │      Flask Backend      │
                               │  • Transaction Engine   │
                               │  • Auto-Categorization  │
                               │  • Forecasting Engine   │
                               │  • JWT Auth Scoping     │
                               └────────────┬────────────┘
                                            │
                                            ▼
                               ┌─────────────────────────┐
                               │    Supabase Platform    │
                               │  • Authentication (JWT) │
                               │  • PostgreSQL DB + RLS  │
                               └─────────────────────────┘
```

---

## 🚀 Projects in this Repository

### 1. Web Application (`/web`)
- **Stack**: Next.js 16 (Turbopack), React 19, TypeScript, Tailwind CSS 4, Lucide React, Pure SVG Responsive Charts.
- **Pages**:
  - `/` — Public Marketing & Feature Landing Page
  - `/dashboard` — Executive Overview (Net Cash Flow, Donut, 30-Day Forecast, Anomaly Alerts)
  - `/transactions` — Transaction Ledger with Search, Filtering & Category Reassignment
  - `/cash-flow` — Inflow vs Outflow Historicals, Runways & +41% Spending Surge Anomaly
  - `/insights` — AI-Style Filterable Intelligence Cards
  - `/recurring` — Rent, Subscriptions & Utility Commitment Tracking
  - `/import` — 7-Stage Simulated OCR Statement/Receipt Processing & Deduplication Review
  - `/ask-wema` — Conversational AI grounded strictly in arithmetic totals
  - `/settings` — Profile, SME Switch & Scenario Switcher

### 2. Mobile Application (`/mobile`)
- **Stack**: Flutter 3.38+ (Dart 3.7+), Material 3, Provider, fl_chart, Google Fonts.
- **Features**:
  - 5-Tab Shell (Home, Transactions, Cash Flow, Insights, Ask Wema) + Floating Action Button for Ingestion
  - Interactive dual bar charts, category donut charts, and line forecast charts
  - Bottom sheet transaction inspector with live recategorization
  - Side-by-side duplicate comparison modal
  - 3-step onboarding walkthrough

### 3. Backend API (`/backend`)
- **Stack**: Python 3.10+, Flask, Supabase Python SDK, Gunicorn.
- **Features**:
  - Transaction ingestion (CSV & JSON)
  - Categorization rule engine
  - Cash-flow analytics, category breakdowns, and monthly trends
  - Linear forecasting service
  - Supabase JWT authentication and Row Level Security (RLS)

---

## 🛠️ Quick Start Guide

### Web (Next.js)
```bash
cd web
npm install
npm run dev
# Visit http://localhost:3000
```
To run the production build:
```bash
cd web
npm run build
npm run start
```

### Mobile (Flutter)
```bash
cd mobile
flutter pub get
flutter run
# Or target Chrome browser:
flutter run -d chrome
```

### Backend (Flask)
```bash
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
python run.py
# API running at http://localhost:5000
```

---

## 🔌 API Endpoints Summary

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Public health check |
| `POST` | `/api/transactions/import` | Upload statement CSV |
| `GET` | `/api/transactions` | Paginated transactions |
| `POST` | `/api/transactions` | Add manual transaction |
| `GET` | `/api/analytics/summary` | Income, expenses, net cash flow |
| `GET` | `/api/analytics/categories` | Spending breakdown by category |
| `GET` | `/api/analytics/trends` | Monthly inflow/outflow trends |
| `GET` | `/api/insights` | Smart spending insights & anomalies |
| `GET` | `/api/forecast` | Linear 30-day to 12-month projection |

---

## 🔒 Security & Privacy Notice
All sensitive database credentials and API keys are stored via environment variables. The client prototypes support both real API integration and isolated local simulated demonstrations.

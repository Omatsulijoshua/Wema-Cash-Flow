# Wema CashFlow — Banking Intelligence Platform

> **Tagline:** *Turn your transactions into financial intelligence.*  
> **Core Principle:** RAW TRANSACTION DATA → ORGANIZED DATA → FINANCIAL UNDERSTANDING → ACTIONABLE INSIGHTS.

Wema CashFlow is a frontend-only banking intelligence prototype designed for individuals and SMEs. It transforms messy transaction records, statements, and receipts into clear cash-flow summaries, automatic category assignments, recurring payment tracking, anomaly alerts, 30-day balance forecasts, and conversational financial explanations.

---

## 🚀 Dual Platforms

This repository contains two production-grade frontend prototypes built with bank-grade aesthetics:

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

---

## 💡 Key Capabilities

- **Realistic Nigerian Banking Dataset**: 220+ transactions across 6 months featuring POS, NIP, Web, USSD, Chowdeck, Uber, Ikeja Electric, MTN VTU, PiggyVest, and more.
- **Strict Arithmetic Grounding**: All figures (₦428,500 balance, ₦1,840,000 inflow, ₦1,215,400 outflow, +₦624,600 net; SME ₦4.82M revenue, ~18d runway) match with mathematical consistency.
- **Simulated 7-Stage OCR State Machine**: Visualizing receipt ingestion (*287 detected, 274 unique, 13 duplicates removed, 6 review items*).
- **Dual Persona & Scenarios**: Instant switching between **Personal Mode** and **SME Mode**, plus 5 test scenarios (Normal, Salary Spike, Business Surplus, Low Runway, Irregular Gig).

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

---

## 🔒 Security & Privacy Notice
This prototype operates purely on simulated local datasets. No external backend, payment credentials, or cloud OCR endpoints are contacted.

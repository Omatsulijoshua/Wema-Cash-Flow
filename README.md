# CashFlow API

Production Flask backend for the CashFlow financial intelligence platform. Handles transaction processing, categorization, analytics, insights, and forecasting. Serves REST APIs to the Flutter mobile application.

## Overview

CashFlow is a financial intelligence platform designed to help SMEs understand their transaction history, spending patterns, and cash flow. This repository contains the Flask backend that processes business logic and communicates with Supabase for authentication and data persistence.

**Architecture:**

```
Flutter Mobile App
        |
        | REST API (JSON)
        v
   Flask Backend
        |
        | Supabase Client
        v
   Supabase
   ├── Authentication (JWT)
   └── PostgreSQL Database
```

**Current state:** Transaction import, categorization, analytics, insights, and forecasting are implemented. Authentication is handled by Supabase — Flask validates JWT tokens and enforces user ownership.

## Tech Stack

- Python
- Flask
- Flask-CORS
- Supabase (PostgreSQL + Auth)
- PyJWT
- Gunicorn
- pytest

## Project Structure

```
Wema-Cash-Flow/
├── backend/
│   ├── app/
│   │   ├── __init__.py          # App factory, blueprint registration
│   │   ├── config.py            # Environment config
│   │   ├── extensions.py        # Supabase client
│   │   ├── middleware/
│   │   │   └── auth.py          # @require_auth decorator
│   │   ├── routes/
│   │   │   ├── health.py        # GET /api/health
│   │   │   ├── transactions.py  # Transaction CRUD + CSV import
│   │   │   ├── analytics.py     # Summary, categories, trends
│   │   │   ├── insights.py      # Smart spending insights
│   │   │   └── forecast.py      # Linear forecast
│   │   ├── models/
│   │   │   └── __init__.py      # Transaction dataclass
│   │   └── utils/
│   │       ├── __init__.py      # categorize(), parse_csv_row()
│   │       └── response.py      # success_response(), error_response()
│   ├── tests/
│   │   ├── conftest.py          # pytest fixtures
│   │   ├── test_health.py
│   │   ├── test_transactions.py
│   │   ├── test_analytics.py
│   │   ├── test_categorization.py
│   │   └── test_parsing.py
│   ├── api/
│   │   └── index.py             # Vercel serverless entry point
│   ├── run.py                   # Local dev runner
│   ├── requirements.txt
│   └── .env.example
├── vercel.json
└── .gitignore
```

## Authentication

Flask does **not** handle registration or login. Supabase manages all authentication.

**Flow:**
1. User authenticates through Supabase (Flutter handles this)
2. Supabase returns a JWT access token
3. Flutter sends the token in the `Authorization: Bearer <token>` header
4. Flask validates the JWT and extracts the `user_id`
5. All data queries are scoped to the authenticated user

Protected endpoints reject:
- Missing token → `401 MISSING_TOKEN`
- Expired token → `401 EXPIRED_TOKEN`
- Invalid token → `401 INVALID_TOKEN`

## API Endpoints

### Public

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |

### Protected (requires `Authorization: Bearer <token>`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/transactions/import` | Import transactions from CSV |
| GET | `/api/transactions` | List user's transactions (paginated) |
| POST | `/api/transactions` | Add a single transaction |
| GET | `/api/analytics/summary` | Income, expenses, net cash flow |
| GET | `/api/analytics/categories` | Spending breakdown by category |
| GET | `/api/analytics/trends` | Monthly income/expense trends |
| GET | `/api/insights` | Smart spending insights |
| GET | `/api/forecast` | Linear forecast (1-12 months) |

---

### POST /api/transactions/import

Upload a CSV file. Required columns: `date`, `description`, `amount`. Optional: `type`, `category`, `balance`.

**Request:** `multipart/form-data` with field `file`

**Response (201):**
```json
{
  "success": true,
  "data": {
    "imported": 120,
    "failed": 3,
    "errors": ["Row 5: invalid or missing data"]
  }
}
```

### GET /api/transactions

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | int | 1 | Page number |
| page_size | int | 50 | Results per page (max 100) |
| start_date | string | - | Filter: start date (YYYY-MM-DD) |
| end_date | string | - | Filter: end date (YYYY-MM-DD) |
| category | string | - | Filter by category |

### POST /api/transactions

```json
{
  "description": "Client Payment",
  "amount": 450000,
  "type": "income",
  "date": "2025-07-15",
  "category": "client_payment"
}
```

> `date` and `category` are optional. Category is auto-assigned if not provided.

### GET /api/analytics/summary

```json
{
  "success": true,
  "data": {
    "total_income": 1720000,
    "total_expenses": 599500,
    "net_cash_flow": 1120500,
    "transaction_count": 120,
    "latest_balance": 2340000
  }
}
```

### GET /api/analytics/categories

```json
{
  "success": true,
  "data": {
    "categories": [
      {"category": "rent", "total": 120000, "percentage": 20.0},
      {"category": "food", "total": 85000, "percentage": 14.2}
    ],
    "total_expenses": 599500
  }
}
```

### GET /api/analytics/trends

```json
{
  "success": true,
  "data": {
    "trends": [
      {"month": "2025-05", "income": 560000, "expense": 210000, "net": 350000},
      {"month": "2025-06", "income": 620000, "expense": 195000, "net": 425000}
    ]
  }
}
```

### GET /api/insights

```json
{
  "success": true,
  "data": {
    "insights": [
      {
        "type": "top_spending_category",
        "title": "Highest Spending Category",
        "message": "Your highest spending category is rent with ₦120,000.00.",
        "value": 120000,
        "category": "rent"
      }
    ]
  }
}
```

### GET /api/forecast

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| months | int | 3 | Months to forecast (max 12) |

```json
{
  "success": true,
  "data": {
    "forecast": [
      {"month": "2025-08", "income": 573333, "expense": 199833, "net": 373500}
    ],
    "method": "linear_average",
    "disclaimer": "This forecast is an estimate based on historical averages and trends. It is not financial advice.",
    "based_on_months": 3
  }
}
```

## Categorization

Transactions are auto-categorized by keyword matching:

| Category | Keywords |
|----------|----------|
| salary | salary, wages, payroll, income, earning |
| food | food, restaurant, grocery, meal, lunch, dinner, cafe |
| transport | fuel, uber, transport, logistics, bus, taxi, parking |
| utilities | electric, electricity, water, internet, airtime, data |
| shopping | shopping, store, shop, market, purchase, mall |
| entertainment | entertainment, movie, netflix, spotify, game, bar |
| healthcare | hospital, clinic, pharmacy, health, medical, doctor |
| education | school, university, education, tuition, course, book |
| transfers | transfer, sent, received, send, wire, remittance |
| bills | bill, subscription, fee, rent, lease, insurance |
| other | (fallback) |

## Database Schema

**transactions** table (Supabase PostgreSQL):

```sql
create table transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  date date not null,
  description text not null,
  type text not null check (type in ('income', 'expense')),
  amount numeric not null check (amount > 0),
  category text not null default 'other',
  balance numeric,
  source text not null default 'csv',
  created_at timestamptz default now()
);

alter table transactions enable row level security;

create policy "Users can access own transactions"
  on transactions for all
  using (auth.uid() = user_id);
```

## Environment Variables

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-or-service-key
SECRET_KEY=your-flask-secret-key
CORS_ORIGINS=http://localhost:3000,http://localhost:5000
PORT=5000
```

## Local Development

### 1. Clone

```bash
git clone https://github.com/Omatsulijoshua/Wema-Cash-Flow.git
cd Wema-Cash-Flow
```

### 2. Setup

```bash
cd backend
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS/Linux
source .venv/bin/activate

pip install -r requirements.txt
```

### 3. Configure

```bash
cp .env.example .env
```

Fill in your Supabase URL and anon key.

### 4. Run

```bash
python run.py
```

Server starts at `http://localhost:5000`.

### 5. Test

```bash
python -m pytest tests/ -v
```

## Flutter Integration

**Base URL (Android emulator):** `http://10.0.2.2:5000`

**Base URL (iOS simulator):** `http://localhost:5000`

**Base URL (deployed):** `https://your-deployment.vercel.app`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer <supabase_access_token>
```

**Example — Import CSV:**
```dart
var request = http.MultipartRequest('POST', Uri.parse('$baseUrl/api/transactions/import'));
request.headers['Authorization'] = 'Bearer $token';
request.files.add(await http.MultipartFile.fromPath('file', csvFilePath));
var response = await request.send();
```

**Example — Get Transactions:**
```dart
final response = await http.get(
  Uri.parse('$baseUrl/api/transactions?page=1&page_size=20'),
  headers: {'Authorization': 'Bearer $token'},
);
```

## Deployment

The server binds to `0.0.0.0` and reads the `PORT` environment variable.

**Render:**
```
Build command: cd backend && pip install -r requirements.txt
Start command: cd backend && gunicorn run:app --bind 0.0.0.0:$PORT
```

**Vercel:** Configured via `vercel.json`. Auto-deploys on push to `master`.

## License

This project currently has no explicit open-source license.

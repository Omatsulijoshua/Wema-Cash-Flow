# CashFlow API

Flask backend for the CashFlow financial intelligence platform. Provides transaction management, automatic categorization, and cash-flow insights for SMEs. Built for a hackathon.

## Overview

CashFlow is a financial intelligence platform that turns transaction history into actionable insights. This repository contains the Flask backend that serves REST APIs to a Flutter mobile application.

**Current state:** The API is functional with in-memory transaction storage, automatic categorization, and basic cash-flow insights. No database, authentication, or persistent storage is implemented yet.

## Tech Stack

- Python
- Flask
- Flask-CORS

## Architecture

```
Flutter Mobile App
        |
        | REST API (JSON)
        v
  Flask Backend
        |
        v
  In-Memory Storage
```

> **Note:** Data is stored in-memory and resets on each server restart. A database will be added in a future iteration.

## Project Structure

```
Wema-Cash-Flow/
├── backend/
│   ├── app.py              # Flask application and all endpoints
│   ├── api/
│   │   └── index.py        # Vercel serverless entry point
│   └── DEPLOY.md           # Vercel deployment guide
├── requirements.txt        # Python dependencies
├── vercel.json             # Vercel deployment configuration
└── .gitignore
```

## Authentication

No authentication is implemented. All endpoints are public.

**Planned:** JWT-based authentication with registration, login, and protected endpoints.

## API Endpoints

### Connectivity

| Method | Endpoint     | Description                        |
|--------|--------------|------------------------------------|
| GET    | `/`          | API status check                   |
| GET    | `/api/health`| Health check                       |
| GET    | `/api/test`  | Flutter-to-Flask connectivity test |

### Transactions

| Method | Endpoint                  | Description                              |
|--------|---------------------------|------------------------------------------|
| GET    | `/api/transactions`       | List all transactions                    |
| POST   | `/api/transactions`       | Add a transaction                        |
| POST   | `/api/transactions/simulate` | Generate 20 sample transactions      |

### Analytics

| Method | Endpoint          | Description                              |
|--------|-------------------|------------------------------------------|
| GET    | `/api/insights`   | Cash-flow analysis and alerts            |
| GET    | `/api/categories` | List income and expense categories       |

---

### GET /

```json
{
  "message": "CashFlow API is running",
  "status": "success"
}
```

### GET /api/health

```json
{
  "status": "ok",
  "service": "cashflow-api"
}
```

### GET /api/test

```json
{
  "message": "Flutter to Flask connection successful",
  "backend": "Flask",
  "status": "success"
}
```

### POST /api/transactions

**Request:**

```json
{
  "description": "Client Payment - Invoice 001",
  "amount": 450000,
  "type": "income",
  "date": "2025-07-15"
}
```

> `date` is optional. Defaults to today.

**Response (201):**

```json
{
  "id": "a1b2c3d4-...",
  "date": "2025-07-15",
  "description": "Client Payment - Invoice 001",
  "amount": 450000,
  "type": "income",
  "category": "client_payment"
}
```

The `category` field is automatically assigned based on keywords in the description.

### POST /api/transactions/simulate

Resets all transactions and generates 20 sample entries.

**Response:**

```json
{
  "count": 20,
  "message": "Simulated 20 transactions"
}
```

### GET /api/insights

Returns cash-flow analysis. Requires at least one transaction.

**Response:**

```json
{
  "total_income": 1720000,
  "total_expenses": 599500,
  "net_cash_flow": 1120500,
  "avg_daily_burn": 19983.33,
  "days_until_low_funds": 56,
  "category_breakdown": {
    "rent": 120000,
    "salaries": 120000,
    "inventory": 180000
  },
  "top_expense_category": "inventory",
  "alerts": []
}
```

### GET /api/categories

```json
{
  "income": ["salary", "client_payment", "loan_disbursement", "investment_return"],
  "expense": ["rent", "utilities", "salaries", "inventory", "marketing", "transport", "office_supplies", "software", "loan_repayment"]
}
```

## Automatic Categorization

Transactions are categorized by matching keywords in the description:

| Category       | Keywords                                      |
|----------------|-----------------------------------------------|
| salary         | salary, wages, payroll                        |
| client_payment | client, invoice, payment received, transfer in|
| rent           | rent, lease, landlord                         |
| utilities      | electric, water, internet, airtime, data      |
| salaries       | staff, employee, worker                       |
| inventory      | stock, inventory, supplies, purchase          |
| marketing      | ads, marketing, promotion, facebook ads       |
| transport      | fuel, uber, transport, logistics              |
| loan_repayment | loan payment, repayment, credit               |

Transactions that match no keywords are marked as `uncategorized`.

## Environment Variables

| Variable | Required | Default | Description        |
|----------|----------|---------|--------------------|
| `PORT`   | No       | `5000`  | Server port number |

No `.env` file is required for local development.

## Local Development

### 1. Clone the repository

```bash
git clone https://github.com/Omatsulijoshua/Wema-Cash-Flow.git
cd Wema-Cash-Flow
```

### 2. Create a virtual environment

```bash
python -m venv backend/.venv
```

### 3. Activate the virtual environment

```bash
# Windows
backend\.venv\Scripts\activate

# macOS/Linux
source backend/.venv/bin/activate
```

### 4. Install dependencies

```bash
pip install -r requirements.txt
```

### 5. Run the server

```bash
python backend/app.py
```

Server starts at `http://localhost:5000`.

### 6. Verify

```bash
curl http://localhost:5000/api/health
```

## API Testing

**Browser** — Open directly for GET endpoints:
- `http://localhost:5000`
- `http://localhost:5000/api/health`
- `http://localhost:5000/api/test`
- `http://localhost:5000/api/transactions`
- `http://localhost:5000/api/insights`
- `http://localhost:5000/api/categories`

**curl:**

```bash
curl http://localhost:5000/
curl http://localhost:5000/api/health
curl http://localhost:5000/api/test

# Add a transaction
curl -X POST http://localhost:5000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{"description": "Client Payment", "amount": 450000, "type": "income"}'

# Simulate transactions
curl -X POST http://localhost:5000/api/transactions/simulate

# Get insights
curl http://localhost:5000/api/insights
```

**Postman / Insomnia** — Send GET and POST requests to the endpoints above.

## Flutter Integration

The Flutter app communicates with this backend via REST API. All responses are JSON.

**Base URL (local):**

```
http://10.0.2.2:5000
```

> For Android emulator, `localhost` refers to the emulator itself. Use `10.0.2.2` to reach the host machine. iOS simulator uses `localhost` normally.

**Base URL (deployed):**

```
https://your-deployment-url.vercel.app
```

**Example Flutter request:**

```dart
import 'dart:convert';
import 'package:http/http.dart' as http;

final response = await http.get(
  Uri.parse('http://10.0.2.2:5000/api/test'),
);
final data = json.decode(response.body);
```

**Example: Load transactions**

```dart
final response = await http.get(
  Uri.parse('http://10.0.2.2:5000/api/transactions'),
);
List transactions = json.decode(response.body);
```

**Example: Add a transaction**

```dart
final response = await http.post(
  Uri.parse('http://10.0.2.2:5000/api/transactions'),
  headers: {'Content-Type': 'application/json'},
  body: json.encode({
    'description': 'Client Payment',
    'amount': 450000,
    'type': 'income',
  }),
);
```

## Deployment

The project is configured for Vercel. The server binds to `0.0.0.0` and uses the platform-provided `PORT` environment variable.

### Deploy to Vercel

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import the repository
4. Deploy

See `backend/DEPLOY.md` for detailed deployment instructions.

## Security

**Implemented:**

- CORS enabled for cross-origin Flutter requests

**Planned:**

- JWT authentication
- Password hashing (bcrypt)
- Input validation
- Rate limiting
- Environment variable management

## Development Roadmap

- [x] Flask API foundation
- [x] Connectivity test endpoints
- [x] Transaction CRUD (in-memory)
- [x] Automatic transaction categorization
- [x] Cash-flow insights
- [x] CORS configuration
- [x] Vercel deployment config
- [ ] Persistent database (PostgreSQL)
- [ ] Authentication (JWT)
- [ ] Transaction ingestion from file
- [ ] Advanced financial analytics
- [ ] Cash-flow forecasting
- [ ] Flutter integration
- [ ] Production deployment

## Contributing

1. Create a feature branch from `master`
2. Make your changes
3. Test locally
4. Submit a pull request

Keep changes focused. One feature or fix per PR.

## License

This project currently has no explicit open-source license.

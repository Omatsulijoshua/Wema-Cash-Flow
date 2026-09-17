# CashFlow API

Minimal Flask backend for the CashFlow financial intelligence platform. Currently a connectivity test between the Flutter mobile app and the Flask server.

## Overview

CashFlow is intended to become a financial intelligence platform that provides transaction analysis, cash-flow insights, and forecasting for SMEs. This repository contains the Flask backend that will serve REST APIs to the Flutter mobile application.

The backend is currently under active development. Only the API foundation and connectivity endpoints exist.

## Tech Stack

- Python
- Flask
- Flask-CORS

## Architecture

```
Flutter Mobile App
        |
        | REST API
        v
  Flask Backend
```

**Currently implemented:** Flask backend with connectivity endpoints.

**Planned:** Database, authentication, transaction analysis, financial insights, forecasting.

## Project Structure

```
Wema-Cash-Flow/
├── backend/
│   ├── app.py              # Flask application with endpoints
│   └── api/
│       └── index.py        # Vercel serverless entry point
├── requirements.txt        # Python dependencies
├── vercel.json             # Vercel deployment config
└── .gitignore
```

## API Endpoints

| Method | Endpoint     | Description                          |
|--------|--------------|--------------------------------------|
| GET    | `/`          | API status check                     |
| GET    | `/api/health`| Health check endpoint                |
| GET    | `/api/test`  | Flutter-to-Flask connectivity test   |

All endpoints are public. No authentication is implemented.

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

## Environment Variables

| Variable | Required | Default | Description          |
|----------|----------|---------|----------------------|
| `PORT`   | No       | `5000`  | Server port number   |

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
```

### 4. Install dependencies

```bash
pip install -r requirements.txt
```

### 5. Run the server

```bash
python backend/app.py
```

### 6. Test the server

```bash
curl http://localhost:5000/api/health
```

## API Testing

**Browser** — Open `http://localhost:5000`, `http://localhost:5000/api/health`, or `http://localhost:5000/api/test` directly.

**curl:**

```bash
curl http://localhost:5000/
curl http://localhost:5000/api/health
curl http://localhost:5000/api/test
```

**Postman/Insomnia** — Send GET requests to the endpoints above.

## Flutter Integration

The Flutter app communicates with this backend via REST API. All responses are JSON.

**Base URL (local):**

```
http://10.0.2.2:5000
```

> For Android emulator, `localhost` refers to the emulator itself. Use `10.0.2.2` to reach the host machine.

**Base URL (deployed):**

```
https://your-vercel-url.vercel.app
```

**Example request from Flutter:**

```dart
final response = await http.get(Uri.parse('http://10.0.2.2:5000/api/test'));
```

## Deployment

The project is configured for Vercel. The server binds to `0.0.0.0` and uses the platform-provided `PORT` environment variable.

### Deploy to Vercel

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import the repository
4. Deploy

The `vercel.json` configuration routes all requests to `backend/api/index.py`.

## Security

**Currently implemented:**

- CORS enabled for cross-origin Flutter requests

**Planned:**

- Authentication (JWT)
- Password hashing
- Environment variable management
- Input validation
- Rate limiting

## Development Roadmap

- [x] Flask API foundation
- [x] Connectivity test endpoints
- [x] CORS configuration
- [x] Vercel deployment config
- [ ] Authentication (JWT)
- [ ] Transaction ingestion
- [ ] Transaction categorization
- [ ] Financial analytics
- [ ] Cash-flow insights
- [ ] Forecasting
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

# DisasterSafe

DisasterSafe is a preparedness and official-alert application. It helps people keep a family plan and emergency kit, learn practical safety guidance, and see verified active alerts in one focused dashboard.

## What is included

- A responsive React/TypeScript dashboard with an alert-first safety brief.
- FastAPI APIs for authentication, preparedness, learning, official alert records, and saved alert locations.
- Local SQLite database with Alembic migrations. Passwords are stored as bcrypt hashes, never in plaintext.

## Local setup

Requirements: Node 20+, Python 3.11+. Docker is not required.

```bash
cp .env.example backend/.env

cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The API creates `backend/data/disaster_safe.db` and applies migrations on startup.

Optional quiz seed data:

```bash
cd backend
source .venv/bin/activate
python seed_quizzes.py
```

In another terminal:

```bash
cd frontend
echo "VITE_API_BASE_URL=http://127.0.0.1:8000" > .env
npm ci
npm run dev
```

The application is available at `http://localhost:5173`; API documentation is at `http://127.0.0.1:8000/docs`.

## Authentication

- `POST /api/auth/signup` hashes the password with bcrypt before insert.
- `POST /api/auth/login` verifies the bcrypt hash and returns a JWT access token.
- `GET /api/auth/me` requires `Authorization: Bearer <token>`.

## Alert API

`GET /api/alerts` returns active persisted alerts. Authenticated users can manage delivery locations through:

```text
GET    /api/alert-subscriptions
POST   /api/alert-subscriptions
PATCH  /api/alert-subscriptions/{id}
DELETE /api/alert-subscriptions/{id}
```

Alert ingestion should be run by a separate worker: fetch an official feed, validate and normalize its records, upsert by `(source, external_id)`, then fan out delivery work. Do not create alerts from client requests.

## Next production milestones

1. Add PostGIS geometry matching and a scheduled, idempotent official-source ingestion worker.
2. Add FCM device registration and a retrying push/SMS/email notification worker.
3. Move access tokens out of `localStorage` into short-lived, cookie-backed sessions before public deployment.
4. Add API rate limiting, audit logs, integration tests, and a staging/production CI pipeline.

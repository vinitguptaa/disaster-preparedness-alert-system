# DisasterSafe

DisasterSafe is a preparedness companion for households. It brings together a practical go-bag, family plan, emergency contacts, safety learning, and location-matched official alerts in one calm interface.

> **Safety note:** DisasterSafe helps organise information and preparedness tasks. In an emergency, always follow instructions from local authorities and contact emergency services when immediate help is needed.

## What it includes

- **Live monitoring:** Uses the device's current location to check the official SACHET / National Disaster Management Authority (NDMA) alert feed. The page refreshes matched notices every 60 seconds while it is open.
- **Browser alerts:** Users can opt in to browser notifications after sharing their location. Notifications are only for newly detected location-matched official notices while the page is active.
- **Readiness plan:** A real, editable go-bag checklist with quick starter items, a family meeting plan, and emergency contacts.
- **Safety learning:** Clear before, during, and after guidance for flood, earthquake, cyclone, and thunderstorm scenarios.
- **Knowledge checks:** Four short, scenario-based quizzes with answer explanations and saved attempt history.
- **Authentication:** Email/password accounts with bcrypt password hashes and JWT access tokens.

## Technology

| Layer | Technology |
| --- | --- |
| Frontend | React, TypeScript, Vite, Tailwind CSS |
| Backend | FastAPI, SQLAlchemy, Alembic |
| Database | SQLite for local development |
| Official alert source | SACHET / NDMA |

## Requirements

- Node.js 20 or later
- Python 3.11 or later
- A modern browser for location and notification permissions

Docker is not required for local development.

## Run locally

From the project directory:

```bash
cd disaster-preparedness-alert-system
cp .env.example backend/.env
```

### 1. Start the backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python seed_quizzes.py
uvicorn app.main:app --reload
```

The API runs at `http://127.0.0.1:8000`. On first start, Alembic creates and migrates `backend/data/disaster_safe.db` automatically.

### 2. Start the frontend

Open a second terminal:

```bash
cd disaster-preparedness-alert-system/frontend
printf 'VITE_API_BASE_URL=http://127.0.0.1:8000\n' > .env
npm ci
npm run dev
```

Open `http://localhost:5173` in your browser. API documentation is available at `http://127.0.0.1:8000/docs`.

## Using live alerts

1. Create an account and sign in.
2. Open **Live alerts**.
3. Select **Use my location** and allow the browser permission prompt.
4. Review the location-matched official notices and select **Enable alerts** if you want in-browser notifications.

Location information is used to request weather and filter the official alert results for the active page session. A weather condition is not presented as an official warning.

## Environment configuration

Copy `.env.example` to `backend/.env` for backend configuration. The defaults use a local SQLite database.

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Database connection string; local SQLite is the default. |
| `JWT_SECRET_KEY` | Replace with a long random secret outside local development. |
| `APP_DEBUG` | Optional boolean debug flag, for example `APP_DEBUG=false`. |
| `FRONTEND_URL` | Comma-separated browser origins permitted by CORS. |
| `VITE_API_BASE_URL` | Frontend API base URL, stored in `frontend/.env`. |

## Key API routes

| Route | Purpose |
| --- | --- |
| `POST /api/auth/signup` | Create an account. |
| `POST /api/auth/login` | Receive a JWT access token. |
| `GET /api/disasters/official-alerts` | Get location-matched SACHET/NDMA notices. Requires authentication. |
| `GET /api/emergency-kit` | Get a user's go-bag checklist. |
| `POST /api/emergency-kit` | Add an item to the go-bag. |
| `PATCH /api/emergency-kit/{item_id}` | Mark a go-bag item ready or not ready. |
| `DELETE /api/emergency-kit/{item_id}` | Remove a go-bag item. |
| `GET /api/quizzes` | List available knowledge checks. |

## Production considerations

This repository is suitable for local development and a prototype. Before a public deployment:

1. Use a managed database and secret manager; do not retain the development JWT secret.
2. Replace `localStorage` JWT handling with secure, short-lived cookie-backed sessions.
3. Add rate limits, audit logs, health monitoring, tests, and CI.
4. Move alert ingestion to a scheduled, idempotent worker with source validation and retry handling.
5. Add a push/SMS/email delivery service if background notifications are required; browser notifications only work while the site is active.
6. Validate local emergency numbers, language, accessibility, and official source coverage for every deployment region.

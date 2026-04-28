# Web Toolbox

Web Toolbox is a Vite React SPA plus a separate FastAPI backend. The frontend keeps the original one-page utility workflow and visual style, while auth, IP lookup, and user history live on the backend.

## Frontend

1. Install dependencies:

```bash
npm install
```

2. Create `.env` in the project root:

```bash
VITE_API_URL=http://localhost:8000
```

3. Start the SPA:

```bash
npm run dev
```

## Backend

1. Create PostgreSQL database, for example `web_toolbox`.
2. In `backend/`, create `.env` from `.env.example`.
3. Create and activate a virtual environment.
4. Install dependencies:

```bash
pip install -r requirements.txt
```

5. Apply migrations:

```bash
alembic upgrade head
```

6. Start the API:

```bash
uvicorn app.main:app --reload
```

Swagger will be available at [http://localhost:8000/docs](http://localhost:8000/docs).

## Example Backend Env

```env
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/web_toolbox
SECRET_KEY=change-me-to-a-long-random-secret
ACCESS_TOKEN_EXPIRE_MINUTES=60
CORS_ORIGINS=http://localhost:5173
```

## API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `GET /api/ip`
- `POST /api/history`
- `GET /api/history?limit=20&offset=0`
- `DELETE /api/history`

## Architecture

- Frontend: React SPA with a clean `src/` structure and a single API client.
- Backend: FastAPI with async SQLAlchemy 2.0, PostgreSQL, Alembic, JWT cookie auth, and modular route/service layers.
- Local tools stay client-side, while auth, IP detection, and user history go through the backend API.

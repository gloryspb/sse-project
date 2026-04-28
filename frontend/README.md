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

## Deploy Frontend to GitHub Pages

This frontend is configured for the repository URL `https://gloryspb.github.io/sse-project/`.

1. In GitHub, open `Settings -> Pages`.
2. Set `Source` to `GitHub Actions`.
3. In `Settings -> Secrets and variables -> Actions`, add:

```env
VITE_API_URL=https://your-backend.onrender.com
```

4. Push to `main`.

The workflow at `.github/workflows/deploy-frontend.yml` will build `frontend/` and publish it to GitHub Pages.

If the backend is hosted on Render, set backend CORS and cookie envs like:

```env
CORS_ORIGINS=https://gloryspb.github.io
COOKIE_SECURE=true
COOKIE_SAMESITE=none
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
COOKIE_SECURE=false
COOKIE_SAMESITE=lax
COOKIE_DOMAIN=
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

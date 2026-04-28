# Backend

FastAPI backend for Web Toolbox with PostgreSQL, async SQLAlchemy, JWT auth via `httpOnly` cookie, IP detection, and user history.

## Run

1. Create a virtual environment.
2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Copy `.env.example` to `.env` and update values.
4. Run migrations:

```bash
alembic upgrade head
```

5. Start the server:

```bash
uvicorn app.main:app --reload
```

Swagger UI will be available at [http://localhost:8000/docs](http://localhost:8000/docs).

## Render Settings

Recommended start command on Render:

```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT --proxy-headers
```

Pin Python version to `3.12` on Render. This repository includes `backend/.python-version` for that purpose. You can also set:

```env
PYTHON_VERSION=3.12.10
```

For a frontend hosted on GitHub Pages, use production cookie settings:

```env
CORS_ORIGINS=https://gloryspb.github.io
COOKIE_SECURE=true
COOKIE_SAMESITE=none
COOKIE_DOMAIN=
```

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

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.auth import router as auth_router
from app.api.routes.history import router as history_router
from app.api.routes.ip import router as ip_router
from app.api.routes.users import router as users_router
from app.core.config import settings

app = FastAPI(title="Web Toolbox API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(users_router, prefix="/api/users", tags=["users"])
app.include_router(ip_router, prefix="/api/ip", tags=["ip"])
app.include_router(history_router, prefix="/api/history", tags=["history"])


@app.get("/health")
async def healthcheck() -> dict[str, str]:
    return {"status": "ok"}

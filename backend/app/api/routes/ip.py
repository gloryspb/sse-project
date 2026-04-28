from fastapi import APIRouter, Request

from app.services.ip_service import extract_public_ip

router = APIRouter()


@router.get("")
async def get_ip(request: Request) -> dict[str, str | None]:
    return extract_public_ip(request)

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user
from app.db.session import get_db_session
from app.models.user import User
from app.schemas.history import HistoryCreate, HistoryRead
from app.services.history_service import clear_history_items, create_history_item, get_history_items

router = APIRouter()


@router.post("", response_model=HistoryRead)
async def create_history(
    payload: HistoryCreate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> HistoryRead:
    item = await create_history_item(session, current_user.id, payload)
    return HistoryRead.model_validate(item)


@router.get("", response_model=list[HistoryRead])
async def list_history(
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> list[HistoryRead]:
    items = await get_history_items(session, current_user.id, limit=limit, offset=offset)
    return [HistoryRead.model_validate(item) for item in items]


@router.delete("")
async def delete_history(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> dict[str, str]:
    await clear_history_items(session, current_user.id)
    return {"message": "History cleared"}

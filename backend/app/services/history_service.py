from fastapi import HTTPException, status
from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.history import HistoryItem
from app.schemas.history import HistoryCreate

PREVIEW_LIMIT = 120


def _sanitize_preview(value: str | None) -> str | None:
    if not value:
        return None

    normalized = " ".join(value.split()).strip()
    if not normalized:
        return None

    return normalized[:PREVIEW_LIMIT]


def _sanitize_result_preview(tool_name: str, result_preview: str | None) -> str | None:
    if tool_name == "password_generator":
        return "[hidden]"
    return _sanitize_preview(result_preview)


async def create_history_item(session: AsyncSession, user_id: int, payload: HistoryCreate) -> HistoryItem:
    if not payload.tool_name.strip():
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="tool_name is required")

    history_item = HistoryItem(
        user_id=user_id,
        tool_name=payload.tool_name.strip(),
        input_preview=_sanitize_preview(payload.input_preview),
        result_preview=_sanitize_result_preview(payload.tool_name, payload.result_preview),
    )
    session.add(history_item)
    await session.commit()
    await session.refresh(history_item)
    return history_item


async def get_history_items(
    session: AsyncSession, user_id: int, limit: int = 20, offset: int = 0
) -> list[HistoryItem]:
    safe_limit = min(max(limit, 1), 100)
    safe_offset = max(offset, 0)
    result = await session.scalars(
        select(HistoryItem)
        .where(HistoryItem.user_id == user_id)
        .order_by(HistoryItem.created_at.desc())
        .limit(safe_limit)
        .offset(safe_offset)
    )
    return list(result)


async def clear_history_items(session: AsyncSession, user_id: int) -> None:
    await session.execute(delete(HistoryItem).where(HistoryItem.user_id == user_id))
    await session.commit()

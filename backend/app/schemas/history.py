from datetime import datetime

from pydantic import BaseModel, Field


class HistoryCreate(BaseModel):
    tool_name: str = Field(min_length=1, max_length=100)
    input_preview: str | None = Field(default=None, max_length=120)
    result_preview: str | None = Field(default=None, max_length=120)


class HistoryRead(BaseModel):
    id: int
    tool_name: str
    input_preview: str | None
    result_preview: str | None
    created_at: datetime

    model_config = {"from_attributes": True}

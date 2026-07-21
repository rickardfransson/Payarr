from pydantic import BaseModel


class EmbySyncRunResponse(BaseModel):
    status: str
    worker: dict
    processor: dict
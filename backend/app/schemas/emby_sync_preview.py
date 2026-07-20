from pydantic import BaseModel


class EmbySyncPreview(BaseModel):
    subscription_active: bool
    emby_is_disabled: bool
    action: str
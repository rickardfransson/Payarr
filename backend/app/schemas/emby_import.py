from pydantic import BaseModel


class EmbyImportPreviewResponse(BaseModel):

    emby_user_id: str

    username: str

    enabled: bool

    imported: bool



class EmbyImportRequest(BaseModel):

    emby_user_id: str
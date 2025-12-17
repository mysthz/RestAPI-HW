from datetime import datetime

from pydantic import BaseModel, PositiveInt

from blog_system_backend.src.api.posts.saved_posts.models import SavedPost


class SavedPostResponse(BaseModel):
    id: PositiveInt
    userId: PositiveInt
    postId: PositiveInt
    createdAt: datetime
    updatedAt: datetime

    @classmethod
    def from_orm(cls, s: SavedPost) -> "SavedPostResponse":
        return cls(
            id=s.id,
            userId=s.userId,
            postId=s.postId,
            createdAt=s.createdAt,
            updatedAt=s.updatedAt,
        )

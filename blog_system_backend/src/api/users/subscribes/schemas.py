from datetime import datetime

from pydantic import BaseModel, PositiveInt

from blog_system_backend.src.api.users.subscribes.models import Subscribe


class SubscribeResponse(BaseModel):
    id: PositiveInt
    authorId: PositiveInt
    subscriberId: PositiveInt
    createdAt: datetime
    updatedAt: datetime

    @classmethod
    def from_orm(cls, s: Subscribe) -> "SubscribeResponse":
        return cls(
            id=s.id,
            authorId=s.authorId,
            subscriberId=s.subscriberId,
            createdAt=s.createdAt,
            updatedAt=s.updatedAt,
        )

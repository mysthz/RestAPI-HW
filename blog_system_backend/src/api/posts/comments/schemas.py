from datetime import datetime
from typing import Annotated

from pydantic import BaseModel, PositiveInt, constr

from blog_system_backend.src.api.posts.comments.models import Comment


class CommentCreateRequest(BaseModel):
    content: Annotated[str, constr(min_length=1, max_length=10000)]


class CommentUpdateRequest(BaseModel):
    content: Annotated[str, constr(min_length=1, max_length=10000)]


class CommentResponse(BaseModel):
    id: PositiveInt
    authorId: PositiveInt
    postId: PositiveInt
    content: Annotated[str, constr(min_length=1, max_length=10000)]
    createdAt: datetime
    updatedAt: datetime

    @classmethod
    def from_orm(cls, c: Comment) -> "CommentResponse":
        return cls(
            id=c.id,
            authorId=c.authorId,
            postId=c.postId,
            content=c.content,
            createdAt=c.createdAt,
            updatedAt=c.updatedAt,
        )

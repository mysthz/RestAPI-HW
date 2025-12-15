from datetime import datetime
from typing import Annotated

from pydantic import BaseModel, PositiveInt, constr

from blog_system_backend.src.api.posts.models import Post
from blog_system_backend.src.pagination import PaginationResponse


class PostCreateRequest(BaseModel):
    authorId: PositiveInt
    title: Annotated[str, constr(max_length=500)]
    content: Annotated[str, constr(max_length=100000)]


class PostUpdateRequest(BaseModel):
    title: Annotated[str, constr(max_length=500)]
    content: Annotated[str, constr(max_length=100000)]


class PostResponse(BaseModel):
    id: PositiveInt
    authorId: PositiveInt
    title: Annotated[str, constr(max_length=500)]
    content: Annotated[str, constr(max_length=100000)]
    createdAt: datetime
    updatedAt: datetime

    @classmethod
    def from_orm(cls, post: Post) -> "PostResponse":
        return cls(
            id=post.id,
            authorId=post.authorId,
            title=post.title,
            content=post.content,
            createdAt=post.createdAt,
            updatedAt=post.updatedAt,
        )


class PostsPaginationResponse(BaseModel):
    pagination: PaginationResponse
    posts: list[PostResponse]

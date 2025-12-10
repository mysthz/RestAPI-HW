from datetime import datetime
from typing import Annotated

from pydantic import BaseModel, PositiveInt, constr


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

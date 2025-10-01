from datetime import datetime

from pydantic import BaseModel, PositiveInt, constr


class PostCreateRequest(BaseModel):
    authorId: PositiveInt
    title: constr(max_length=500)
    content: constr(max_length=100000)


class PostUpdateRequest(BaseModel):
    title: constr(max_length=500)
    content: constr(max_length=100000)


class PostResponse(BaseModel):
    id: PositiveInt
    authorId: PositiveInt
    title: constr(max_length=500)
    content: constr(max_length=100000)
    createdAt: datetime
    updatedAt: datetime

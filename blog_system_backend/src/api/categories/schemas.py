from datetime import datetime
from typing import Annotated

from pydantic import BaseModel, PositiveInt, constr

from blog_system_backend.src.pagination import PaginationResponse


class CategoryCreateRequest(BaseModel):
    title: Annotated[str, constr(min_length=1, max_length=128)]


class CategoryUpdateRequest(BaseModel):
    title: Annotated[str, constr(min_length=1, max_length=128)]


class CategoryResponse(BaseModel):
    id: PositiveInt
    title: Annotated[str, constr(min_length=1, max_length=128)]
    createdAt: datetime
    updatedAt: datetime

    @classmethod
    def from_orm(cls, category):
        return cls(
            id=category.id,
            title=category.title,
            createdAt=category.createdAt,
            updatedAt=category.updatedAt,
        )


class CategoryPaginationResponse(BaseModel):
    pagination: PaginationResponse
    categories: list[CategoryResponse]

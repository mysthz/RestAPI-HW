import math
from typing import Self

from pydantic import BaseModel

from blog_system_backend.src.pagination.fields import (
    PaginationSearchParamsLimit,
    PaginationSearchParamsOffset,
    PaginationSearchParamsQ,
)


class PaginationSearchParams(BaseModel):
    q: PaginationSearchParamsQ
    offset: PaginationSearchParamsOffset
    limit: PaginationSearchParamsLimit


class PaginationResponse(BaseModel):
    total_items: int
    total_pages: int
    current_page: int
    per_page: int
    has_next_page: bool
    has_prev_page: bool
    next_page: int | None
    prev_page: int | None

    @classmethod
    def from_search_params(cls, search_params: PaginationSearchParams, *, total_items: int) -> Self:
        per_page = search_params.limit
        offset = search_params.offset

        current_page = offset // per_page + 1 if total_items > 0 and per_page != 0 else 0
        total_pages = math.ceil(total_items / per_page) if total_items > 0 and per_page != 0 else 0

        has_next_page = (offset + per_page) < total_items
        has_prev_page = offset > 0

        next_page = current_page + 1 if has_next_page else None
        prev_page = current_page - 1 if has_prev_page else None

        return cls(
            total_items=total_items,
            total_pages=total_pages,
            current_page=current_page,
            per_page=per_page,
            has_next_page=has_next_page,
            has_prev_page=has_prev_page,
            next_page=next_page,
            prev_page=prev_page,
        )

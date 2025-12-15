from typing import Annotated

from pydantic import Field, NonNegativeInt, PositiveInt

from blog_system_backend.src.settings import settings

PaginationSearchParamsQ = Annotated[
    str | None,
    Field(
        default=None,
    ),
]

PaginationSearchParamsLimit = Annotated[
    PositiveInt,
    Field(
        le=settings.pagination_search_params_max_limit,
        default=settings.pagination_search_params_max_limit,
    ),
]

PaginationSearchParamsOffset = Annotated[
    NonNegativeInt,
    Field(
        default=0,
    ),
]

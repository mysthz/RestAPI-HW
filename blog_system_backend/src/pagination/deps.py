from typing import Annotated

from fastapi import Depends

from blog_system_backend.src.pagination.schemas import PaginationSearchParams

PaginationSearchParamsDepends = Annotated[PaginationSearchParams, Depends(PaginationSearchParams)]

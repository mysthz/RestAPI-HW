from functools import lru_cache

from fastapi import APIRouter, HTTPException, status

from blog_system_backend.src.api.categories.repository import CategoryRepositoryDepends
from blog_system_backend.src.api.categories.schemas import (
    CategoryCreateRequest,
    CategoryPaginationResponse,
    CategoryResponse,
    CategoryUpdateRequest,
)
from blog_system_backend.src.api.users.deps import CurrentUserDepends
from blog_system_backend.src.api.users.enums import UserRole
from blog_system_backend.src.pagination import PaginationResponse, PaginationSearchParamsDepends
from blog_system_backend.src.settings import settings

router = APIRouter(prefix="/categories", tags=["categories"])


@lru_cache(maxsize=settings.lru_cache_size)
@router.get("", response_model=list[CategoryResponse])
async def get_categories(
    search_params: PaginationSearchParamsDepends,
    repository: CategoryRepositoryDepends,
    current_user=CurrentUserDepends,
) -> CategoryPaginationResponse:
    categories = repository.list(search_params)
    count = repository.count(search_params)
    return CategoryPaginationResponse(
        pagination=PaginationResponse.from_search_params(search_params, total_items=count),
        categories=[CategoryResponse.from_orm(cat) for cat in categories],
    )


@lru_cache(maxsize=settings.lru_cache_size)
@router.get("/{category_id}", response_model=CategoryResponse)
async def get_category(category_id: int, repository: CategoryRepositoryDepends, current_user=CurrentUserDepends):
    category = repository.get_by_id(category_id)
    if not category:
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"Категория с id {category_id} не найдена")
    return category


@router.post("", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_category(
    args: CategoryCreateRequest, repository: CategoryRepositoryDepends, current_user=CurrentUserDepends
):
    if current_user.role != UserRole.admin:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Доступно только администраторам")

    existing = repository.get_by_title(args.title)
    if existing:
        raise HTTPException(status.HTTP_409_CONFLICT, f"Категория {args.title} уже существует")

    return repository.create(args)


@router.put("/{category_id}", response_model=CategoryResponse)
async def update_category(
    category_id: int,
    args: CategoryUpdateRequest,
    repository: CategoryRepositoryDepends,
    current_user=CurrentUserDepends,
):
    if current_user.role != UserRole.admin:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Доступно только администраторам")

    category = repository.get_by_id(category_id)
    if not category:
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"Категория с id {category_id} не найдена")

    other = repository.get_by_title(args.title)
    if other and other.id != category_id:
        raise HTTPException(status.HTTP_409_CONFLICT, f"Категория с названием {args.title} уже существует")

    repository.update(category, args)
    return category


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_category(category_id: int, repository: CategoryRepositoryDepends, current_user=CurrentUserDepends):
    if current_user.role != UserRole.admin:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Доступно только администраторам")

    category = repository.get_by_id(category_id)
    if not category:
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"Категория с id {category_id} не найдена")

    repository.delete(category)

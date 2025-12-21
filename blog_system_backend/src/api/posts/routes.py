from functools import lru_cache

from fastapi import APIRouter, HTTPException, status

from blog_system_backend.src.api.posts.repository import PostRepositoryDepends
from blog_system_backend.src.api.posts.schemas import (
    PostCreateRequest,
    PostResponse,
    PostsPaginationResponse,
    PostUpdateRequest,
)
from blog_system_backend.src.api.users.deps import CurrentUserDepends
from blog_system_backend.src.api.users.enums import UserRole
from blog_system_backend.src.pagination import PaginationResponse, PaginationSearchParamsDepends
from blog_system_backend.src.settings import settings

router = APIRouter(prefix="/posts", tags=["posts"])


@lru_cache(maxsize=settings.lru_cache_size)
@router.get("", response_model=PostsPaginationResponse)
async def get_posts(
    search_params: PaginationSearchParamsDepends,
    post_repository: PostRepositoryDepends,
    current_user: CurrentUserDepends,
) -> PostsPaginationResponse:
    posts = post_repository.get_posts(search_params)
    count = post_repository.count_posts(search_params)

    return PostsPaginationResponse(
        pagination=PaginationResponse.from_search_params(search_params, total_items=count),
        posts=[PostResponse.from_orm(post) for post in posts],
    )


@lru_cache(maxsize=settings.lru_cache_size)
@router.get("/{post_id}", response_model=PostResponse)
async def get_post(
    post_id: int, post_repository: PostRepositoryDepends, current_user: CurrentUserDepends
) -> PostResponse:
    post = post_repository.get_post_by_id(post_id)

    if not post:
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"Пост с id {post_id} не найден")

    return PostResponse.from_orm(post)


@router.post("", status_code=status.HTTP_201_CREATED, response_model=PostResponse)
async def create_post(
    args: PostCreateRequest,
    post_repository: PostRepositoryDepends,
    current_user: CurrentUserDepends,
) -> PostResponse:
    post = post_repository.create_post(args, current_user.id)
    return PostResponse.from_orm(post)


@router.put("/{post_id}", response_model=PostResponse)
async def update_post(
    post_id: int, args: PostUpdateRequest, post_repository: PostRepositoryDepends, current_user: CurrentUserDepends
) -> PostResponse:
    post = post_repository.get_post_by_id(post_id)

    if not post:
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"Пост с id {post_id} не найден")

    if post.authorId != current_user.id:
        raise HTTPException(
            status.HTTP_403_FORBIDDEN, "Пост недоступен для редактирования, так как принадлежит другому пользователю"
        )

    post_repository.update_post(post, args)
    return PostResponse.from_orm(post)


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_post(post_id: int, post_repository: PostRepositoryDepends, current_user: CurrentUserDepends) -> None:
    post = post_repository.get_post_by_id(post_id)

    if not post:
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"Пост с id {post_id} не найден")

    if post.authorId != current_user.id and current_user.role != UserRole.admin:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Недостаточно прав для удаления поста")

    post_repository.delete_post(post)

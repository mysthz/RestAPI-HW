from functools import lru_cache

from fastapi import APIRouter, HTTPException, status

from blog_system_backend.src.api.posts.models import Post
from blog_system_backend.src.api.posts.repository import PostRepositoryDepends
from blog_system_backend.src.api.posts.schemas import PostCreateRequest, PostResponse, PostUpdateRequest
from blog_system_backend.src.api.users.deps import CurrentUserDepends
from blog_system_backend.src.api.users.enums import UserRole
from blog_system_backend.src.api.users.repository import UserRepositoryDepends
from blog_system_backend.src.settings import settings

router = APIRouter(prefix="/posts", tags=["posts"])


@lru_cache(maxsize=settings.lru_cache_size)
@router.get("", response_model=list[PostResponse])
async def get_posts(post_repository: PostRepositoryDepends, current_user: CurrentUserDepends) -> list[Post]:
    return post_repository.get_posts()


@lru_cache(maxsize=settings.lru_cache_size)
@router.get("/{post_id}", response_model=PostResponse)
async def get_post(post_id: int, post_repository: PostRepositoryDepends, current_user: CurrentUserDepends) -> Post:
    post = post_repository.get_post_by_id(post_id)

    if not post:
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"Пост с id {post_id} не найден")

    return post


@router.post("", status_code=status.HTTP_201_CREATED, response_model=PostResponse)
async def create_post(
    args: PostCreateRequest,
    user_repository: UserRepositoryDepends,
    post_repository: PostRepositoryDepends,
    current_user: CurrentUserDepends,
) -> Post:
    user = user_repository.get_user_by_id(args.authorId)

    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"Пользователь с id {args.authorId} не найден")

    return post_repository.create_post(args)


@router.put("/{post_id}", response_model=PostResponse)
async def update_post(
    post_id: int, args: PostUpdateRequest, post_repository: PostRepositoryDepends, current_user: CurrentUserDepends
) -> Post:
    post = post_repository.get_post_by_id(post_id)

    if not post:
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"Пост с id {post_id} не найден")

    if post.authorId != current_user.id:
        raise HTTPException(
            status.HTTP_403_FORBIDDEN, "Пост недоступен для редактирования, так как принадлежит другому пользователю"
        )

    post_repository.update_post(post, args)
    return post


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_post(post_id: int, post_repository: PostRepositoryDepends, current_user: CurrentUserDepends) -> None:
    post = post_repository.get_post_by_id(post_id)

    if not post:
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"Пост с id {post_id} не найден")

    if post.authorId != current_user.id and current_user.role != UserRole.admin:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Недостаточно прав для удаления поста")

    post_repository.delete_post(post)

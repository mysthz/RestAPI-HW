from fastapi import APIRouter, HTTPException, status

from blog_system_backend.src.api.posts.repository import PostRepositoryDepends
from blog_system_backend.src.api.posts.saved_posts.models import SavedPost
from blog_system_backend.src.api.posts.saved_posts.repository import SavedPostRepositoryDepends
from blog_system_backend.src.api.posts.saved_posts.schemas import SavedPostResponse
from blog_system_backend.src.api.users.deps import CurrentUserDepends

router = APIRouter(prefix="/save")


@router.post("", response_model=SavedPostResponse, status_code=status.HTTP_201_CREATED)
async def save_post(
    post_id: int,
    saved_posts_repository: SavedPostRepositoryDepends,
    post_repository: PostRepositoryDepends,
    current_user: CurrentUserDepends,
) -> SavedPost:
    post = post_repository.get_post_by_id(post_id)
    if not post:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Пост не найден")

    existing = saved_posts_repository.get_by_user_and_post(current_user.id, post_id)
    if existing:
        return existing

    saved = saved_posts_repository.create(current_user.id, post_id)
    return saved


@router.delete("", status_code=status.HTTP_204_NO_CONTENT)
async def unsave_post(
    post_id: int,
    saved_posts_repository: SavedPostRepositoryDepends,
    post_repository: PostRepositoryDepends,
    current_user: CurrentUserDepends,
) -> None:
    post = post_repository.get_post_by_id(post_id)
    if not post:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Пост не найден")

    existing = saved_posts_repository.get_by_user_and_post(current_user.id, post_id)
    if existing:
        saved_posts_repository.delete(existing)

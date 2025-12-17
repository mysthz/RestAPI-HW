from functools import lru_cache

from fastapi import APIRouter, HTTPException, status

from blog_system_backend.src.api.posts.comments.models import Comment
from blog_system_backend.src.api.posts.comments.repository import CommentRepositoryDepends
from blog_system_backend.src.api.posts.comments.schemas import (
    CommentCreateRequest,
    CommentResponse,
    CommentUpdateRequest,
)
from blog_system_backend.src.api.posts.repository import PostRepositoryDepends
from blog_system_backend.src.api.users.deps import CurrentUserDepends
from blog_system_backend.src.api.users.enums import UserRole
from blog_system_backend.src.settings import settings

router = APIRouter(prefix="/comments", include_in_schema=False)


@lru_cache(maxsize=settings.lru_cache_size)
@router.get("", response_model=list[CommentResponse])
async def get_comments(
    post_id: int, repository: CommentRepositoryDepends, current_user: CurrentUserDepends
) -> list[CommentResponse]:
    return [CommentResponse.from_orm(c) for c in repository.get_by_post(post_id)]


@router.post("", response_model=CommentResponse, status_code=status.HTTP_201_CREATED)
async def create_comment(
    post_id: int,
    args: CommentCreateRequest,
    post_repo: PostRepositoryDepends,
    repository: CommentRepositoryDepends,
    current_user: CurrentUserDepends,
) -> Comment:
    post = post_repo.get_post_by_id(post_id)
    if not post:
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"Пост с id {post_id} не найден")
    comment = repository.create(current_user.id, post_id, args)
    return comment


@router.put("/{comment_id}", response_model=CommentResponse)
async def update_comment(
    post_id: int,
    comment_id: int,
    args: CommentUpdateRequest,
    repository: CommentRepositoryDepends,
    current_user: CurrentUserDepends,
) -> Comment:
    comment = repository.get_by_id(comment_id)
    if not comment or comment.postId != post_id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Комментарий не найден")

    if comment.authorId != current_user.id:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Недостаточно прав на редактирование комментария")

    repository.update(comment, args)
    return comment


@router.delete("/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_comment(
    post_id: int, comment_id: int, repository: CommentRepositoryDepends, current_user: CurrentUserDepends
) -> None:
    comment = repository.get_by_id(comment_id)
    if not comment or comment.postId != post_id:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Комментарий не найден")

    if comment.authorId != current_user.id and current_user.role != UserRole.admin:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Недостаточно прав на удаление комментария")

    repository.delete(comment)

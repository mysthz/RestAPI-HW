from fastapi import APIRouter, status, HTTPException

from src.api.posts.repository import PostRepositoryDepends
from src.api.posts.schemas import PostResponse, PostCreateRequest, PostUpdateRequest
from src.api.users.repository import UserRepositoryDepends

router = APIRouter(prefix="/posts", tags=["posts"])


@router.get("")
async def get_posts(post_repository: PostRepositoryDepends) -> list[PostResponse]:
    return post_repository.get_posts()


@router.get("/{post_id}")
async def get_post(post_id: int, post_repository: PostRepositoryDepends) -> PostResponse:
    post = post_repository.get_post_by_id(post_id)

    if not post:
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"Пост с id {post_id} не найден")

    return post


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_post(args: PostCreateRequest, user_repository: UserRepositoryDepends,
                      post_repository: PostRepositoryDepends) -> PostResponse:
    user = user_repository.get_user_by_id(args.authorId)

    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"Пользователь с id {args.authorId} не найден")

    return post_repository.create_post(args)


@router.put("/{post_id}")
async def update_post(post_id: int, args: PostUpdateRequest, post_repository: PostRepositoryDepends) -> PostResponse:
    post = post_repository.get_post_by_id(post_id)

    if not post:
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"Пост с id {post_id} не найден")

    post_repository.update_post(post, args)
    return post


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_post(post_id: int, post_repository: PostRepositoryDepends) -> None:
    post = post_repository.get_post_by_id(post_id)

    if not post:
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"Пост с id {post_id} не найден")

    post_repository.delete_post(post)

from fastapi import APIRouter, HTTPException, status

from blog_system_backend.src.api.users.deps import CurrentUserDepends
from blog_system_backend.src.api.users.repository import UserRepositoryDepends
from blog_system_backend.src.api.users.subscribes.models import Subscribe
from blog_system_backend.src.api.users.subscribes.repository import SubscribeRepositoryDepends
from blog_system_backend.src.api.users.subscribes.schemas import SubscribeResponse

router = APIRouter(prefix="/subscribe")


@router.post("", response_model=SubscribeResponse, status_code=status.HTTP_201_CREATED)
async def subscribe(
    author_id: int,
    subscribe_repository: SubscribeRepositoryDepends,
    user_repository: UserRepositoryDepends,
    current_user: CurrentUserDepends,
) -> Subscribe:
    if author_id == current_user.id:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Нельзя подписаться на самого себя")

    author = user_repository.get_user_by_id(author_id)
    if not author:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Автор не найден")

    existing = subscribe_repository.get_by_author_and_subscriber(author_id, current_user.id)
    if existing:
        return existing

    sub = subscribe_repository.create(author_id, current_user.id)
    return sub


@router.delete("", status_code=status.HTTP_204_NO_CONTENT)
async def unsubscribe(
    author_id: int, subscribe_repository: SubscribeRepositoryDepends, current_user: CurrentUserDepends
) -> None:
    existing = subscribe_repository.get_by_author_and_subscriber(author_id, current_user.id)
    if existing:
        subscribe_repository.delete(existing)

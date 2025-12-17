from functools import lru_cache

from fastapi import APIRouter, HTTPException, status

from blog_system_backend.src.api.posts.schemas import PostResponse, PostsPaginationResponse
from blog_system_backend.src.api.users.deps import CurrentUserDepends
from blog_system_backend.src.api.users.enums import UserRole
from blog_system_backend.src.api.users.models import User
from blog_system_backend.src.api.users.repository import UserRepositoryDepends
from blog_system_backend.src.api.users.schemas import (
    UserResponse,
    UsersPaginationResponse,
    UserUpdateRequest,
)
from blog_system_backend.src.api.users.subscribes.repository import SubscribeRepositoryDepends
from blog_system_backend.src.api.users.subscribes.schemas import SubscribePaginationResponse, SubscribeResponse
from blog_system_backend.src.pagination import PaginationResponse, PaginationSearchParamsDepends
from blog_system_backend.src.settings import settings

router = APIRouter(prefix="/users", tags=["users"])


@lru_cache(maxsize=settings.lru_cache_size)
@router.get("", response_model=UsersPaginationResponse)
async def get_users(
    search_params: PaginationSearchParamsDepends,
    user_repository: UserRepositoryDepends,
    current_user: CurrentUserDepends,
) -> UsersPaginationResponse:
    if current_user.role != UserRole.admin:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Доступно только администраторам")

    count = user_repository.count_users(search_params)
    users = user_repository.get_users(search_params)

    pagination = PaginationResponse.from_search_params(search_params, total_items=count)

    return UsersPaginationResponse(pagination=pagination, users=[UserResponse.from_orm(user) for user in users])


@lru_cache(maxsize=settings.lru_cache_size)
@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: int, user_repository: UserRepositoryDepends, current_user: CurrentUserDepends) -> User:
    user = user_repository.get_user_by_id(user_id)

    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"Пользователь с id {user_id} не найден")

    return user


@router.put("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: int, args: UserUpdateRequest, user_repository: UserRepositoryDepends, current_user: CurrentUserDepends
) -> User:
    request_user = user_repository.get_user_by_id(user_id)

    if not request_user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"Пользователь с id {user_id} не найден")

    if current_user.id != user_id and current_user.role != UserRole.admin:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Недостаточно прав на редактирование пользователя")

    user = user_repository.get_user_by_email(args.email)
    if user and user.id != user_id:
        raise HTTPException(status.HTTP_409_CONFLICT, f"Пользователь с email {args.email} уже существует")

    user = user_repository.get_user_by_login(args.login)
    if user and user.id != user_id:
        raise HTTPException(status.HTTP_409_CONFLICT, f"Пользователь с логином {args.login} уже существует")

    user_repository.update_user(request_user, args)
    return request_user


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(user_id: int, user_repository: UserRepositoryDepends, current_user: CurrentUserDepends) -> None:
    user = user_repository.get_user_by_id(user_id)

    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"Пользователь с id {user_id} не найден")

    if current_user.id != user_id and current_user.role != UserRole.admin:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Недостаточно прав на удаление пользователя")

    user_repository.delete_user(user)


@lru_cache(maxsize=settings.lru_cache_size)
@router.get("/{user_id}/subscriptions")
async def get_user_subscriptions(
    user_id: int,
    search_params: PaginationSearchParamsDepends,
    user_repository: UserRepositoryDepends,
    subscribe_repository: SubscribeRepositoryDepends,
    current_user: CurrentUserDepends,
) -> SubscribePaginationResponse:
    user = user_repository.get_user_by_id(user_id)

    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"Пользователь с id {user_id} не найден")

    subscriptions, count = subscribe_repository.def_followers(user_id, search_params)

    return SubscribePaginationResponse(
        pagination=PaginationResponse.from_search_params(search_params, total_items=count),
        subscribes=[SubscribeResponse.from_orm(subscription) for subscription in subscriptions],
    )


@lru_cache(maxsize=settings.lru_cache_size)
@router.get("/{user_id}/followers")
async def get_user_followers(
    user_id: int,
    search_params: PaginationSearchParamsDepends,
    user_repository: UserRepositoryDepends,
    subscribe_repository: SubscribeRepositoryDepends,
    current_user: CurrentUserDepends,
) -> SubscribePaginationResponse:
    user = user_repository.get_user_by_id(user_id)

    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"Пользователь с id {user_id} не найден")

    followers, count = subscribe_repository.def_followers(user_id, search_params)

    return SubscribePaginationResponse(
        pagination=PaginationResponse.from_search_params(search_params, total_items=count),
        subscribes=[SubscribeResponse.from_orm(follower) for follower in followers],
    )


@lru_cache(maxsize=settings.lru_cache_size)
@router.get("/{user_id}/posts", response_model=PostsPaginationResponse)
async def get_user_posts(
    user_id: int,
    search_params: PaginationSearchParamsDepends,
    user_repository: UserRepositoryDepends,
    current_user: CurrentUserDepends,
) -> PostsPaginationResponse:
    user = user_repository.get_user_by_id(user_id)

    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"Пользователь с id {user_id} не найден")

    count = len(user.posts)

    return PostsPaginationResponse(
        pagination=PaginationResponse.from_search_params(search_params, total_items=count),
        posts=[
            PostResponse.from_orm(post)
            for post in user.posts[search_params.offset : search_params.limit + search_params.offset]
        ],
    )

from fastapi import APIRouter, HTTPException, status

from blog_system_backend.src.api.users.models import User
from blog_system_backend.src.api.users.repository import UserRepositoryDepends
from blog_system_backend.src.api.users.schemas import UserRequest, UserResponse

router = APIRouter(prefix="/users", tags=["users"])


@router.post("", status_code=status.HTTP_201_CREATED, response_model=UserResponse)
async def create_user(args: UserRequest, user_repository: UserRepositoryDepends) -> User:
    user = user_repository.get_user_by_email(args.email)
    if user:
        raise HTTPException(status.HTTP_409_CONFLICT, f"Пользователь с email {args.email} уже существует")

    user = user_repository.get_user_by_login(args.login)
    if user:
        raise HTTPException(status.HTTP_409_CONFLICT, f"Пользователь с логином {args.login} уже существует")

    user = user_repository.create_user(args)
    return user


@router.get("", response_model=list[UserResponse])
async def get_users(user_repository: UserRepositoryDepends) -> list[User]:
    return user_repository.get_users()


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: int, user_repository: UserRepositoryDepends) -> User:
    user = user_repository.get_user_by_id(user_id)

    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"Пользователь с id {user_id} не найден")

    return user


@router.put("/{user_id}", response_model=UserResponse)
async def update_user(user_id: int, args: UserRequest, user_repository: UserRepositoryDepends) -> User:
    request_user = user_repository.get_user_by_id(user_id)

    if not request_user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"Пользователь с id {user_id} не найден")

    user = user_repository.get_user_by_email(args.email)
    if user and user.id != user_id:
        raise HTTPException(status.HTTP_409_CONFLICT, f"Пользователь с email {args.email} уже существует")

    user = user_repository.get_user_by_login(args.login)
    if user and user.id != user_id:
        raise HTTPException(status.HTTP_409_CONFLICT, f"Пользователь с логином {args.login} уже существует")

    user_repository.update_user(request_user, args)
    return request_user


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(user_id: int, user_repository: UserRepositoryDepends) -> None:
    user = user_repository.get_user_by_id(user_id)

    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"Пользователь с id {user_id} не найден")

    user_repository.delete_user(user)

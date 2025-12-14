from fastapi import APIRouter, HTTPException, status

from blog_system_backend.src.api.users.deps import CurrentUserDepends
from blog_system_backend.src.api.users.enums import UserRole
from blog_system_backend.src.api.users.models import User
from blog_system_backend.src.api.users.repository import UserRepositoryDepends
from blog_system_backend.src.api.users.schemas import UserRequest, UserResponse

router = APIRouter(prefix="/users", tags=["users"])


@router.get("", response_model=list[UserResponse])
async def get_users(user_repository: UserRepositoryDepends, current_user: CurrentUserDepends) -> list[User]:
    if current_user.role != UserRole.admin:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Доступно только администраторам")
    return user_repository.get_users()


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: int, user_repository: UserRepositoryDepends, current_user: CurrentUserDepends) -> User:
    user = user_repository.get_user_by_id(user_id)

    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, f"Пользователь с id {user_id} не найден")

    return user


@router.put("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: int, args: UserRequest, user_repository: UserRepositoryDepends, current_user: CurrentUserDepends
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

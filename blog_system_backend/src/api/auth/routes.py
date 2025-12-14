from fastapi import APIRouter, HTTPException, status

from blog_system_backend.src.api.auth.deps import PasswordRequestFormDepends
from blog_system_backend.src.api.auth.schemas import AccessTokenResponse
from blog_system_backend.src.api.users.repository import UserRepositoryDepends
from blog_system_backend.src.api.users.schemas import UserRequest
from blog_system_backend.src.security import create_access_token, is_valid_password

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post(
    "/register",
    status_code=status.HTTP_201_CREATED,
)
async def register(args: UserRequest, repository: UserRepositoryDepends) -> AccessTokenResponse:
    if repository.get_user_by_login(args.login):
        raise HTTPException(status.HTTP_409_CONFLICT, f"Пользователь с email {args.email} уже существует")

    if repository.get_user_by_email(args.email):
        raise HTTPException(status.HTTP_409_CONFLICT, f"Пользователь с логином {args.login} уже существует")

    user = repository.create_user(args)

    return create_access_token(user.id)


@router.post("/login", status_code=status.HTTP_200_OK)
async def login(form: PasswordRequestFormDepends, repository: UserRepositoryDepends) -> AccessTokenResponse:
    user = repository.get_user_by_login(form.username)

    if not user:
        user = repository.get_user_by_email(form.username)

    if not user or not is_valid_password(form.password, user.password):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Некорректный логин или пароль")

    return create_access_token(user.id)

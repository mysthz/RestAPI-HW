from typing import Annotated

import jwt
from fastapi import Depends, HTTPException, status

from blog_system_backend.src.api.auth.deps import PasswordBearerDepends
from blog_system_backend.src.api.auth.schemas import JWT
from blog_system_backend.src.api.users.models import User
from blog_system_backend.src.db.deps import SessionDepends
from blog_system_backend.src.settings import settings


def get_current_user(session: SessionDepends, raw: PasswordBearerDepends) -> User:
    try:
        data = JWT(**jwt.decode(raw, settings.jwt_secret, algorithms=[settings.jwt_algorithm]))
    except Exception:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Неверный логин или пароль") from None

    user = session.get(User, data.sub)

    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Пользователь не найден")

    return user


CurrentUserDepends = Annotated[User, Depends(get_current_user)]

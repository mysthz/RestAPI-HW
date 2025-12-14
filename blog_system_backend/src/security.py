from datetime import datetime, timedelta, timezone
from typing import Any

import jwt
from passlib.context import CryptContext

from blog_system_backend.src.api.auth.schemas import JWT, AccessTokenResponse
from blog_system_backend.src.settings import settings

crypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def create_access_token(subject: Any, minutes: int = settings.jwt_expire_minutes) -> AccessTokenResponse:
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=minutes)
    to_encode = JWT(exp=expires_at, sub=str(subject))
    access_token = jwt.encode(to_encode.model_dump(), settings.jwt_secret, algorithm=settings.jwt_algorithm)
    return AccessTokenResponse(access_token=str(access_token), expires_at=expires_at)


def is_valid_password(plain_password: str, hashed_password: str) -> bool:
    return crypt_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return crypt_context.hash(password)

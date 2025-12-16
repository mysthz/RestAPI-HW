__all__ = [
    "generate_password_hash",
    "generate_password",
    "generate_user",
    "generate_login",
    "user_client",
    "user_repository",
    "user",
    "UserClient",
    "auth_client",
    "AuthClient",
    "AuthLoginDict",
    "AuthRegisterDict",
    "token",
]

from typing import AsyncIterator, Iterator

import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Session

from blog_system_backend.src.app import app
from blog_system_backend.src.db.deps import get_session
from blog_system_backend.src.db.models import Base
from blog_system_backend.tests.utils.auth.args import AuthLoginDict, AuthRegisterDict
from blog_system_backend.tests.utils.auth.client import AuthClient
from blog_system_backend.tests.utils.auth.fixtures import auth_client, token
from blog_system_backend.tests.utils.users.client import UserClient
from blog_system_backend.tests.utils.users.fixtures import user, user_client, user_repository
from blog_system_backend.tests.utils.users.generator import (
    generate_login,
    generate_password,
    generate_password_hash,
    generate_user,
)

ENGINE = create_engine("sqlite:///./data/test_database.db")


def get_overwrite_session() -> Iterator[Session]:
    session = Session(ENGINE)

    try:
        yield session
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


@pytest.fixture(scope="function")
def session() -> Iterator[Session]:
    session = Session(ENGINE)

    try:
        yield session
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


@pytest.fixture(scope="function", autouse=True)
def setup_database() -> None:
    Base.metadata.drop_all(bind=ENGINE)
    Base.metadata.create_all(bind=ENGINE)


@pytest.fixture(scope="function")
async def client(session: AsyncSession) -> AsyncIterator[AsyncClient]:
    app.dependency_overrides[get_session] = lambda: session

    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        yield client

    app.dependency_overrides.clear()


app.dependency_overrides[get_session] = get_overwrite_session

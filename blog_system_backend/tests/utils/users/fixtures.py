import pytest
from httpx import AsyncClient
from sqlalchemy.orm import Session

from blog_system_backend.src.api.users.models import User
from blog_system_backend.src.api.users.repository import UserRepository
from blog_system_backend.tests.utils.users.client import UserClient
from blog_system_backend.tests.utils.users.generator import generate_user


@pytest.fixture(scope="function")
def user_client(client: AsyncClient) -> UserClient:
    return UserClient(client=client)


@pytest.fixture(scope="function")
def user_repository(session: Session) -> UserRepository:
    return UserRepository(session=session)


@pytest.fixture(scope="function")
def user(user_repository: UserRepository) -> User:
    return user_repository.create_user(generate_user())

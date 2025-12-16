import pytest
from httpx import AsyncClient

from blog_system_backend.src.api.auth.schemas import AccessTokenResponse
from blog_system_backend.src.api.users.repository import UserRepository
from blog_system_backend.tests.utils.auth.client import AuthClient
from blog_system_backend.tests.utils.users import UserClient, generate_user


@pytest.fixture(scope="function")
async def auth_client(client: AsyncClient) -> AuthClient:
    return AuthClient(client=client)


@pytest.fixture(scope="function")
async def token(auth_client: AuthClient, user_repository: UserRepository, user_client: UserClient) -> str:
    plain_admin = generate_user(login="admin")
    user_repository.create_user(plain_admin, is_admin=True)

    response = await auth_client.login(username=plain_admin.login, password=plain_admin.password)

    token = AccessTokenResponse(**response.json()).access_token
    user_client.client.headers["Authorization"] = f"Bearer {token}"

    return token

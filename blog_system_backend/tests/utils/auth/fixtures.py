import pytest
from httpx import AsyncClient

from blog_system_backend.tests.utils.auth.client import AuthClient


@pytest.fixture(scope="function")
async def auth_client(client: AsyncClient) -> AuthClient:
    return AuthClient(client=client)

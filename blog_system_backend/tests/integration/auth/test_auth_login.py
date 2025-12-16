import pytest
from fastapi import status

from blog_system_backend.tests.utils.auth import AuthClient
from blog_system_backend.tests.utils.auth.args import AuthLoginDict
from blog_system_backend.tests.utils.users import generate_login, generate_password
from blog_system_backend.tests.utils.users.generator import generate_email


@pytest.mark.anyio
class TestAuthLogin:
    @pytest.fixture(scope="function", autouse=True)
    async def setup(self, auth_client: AuthClient) -> None:
        self.auth_client = auth_client

    async def test_login_ok(self) -> None:
        register_data = dict(login=generate_login(), password=generate_password(), email=generate_email())
        login_data = dict(username=register_data["login"], password=register_data["password"])

        response = await self.auth_client.register(**register_data)
        assert response.status_code == status.HTTP_201_CREATED

        response = await self.auth_client.login(**login_data)
        assert response.status_code == status.HTTP_200_OK

    @pytest.mark.parametrize(
        ("data", "status_code"),
        (
            ({}, status.HTTP_422_UNPROCESSABLE_CONTENT),
            (dict(password=generate_password()), status.HTTP_422_UNPROCESSABLE_CONTENT),
            (dict(username=generate_login()), status.HTTP_422_UNPROCESSABLE_CONTENT),
            (dict(username=generate_login(), password=generate_password()), status.HTTP_401_UNAUTHORIZED),
        ),
    )
    async def test_auth_login_unprocessable_entity_unauthorized(self, data: AuthLoginDict, status_code: int) -> None:
        response = await self.auth_client.login(**data)
        assert response.status_code == status_code

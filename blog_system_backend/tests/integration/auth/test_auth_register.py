import pytest
from fastapi import status

from blog_system_backend.tests.utils.auth.args import AuthRegisterDict
from blog_system_backend.tests.utils.auth.client import AuthClient
from blog_system_backend.tests.utils.users import generate_login, generate_password
from blog_system_backend.tests.utils.users.generator import generate_email


@pytest.mark.anyio
class TestAuthRegister:
    @pytest.fixture(scope="function", autouse=True)
    async def setup(self, auth_client: AuthClient) -> None:
        self.auth_client = auth_client

    async def test_register_created(self) -> None:
        response = await self.auth_client.register(
            login=generate_login(), password=generate_password(), email=generate_email()
        )
        assert response.status_code == status.HTTP_201_CREATED

    async def test_register_conflict(self) -> None:
        json = dict(login=generate_login(), password=generate_password(), email=generate_email())

        response = await self.auth_client.register(**json)
        assert response.status_code == status.HTTP_201_CREATED

        response = await self.auth_client.register(**json)
        assert response.status_code == status.HTTP_409_CONFLICT

    @pytest.mark.parametrize(
        ("json", "status_code"),
        (
            ({}, status.HTTP_422_UNPROCESSABLE_CONTENT),
            (dict(password=generate_password()), status.HTTP_422_UNPROCESSABLE_CONTENT),
            (dict(login=generate_login()), status.HTTP_422_UNPROCESSABLE_CONTENT),
            (dict(login=generate_login(), password="short"), status.HTTP_422_UNPROCESSABLE_CONTENT),
            (dict(login="@@", password=generate_password()), status.HTTP_422_UNPROCESSABLE_CONTENT),
            (dict(login="user@example.com", password="short"), status.HTTP_422_UNPROCESSABLE_CONTENT),
            (dict(email=generate_email(), password="short"), status.HTTP_422_UNPROCESSABLE_CONTENT),
        ),
    )
    async def test_register_unprocessable_entity(self, json: AuthRegisterDict, status_code: int) -> None:
        response = await self.auth_client.register(**json)
        assert response.status_code == status_code

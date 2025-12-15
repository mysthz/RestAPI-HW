from typing import Unpack

from httpx import AsyncClient, Response

from blog_system_backend.tests.utils.auth.args import AuthLoginDict, AuthRegisterDict


class AuthClient:
    def __init__(self, *, client: AsyncClient) -> None:
        self.client = client

    async def login(self, **kwargs: Unpack[AuthLoginDict]) -> Response:
        return await self.client.post("/api/auth/login", data=kwargs)

    async def register(self, **kwargs: Unpack[AuthRegisterDict]) -> Response:
        return await self.client.post("/api/auth/register", json=kwargs)

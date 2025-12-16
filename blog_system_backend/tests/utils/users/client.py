from typing import Any

from httpx import AsyncClient, Response


class UserClient:
    def __init__(self, *, client: AsyncClient) -> None:
        self.client = client

    async def get_users(self, *, params: dict[str, Any] | None = None) -> Response:
        return await self.client.get("/api/users", params=params)

    async def get_user(self, id: int) -> Response:
        return await self.client.get(f"/api/users/{id}")

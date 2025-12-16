import pytest
from fastapi import status
from httpx import AsyncClient


@pytest.mark.anyio
async def test_get_docs(client: AsyncClient) -> None:
    response = await client.get("/docs")

    assert response.status_code == status.HTTP_200_OK


@pytest.mark.anyio
async def test_get_docs_openapi_json(client: AsyncClient) -> None:
    response = await client.get("/openapi.json")

    assert response.headers["Content-Type"] == "application/json"
    assert response.status_code == status.HTTP_200_OK

from fastapi import FastAPI, Response, status

from src.api import router
from src.db import ENGINE
from src.db.models import Base

app = FastAPI(
    title="Blog API",
    version="0.0.1",
)

Base.metadata.create_all(ENGINE)

app.include_router(router)


@app.get("/", include_in_schema=False)
async def root() -> Response:
    return Response(status_code=status.HTTP_200_OK)

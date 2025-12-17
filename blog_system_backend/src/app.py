from fastapi import FastAPI, Response, status
from starlette.middleware.cors import CORSMiddleware

from blog_system_backend.src.api import router
from blog_system_backend.src.db import ENGINE
from blog_system_backend.src.db.models import Base

app = FastAPI(
    title="Blog API",
    version="0.0.1",
)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_headers=["*"],
    allow_methods=["*"],
    allow_origins=["*"],
)

Base.metadata.create_all(ENGINE)

app.include_router(router)


@app.get("/", include_in_schema=False)
async def root() -> Response:
    return Response(status_code=status.HTTP_200_OK)

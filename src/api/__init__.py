from fastapi import APIRouter

from src.api import users
from src.api import posts

router = APIRouter(prefix="/api")

router.include_router(users.router)
router.include_router(posts.router)

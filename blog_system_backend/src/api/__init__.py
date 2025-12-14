from fastapi import APIRouter

from blog_system_backend.src.api import auth, posts, users

router = APIRouter(prefix="/api")

router.include_router(auth.router)
router.include_router(users.router)
router.include_router(posts.router)

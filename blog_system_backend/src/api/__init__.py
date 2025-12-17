from fastapi import APIRouter

from blog_system_backend.src.api import auth, categories, posts, users

router = APIRouter(prefix="/api")

router.include_router(auth.router)
router.include_router(users.router)
router.include_router(posts.router)
router.include_router(categories.router)

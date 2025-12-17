__all__ = ["router"]

from blog_system_backend.src.api.posts import comments
from blog_system_backend.src.api.posts.routes import router

router.include_router(comments.router, prefix="/posts/{post_id}", tags=["comments"])

__all__ = ["router"]

from blog_system_backend.src.api.users import subscribes
from blog_system_backend.src.api.users.routes import router

router.include_router(subscribes.router, prefix="/{author_id}", tags=["subscribe"])

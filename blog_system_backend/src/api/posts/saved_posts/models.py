from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from blog_system_backend.src.db.models import Base


class SavedPost(Base):
    __tablename__ = "saved_posts"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    userId: Mapped[int] = mapped_column(
        ForeignKey("users.id", onupdate="CASCADE", name="fk_saved_posts_user"), index=True, nullable=False
    )
    postId: Mapped[int] = mapped_column(
        ForeignKey("posts.id", onupdate="CASCADE", name="fk_saved_posts_post"), index=True, nullable=False
    )

    user = relationship("User")
    post = relationship("Post")

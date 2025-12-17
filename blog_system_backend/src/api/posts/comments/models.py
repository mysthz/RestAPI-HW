from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from blog_system_backend.src.db.models import Base

if TYPE_CHECKING:
    from blog_system_backend.src.api.posts.models import Post
    from blog_system_backend.src.api.users.models import User


class Comment(Base):
    __tablename__ = "comments"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    authorId: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True, nullable=False)
    postId: Mapped[int] = mapped_column(ForeignKey("posts.id"), index=True, nullable=False)
    content: Mapped[str] = mapped_column(nullable=False)

    post: Mapped["Post"] = relationship("Post", back_populates="comments")
    author: Mapped["User"] = relationship("User", back_populates="posts")

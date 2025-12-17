from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from blog_system_backend.src.db.models import Base

if TYPE_CHECKING:
    from blog_system_backend.src.api.categories.models import Category
    from blog_system_backend.src.api.users.models import User


class Post(Base):
    __tablename__ = "posts"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    authorId: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    title: Mapped[str] = mapped_column()
    content: Mapped[str] = mapped_column()

    author: Mapped["User"] = relationship("User", back_populates="posts")
    categories: Mapped[list["Category"]] = relationship(
        "Category",
        secondary="post_to_category",
        back_populates="posts",
    )

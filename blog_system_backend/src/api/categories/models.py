from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from blog_system_backend.src.db.models import Base

if TYPE_CHECKING:
    from blog_system_backend.src.api.posts.models import Post


class Category(Base):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(nullable=False, unique=True)

    posts: Mapped[list["Post"]] = relationship(
        "Post",
        secondary="post_to_category",
        back_populates="categories",
    )


class PostToCategory(Base):
    __tablename__ = "post_to_category"

    categoryId: Mapped[int] = mapped_column(ForeignKey("categories.id"), primary_key=True)
    postId: Mapped[int] = mapped_column(ForeignKey("posts.id"), primary_key=True)

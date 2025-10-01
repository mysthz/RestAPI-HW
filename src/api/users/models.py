from typing import TYPE_CHECKING

from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.db.models import Base

if TYPE_CHECKING:
    from src.api.posts.models import Post

class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    email: Mapped[str] = mapped_column(index=True, unique=True)
    login: Mapped[str] = mapped_column(index=True, unique=True)
    password: Mapped[str] = mapped_column()

    posts: Mapped[list["Post"]] = relationship("Post", back_populates="author")

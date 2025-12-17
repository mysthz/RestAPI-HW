from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from blog_system_backend.src.db.models import Base


class Subscribe(Base):
    __tablename__ = "subscribes"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    authorId: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True, nullable=False)
    subscriberId: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True, nullable=False)

    author = relationship("User", foreign_keys=[authorId])
    subscriber = relationship("User", foreign_keys=[subscriberId])

from datetime import datetime
from typing import Any

from sqlalchemy import func
from sqlalchemy.orm import Mapped, mapped_column


class AttributeUpdaterMixin:
    def update(self, args: dict[str, Any]) -> None:
        for key, value in args.items():
            setattr(self, key, value)


class AuditMixin:
    createdAt: Mapped[datetime] = mapped_column(server_default=func.now())
    updatedAt: Mapped[datetime] = mapped_column(server_default=func.now(), onupdate=func.now())

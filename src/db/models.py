from sqlalchemy.orm import DeclarativeBase

from src.db.mixins import AttributeUpdaterMixin, AuditMixin


class Base(DeclarativeBase, AttributeUpdaterMixin, AuditMixin):
    pass

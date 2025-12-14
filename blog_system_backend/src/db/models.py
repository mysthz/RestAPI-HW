from sqlalchemy.orm import DeclarativeBase

from blog_system_backend.src.db.mixins import AttributeUpdaterMixin, AuditMixin


class Base(DeclarativeBase, AttributeUpdaterMixin, AuditMixin):
    pass

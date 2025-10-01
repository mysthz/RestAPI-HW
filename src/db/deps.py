from typing import Annotated, Iterator

from fastapi import Depends
from sqlalchemy.orm import Session

from src.db import ENGINE


def get_session() -> Iterator[Session]:
    session = Session(ENGINE)

    try:
        yield session
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


SessionDepends = Annotated[Session, Depends(get_session)]
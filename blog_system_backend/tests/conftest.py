from typing import Iterator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from blog_system_backend.src.app import app
from blog_system_backend.src.db.deps import get_session
from blog_system_backend.src.db.models import Base

ENGINE = create_engine("sqlite:///./data/test_database.db")


def get_overwrite_session() -> Iterator[Session]:
    session = Session(ENGINE)

    try:
        yield session
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


@pytest.fixture(scope="function")
def session() -> Iterator[Session]:
    session = Session(ENGINE)

    try:
        yield session
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


@pytest.fixture(scope="function", autouse=True)
def setup_database():
    Base.metadata.drop_all(bind=ENGINE)
    Base.metadata.create_all(bind=ENGINE)


@pytest.fixture(scope="function")
def client():
    return TestClient(app)


app.dependency_overrides[get_session] = get_overwrite_session

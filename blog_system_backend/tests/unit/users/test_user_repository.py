import random

import pytest
from sqlalchemy.exc import IntegrityError

from blog_system_backend.src.api.users.models import User
from blog_system_backend.src.api.users.repository import UserRepository
from blog_system_backend.src.api.users.schemas import UserUpdateRequest
from blog_system_backend.src.pagination import PaginationSearchParams
from blog_system_backend.tests.utils.users import generate_login, generate_user


class TestUserRepository:
    def test_create_success(self, user_repository: UserRepository) -> None:
        user = user_repository.create_user(generate_user())

        assert user.id is not None
        assert user.createdAt is not None
        assert user.updatedAt is not None
        assert user.login == user.login

    def test_create_unique_username(self, user_repository: UserRepository) -> None:
        username = generate_login()

        user1 = generate_user(login=username)
        user2 = generate_user(login=username)

        user_repository.create_user(user1)

        with pytest.raises(IntegrityError):
            user_repository.create_user(user2)

    def test_get_by_id_existing(self, user: User, user_repository: UserRepository) -> None:
        result = user_repository.get_user_by_id(user.id)

        assert result == user

    def test_get_by_id_non_existing(self, user_repository: UserRepository) -> None:
        result = user_repository.get_user_by_id(random.randint(1, 100))

        assert result is None

    def test_get_by_username_existing(self, user: User, user_repository: UserRepository) -> None:
        result = user_repository.get_user_by_login(user.login)

        assert result == user

    def test_get_by_username_non_existing(self, user_repository: UserRepository) -> None:
        result = user_repository.get_user_by_login(generate_login())

        assert result is None

    def test_update_user(self, user: User, user_repository: UserRepository) -> None:
        new_username = generate_login()
        old_username = user.login

        user_repository.update_user(user, UserUpdateRequest(login=new_username, email=user.email))

        updated_user = user_repository.get_user_by_id(user.id)

        assert updated_user is not None
        assert updated_user.login == new_username
        assert updated_user.login != old_username

    def test_get_all_empty(self, user_repository: UserRepository) -> None:
        users = user_repository.get_users()

        assert len(users) == 0

    def test_get_all_with_users(self, user_repository: UserRepository) -> None:
        count = 3

        for _ in range(count):
            user_repository.create_user(generate_user())

        users = user_repository.get_users()

        assert len(users) == count

    def test_get_all_pagination(self, user_repository: UserRepository) -> None:
        count = 5

        for _ in range(count):
            user_repository.create_user(generate_user())

        page1 = user_repository.get_users(PaginationSearchParams.model_construct(limit=2))
        assert len(page1) == 2

        page2 = user_repository.get_users(PaginationSearchParams.model_construct(limit=2, offset=2))
        assert len(page2) == 2

        assert page1[0].id != page2[0].id

    def test_get_all_search(self, user_repository: UserRepository) -> None:
        user1 = user_repository.create_user(generate_user(login="maria123"))

        results = user_repository.get_users(PaginationSearchParams.model_construct(q="mari"))

        assert len(results) == 1
        assert results[0].id == user1.id

    def test_get_all_ordering(self, user_repository: UserRepository) -> None:
        user_repository.create_user(generate_user(login="z_user"))
        user_repository.create_user(generate_user(login="a_user"))

        users = user_repository.get_users()

        assert users[0].login == "a_user"
        assert users[1].login == "z_user"

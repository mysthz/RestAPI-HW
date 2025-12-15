from typing import Annotated

from fastapi import Depends

from blog_system_backend.src.api.users.enums import UserRole
from blog_system_backend.src.api.users.models import User
from blog_system_backend.src.api.users.schemas import UserRequest
from blog_system_backend.src.db.deps import SessionDepends
from blog_system_backend.src.pagination import PaginationSearchParams
from blog_system_backend.src.security import get_password_hash


class UserRepository:
    def __init__(self, session: SessionDepends) -> None:
        self.session = session

    def get_user_by_id(self, id: int) -> User | None:
        return self.session.get(User, id)

    def get_user_by_login(self, login: str) -> User | None:
        return self.session.query(User).filter(User.login == login).first()

    def get_user_by_email(self, email: str) -> User | None:
        return self.session.query(User).filter(User.email == email).first()

    def get_users(self, search_params: PaginationSearchParams | None = None) -> list[User]:
        search_params = search_params or PaginationSearchParams.model_construct()

        query = self.session.query(User)
        query = query.filter(User.login.icontains(search_params.q)) if search_params.q else query
        query = query.order_by(User.login).offset(search_params.offset).limit(search_params.limit)

        return query.all()

    def count_users(self, search_params: PaginationSearchParams | None = None) -> int:
        search_params = search_params or PaginationSearchParams.model_construct()
        query = self.session.query(User)
        query = query.filter(User.login.icontains(search_params.q)) if search_params.q else query

        return query.count()

    def create_user(self, args: UserRequest, is_admin: bool = False) -> User:
        user = User(
            login=args.login,
            email=args.email,
            password=get_password_hash(args.password),
            role=UserRole.admin if is_admin else UserRole.user,
        )

        self.session.add(user)
        self.session.commit()
        self.session.refresh(user)

        return user

    def update_user(self, user: User, args: UserRequest) -> None:
        user.update(args.dict())

        self.session.commit()
        self.session.refresh(user)

    def delete_user(self, user: User) -> None:
        self.session.delete(user)
        self.session.commit()


UserRepositoryDepends = Annotated[UserRepository, Depends()]

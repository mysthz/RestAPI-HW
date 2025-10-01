from typing import Annotated

from fastapi import Depends

from src.api.users.models import User
from src.api.users.schemas import UserRequest
from src.db.deps import SessionDepends
from src.security import get_password_hash


class UserRepository:
    def __init__(self, session: SessionDepends) -> None:
        self.session = session

    def get_user_by_id(self, id: int) -> User | None:
        return self.session.get(User, id)

    def get_user_by_login(self, login: str) -> User | None:
        return self.session.query(User).filter(User.login == login).first()

    def get_user_by_email(self, email: str) -> User | None:
        return self.session.query(User).filter(User.email == email).first()

    def get_users(self) -> list[User]:
        query = self.session.query(User)
        return query.all()

    def create_user(self, args: UserRequest) -> User:
        user = User(
            login=args.login,
            email=args.email,
            password=get_password_hash(args.password),
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

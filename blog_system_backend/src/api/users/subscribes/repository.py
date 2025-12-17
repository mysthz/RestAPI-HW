from typing import Annotated

from fastapi import Depends

from blog_system_backend.src.api.users.subscribes.models import Subscribe
from blog_system_backend.src.db.deps import SessionDepends
from blog_system_backend.src.pagination import PaginationSearchParams


class SubscribeRepository:
    def __init__(self, session: SessionDepends) -> None:
        self.session = session

    def get(self, id: int) -> Subscribe | None:
        return self.session.get(Subscribe, id)

    def get_by_author_and_subscriber(self, author_id: int, subscriber_id: int) -> Subscribe | None:
        return (
            self.session.query(Subscribe)
            .filter(Subscribe.authorId == author_id, Subscribe.subscriberId == subscriber_id)
            .first()
        )

    def create(self, author_id: int, subscriber_id: int) -> Subscribe:
        s = Subscribe(authorId=author_id, subscriberId=subscriber_id)
        self.session.add(s)
        self.session.commit()
        self.session.refresh(s)
        return s

    def delete(self, s: Subscribe) -> None:
        self.session.delete(s)
        self.session.commit()

    def def_followers(
        self, author_id: int, search_params: PaginationSearchParams | None = None
    ) -> tuple[list[Subscribe], int]:
        search_params = search_params or PaginationSearchParams.model_construct()
        query = self.session.query(Subscribe).filter(Subscribe.authorId == author_id)

        return query.offset(search_params.offset).limit(search_params.limit).all(), query.count()

    def def_subscriptions(
        self, user_id: int, search_params: PaginationSearchParams | None = None
    ) -> tuple[list[Subscribe], int]:
        search_params = search_params or PaginationSearchParams.model_construct()
        query = self.session.query(Subscribe).filter(Subscribe.subscriberId == user_id)

        return query.offset(search_params.offset).limit(search_params.limit).all(), query.count()


SubscribeRepositoryDepends = Annotated[SubscribeRepository, Depends()]

from typing import Annotated

from fastapi import Depends

from blog_system_backend.src.api.posts.saved_posts.models import SavedPost
from blog_system_backend.src.db.deps import SessionDepends
from blog_system_backend.src.pagination import PaginationSearchParams


class SavedPostRepository:
    def __init__(self, session: SessionDepends) -> None:
        self.session = session

    def get_by_id(self, id: int) -> SavedPost | None:
        return self.session.get(SavedPost, id)

    def get_by_user_and_post(self, user_id: int, post_id: int) -> SavedPost | None:
        return self.session.query(SavedPost).filter(SavedPost.userId == user_id, SavedPost.postId == post_id).first()

    def get_by_user(
        self, user_id: int, search_params: PaginationSearchParams | None = None
    ) -> tuple[list[SavedPost], int]:
        search_params = search_params or PaginationSearchParams.model_construct()
        query = self.session.query(SavedPost).filter(SavedPost.userId == user_id)
        return query.offset(search_params.offset).limit(search_params.limit).all(), query.count()

    def create(self, user_id: int, post_id: int) -> SavedPost:
        saved = SavedPost(userId=user_id, postId=post_id)
        self.session.add(saved)
        self.session.commit()
        self.session.refresh(saved)
        return saved

    def delete(self, saved: SavedPost) -> None:
        self.session.delete(saved)
        self.session.commit()


SavedPostRepositoryDepends = Annotated[SavedPostRepository, Depends()]

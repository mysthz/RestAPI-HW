from typing import Annotated

from fastapi import Depends

from blog_system_backend.src.api.posts.saved_posts.models import SavedPost
from blog_system_backend.src.db.deps import SessionDepends


class SavedPostRepository:
    def __init__(self, session: SessionDepends) -> None:
        self.session = session

    def get_by_id(self, id: int) -> SavedPost | None:
        return self.session.get(SavedPost, id)

    def get_by_user_and_post(self, user_id: int, post_id: int) -> SavedPost | None:
        return self.session.query(SavedPost).filter(SavedPost.userId == user_id, SavedPost.postId == post_id).first()

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

from typing import Annotated

from fastapi import Depends

from blog_system_backend.src.api.posts.comments.models import Comment
from blog_system_backend.src.api.posts.comments.schemas import CommentCreateRequest, CommentUpdateRequest
from blog_system_backend.src.db.deps import SessionDepends
from blog_system_backend.src.pagination import PaginationSearchParams


class CommentRepository:
    def __init__(self, session: SessionDepends) -> None:
        self.session = session

    def get_by_id(self, id: int) -> Comment | None:
        return self.session.get(Comment, id)

    def get_by_post(self, post_id: int, search_params: PaginationSearchParams | None = None) -> list[Comment]:
        search_params = search_params or PaginationSearchParams.model_construct()
        query = self.session.query(Comment).filter(Comment.postId == post_id)
        query = query.order_by(Comment.createdAt.desc()).offset(search_params.offset).limit(search_params.limit)
        return query.all()

    def count(self, post_id: int) -> int:
        query = self.session.query(Comment).filter(Comment.postId == post_id)
        return query.count()

    def create(self, author_id: int, post_id: int, args: CommentCreateRequest) -> Comment:
        comment = Comment(authorId=author_id, postId=post_id, content=args.content)
        self.session.add(comment)
        self.session.commit()
        self.session.refresh(comment)
        return comment

    def update(self, comment: Comment, args: CommentUpdateRequest) -> None:
        comment.update(args.dict())
        self.session.commit()
        self.session.refresh(comment)

    def delete(self, comment: Comment) -> None:
        self.session.delete(comment)
        self.session.commit()


CommentRepositoryDepends = Annotated[CommentRepository, Depends()]

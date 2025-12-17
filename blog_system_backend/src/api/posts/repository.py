from typing import Annotated

from fastapi import Depends
from sqlalchemy import or_

from blog_system_backend.src.api.categories.models import Category
from blog_system_backend.src.api.posts.models import Post
from blog_system_backend.src.api.posts.schemas import PostCreateRequest, PostUpdateRequest
from blog_system_backend.src.db.deps import SessionDepends
from blog_system_backend.src.pagination import PaginationSearchParams


class PostRepository:
    def __init__(self, session: SessionDepends) -> None:
        self.session = session

    def get_post_by_id(self, id: int) -> Post | None:
        return self.session.get(Post, id)

    def get_posts(self, search_params: PaginationSearchParams | None = None) -> list[Post]:
        search_params = search_params or PaginationSearchParams.model_construct()

        query = self.session.query(Post)
        query = (
            query.filter(or_(Post.title.icontains(search_params.q), Post.content.icontains(search_params.q)))
            if search_params.q
            else query
        )
        query = query.order_by(Post.createdAt.desc()).offset(search_params.offset).limit(search_params.limit)

        return query.all()

    def count_posts(self, search_params: PaginationSearchParams | None = None) -> int:
        search_params = search_params or PaginationSearchParams.model_construct()
        query = self.session.query(Post)
        query = (
            query.filter(or_(Post.title.icontains(search_params.q), Post.content.icontains(search_params.q)))
            if search_params.q
            else query
        )

        return query.count()

    def create_post(self, args: PostCreateRequest, author_id: int) -> Post:
        post = Post(
            authorId=author_id,
            title=args.title,
            content=args.content,
        )

        if args.categoryIds:
            categories = self.session.query(Category).filter(Category.id.in_(args.categoryIds)).all()
            post.categories = categories

        self.session.add(post)
        self.session.commit()
        self.session.refresh(post)

        return post

    def update_post(self, post: Post, args: PostUpdateRequest) -> None:
        post.update({k: v for k, v in args.dict().items() if k != "categoryIds"})
        if args.categoryIds is not None:
            categories = self.session.query(Category).filter(Category.id.in_(args.categoryIds)).all()
            post.categories = categories

        self.session.commit()
        self.session.refresh(post)

    def delete_post(self, post: Post) -> None:
        self.session.delete(post)
        self.session.commit()


PostRepositoryDepends = Annotated[PostRepository, Depends()]

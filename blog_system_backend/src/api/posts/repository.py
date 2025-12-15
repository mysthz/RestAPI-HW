from typing import Annotated

from fastapi import Depends

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
        query = query.filter(Post.title.icontains(search_params.q)) if search_params.q else query
        query = query.order_by(Post.title).offset(search_params.offset).limit(search_params.limit)

        return query.all()

    def count_posts(self, search_params: PaginationSearchParams | None = None) -> int:
        search_params = search_params or PaginationSearchParams.model_construct()
        query = self.session.query(Post)
        query = query.filter(Post.title.icontains(search_params.q)) if search_params.q else query

        return query.count()

    def create_post(self, args: PostCreateRequest) -> Post:
        post = Post(
            authorId=args.authorId,
            title=args.title,
            content=args.content,
        )

        self.session.add(post)
        self.session.commit()
        self.session.refresh(post)

        return post

    def update_post(self, post: Post, args: PostUpdateRequest) -> None:
        post.update(args.dict())

        self.session.commit()
        self.session.refresh(post)

    def delete_post(self, post: Post) -> None:
        self.session.delete(post)
        self.session.commit()


PostRepositoryDepends = Annotated[PostRepository, Depends()]

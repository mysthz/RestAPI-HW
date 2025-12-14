from typing import Annotated

from fastapi import Depends

from blog_system_backend.src.api.posts.models import Post
from blog_system_backend.src.api.posts.schemas import PostCreateRequest, PostUpdateRequest
from blog_system_backend.src.db.deps import SessionDepends


class PostRepository:
    def __init__(self, session: SessionDepends) -> None:
        self.session = session

    def get_post_by_id(self, id: int) -> Post | None:
        return self.session.get(Post, id)

    def get_posts(self) -> list[Post]:
        query = self.session.query(Post)
        return query.all()

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

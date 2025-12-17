from typing import Annotated

from fastapi import Depends

from blog_system_backend.src.api.categories.models import Category
from blog_system_backend.src.api.categories.schemas import CategoryCreateRequest, CategoryUpdateRequest
from blog_system_backend.src.db.deps import SessionDepends
from blog_system_backend.src.pagination import PaginationSearchParams


class CategoryRepository:
    def __init__(self, session: SessionDepends) -> None:
        self.session = session

    def get_by_id(self, id: int) -> Category | None:
        return self.session.get(Category, id)

    def get_by_title(self, title: str) -> Category | None:
        return self.session.query(Category).filter(Category.title == title).first()

    def list(self, search_params: PaginationSearchParams | None = None) -> list[Category]:
        search_params = search_params or PaginationSearchParams.model_construct()
        query = self.session.query(Category)

        query = query.filter(Category.title.icontains(search_params.q)) if search_params.q else query
        query = query.order_by(Category.title).offset(search_params.offset).limit(search_params.limit)

        return query.all()

    def count(self, search_params: PaginationSearchParams | None = None) -> int:
        search_params = search_params or PaginationSearchParams.model_construct()
        query = self.session.query(Category)
        query = query.filter(Category.title.icontains(search_params.q)) if search_params.q else query

        return query.count()

    def create(self, args: CategoryCreateRequest) -> Category:
        category = Category(title=args.title)
        self.session.add(category)
        self.session.commit()
        self.session.refresh(category)
        return category

    def update(self, category: Category, args: CategoryUpdateRequest) -> None:
        category.update(args.dict())
        self.session.commit()
        self.session.refresh(category)

    def delete(self, category: Category) -> None:
        self.session.delete(category)
        self.session.commit()


CategoryRepositoryDepends = Annotated[CategoryRepository, Depends()]

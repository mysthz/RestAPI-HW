from datetime import datetime
from typing import Annotated

from pydantic import BaseModel, EmailStr, PositiveInt, constr

from blog_system_backend.src.api.users.enums import UserRole


class UserRequest(BaseModel):
    email: EmailStr
    login: Annotated[str, constr(min_length=4, max_length=128)]
    password: Annotated[str, constr(min_length=8, max_length=70)]


class UserResponse(BaseModel):
    id: PositiveInt
    email: EmailStr
    login: Annotated[str, constr(min_length=4, max_length=128)]
    role: UserRole
    createdAt: datetime
    updatedAt: datetime

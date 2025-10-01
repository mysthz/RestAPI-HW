from datetime import datetime

from pydantic import BaseModel, PositiveInt, EmailStr, constr


class UserRequest(BaseModel):
    email: EmailStr
    login: constr(min_length=4, max_length=128)
    password: constr(min_length=8, max_length=70)


class UserResponse(BaseModel):
    id: PositiveInt
    email: EmailStr
    login: constr(min_length=4, max_length=128)
    createdAt: datetime
    updatedAt: datetime

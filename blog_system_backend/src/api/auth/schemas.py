from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, Field


class AccessTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_at: datetime


class JWT(BaseModel):
    exp: datetime | None = None
    sub: Any | None = None


class UserRegistrationConflictResponse(BaseModel):
    subject: Literal["email", "username"] = Field(
        ...,
        description=("The field that caused the conflict."),
        examples=[
            "email",
            "username",
        ],
        json_schema_extra={
            "x-enum-descriptions": [
                "The email address is already registered.",
                "The username is already taken.",
            ]
        },
    )

    message: str = Field(
        ...,
        description="Human-readable error message describing the conflict.",
        examples=[
            "The email address is already registered.",
            "The username is already taken.",
        ],
    )

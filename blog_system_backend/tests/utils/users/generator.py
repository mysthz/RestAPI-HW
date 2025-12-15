import hashlib

from blog_system_backend.src.api.users.schemas import UserRequest
from blog_system_backend.tests.utils.string import generate_str


def generate_user(login: str | None = None, password: str | None = None, email: str | None = None) -> UserRequest:
    user = UserRequest(
        login=login or generate_login(), password=password or generate_password(), email=email or generate_email()
    )

    return user


def generate_login() -> str:
    return generate_str(
        min_length=4,
        max_length=128,
        pattern="^[a-zA-Z0-9_]+$",
    )


def generate_password() -> str:
    return generate_str(
        min_length=8,
        max_length=70,
        pattern="^[a-zA-Z0-9!@#$%^&*]+$",
    )


def generate_email(domain: str = "example.com") -> str:
    username = generate_login()
    return f"{username}@{domain}"


def generate_password_hash() -> str:
    return str(hashlib.sha256())

from typing import TypedDict


class AuthLoginDict(TypedDict, total=False):
    username: str
    password: str


class AuthRegisterDict(TypedDict, total=False):
    login: str
    password: str
    email: str

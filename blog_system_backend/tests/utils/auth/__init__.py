__all__ = [
    "auth_client",
    "AuthClient",
    "AuthLoginDict",
    "AuthRegisterDict",
]

from blog_system_backend.tests.utils.auth.args import AuthLoginDict, AuthRegisterDict
from blog_system_backend.tests.utils.auth.client import AuthClient
from blog_system_backend.tests.utils.auth.fixtures import auth_client

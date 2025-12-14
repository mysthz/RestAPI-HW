__all__ = [
    "app",
]

from typer import Option, Typer

from blog_system_backend.cli.admin.service import create_superuser

app = Typer(
    name="admin",
    help="Управление админами",
)


@app.command(
    help="Создание нового админа",
)
def create(
    login: str = Option(
        None,
        "--login",
        "-u",
        prompt="Введите имя нового админа",
        help="Имя нового админа (английскими буквами без пробелов).",
    ),
    email: str = Option(
        None,
        "--email",
        "-e",
        prompt="Введите электронную почту нового админа",
        help="Электронная почта нового админа.",
    ),
    password: str = Option(
        None,
        "--password",
        "-p",
        prompt="Введите пароль нового админа",
        confirmation_prompt=True,
        hide_input=True,
        help="Пароль нового админа",
    ),
) -> None:
    create_superuser(login, email, password)

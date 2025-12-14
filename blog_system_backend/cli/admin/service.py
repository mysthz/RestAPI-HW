from typer import colors, secho

from blog_system_backend.src.api.users.repository import UserRepository
from blog_system_backend.src.api.users.schemas import UserRequest
from blog_system_backend.src.db.deps import get_session


def create_superuser(
    login: str,
    email: str,
    password: str,
) -> None:
    for session in get_session():
        user_repository = UserRepository(session=session)

        if user_repository.get_user_by_login(login):
            return secho(f"Пользователь с именем '{login}' уже существует.", fg=colors.RED)

        if user_repository.get_user_by_email(email):
            return secho(f"Пользователь с электронной почтой '{email}' уже существует.", fg=colors.RED)

        user = UserRequest(
            login=login,
            email=email,
            password=password,
        )

        try:
            user_repository.create_user(user, True)
            secho(f"Админ с именем '{login}' успешно создан.", fg=colors.GREEN)
        except Exception as exception:
            secho(f"Не удалось создать админа с именем '{login}':\n\n{exception}", fg=colors.RED)

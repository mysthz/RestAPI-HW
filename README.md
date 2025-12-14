Реализованные критерии

**Бэкенд**

- [x] Хранение данных в БД - 1 балл
- [x] Использование инструмента для миграций - 1 балл
- [x] Контейнеризация - 1 балл
- [x] CRUD-операции для всех сущностей - 2 балла
- [x] Валидация входных данных и обработка ошибок - 1 балл
- [ ] Авторизация и контроль доступа - 1 балл
- [ ] Пагинация и фильтрация постов и пользователей - 1 балл
- [ ] Использование кэширования - 1 балл
- [ ] Ролевая система контроля доступа - 1 балл
- [ ] Тестирование. Написаны unit и интеграционные тесты, тестовое покрытие больше 50% - 2 балла

Итого: 12 баллов 

**Фронтенд**

- [ ] TODO

Итого: TODO

Запуск проекта:

```bash
git clone https://github.com/mysthz/RestAPI-HW.git
```

```bash
cd RestAPI-HW
```

```bash
pip install poetry==2.2.1
```

```bash
poetry install
```

```bash
uvicorn blog_system_backend.src.app:app --reload
```

Установка хуков:
```bash
pre-commit install
```

Создание миграции
```bash
poetry run alembic revision --autogenerate -m "message"
```

Тестирование

<img src="img/post_user.png">
<img src="img/get_user.png">
<img src="img/get_user_error.png">
<img src="img/put_user_validation.png">
<img src="img/delete_user.png">
<img src="img/post_post.png">
<img src="img/get_posts.png">
<img src="img/put_post.png">
<img src="img/delete_post_validation.png">


ER-диаграмма:

<img src="img/ER-diagram.png">


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
uvicorn blog_system.src.app:app --reload
```

Установка хуков:
```bash
pre-commit install
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


FROM python:3.13-alpine

ENV POETRY_VENV=/opt/.venv
ENV POETRY_VERSION=2.2.1
ENV PATH="$POETRY_VENV/bin:$PATH"
ENV POETRY_VIRTUALENVS_CREATE=false

RUN apk add --no-cache build-base libffi-dev openssl-dev git

RUN python -m venv $POETRY_VENV \
    && $POETRY_VENV/bin/pip install poetry==${POETRY_VERSION}

WORKDIR /app

COPY pyproject.toml poetry.lock* ./

COPY . .

RUN poetry install --no-interaction --no-ansi

EXPOSE 8000

RUN poetry run alembic upgrade head

CMD ["poetry", "run", "uvicorn", "blog_system_backend.src.app:app", "--host", "0.0.0.0", "--port", "8000", "--forwarded-allow-ips=\"*\"", "--proxy-headers"]
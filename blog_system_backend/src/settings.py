from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_nested_delimiter="_",
        env_nested_max_split=1,
        env_file=(".env.example", ".env"),
        extra="ignore",
    )

    token_url: str = "api/auth/login"
    lru_cache_size: int = 128

    jwt_algorithm: str
    jwt_expire_minutes: int
    jwt_secret: str

    pagination_search_params_max_limit: int = 100


settings = Settings()  # type: ignore

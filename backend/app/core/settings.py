from pydantic_settings import BaseSettings
from typing import Optional
from pydantic import ConfigDict


class Settings(BaseSettings):
    database_url: str
    environment: str = "development"
    log_level: str = "info"

    model_config = ConfigDict(env_file=".env")


settings = Settings()
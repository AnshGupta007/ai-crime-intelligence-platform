from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "mysql+aiomysql://ksp:ksp_secure_2024@localhost:3306/crime_intelligence"
    REDIS_URL: str = "redis://localhost:6379/0"
    SECRET_KEY: str = "change-this-to-a-random-secret-key-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480
    CATALYST_PROJECT_ID: str = "45088000000013024"
    CATALYST_ENV: str = "development"

    class Config:
        env_file = ".env"


settings = Settings()

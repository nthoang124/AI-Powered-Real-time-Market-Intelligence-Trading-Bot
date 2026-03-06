import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    KAFKA_BOOTSTRAP_SERVERS = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092")
    DATABASE_URL = os.getenv(
        "DATABASE_URL", 
        "postgresql+asyncpg://postgres:postgres@localhost:5432/postgres" # Will be overridden by .env
    )
    REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")

settings = Settings()

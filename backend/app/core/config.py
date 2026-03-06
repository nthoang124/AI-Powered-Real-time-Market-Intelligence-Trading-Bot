import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Trading Bot"
    API_V1_STR: str = "/api/v1"
    
    # Supabase (PostgreSQL 17)
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres.ncmgapkkagozpllhmrfv:[YOUR_PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres")
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "https://ncmgapkkagozpllhmrfv.supabase.co")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")
    SUPABASE_JWT_SECRET: str = os.getenv("SUPABASE_JWT_SECRET", "")
    
    # Redis
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")

    class Config:
        env_file = ".env"

settings = Settings()

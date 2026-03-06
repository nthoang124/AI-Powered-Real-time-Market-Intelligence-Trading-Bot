import asyncio
import asyncpg
import sys
import os

# Add parent path trick
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from app.core.config import settings

async def run():
    url = settings.DATABASE_URL.replace("+asyncpg", "")
    conn = await asyncpg.connect(url)
    row = await conn.fetch('SELECT * FROM alembic_version')
    print("DB VERSION:", row)
    await conn.close()

asyncio.run(run())

import asyncio
import asyncpg
from app.core.config import settings

async def main():
    direct_url = "postgresql://postgres:AI-Powered-Real-time-Market-Intelligence-Trading-Bot@db.ncmgapkkagozpllhmrfv.supabase.co:5432/postgres"
    print(f"Testing direct connection to: {direct_url}")
    try:
        conn = await asyncpg.connect(direct_url)
        print("Successfully connected!")
        await conn.close()
    except Exception as e:
        print(f"Connection failed: {e}")

if __name__ == "__main__":
    asyncio.run(main())

import asyncio
from datetime import datetime
import feedparser
from sqlalchemy import select

from app.tasks.celery_app import celery_app
from app.core.database import AsyncSessionLocal
from app.models.news import NewsArticle

RSS_FEEDS = [
    "https://vnexpress.net/rss/kinh-doanh.rss",
    "https://cafef.vn/tai-chinh-quoc-te.rss",
    "https://cointelegraph.com/rss"
]

async def fetch_and_store_news():
    async with AsyncSessionLocal() as session:
        for feed_url in RSS_FEEDS:
            # Note: in a production app, feed fetching should be async (e.g., using aiohttp)
            # but feedparser is synchronous, which is fine for this MVP periodic task limit
            parsed = feedparser.parse(feed_url)
            for entry in parsed.entries[:10]: # take top 10 per feed
                url = entry.link
                # Check if exists
                stmt = select(NewsArticle).where(NewsArticle.url == url)
                result = await session.execute(stmt)
                if result.scalar_one_or_none() is None:
                    # Insert new article
                    article = NewsArticle(
                        title=entry.title,
                        source="CoinTelegraph" if "cointelegraph" in feed_url else "VNExpress/CafeF",
                        url=url,
                        published_at=datetime.utcnow(), 
                        content=entry.get('summary', '')[:2000]
                    )
                    session.add(article)
        await session.commit()

@celery_app.task
def scrape_news_task():
    # Because db operations are async, we need an event loop
    loop = asyncio.get_event_loop()
    if loop.is_closed():
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
    
    # Run the async function synchronously within the Celery worker thread
    loop.run_until_complete(fetch_and_store_news())
    return "News scraped successfully"
    
celery_app.conf.beat_schedule = {
    'scrape-news-every-5-minutes': {
        'task': 'app.tasks.news_tasks.scrape_news_task',
        'schedule': 300.0,
    },
}

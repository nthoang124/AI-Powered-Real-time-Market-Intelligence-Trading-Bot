import os
from celery import Celery
from app.core.config import settings

celery_app = Celery(
    "ai_trading_bot",
    broker=os.environ.get("CELERY_BROKER_URL", settings.REDIS_URL),
    backend=os.environ.get("CELERY_RESULT_BACKEND", settings.REDIS_URL),
    include=['app.tasks.news_tasks']
)

celery_app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    timezone='UTC',
    enable_utc=True,
)

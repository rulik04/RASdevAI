import redis.asyncio as redis
from .config import settings

redis_client = redis.Redis(
    host=settings.redis_url,
    port=settings.redis_port,
    decode_responses=True,
    username="default",
    password=settings.redis_password,
)

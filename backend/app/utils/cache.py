import json
import logging
from app.redis_client import get_redis

logger = logging.getLogger(__name__)


async def cache_get(key: str):
    try:
        r = await get_redis()
        val = await r.get(key)
        if val:
            return json.loads(val)
    except Exception as e:
        logger.warning(f"Cache get error for key '{key}': {e}")
    return None


async def cache_set(key: str, value, ttl_seconds: int):
    try:
        r = await get_redis()
        await r.setex(key, ttl_seconds, json.dumps(value, default=str))
    except Exception as e:
        logger.warning(f"Cache set error for key '{key}': {e}")


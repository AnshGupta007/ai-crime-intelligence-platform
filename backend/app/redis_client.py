import json
import logging

from app.config import settings

logger = logging.getLogger(__name__)

try:
    from catalyst.cache import Cache
    cache_instance = Cache()
    CATALYST_AVAILABLE = True
except ImportError:
    CATALYST_AVAILABLE = False
    cache_instance = None


async def get_cache() -> "Cache | None":
    if CATALYST_AVAILABLE:
        return cache_instance
    return None


async def close_redis():
    pass


async def cache_get(key: str):
    try:
        if CATALYST_AVAILABLE:
            val = cache_instance.get(key)
            if val:
                return json.loads(val)
    except Exception as e:
        logger.warning(f"Cache get error for key '{key}': {e}")
    return None


async def cache_set(key: str, value, ttl_seconds: int):
    try:
        if CATALYST_AVAILABLE:
            cache_instance.put(key, json.dumps(value, default=str), ttl_seconds)
    except Exception as e:
        logger.warning(f"Cache set error for key '{key}': {e}")

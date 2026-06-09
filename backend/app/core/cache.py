"""
In-memory and Redis-ready cache wrapper with TTL expiration.
"""
import time
from typing import Any, Optional, Dict

class SimpleTTLCache:
    def __init__(self, default_ttl_seconds: int = 900):
        self._cache: Dict[str, Dict[str, Any]] = {}
        self.default_ttl = default_ttl_seconds

    def get(self, key: str) -> Optional[Any]:
        item = self._cache.get(key)
        if not item:
            return None
        if time.time() > item["expires_at"]:
            del self._cache[key]
            return None
        return item["value"]

    def set(self, key: str, value: Any, ttl_seconds: Optional[int] = None) -> None:
        ttl = ttl_seconds if ttl_seconds is not None else self.default_ttl
        self._cache[key] = {
            "value": value,
            "expires_at": time.time() + ttl
        }

    def clear(self) -> None:
        self._cache.clear()

deal_cache = SimpleTTLCache(default_ttl_seconds=900)  # 15 min TTL

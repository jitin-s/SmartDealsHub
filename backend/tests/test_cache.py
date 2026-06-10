"""
Unit tests for SimpleTTLCache expiration and eviction.
"""
import unittest
import time
from app.core.cache import SimpleTTLCache

class TestTTLCache(unittest.TestCase):
    def test_cache_set_and_get(self):
        c = SimpleTTLCache(default_ttl_seconds=10)
        c.set("item1", {"price": 999})
        self.assertEqual(c.get("item1"), {"price": 999})

    def test_cache_expiration(self):
        c = SimpleTTLCache(default_ttl_seconds=1)
        c.set("temp", "fast_expire", ttl_seconds=1)
        time.sleep(1.1)
        self.assertIsNone(c.get("temp"))

if __name__ == "__main__":
    unittest.main()

"""
Unit tests for dead link indicators and coupon expiration flags.
"""
import unittest
from app.services.link_validator import inspect_coupon_validity, detect_dead_link_indicators

class TestLinkValidator(unittest.TestCase):
    def test_coupon_expiration(self):
        past = "2025-01-01T00:00:00Z"
        res = inspect_coupon_validity("SAVE50", past)
        self.assertTrue(res["is_expired"])
        self.assertFalse(res["is_valid"])

    def test_dead_link_signals(self):
        self.assertTrue(detect_dead_link_indicators("Oops, page not found on Amazon", 200))
        self.assertTrue(detect_dead_link_indicators("", 404))
        self.assertFalse(detect_dead_link_indicators("In stock. Free Prime delivery", 200))

if __name__ == "__main__":
    unittest.main()

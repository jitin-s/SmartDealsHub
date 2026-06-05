"""
Unit tests for affiliate builder and query parameter sanitization.
"""
import unittest
from app.services.affiliate import sanitize_url, build_affiliate_url

class TestAffiliateService(unittest.TestCase):
    def test_strip_tracking_params(self):
        dirty = "https://www.amazon.in/dp/B0D9BDL9C9?fbclid=12345&gclid=67890&utm_source=old"
        cleaned = sanitize_url(dirty)
        self.assertNotIn("fbclid", cleaned)
        self.assertNotIn("gclid", cleaned)

    def test_build_amazon_affiliate_url(self):
        url = "https://www.amazon.in/dp/B0D9BDL9C9"
        res = build_affiliate_url(url, utm_source="newsletter")
        self.assertIn("tag=smartdeals-21", res)
        self.assertIn("utm_source=newsletter", res)
        self.assertIn("utm_medium=deals_feed", res)

    def test_build_flipkart_affiliate_url(self):
        url = "https://www.flipkart.com/p/itm123456"
        res = build_affiliate_url(url)
        self.assertIn("affid=smartdealshub", res)

if __name__ == "__main__":
    unittest.main()

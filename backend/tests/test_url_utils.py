"""
Unit tests for platform identification and Croma SKU extraction.
"""
import unittest
from app.scraper.url_utils import identify_platform, extract_croma_product_id

class TestUrlUtils(unittest.TestCase):
    def test_identify_platform(self):
        self.assertEqual(identify_platform("https://www.amazon.in/dp/B001"), "amazon")
        self.assertEqual(identify_platform("https://www.flipkart.com/p/itm1"), "flipkart")
        self.assertEqual(identify_platform("https://www.croma.com/p/12345"), "croma")

    def test_extract_croma_sku(self):
        self.assertEqual(extract_croma_product_id("https://www.croma.com/product/p/264264"), "264264")

if __name__ == "__main__":
    unittest.main()

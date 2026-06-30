"""
Unit tests for price normalization and currency mapping helpers.
"""
import unittest
from app.scraper.parsers import clean_price, normalize_currency_symbol

class TestPriceNormalization(unittest.TestCase):
    def test_clean_price_inr(self):
        self.assertEqual(clean_price("₹1,499.00"), 1499.0)
        self.assertEqual(clean_price("₹ 999"), 999.0)
        self.assertEqual(clean_price("₹45,999.50"), 45999.5)

    def test_clean_price_usd_and_eur(self):
        self.assertEqual(clean_price("$29.99"), 29.99)
        self.assertEqual(clean_price("€ 149.00"), 149.0)
        self.assertEqual(clean_price("£89.95"), 89.95)

    def test_currency_symbol_normalization(self):
        self.assertEqual(normalize_currency_symbol("₹"), "INR")
        self.assertEqual(normalize_currency_symbol("$"), "USD")
        self.assertEqual(normalize_currency_symbol("€"), "EUR")
        self.assertEqual(normalize_currency_symbol("£"), "GBP")

if __name__ == "__main__":
    unittest.main()

def test_calculate_discount_metrics(self):
        from app.scraper.parsers import calculate_discount_metrics
        res = calculate_discount_metrics(1000.0, 750.0)
        self.assertEqual(res["savings_delta"], 250.0)
        self.assertEqual(res["discount_pct"], 25.0)
        self.assertTrue(res["is_deal"])

        no_discount = calculate_discount_metrics(500.0, 500.0)
        self.assertEqual(no_discount["savings_delta"], 0.0)
        self.assertEqual(no_discount["discount_pct"], 0.0)
        self.assertFalse(no_discount["is_deal"])

def test_bot_challenge_detection(self):
        from app.scraper.parsers import is_bot_challenge_page
        captcha_html = "<html><body>Enter the characters you see below</body></html>"
        self.assertTrue(is_bot_challenge_page(captcha_html))
        normal_html = "<html><body>Product Title: Sony WH-1000XM5</body></html>"
        self.assertFalse(is_bot_challenge_page(normal_html))

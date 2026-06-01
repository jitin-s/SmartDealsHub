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

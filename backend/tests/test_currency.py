"""
Unit tests for multi-currency conversion.
"""
import unittest
from app.services.currency import convert_currency

class TestCurrencyConverter(unittest.TestCase):
    def test_usd_to_inr_conversion(self):
        inr = convert_currency(10.0, "USD", "INR")
        self.assertEqual(inr, 835.0)

    def test_same_currency(self):
        self.assertEqual(convert_currency(1500.0, "INR", "INR"), 1500.0)

if __name__ == "__main__":
    unittest.main()

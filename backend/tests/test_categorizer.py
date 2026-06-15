"""
Unit tests for store categorizer.
"""
import unittest
from app.services.categorizer import infer_product_category

class TestCategorizer(unittest.TestCase):
    def test_electronics_detection(self):
        self.assertEqual(infer_product_category("Apple MacBook Air M3"), "Electronics")
        self.assertEqual(infer_product_category("Sony WH-1000XM5 Noise Canceling Headphone"), "Electronics")

    def test_fashion_and_home_detection(self):
        self.assertEqual(infer_product_category("Men Slim Fit Denim Jeans"), "Fashion")
        self.assertEqual(infer_product_category("Philips Air Purifier for Home"), "Home & Kitchen")

if __name__ == "__main__":
    unittest.main()

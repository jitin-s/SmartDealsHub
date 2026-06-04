"""
Unit tests for price drop threshold evaluation and historical extremes.
"""
import unittest
from app.services.price_tracker import evaluate_price_drop, compute_historical_extremes

class TestPriceTracker(unittest.TestCase):
    def test_percentage_drop_trigger(self):
        # 25% drop triggers standard 20% threshold
        res = evaluate_price_drop(current_price=750.0, previous_price=1000.0, percentage_threshold=20.0)
        self.assertTrue(res["should_alert"])
        self.assertEqual(res["drop_percentage"], 25.0)
        self.assertTrue(res["hit_threshold"])

    def test_target_price_trigger(self):
        # Dropped to 890 with target 900
        res = evaluate_price_drop(current_price=890.0, previous_price=950.0, target_price=900.0, percentage_threshold=20.0)
        self.assertTrue(res["should_alert"])
        self.assertTrue(res["hit_target"])

    def test_historical_extremes_calculation(self):
        history = [1200.0, 1100.0, 1300.0, 950.0]
        stats = compute_historical_extremes(history)
        self.assertEqual(stats["lowest"], 950.0)
        self.assertEqual(stats["highest"], 1300.0)
        self.assertTrue(stats["is_lowest_ever"])
        self.assertEqual(stats["record_count"], 4)

if __name__ == "__main__":
    unittest.main()

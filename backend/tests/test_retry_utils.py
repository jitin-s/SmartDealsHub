"""
Unit tests for retry backoff handler.
"""
import unittest
from app.scraper.retry_utils import retry_with_backoff

class TestRetryUtils(unittest.TestCase):
    def test_successful_first_call(self):
        @retry_with_backoff(max_retries=3, initial_delay=0.01)
        def succeeds():
            return "ok"
        self.assertEqual(succeeds(), "ok")

    def test_retry_on_failure_then_succeed(self):
        attempts = 0
        @retry_with_backoff(max_retries=3, initial_delay=0.01)
        def fail_once():
            nonlocal attempts
            attempts += 1
            if attempts == 1:
                raise ConnectionError("Temporary glitch")
            return "recovered"
        self.assertEqual(fail_once(), "recovered")
        self.assertEqual(attempts, 2)

if __name__ == "__main__":
    unittest.main()

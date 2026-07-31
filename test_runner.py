"""
Comprehensive test runner validating all test modules.
"""
import os
import sys
import unittest

# Ensure backend package is in python import path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "backend")))

def run_all_tests():
    loader = unittest.TestLoader()
    suite = loader.discover("backend/tests", pattern="test_*.py")
    runner = unittest.TextTestRunner(verbosity=2)
    res = runner.run(suite)
    return res.wasSuccessful()

if __name__ == "__main__":
    success = run_all_tests()
    exit(0 if success else 1)

import time

def retry_with_backoff(max_retries: int = 3, initial_delay: float = 0.5, backoff_factor: float = 2.0):
    """Decorator providing exponential backoff for resilient network requests."""
    def decorator(func):
        def wrapper(*args, **kwargs):
            delay = initial_delay
            last_err = None
            for attempt in range(max_retries):
                try:
                    return func(*args, **kwargs)
                except Exception as exc:
                    last_err = exc
                    if attempt == max_retries - 1:
                        raise
                    time.sleep(delay)
                    delay *= backoff_factor
            return None
        return wrapper
    return decorator

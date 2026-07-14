"""
Price tracking threshold calculation and drop evaluation utilities.
"""
from typing import List, Dict, Any, Optional

def evaluate_price_drop(
    current_price: float,
    previous_price: float,
    target_price: Optional[float] = None,
    percentage_threshold: float = 20.0
) -> Dict[str, Any]:
    """
    Evaluates whether an item has triggered a price drop threshold.
    Alerts if:
    1. current_price <= target_price (if target_price is configured), OR
    2. percentage drop >= percentage_threshold (e.g. >= 20% drop)
    """
    if previous_price <= 0:
        return {"should_alert": False, "drop_percentage": 0.0, "reason": "No previous price"}

    delta = previous_price - current_price
    drop_pct = round((delta / previous_price) * 100.0, 2)

    hit_target = target_price is not None and current_price <= target_price
    hit_threshold = drop_pct >= percentage_threshold

    reasons = []
    if hit_target:
        reasons.append(f"Reached user target price of {target_price}")
    if hit_threshold:
        reasons.append(f"Dropped {drop_pct}% (threshold: {percentage_threshold}%)")

    return {
        "should_alert": hit_target or hit_threshold,
        "drop_percentage": drop_pct,
        "delta": round(delta, 2),
        "hit_target": hit_target,
        "hit_threshold": hit_threshold,
        "reasons": reasons
    }

def compute_historical_extremes(price_history: List[float]) -> Dict[str, Any]:
    """
    Computes all-time lowest, highest, average, and price volatility
    from a sequence of recorded prices.
    """
    valid_prices = [p for p in price_history if p > 0]
    if not valid_prices:
        return {
            "lowest": 0.0,
            "highest": 0.0,
            "average": 0.0,
            "is_lowest_ever": False,
            "record_count": 0
        }

    lowest = min(valid_prices)
    highest = max(valid_prices)
    avg = round(sum(valid_prices) / len(valid_prices), 2)
    latest = valid_prices[-1]

    return {
        "lowest": lowest,
        "highest": highest,
        "average": avg,
        "is_lowest_ever": latest <= lowest,
        "discount_from_peak": round(((highest - latest) / highest) * 100.0, 1) if highest > 0 else 0.0,
        "record_count": len(valid_prices)
    }

def calculate_price_meter_score(current: float, lowest: float, highest: float) -> int:
    """Computes BuyHatke-style 0-100 price meter score (100 = best steal price)."""
    if highest <= lowest or current <= 0:
        return 75
    # Normalize between lowest (100) and highest (0)
    ratio = (highest - current) / (highest - lowest)
    return max(0, min(100, int(ratio * 100)))

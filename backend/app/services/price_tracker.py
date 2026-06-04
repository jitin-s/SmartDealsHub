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

"""
Health check detectors for product listing availability and promo code status.
"""
from typing import Dict, Any
from datetime import datetime, timezone

def inspect_coupon_validity(coupon_code: str, expiry_date: str) -> Dict[str, Any]:
    """Checks coupon expiration against current UTC date."""
    try:
        exp_dt = datetime.fromisoformat(expiry_date.replace("Z", "+00:00"))
        now = datetime.now(timezone.utc)
        is_expired = now > exp_dt
        return {
            "code": coupon_code,
            "is_valid": not is_expired,
            "is_expired": is_expired,
            "expires_at": expiry_date
        }
    except Exception:
        return {"code": coupon_code, "is_valid": True, "is_expired": False, "note": "Unparsed date"}

def detect_dead_link_indicators(html_content: str, status_code: int) -> bool:
    """Detects whether product page is 404 or discontinued."""
    if status_code in (404, 410):
        return True
    content_lower = html_content.lower()
    dead_signals = [
        "page not found",
        "looking for something that isn't here",
        "currently unavailable",
        "item is no longer available",
        "product is out of stock"
    ]
    return any(signal in content_lower for signal in dead_signals)

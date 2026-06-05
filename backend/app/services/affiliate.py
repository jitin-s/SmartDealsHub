"""
Affiliate redirect builder and destination URL sanitization utilities.
"""
import re
from urllib.parse import urlparse, parse_qs, urlencode, urlunparse
from typing import Dict, Optional

# Supported affiliate tags by platform
DEFAULT_AFFILIATE_TAGS = {
    "amazon.in": {"tag": "smartdeals-21"},
    "amazon.com": {"tag": "smartdeals-20"},
    "flipkart.com": {"affid": "smartdealshub"}
}

def sanitize_url(url: str) -> str:
    """Removes tracking bloat and unneeded transient parameters."""
    parsed = urlparse(url)
    clean_qs = parse_qs(parsed.query)
    # Strip unnecessary third-party click identifiers
    keys_to_remove = ["fbclid", "gclid", "msclkid", "_ga", "ref_", "ref_src", "ascsubtag", "camp", "creative"]
    for k in keys_to_remove:
        clean_qs.pop(k, None)
    
    new_query = urlencode({k: v[0] for k, v in clean_qs.items()})
    return urlunparse((parsed.scheme, parsed.netloc, parsed.path, parsed.params, new_query, parsed.fragment))

def build_affiliate_url(
    original_url: str,
    utm_source: str = "smartdealshub",
    utm_medium: str = "deals_feed",
    custom_tag: Optional[str] = None
) -> str:
    """
    Appends platform-specific affiliate tags and standard UTM attribution.
    """
    sanitized = sanitize_url(original_url)
    parsed = urlparse(sanitized)
    qs = parse_qs(parsed.query)
    query_dict = {k: v[0] for k, v in qs.items()}

    # Inject UTM parameters
    query_dict["utm_source"] = utm_source
    query_dict["utm_medium"] = utm_medium

    # Inject affiliate tag
    host = parsed.netloc.lower().replace("www.", "")
    if "amazon." in host:
        tag_val = custom_tag or ("smartdeals-21" if ".in" in host else "smartdeals-20")
        query_dict["tag"] = tag_val
    elif "flipkart." in host:
        query_dict["affid"] = custom_tag or "smartdealshub"

    new_query = urlencode(query_dict)
    return urlunparse((parsed.scheme, parsed.netloc, parsed.path, parsed.params, new_query, parsed.fragment))

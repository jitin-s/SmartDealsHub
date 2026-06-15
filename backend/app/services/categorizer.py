"""
Category inference and metadata tagging based on title and marketplace breadcrumbs.
"""
from typing import List

CATEGORY_RULES = {
    "Electronics": ["laptop", "phone", "iphone", "headphone", "audio", "macbook", "charger", "monitor", "tv"],
    "Fashion": ["shirt", "jeans", "shoes", "jacket", "dress", "sneakers", "watch"],
    "Home & Kitchen": ["cooker", "blender", "pan", "bed", "sofa", "vacuum", "purifier", "kettle"],
    "Travel": ["backpack", "luggage", "suitcase", "travel adapter", "pillow"]
}

def infer_product_category(title: str, default: str = "Electronics") -> str:
    """Infers top-level category from product title keywords."""
    title_lower = title.lower()
    for cat, keywords in CATEGORY_RULES.items():
        if any(kw in title_lower for kw in keywords):
            return cat
    return default

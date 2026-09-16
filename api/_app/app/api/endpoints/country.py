from fastapi import APIRouter
from typing import List, Dict, Any

router = APIRouter()

SUPPORTED_COUNTRIES = [
    {
        "code": "IN",
        "name": "India",
        "flag": "🇮🇳",
        "currency": "INR",
        "currency_symbol": "₹",
        "usd_rate": 86.5,
        "shopping_platforms": ["Amazon.in", "Flipkart", "Croma", "Myntra", "Reliance Digital"],
        "quick_commerce": ["Blinkit", "Zepto", "Swiggy Instamart", "BigBasket"],
        "popular_tlds": [".in", ".co.in", ".com", ".ai", ".io"]
    },
    {
        "code": "US",
        "name": "United States",
        "flag": "🇺🇸",
        "currency": "USD",
        "currency_symbol": "$",
        "usd_rate": 1.0,
        "shopping_platforms": ["Amazon.com", "Walmart", "Best Buy", "Target", "eBay"],
        "quick_commerce": ["Instacart", "DoorDash", "Amazon Fresh", "Uber Eats"],
        "popular_tlds": [".com", ".net", ".org", ".io", ".ai", ".co"]
    },
    {
        "code": "UK",
        "name": "United Kingdom",
        "flag": "🇬🇧",
        "currency": "GBP",
        "currency_symbol": "£",
        "usd_rate": 0.79,
        "shopping_platforms": ["Amazon.co.uk", "Argos", "Currys", "John Lewis"],
        "quick_commerce": ["Deliveroo Hop", "Getir", "Gopuff"],
        "popular_tlds": [".co.uk", ".uk", ".com", ".io"]
    },
    {
        "code": "CA",
        "name": "Canada",
        "flag": "🇨🇦",
        "currency": "CAD",
        "currency_symbol": "CA$",
        "usd_rate": 1.41,
        "shopping_platforms": ["Amazon.ca", "Best Buy Canada", "Canadian Tire", "Walmart CA"],
        "quick_commerce": ["Instacart CA", "SkipTheDishes"],
        "popular_tlds": [".ca", ".com", ".org"]
    }
]

@router.get("/", response_model=List[Dict[str, Any]])
async def get_countries():
    return SUPPORTED_COUNTRIES

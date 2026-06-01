from fastapi import APIRouter, Query, Body
from typing import List, Optional, Dict, Any
from app.services.services_hub import services_hub

router = APIRouter()

@router.get("/ai")
async def get_ai_services(currency: str = Query("USD")):
    return {
        "subscriptions": services_hub.get_ai_subscriptions(currency=currency),
        "api_token_board": services_hub.get_ai_token_board()
    }

@router.get("/vps")
async def get_vps_services(currency: str = Query("USD")):
    return {
        "providers": services_hub.get_cloud_vps(currency=currency)
    }

@router.get("/vpn")
async def get_vpn_services():
    return {
        "providers": services_hub.get_vpn_providers()
    }

@router.get("/streaming")
async def get_streaming_services():
    return {
        "bundles": services_hub.get_streaming_bundles()
    }

@router.post("/grocery/basket")
async def calculate_grocery_basket(selected_indices: Optional[List[int]] = Body(None)):
    return services_hub.calculate_grocery_basket(selected_indices=selected_indices)

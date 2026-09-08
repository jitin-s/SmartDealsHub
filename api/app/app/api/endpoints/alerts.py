from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from typing import List, Dict, Any
from datetime import datetime, timezone
from pydantic import BaseModel, EmailStr

from app.db.database import get_db
from app.db.models import PriceAlert, Product
from app.services.alert_service import alert_service

router = APIRouter()

class AlertSubscribeRequest(BaseModel):
    product_id: int
    user_email: EmailStr
    target_price: float
    currency: str = "INR"

@router.post("/subscribe")
async def subscribe_alert(payload: AlertSubscribeRequest, db: AsyncSession = Depends(get_db)):
    # Verify product exists
    prod_res = await db.execute(select(Product).where(Product.id == payload.product_id))
    product = prod_res.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    alert = PriceAlert(
        product_id=payload.product_id,
        user_email=payload.user_email,
        target_price=payload.target_price,
        currency=payload.currency,
        is_active=True
    )
    db.add(alert)
    await db.commit()
    await db.refresh(alert)

    # Check if target is already met or close
    curr_sym = "₹" if payload.currency == "INR" else "$"
    
    return {
        "message": f"Successfully subscribed to price drop alerts for '{product.title[:40]}...'",
        "alert_id": alert.id,
        "product_title": product.title,
        "current_price": product.current_price,
        "target_price": alert.target_price,
        "user_email": alert.user_email
    }

@router.get("/")
async def list_alerts(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(PriceAlert, Product)
        .join(Product, PriceAlert.product_id == Product.id)
        .order_by(desc(PriceAlert.created_at))
    )
    rows = result.all()
    output = []
    for alert, product in rows:
        output.append({
            "id": alert.id,
            "product_id": product.id,
            "product_title": product.title,
            "product_image": product.image_url,
            "platform": product.platform,
            "current_price": product.current_price,
            "target_price": alert.target_price,
            "currency": alert.currency,
            "user_email": alert.user_email,
            "is_active": alert.is_active,
            "is_triggered": alert.is_triggered,
            "created_at": alert.created_at.isoformat()
        })
    return output

@router.post("/test-trigger/{alert_id}")
async def test_trigger_alert(alert_id: int, db: AsyncSession = Depends(get_db)):
    """
    Test endpoint: manually simulates a price drop trigger and sends/logs the notification email
    """
    result = await db.execute(
        select(PriceAlert, Product)
        .join(Product, PriceAlert.product_id == Product.id)
        .where(PriceAlert.id == alert_id)
    )
    row = result.first()
    if not row:
        raise HTTPException(status_code=404, detail="Alert not found")

    alert, product = row
    curr_sym = "₹" if product.currency == "INR" else "$"

    log_entry = await alert_service.send_price_drop_email(
        recipient_email=alert.user_email,
        product_title=product.title,
        platform=product.platform,
        old_price=product.original_mrp or (product.current_price * 1.15),
        new_price=alert.target_price - 100 if alert.target_price > 100 else alert.target_price * 0.9,
        target_price=alert.target_price,
        currency_symbol=curr_sym,
        product_url=product.product_url,
        image_url=product.image_url or ""
    )

    alert.is_triggered = True
    alert.triggered_at = datetime.now(timezone.utc)
    await db.commit()

    return {
        "status": "success",
        "message": f"Simulated price drop alert delivered to {alert.user_email}",
        "log": log_entry
    }

@router.get("/logs")
async def get_alert_logs():
    return alert_service.get_sent_alerts()

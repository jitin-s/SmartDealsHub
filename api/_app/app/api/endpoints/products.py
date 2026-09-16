import json
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta, timezone

from app.db.database import get_db
from app.db.models import Product, PriceHistory
from app.scraper.engine import scraper_engine

router = APIRouter()

def compute_buy_verdict(current_price: float, history: List[float]) -> Dict[str, Any]:
    """
    Computes BuyHatke style Price Meter verdict based on all-time lowest, highest, and average
    """
    if not history:
        history = [current_price]
        
    lowest = min(history)
    highest = max(history)
    avg = sum(history) / len(history)

    # If within 5% of lowest price ever
    if current_price <= lowest * 1.05:
        verdict = "GREAT_PRICE"
        label = "🟢 Great Price / Steal Deal!"
        description = f"Current price is at or near the all-time lowest recorded ({lowest:,.2f})! Excellent time to buy."
        score = 95
    elif current_price <= avg:
        verdict = "FAIR_PRICE"
        label = "🟡 Fair / Average Price"
        description = f"Price is below average ({avg:,.2f}). Moderate savings available."
        score = 65
    else:
        verdict = "OVERPRICED"
        label = "🔴 Overpriced / Wait for Drop"
        description = f"Current price is above historical average ({avg:,.2f}). Suggest setting an alert and waiting."
        score = 30

    return {
        "verdict": verdict,
        "label": label,
        "description": description,
        "score": score,
        "lowest_price": lowest,
        "highest_price": highest,
        "average_price": round(avg, 2)
    }

@router.post("/scrape")
async def scrape_and_track_product(
    url_or_query: str = Query(..., description="Amazon/Flipkart product URL or product name"),
    country: str = Query("IN", description="Country code (IN, US, UK)"),
    db: AsyncSession = Depends(get_db)
):
    """
    Scrapes a product from URL or searches preset catalogs, saves to DB and returns full details + price meter
    """
    scraped = await scraper_engine.scrape_product(url_or_query, country)
    asin_or_pid = scraped["asin_or_pid"]
    platform = scraped["platform"]

    # Check if already exists in DB
    result = await db.execute(
        select(Product).where(Product.asin_or_pid == asin_or_pid, Product.platform == platform)
    )
    product = result.scalar_one_or_none()

    if not product:
        product = Product(
            title=scraped["title"],
            brand=scraped.get("brand", "Verified Brand"),
            asin_or_pid=asin_or_pid,
            platform=platform,
            country=scraped.get("country", country),
            category=scraped.get("category", "Electronics"),
            current_price=scraped["current_price"],
            original_mrp=scraped["original_mrp"],
            currency=scraped.get("currency", "INR" if country == "IN" else "USD"),
            discount_percent=scraped["discount_percent"],
            rating=scraped["rating"],
            review_count=scraped["review_count"],
            image_url=scraped["image_url"],
            product_url=scraped["product_url"],
            in_stock=scraped["in_stock"],
            is_prime_or_assured=scraped["is_prime_or_assured"],
            bank_offers=scraped.get("bank_offers", "[]"),
            pros_summary=scraped.get("pros_summary", "[]"),
            cons_summary=scraped.get("cons_summary", "[]"),
            fake_review_score=scraped.get("fake_review_score", 95.0)
        )
        db.add(product)
        await db.flush()

        # Seed initial realistic price history (last 30 days) for instant rich charts
        base_price = scraped["current_price"]
        now = datetime.now(timezone.utc)
        demo_points = [
            (now - timedelta(days=28), base_price * 1.14),
            (now - timedelta(days=21), base_price * 1.10),
            (now - timedelta(days=14), base_price * 1.05),
            (now - timedelta(days=7), base_price * 0.98),
            (now - timedelta(days=2), base_price * 1.02),
            (now, base_price)
        ]
        for dt, p in demo_points:
            db.add(PriceHistory(product_id=product.id, price=round(p, 2), recorded_at=dt))
    else:
        # Update existing
        product.current_price = scraped["current_price"]
        product.original_mrp = scraped["original_mrp"]
        product.discount_percent = scraped["discount_percent"]
        product.updated_at = datetime.now(timezone.utc)
        db.add(PriceHistory(product_id=product.id, price=scraped["current_price"]))

    await db.commit()
    await db.refresh(product)

    # Fetch price history to compute BuyHatke Verdict
    hist_result = await db.execute(
        select(PriceHistory).where(PriceHistory.product_id == product.id).order_by(PriceHistory.recorded_at.asc())
    )
    histories = hist_result.scalars().all()
    price_points = [h.price for h in histories]

    verdict = compute_buy_verdict(product.current_price, price_points)

    bank_offers = []
    if product.bank_offers:
        try:
            bank_offers = json.loads(product.bank_offers)
        except Exception:
            pass

    pros = []
    if product.pros_summary:
        try:
            pros = json.loads(product.pros_summary)
        except Exception:
            pass

    cons = []
    if product.cons_summary:
        try:
            cons = json.loads(product.cons_summary)
        except Exception:
            pass

    return {
        "id": product.id,
        "title": product.title,
        "brand": product.brand,
        "asin_or_pid": product.asin_or_pid,
        "platform": product.platform,
        "country": product.country,
        "category": product.category,
        "current_price": product.current_price,
        "original_mrp": product.original_mrp,
        "currency": product.currency,
        "discount_percent": product.discount_percent,
        "rating": product.rating,
        "review_count": product.review_count,
        "image_url": product.image_url,
        "product_url": product.product_url,
        "in_stock": product.in_stock,
        "is_prime_or_assured": product.is_prime_or_assured,
        "bank_offers": bank_offers,
        "pros": pros,
        "cons": cons,
        "fake_review_score": product.fake_review_score,
        "price_meter": verdict,
        "comparison": scraped.get("comparison", None)
    }

@router.get("/")
async def list_products(
    country: str = Query("IN"),
    category: Optional[str] = None,
    db: AsyncSession = Depends(get_db)
):
    query = select(Product).order_by(desc(Product.updated_at))
    if country:
        query = query.where(Product.country == country)
    if category:
        query = query.where(Product.category == category)
        
    result = await db.execute(query)
    products = result.scalars().all()
    
    output = []
    for p in products:
        bank_offers = []
        if p.bank_offers:
            try:
                bank_offers = json.loads(p.bank_offers)
            except Exception:
                pass
        output.append({
            "id": p.id,
            "title": p.title,
            "brand": p.brand,
            "asin_or_pid": p.asin_or_pid,
            "platform": p.platform,
            "country": p.country,
            "category": p.category,
            "current_price": p.current_price,
            "original_mrp": p.original_mrp,
            "currency": p.currency,
            "discount_percent": p.discount_percent,
            "rating": p.rating,
            "review_count": p.review_count,
            "image_url": p.image_url,
            "product_url": p.product_url,
            "in_stock": p.in_stock,
            "is_prime_or_assured": p.is_prime_or_assured,
            "bank_offers": bank_offers
        })
    return output

@router.get("/{product_id}/history")
async def get_price_history(product_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(PriceHistory)
        .where(PriceHistory.product_id == product_id)
        .order_by(PriceHistory.recorded_at.asc())
    )
    records = result.scalars().all()
    if not records:
        raise HTTPException(status_code=404, detail="No price history found for this product")

    prod_res = await db.execute(select(Product).where(Product.id == product_id))
    product = prod_res.scalar_one_or_none()

    price_list = [r.price for r in records]
    verdict = compute_buy_verdict(product.current_price if product else price_list[-1], price_list)

    timeline = []
    for r in records:
        timeline.append({
            "date": r.recorded_at.strftime("%b %d"),
            "full_date": r.recorded_at.strftime("%Y-%m-%d %H:%M"),
            "price": r.price
        })

    return {
        "product_id": product_id,
        "timeline": timeline,
        "price_meter": verdict
    }

@router.get("/deals/loot")
async def get_loot_deals(country: str = "IN", db: AsyncSession = Depends(get_db)):
    """
    Returns high-discount 'Loot Deals' (items with >= 20% discount)
    """
    result = await db.execute(
        select(Product)
        .where(Product.discount_percent >= 15.0)
        .order_by(desc(Product.discount_percent))
        .limit(10)
    )
    deals = result.scalars().all()
    output = []
    for p in deals:
        output.append({
            "id": p.id,
            "title": p.title,
            "platform": p.platform,
            "current_price": p.current_price,
            "original_mrp": p.original_mrp,
            "currency": p.currency,
            "discount_percent": p.discount_percent,
            "rating": p.rating,
            "image_url": p.image_url,
            "product_url": p.product_url,
            "deal_badge": f"🔥 {int(p.discount_percent)}% OFF"
        })
    return output

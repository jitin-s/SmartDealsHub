import json
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta, timezone

from app.core.config import settings
from app.db.database import engine, Base, AsyncSessionLocal
from app.db.models import Product, PriceHistory, PriceAlert
from app.core.scheduler import start_scheduler, stop_scheduler
from app.api.api_router import api_router
from app.core.presets import CATALOG_PRESETS

async def seed_initial_catalog():
    async with AsyncSessionLocal() as session:
        # Check if products exist
        from sqlalchemy import select
        res = await session.execute(select(Product))
        existing = res.scalars().all()
        if existing:
            return

        now = datetime.now(timezone.utc)
        for item in CATALOG_PRESETS:
            amz = item["amazon"]
            flp = item["flipkart"]
            
            # Add Amazon listing
            disc_amz = round(((amz["mrp"] - amz["price"]) / amz["mrp"]) * 100, 1)
            p_amz = Product(
                title=item["title"],
                brand=item["brand"],
                asin_or_pid=amz["asin"],
                platform="amazon",
                country="IN",
                category=item["category"],
                current_price=amz["price"],
                original_mrp=amz["mrp"],
                currency="INR",
                discount_percent=disc_amz,
                rating=amz["rating"],
                review_count=amz["reviews"],
                image_url=amz["image"],
                product_url=amz["url"],
                in_stock=True,
                is_prime_or_assured=True,
                bank_offers=json.dumps(amz["bank_offers"]),
                pros_summary=json.dumps(amz["pros"]),
                cons_summary=json.dumps(amz["cons"]),
                fake_review_score=97.0
            )
            session.add(p_amz)
            await session.flush()

            # Seed 30 days price history for rich BuyHatke graphs
            base_p = amz["price"]
            hist_points = [
                (now - timedelta(days=30), round(base_p * 1.15, 2)),
                (now - timedelta(days=22), round(base_p * 1.11, 2)),
                (now - timedelta(days=15), round(base_p * 1.08, 2)),
                (now - timedelta(days=9), round(base_p * 1.04, 2)),
                (now - timedelta(days=4), round(base_p * 0.99, 2)),
                (now, base_p)
            ]
            for dt, p in hist_points:
                session.add(PriceHistory(product_id=p_amz.id, price=p, recorded_at=dt))

            # Add sample price alert for demo
            if amz["asin"] == "B09XS7JWHH":
                session.add(PriceAlert(
                    product_id=p_amz.id,
                    user_email="demo.shopper@gmail.com",
                    target_price=25000.0,
                    currency="INR",
                    is_active=True
                ))

            # Add Flipkart listing
            disc_flp = round(((flp["mrp"] - flp["price"]) / flp["mrp"]) * 100, 1)
            p_flp = Product(
                title=item["title"],
                brand=item["brand"],
                asin_or_pid=flp["asin"],
                platform="flipkart",
                country="IN",
                category=item["category"],
                current_price=flp["price"],
                original_mrp=flp["mrp"],
                currency="INR",
                discount_percent=disc_flp,
                rating=flp["rating"],
                review_count=flp["reviews"],
                image_url=flp["image"],
                product_url=flp["url"],
                in_stock=True,
                is_prime_or_assured=True,
                bank_offers=json.dumps(flp["bank_offers"]),
                pros_summary=json.dumps(flp["pros"]),
                cons_summary=json.dumps(flp["cons"]),
                fake_review_score=95.5
            )
            session.add(p_flp)
            await session.flush()

            flp_base = flp["price"]
            for dt, p in [
                (now - timedelta(days=30), round(flp_base * 1.12, 2)),
                (now - timedelta(days=18), round(flp_base * 1.07, 2)),
                (now - timedelta(days=6), round(flp_base * 1.03, 2)),
                (now, flp_base)
            ]:
                session.add(PriceHistory(product_id=p_flp.id, price=p, recorded_at=dt))

        await session.commit()
        print("[Catalog] Initial products and price histories seeded.")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("[Database] SQLite database tables ready.")
    
    # Seed sample products
    await seed_initial_catalog()
    
    # Start APScheduler
    start_scheduler()
    yield
    # Stop APScheduler
    stop_scheduler()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    lifespan=lifespan
)

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routes
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "online",
        "docs": "/docs",
        "api_v1": settings.API_V1_STR
    }

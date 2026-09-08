from apscheduler.schedulers.asyncio import AsyncIOScheduler
from sqlalchemy import select
from datetime import datetime, timezone
from app.db.database import AsyncSessionLocal
from app.db.models import Product, PriceAlert
from app.services.alert_service import alert_service

scheduler = AsyncIOScheduler()

async def check_price_alerts_job():
    """
    Background job: checks tracked products against target alert prices
    """
    async with AsyncSessionLocal() as session:
        try:
            # Query active, untriggered alerts
            result = await session.execute(
                select(PriceAlert, Product)
                .join(Product, PriceAlert.product_id == Product.id)
                .where(PriceAlert.is_active == True, PriceAlert.is_triggered == False)
            )
            alerts_with_products = result.all()

            for alert, product in alerts_with_products:
                if product.current_price <= alert.target_price:
                    # Trigger alert!
                    curr_sym = "₹" if product.currency == "INR" else "$"
                    await alert_service.send_price_drop_email(
                        recipient_email=alert.user_email,
                        product_title=product.title,
                        platform=product.platform,
                        old_price=product.original_mrp or (product.current_price * 1.15),
                        new_price=product.current_price,
                        target_price=alert.target_price,
                        currency_symbol=curr_sym,
                        product_url=product.product_url,
                        image_url=product.image_url or ""
                    )
                    alert.is_triggered = True
                    alert.triggered_at = datetime.now(timezone.utc)
                    session.add(alert)
                    
            await session.commit()
        except Exception as e:
            print(f"[Scheduler] Error running price check job: {e}")

def start_scheduler():
    import os
    if os.getenv("VERCEL"):
        print("[Scheduler] Running in Vercel Serverless environment - skipping APScheduler background thread.")
        return
    if not scheduler.running:
        scheduler.add_job(check_price_alerts_job, "interval", minutes=30, id="price_check_job")
        scheduler.start()
        print("[Scheduler] APScheduler price monitor started.")

def stop_scheduler():
    if scheduler.running:
        scheduler.shutdown()

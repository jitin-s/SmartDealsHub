from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.database import Base

def utc_now():
    return datetime.now(timezone.utc)

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500), nullable=False)
    brand = Column(String(100), nullable=True)
    asin_or_pid = Column(String(100), index=True, nullable=False)
    platform = Column(String(50), index=True, nullable=False)  # amazon, flipkart, croma, walmart
    country = Column(String(10), default="IN", index=True)      # IN, US, UK, CA
    category = Column(String(100), default="Electronics")
    
    current_price = Column(Float, nullable=False)
    original_mrp = Column(Float, nullable=True)
    currency = Column(String(10), default="INR")
    discount_percent = Column(Float, default=0.0)
    
    rating = Column(Float, default=0.0)
    review_count = Column(Integer, default=0)
    image_url = Column(Text, nullable=True)
    product_url = Column(Text, nullable=False)
    in_stock = Column(Boolean, default=True)
    seller_name = Column(String(200), nullable=True)
    is_prime_or_assured = Column(Boolean, default=False)
    
    # BuyHatke style insights
    bank_offers = Column(Text, nullable=True)       # JSON string of active bank offers
    pros_summary = Column(Text, nullable=True)      # JSON list of top customer pros
    cons_summary = Column(Text, nullable=True)      # JSON list of top customer cons
    fake_review_score = Column(Float, default=95.0) # 0 to 100 authenticity score
    
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    # Relationships
    price_history = relationship("PriceHistory", back_populates="product", cascade="all, delete-orphan")
    alerts = relationship("PriceAlert", back_populates="product", cascade="all, delete-orphan")


class PriceHistory(Base):
    __tablename__ = "price_history"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False, index=True)
    price = Column(Float, nullable=False)
    recorded_at = Column(DateTime, default=utc_now, index=True)

    product = relationship("Product", back_populates="price_history")


class PriceAlert(Base):
    __tablename__ = "price_alerts"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False, index=True)
    user_email = Column(String(200), nullable=False, index=True)
    target_price = Column(Float, nullable=False)
    currency = Column(String(10), default="INR")
    is_active = Column(Boolean, default=True)
    is_triggered = Column(Boolean, default=False)
    created_at = Column(DateTime, default=utc_now)
    triggered_at = Column(DateTime, nullable=True)

    product = relationship("Product", back_populates="alerts")


class DomainPricing(Base):
    __tablename__ = "domain_pricing"

    id = Column(Integer, primary_key=True, index=True)
    tld = Column(String(20), index=True, nullable=False)            # .com, .in, .io, .ai, .org
    registrar_name = Column(String(100), index=True, nullable=False) # Cloudflare, Porkbun, Namecheap, GoDaddy, Hostinger
    logo_url = Column(String(255), nullable=True)
    
    registration_price = Column(Float, nullable=False)  # 1st year promo
    renewal_price = Column(Float, nullable=False)       # True renewal
    transfer_price = Column(Float, nullable=False)      # Transfer cost
    currency = Column(String(10), default="USD")
    
    whois_privacy_free = Column(Boolean, default=True)
    whois_privacy_cost = Column(Float, default=0.0)
    icann_fee_included = Column(Boolean, default=True)
    icann_fee = Column(Float, default=0.18)
    
    renewal_trap_score = Column(String(20), default="Honest") # Honest, Moderate Markup, Bait-and-Switch
    features = Column(Text, nullable=True)                     # Free DNSSEC, Free URL Forwarding
    promo_code = Column(String(50), nullable=True)
    affiliate_or_direct_url = Column(Text, nullable=True)
    updated_at = Column(DateTime, default=utc_now)


class TLDTrend(Base):
    __tablename__ = "tld_trends"

    id = Column(Integer, primary_key=True, index=True)
    tld = Column(String(20), index=True, nullable=False) # .com, .io, .ai, .in
    year = Column(Integer, nullable=False)
    registry_wholesale_price = Column(Float, nullable=False)
    average_retail_price = Column(Float, nullable=False)
    registry_name = Column(String(100), nullable=True) # Verisign, Identity Digital, NIXI
    notes = Column(String(255), nullable=True)


class ServicePlan(Base):
    __tablename__ = "service_plans"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String(50), index=True, nullable=False) # ai, cloud_vps, cloud_storage, vpn, streaming
    service_name = Column(String(100), index=True, nullable=False) # ChatGPT, Claude, Hetzner, Mullvad, Netflix
    logo_url = Column(String(255), nullable=True)
    plan_name = Column(String(100), nullable=False)
    
    monthly_price = Column(Float, nullable=False)
    annual_price = Column(Float, nullable=True)
    currency = Column(String(10), default="USD")
    
    renewal_price = Column(Float, nullable=True)
    renewal_trap_warning = Column(String(255), nullable=True)
    
    key_specs = Column(Text, nullable=True)        # JSON details e.g. {"RAM": "8GB", "Storage": "100GB"}
    value_badge = Column(String(50), nullable=True) # Best Value, Budget Pick, Developer Choice
    perks_and_notes = Column(Text, nullable=True)  # Includes 2TB Google One, etc.
    website_url = Column(Text, nullable=True)


class GroceryItem(Base):
    __tablename__ = "grocery_items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), index=True, nullable=False)
    category = Column(String(100), default="Daily Staples")
    quantity_unit = Column(String(50), default="1 kg")
    
    blinkit_price = Column(Float, nullable=False)
    zepto_price = Column(Float, nullable=False)
    instamart_price = Column(Float, nullable=False)
    bigbasket_price = Column(Float, nullable=False)
    currency = Column(String(10), default="INR")
    image_url = Column(Text, nullable=True)

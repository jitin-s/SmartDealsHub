from fastapi import APIRouter
from app.api.endpoints import country, products, domains, services, alerts

api_router = APIRouter()

api_router.include_router(country.router, prefix="/country", tags=["Country & Locale"])
api_router.include_router(products.router, prefix="/products", tags=["E-Commerce Products & Scraper"])
api_router.include_router(domains.router, prefix="/domains", tags=["Domain & Registrar Intelligence"])
api_router.include_router(services.router, prefix="/services", tags=["Services & Daily Life Hub"])
api_router.include_router(alerts.router, prefix="/alerts", tags=["Price Drop Alerts & Email"])

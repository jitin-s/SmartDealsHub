import os
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "SmartDeal & Domain Intelligence Hub"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Database (Uses /tmp on Vercel Serverless environment where root filesystem is read-only)
    DATABASE_URL: str = (
        "sqlite+aiosqlite:////tmp/deals_hub.db" 
        if os.getenv("VERCEL") 
        else "sqlite+aiosqlite:///./deals_hub.db"
    )
    
    # Email / SMTP Configuration
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    EMAIL_FROM: str = "alerts@smartdealshub.com"
    EMAIL_FROM_NAME: str = "Smart Deals & Price Tracker"
    
    # Scheduler
    PRICE_CHECK_INTERVAL_MINUTES: int = 30
    
    # Allowed CORS Origins
    CORS_ORIGINS: list[str] = ["*"]

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()

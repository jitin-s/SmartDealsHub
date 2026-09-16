import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timezone
from typing import Optional, Dict, Any
from app.core.config import settings

def generate_price_drop_html(
    product_title: str,
    platform: str,
    old_price: float,
    new_price: float,
    target_price: float,
    currency_symbol: str,
    product_url: str,
    image_url: str
) -> str:
    savings = round(old_price - new_price, 2)
    discount_pct = round((savings / old_price) * 100, 1) if old_price > 0 else 0

    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f3f4f6; margin: 0; padding: 20px; }}
            .card {{ max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #e5e7eb; }}
            .header {{ background: linear-gradient(135deg, #2563eb, #1d4ed8); padding: 24px; text-align: center; color: white; }}
            .header h1 {{ margin: 0; font-size: 24px; font-weight: 700; }}
            .header p {{ margin: 8px 0 0 0; opacity: 0.9; font-size: 14px; }}
            .content {{ padding: 24px; }}
            .product-box {{ display: flex; gap: 20px; align-items: center; background: #f9fafb; border-radius: 8px; padding: 16px; margin-bottom: 20px; }}
            .product-img {{ width: 100px; height: 100px; object-fit: contain; border-radius: 6px; background: white; }}
            .product-info {{ flex: 1; }}
            .product-title {{ font-weight: 600; color: #111827; font-size: 16px; line-height: 1.4; margin: 0 0 8px 0; }}
            .badge {{ display: inline-block; padding: 4px 10px; background: #dbeafe; color: #1e40af; border-radius: 9999px; font-size: 12px; font-weight: 600; text-transform: uppercase; }}
            .price-row {{ display: flex; align-items: baseline; gap: 12px; margin: 20px 0; }}
            .new-price {{ font-size: 32px; font-weight: 800; color: #16a34a; }}
            .old-price {{ font-size: 18px; color: #6b7280; text-decoration: line-through; }}
            .save-pill {{ background: #dcfce7; color: #15803d; padding: 4px 8px; border-radius: 6px; font-weight: 700; font-size: 14px; }}
            .cta-btn {{ display: block; text-align: center; background: #2563eb; color: #ffffff !important; padding: 14px 20px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; margin: 24px 0 12px 0; }}
            .cta-btn:hover {{ background: #1d4ed8; }}
            .footer {{ background: #f9fafb; padding: 16px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; }}
        </style>
    </head>
    <body>
        <div class="card">
            <div class="header">
                <h1>⚡ Price Drop Alert!</h1>
                <p>An item on your watchlist just hit your target threshold!</p>
            </div>
            <div class="content">
                <div class="product-box">
                    <img src="{image_url}" alt="Product" class="product-img" />
                    <div class="product-info">
                        <span class="badge">{platform.upper()}</span>
                        <h2 class="product-title">{product_title}</h2>
                    </div>
                </div>
                
                <div class="price-row">
                    <span class="new-price">{currency_symbol}{new_price:,.2f}</span>
                    <span class="old-price">{currency_symbol}{old_price:,.2f}</span>
                    <span class="save-pill">Save {currency_symbol}{savings:,.2f} ({discount_pct}% OFF)</span>
                </div>
                
                <p style="color: #4b5563; font-size: 14px; margin: 0;">
                    Target set by you: <strong>{currency_symbol}{target_price:,.2f}</strong>. Current price is now strictly at or below your desired price!
                </p>
                
                <a href="{product_url}" class="cta-btn" target="_blank">
                    Buy Now on {platform.title()} →
                </a>
            </div>
            <div class="footer">
                Sent by Smart Deal & Domain Intelligence Hub • Real-time Daily Price Alerts
            </div>
        </div>
    </body>
    </html>
    """

# In-memory delivery log for instant UI review and verification
SENT_ALERTS_LOG = []

class AlertService:
    async def send_price_drop_email(
        self,
        recipient_email: str,
        product_title: str,
        platform: str,
        old_price: float,
        new_price: float,
        target_price: float,
        currency_symbol: str,
        product_url: str,
        image_url: str
    ) -> Dict[str, Any]:
        html_content = generate_price_drop_html(
            product_title=product_title,
            platform=platform,
            old_price=old_price,
            new_price=new_price,
            target_price=target_price,
            currency_symbol=currency_symbol,
            product_url=product_url,
            image_url=image_url
        )
        
        log_entry = {
            "to": recipient_email,
            "subject": f"⚡ Price Drop: {product_title[:45]} is now {currency_symbol}{new_price:,.2f}!",
            "product_title": product_title,
            "old_price": old_price,
            "new_price": new_price,
            "platform": platform,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "status": "SENT"
        }
        SENT_ALERTS_LOG.append(log_entry)

        # If user has configured SMTP settings, attempt real email delivery
        if settings.SMTP_USER and settings.SMTP_PASSWORD:
            try:
                msg = MIMEMultipart("alternative")
                msg["Subject"] = log_entry["subject"]
                msg["From"] = f"{settings.EMAIL_FROM_NAME} <{settings.EMAIL_FROM}>"
                msg["To"] = recipient_email
                msg.attach(MIMEText(html_content, "html"))

                server = smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT)
                server.starttls()
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
                server.sendmail(settings.EMAIL_FROM, recipient_email, msg.as_string())
                server.quit()
                log_entry["delivery_mode"] = "SMTP_LIVE"
            except Exception as e:
                print(f"[AlertService] SMTP Error: {e}")
                log_entry["delivery_mode"] = f"MOCK_FALLBACK (SMTP Error: {e})"
        else:
            log_entry["delivery_mode"] = "LOCAL_MOCK_SUCCESS (Configure SMTP in .env for external delivery)"

        return log_entry

    def get_sent_alerts(self):
        return list(reversed(SENT_ALERTS_LOG))

alert_service = AlertService()

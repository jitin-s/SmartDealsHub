from typing import List, Dict, Any, Optional

# Master Registrar Pricing Dataset across common TLDs (in USD / INR normalized)
REGISTRAR_DATABASE = [
    {
        "registrar": "Cloudflare Registrar",
        "logo": "https://www.cloudflare.com/img/logo-cloudflare-dark.svg",
        "tld_prices": {
            ".com": {"reg": 10.44, "ren": 10.44, "transfer": 10.44},
            ".org": {"reg": 11.26, "ren": 11.26, "transfer": 11.26},
            ".net": {"reg": 12.80, "ren": 12.80, "transfer": 12.80},
            ".io":  {"reg": 42.00, "ren": 42.00, "transfer": 42.00},
            ".ai":  {"reg": 75.00, "ren": 75.00, "transfer": 75.00},
            ".in":  {"reg": 8.50,  "ren": 8.50,  "transfer": 8.50},
        },
        "whois_free": True,
        "whois_cost": 0.0,
        "icann_included": True,
        "icann_fee": 0.0,
        "trap_score": "Honest",
        "trap_badge": "At-Cost Wholesale ($0 Markup)",
        "features": ["Enterprise Anycast DNS", "Free DNSSEC", "Zero Renewal Markup", "No Upsells"],
        "url": "https://www.cloudflare.com/products/registrar/"
    },
    {
        "registrar": "Porkbun",
        "logo": "https://porkbun.com/images/pig_mascot.svg",
        "tld_prices": {
            ".com": {"reg": 10.37, "ren": 11.45, "transfer": 10.37},
            ".org": {"reg": 11.00, "ren": 12.20, "transfer": 11.00},
            ".net": {"reg": 12.50, "ren": 13.90, "transfer": 12.50},
            ".io":  {"reg": 38.50, "ren": 39.50, "transfer": 38.50},
            ".ai":  {"reg": 72.00, "ren": 72.00, "transfer": 72.00},
            ".in":  {"reg": 7.99,  "ren": 8.99,  "transfer": 7.99},
        },
        "whois_free": True,
        "whois_cost": 0.0,
        "icann_included": True,
        "icann_fee": 0.0,
        "trap_score": "Honest",
        "trap_badge": "Transparent Developer Favorite",
        "features": ["Free WHOIS Privacy", "Free SSL Certificate", "Free URL/Email Forwarding", "Cute Pig UI"],
        "url": "https://porkbun.com/"
    },
    {
        "registrar": "Spaceship",
        "logo": "https://www.spaceship.com/favicon.ico",
        "tld_prices": {
            ".com": {"reg": 8.48,  "ren": 10.98, "transfer": 9.48},
            ".org": {"reg": 9.98,  "ren": 11.98, "transfer": 9.98},
            ".net": {"reg": 11.48, "ren": 13.48, "transfer": 11.48},
            ".io":  {"reg": 39.98, "ren": 41.98, "transfer": 39.98},
            ".ai":  {"reg": 73.98, "ren": 74.98, "transfer": 73.98},
            ".in":  {"reg": 7.48,  "ren": 8.88,  "transfer": 7.48},
        },
        "whois_free": True,
        "whois_cost": 0.0,
        "icann_included": True,
        "icann_fee": 0.0,
        "trap_score": "Honest",
        "trap_badge": "Modern Low-Cost NextGen",
        "features": ["Ultra Fast Spacemail", "Free Privacy Protection", "No Spam Checkout"],
        "url": "https://www.spaceship.com/"
    },
    {
        "registrar": "Namecheap",
        "logo": "https://www.namecheap.com/favicon.ico",
        "tld_prices": {
            ".com": {"reg": 6.98,  "ren": 15.88, "transfer": 10.98},
            ".org": {"reg": 8.98,  "ren": 14.98, "transfer": 12.98},
            ".net": {"reg": 11.98, "ren": 16.98, "transfer": 13.98},
            ".io":  {"reg": 42.98, "ren": 49.98, "transfer": 42.98},
            ".ai":  {"reg": 78.98, "ren": 84.98, "transfer": 78.98},
            ".in":  {"reg": 6.98,  "ren": 11.98, "transfer": 8.98},
        },
        "whois_free": True,
        "whois_cost": 0.0,
        "icann_included": False,
        "icann_fee": 0.18,
        "trap_score": "Moderate",
        "trap_badge": "Moderate Renewal Markup",
        "features": ["Free Lifetime WhoisGuard", "FreeDNS", "Frequent Promo Coupons", "2FA Security"],
        "url": "https://www.namecheap.com/"
    },
    {
        "registrar": "GoDaddy",
        "logo": "https://img1.wsimg.com/shared/godaddy-share.jpg",
        "tld_prices": {
            ".com": {"reg": 1.99,  "ren": 23.99, "transfer": 19.99},
            ".org": {"reg": 9.99,  "ren": 22.99, "transfer": 18.99},
            ".net": {"reg": 14.99, "ren": 24.99, "transfer": 19.99},
            ".io":  {"reg": 49.99, "ren": 69.99, "transfer": 54.99},
            ".ai":  {"reg": 89.99, "ren": 109.99, "transfer": 99.99},
            ".in":  {"reg": 1.49,  "ren": 16.99, "transfer": 14.99},
        },
        "whois_free": False,
        "whois_cost": 9.99,
        "icann_included": False,
        "icann_fee": 0.18,
        "trap_score": "Bait-and-Switch",
        "trap_badge": "High Renewal Trap + Paid Privacy ($9.99/yr)",
        "features": ["Cheap 1st Year", "Extensive Domain Marketplace", "24/7 Phone Support"],
        "url": "https://www.godaddy.com/"
    },
    {
        "registrar": "Hostinger",
        "logo": "https://assets.hostinger.com/images/logo-dark-hostinger.svg",
        "tld_prices": {
            ".com": {"reg": 4.99,  "ren": 16.99, "transfer": 11.99},
            ".org": {"reg": 7.99,  "ren": 15.99, "transfer": 12.99},
            ".net": {"reg": 12.99, "ren": 17.99, "transfer": 13.99},
            ".io":  {"reg": 39.99, "ren": 46.99, "transfer": 42.99},
            ".ai":  {"reg": 79.99, "ren": 89.99, "transfer": 79.99},
            ".in":  {"reg": 3.99,  "ren": 10.99, "transfer": 8.99},
        },
        "whois_free": True,
        "whois_cost": 0.0,
        "icann_included": False,
        "icann_fee": 0.18,
        "trap_score": "Moderate",
        "trap_badge": "Great with Web Hosting Bundle",
        "features": ["Free Domain with Annual Hosting", "Free Privacy Protection", "Intuitive hPanel"],
        "url": "https://www.hostinger.com/domain-name-search"
    },
    {
        "registrar": "BigRock (India Focus)",
        "logo": "https://www.bigrock.in/images/logo.png",
        "tld_prices": {
            ".com": {"reg": 4.99,  "ren": 17.49, "transfer": 12.49},
            ".org": {"reg": 8.99,  "ren": 16.99, "transfer": 13.99},
            ".net": {"reg": 12.99, "ren": 18.99, "transfer": 14.99},
            ".io":  {"reg": 44.99, "ren": 52.99, "transfer": 46.99},
            ".ai":  {"reg": 84.99, "ren": 94.99, "transfer": 88.99},
            ".in":  {"reg": 4.49,  "ren": 9.99,  "transfer": 7.99},
        },
        "whois_free": False,
        "whois_cost": 3.99,
        "icann_included": False,
        "icann_fee": 0.18,
        "trap_score": "Moderate",
        "trap_badge": "India UPI / Netbanking Ready",
        "features": ["Local INR & UPI Billing", "Strong .IN registry tie-up", "2 Free Email Accounts"],
        "url": "https://www.bigrock.in/"
    }
]

# Historical registry wholesale hikes
TLD_HISTORICAL_TRENDS = [
    {
        "tld": ".com",
        "registry": "Verisign",
        "trend_data": [
            {"year": 2021, "wholesale": 8.39, "retail_avg": 12.50},
            {"year": 2022, "wholesale": 8.97, "retail_avg": 13.80},
            {"year": 2023, "wholesale": 9.59, "retail_avg": 14.90},
            {"year": 2024, "wholesale": 10.26, "retail_avg": 16.20},
            {"year": 2025, "wholesale": 10.98, "retail_avg": 17.50},
            {"year": 2026, "wholesale": 11.75, "retail_avg": 18.80}
        ],
        "notes": "Verisign contract permits annual 7% wholesale price increases under ICANN agreement."
    },
    {
        "tld": ".io",
        "registry": "Internet Computer Bureau / Identity Digital",
        "trend_data": [
            {"year": 2021, "wholesale": 32.0, "retail_avg": 38.0},
            {"year": 2022, "wholesale": 34.0, "retail_avg": 40.0},
            {"year": 2023, "wholesale": 36.0, "retail_avg": 43.0},
            {"year": 2024, "wholesale": 38.0, "retail_avg": 46.0},
            {"year": 2025, "wholesale": 40.0, "retail_avg": 48.0},
            {"year": 2026, "wholesale": 42.0, "retail_avg": 50.0}
        ],
        "notes": "Premium tech positioning, consistent developer adoption."
    },
    {
        "tld": ".ai",
        "registry": "Government of Anguilla",
        "trend_data": [
            {"year": 2021, "wholesale": 50.0, "retail_avg": 65.0},
            {"year": 2022, "wholesale": 55.0, "retail_avg": 70.0},
            {"year": 2023, "wholesale": 65.0, "retail_avg": 80.0},
            {"year": 2024, "wholesale": 70.0, "retail_avg": 85.0},
            {"year": 2025, "wholesale": 72.0, "retail_avg": 90.0},
            {"year": 2026, "wholesale": 75.0, "retail_avg": 95.0}
        ],
        "notes": "Explosive growth due to the global AI boom, mandatory 2-year minimum initial registration in some registries."
    }
]

class DomainService:
    def compare_tld(self, tld: str = ".com", years: int = 3, currency: str = "USD") -> List[Dict[str, Any]]:
        multiplier = 86.5 if currency == "INR" else 1.0
        results = []

        for reg in REGISTRAR_DATABASE:
            prices = reg["tld_prices"].get(tld)
            if not prices:
                continue

            reg_price = prices["reg"]
            ren_price = prices["ren"]
            transfer_price = prices["transfer"]
            privacy_cost = reg["whois_cost"] if not reg["whois_free"] else 0.0
            icann = 0.0 if reg["icann_included"] else reg["icann_fee"]

            # Total Cost of Ownership calculation over N years
            # Year 1: reg_price + privacy + icann
            # Year 2..N: (years - 1) * (ren_price + privacy + icann)
            total_tco = reg_price + privacy_cost + icann + ((years - 1) * (ren_price + privacy_cost + icann))
            avg_yearly_cost = total_tco / years

            results.append({
                "registrar": reg["registrar"],
                "logo": reg["logo"],
                "trap_score": reg["trap_score"],
                "trap_badge": reg["trap_badge"],
                "reg_price": round(reg_price * multiplier, 2),
                "renewal_price": round(ren_price * multiplier, 2),
                "transfer_price": round(transfer_price * multiplier, 2),
                "privacy_free": reg["whois_free"],
                "privacy_cost": round(privacy_cost * multiplier, 2),
                "icann_included": reg["icann_included"],
                "total_tco": round(total_tco * multiplier, 2),
                "avg_per_year": round(avg_yearly_cost * multiplier, 2),
                "features": reg["features"],
                "url": reg["url"],
                "currency_symbol": "₹" if currency == "INR" else "$"
            })

        # Sort by total TCO ascending (cheapest true cost first!)
        results.sort(key=lambda x: x["total_tco"])
        return results

    def calculate_transfer_savings(self, current_registrar: str, tld: str = ".com", currency: str = "USD") -> Dict[str, Any]:
        multiplier = 86.5 if currency == "INR" else 1.0
        
        # Find current registrar
        curr = next((r for r in REGISTRAR_DATABASE if r["registrar"].lower() == current_registrar.lower()), None)
        if not curr:
            curr = next((r for r in REGISTRAR_DATABASE if "godaddy" in r["registrar"].lower()), REGISTRAR_DATABASE[4])

        curr_renewal = curr["tld_prices"].get(tld, {}).get("ren", 23.99)
        curr_privacy = curr["whois_cost"] if not curr["whois_free"] else 0.0
        curr_yearly = curr_renewal + curr_privacy + (0.18 if not curr["icann_included"] else 0.0)

        # Best alternative (e.g. Cloudflare or Porkbun)
        best = REGISTRAR_DATABASE[0] # Cloudflare
        best_renewal = best["tld_prices"].get(tld, {}).get("ren", 10.44)
        best_yearly = best_renewal

        yearly_savings = curr_yearly - best_yearly
        three_year_savings = yearly_savings * 3

        return {
            "current_registrar": curr["registrar"],
            "current_yearly_cost": round(curr_yearly * multiplier, 2),
            "recommended_registrar": best["registrar"],
            "recommended_yearly_cost": round(best_yearly * multiplier, 2),
            "yearly_savings": round(yearly_savings * multiplier, 2),
            "three_year_savings": round(three_year_savings * multiplier, 2),
            "currency_symbol": "₹" if currency == "INR" else "$",
            "transfer_steps": [
                "1. Unlock your domain in your current registrar dashboard.",
                "2. Request the EPP Authorization Code / Transfer Code.",
                f"3. Head to {best['registrar']} and initiate domain transfer.",
                "4. Enter code and confirm via email — no downtime guaranteed!"
            ]
        }

    def get_tld_trends(self) -> List[Dict[str, Any]]:
        return TLD_HISTORICAL_TRENDS

domain_service = DomainService()

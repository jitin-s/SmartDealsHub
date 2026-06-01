from fastapi import APIRouter, Query
from typing import List, Dict, Any
from app.services.domain_service import domain_service

router = APIRouter()

@router.get("/compare")
async def compare_domains(
    tld: str = Query(".com", description="Domain extension (.com, .in, .io, .ai, .org, .net)"),
    years: int = Query(3, description="Duration in years for TCO calculation (1 to 10)", ge=1, le=10),
    currency: str = Query("USD", description="Currency (USD or INR)")
):
    """
    Returns registrar price matrix with Total Cost of Ownership (TCO) and Renewal Trap Score
    """
    return domain_service.compare_tld(tld=tld, years=years, currency=currency)

@router.get("/transfer-savings")
async def get_transfer_savings(
    current: str = Query("GoDaddy", description="Current domain registrar"),
    tld: str = Query(".com", description="Domain extension"),
    currency: str = Query("USD", description="Currency (USD or INR)")
):
    """
    Calculates 1-year and 3-year savings by transferring to a wholesale/at-cost registrar
    """
    return domain_service.calculate_transfer_savings(current_registrar=current, tld=tld, currency=currency)

@router.get("/trends")
async def get_domain_trends():
    """
    Returns historical wholesale and retail price inflation trends for TLDs
    """
    return domain_service.get_tld_trends()

@router.get("/search")
async def search_domain(
    name: str = Query(..., description="Domain name or keyword to search (e.g. mycoolstartup)"),
    currency: str = Query("USD", description="Currency (USD or INR)")
):
    """
    Multi-TLD scanner across .com, .in, .io, .ai, .org, .net
    """
    cleaned_name = name.lower().strip().replace("http://", "").replace("https://", "").split("/")[0].split(".")[0]
    tlds = [".com", ".in", ".io", ".ai", ".org", ".net"]
    
    results = []
    for tld in tlds:
        matrix = domain_service.compare_tld(tld=tld, years=1, currency=currency)
        if matrix:
            cheapest = matrix[0]
            # Flag simulated availability (popular short names might be taken, custom names available)
            is_avail = len(cleaned_name) > 4
            results.append({
                "domain": f"{cleaned_name}{tld}",
                "tld": tld,
                "available": is_avail,
                "best_registrar": cheapest["registrar"],
                "best_price": cheapest["reg_price"],
                "renewal_price": cheapest["renewal_price"],
                "currency_symbol": cheapest["currency_symbol"],
                "buy_url": cheapest["url"]
            })

    return {
        "query": cleaned_name,
        "results": results
    }

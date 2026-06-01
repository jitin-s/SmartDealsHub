import re
from urllib.parse import urlparse, parse_qs

def identify_platform(url_or_str: str) -> str:
    url_lower = url_or_str.lower()
    if "amazon." in url_lower:
        return "amazon"
    elif "flipkart." in url_lower:
        return "flipkart"
    elif "croma." in url_lower:
        return "croma"
    elif "walmart." in url_lower:
        return "walmart"
    elif "myntra." in url_lower:
        return "myntra"
    else:
        return "generic"

def extract_amazon_asin(url_or_str: str) -> str:
    # If the input is already a 10-char ASIN (e.g. B0D9BDL9C9)
    asin_direct_match = re.match(r"^[A-Z0-9]{10}$", url_or_str.strip().upper())
    if asin_direct_match:
        return asin_direct_match.group(0)
    
    # Common Amazon URL patterns
    patterns = [
        r"/dp/([A-Z0-9]{10})",
        r"/gp/product/([A-Z0-9]{10})",
        r"/ASIN/([A-Z0-9]{10})",
        r"/product-reviews/([A-Z0-9]{10})",
        r"/([A-Z0-9]{10})(?:/|\?|$)"
    ]
    for pattern in patterns:
        match = re.search(pattern, url_or_str, re.IGNORECASE)
        if match:
            return match.group(1).upper()
    return ""

def extract_flipkart_pid(url_or_str: str) -> str:
    parsed = urlparse(url_or_str)
    qs = parse_qs(parsed.query)
    if "pid" in qs and qs["pid"]:
        return qs["pid"][0]
    
    # Pattern like /p/itm123456789 or /p/itm...
    match = re.search(r"/p/(itm[a-zA-Z0-9]+)", url_or_str)
    if match:
        return match.group(1)
    
    # Check for direct PID code
    direct_match = re.match(r"^[A-Z0-9]{16}$", url_or_str.strip().upper())
    if direct_match:
        return direct_match.group(0)
        
    return ""

def clean_amazon_url(url: str, domain: str = "amazon.in") -> str:
    asin = extract_amazon_asin(url)
    if asin:
        # Detect domain from original URL if possible
        parsed = urlparse(url)
        if parsed.netloc and "amazon." in parsed.netloc:
            domain = parsed.netloc.replace("www.", "")
        return f"https://www.{domain}/dp/{asin}"
    return url

def clean_flipkart_url(url: str) -> str:
    parsed = urlparse(url)
    # Strip unnecessary affiliate/tracking queries
    clean_path = parsed.path
    qs = parse_qs(parsed.query)
    pid = qs.get("pid", [""])[0]
    if pid:
        return f"https://www.flipkart.com{clean_path}?pid={pid}"
    return f"https://www.flipkart.com{clean_path}"

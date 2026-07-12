"""
Static FX exchange rates for cross-border currency conversion.
"""
FX_RATES_TO_INR = {
    "INR": 1.0,
    "USD": 83.5,
    "EUR": 90.2,
    "GBP": 105.8,
    "CAD": 61.2,
    "AUD": 55.4
}

def convert_currency(amount: float, from_currency: str, to_currency: str = "INR") -> float:
    """Converts price amount between supported currencies."""
    rate_from = FX_RATES_TO_INR.get(from_currency.upper(), 1.0)
    rate_to = FX_RATES_TO_INR.get(to_currency.upper(), 1.0)
    amount_in_inr = amount * rate_from
    return round(amount_in_inr / rate_to, 2)

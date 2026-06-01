from typing import List, Dict, Any

AI_SUBSCRIPTIONS = [
    {
        "id": "chatgpt-plus",
        "name": "ChatGPT Plus",
        "provider": "OpenAI",
        "monthly_usd": 20.0,
        "monthly_inr": 1999.0,
        "badge": "Industry Standard",
        "models": ["GPT-4o", "OpenAI o1 Reasoning", "DALL·E 3", "Advanced Voice"],
        "key_features": [
            "Advanced Voice Mode with real-time inflection",
            "Interactive Canvas for coding and writing",
            "Custom GPT store & web browsing",
            "Early access to new flagship models"
        ],
        "pros": ["Highest general intelligence & voice fluidity", "Excellent reasoning with o1"],
        "cons": ["Usage caps on o1 model", "Slightly more conservative content filtering"],
        "url": "https://chatgpt.com/"
    },
    {
        "id": "claude-pro",
        "name": "Claude Pro",
        "provider": "Anthropic",
        "monthly_usd": 20.0,
        "monthly_inr": 1999.0,
        "badge": "Coder & Writer's Choice",
        "models": ["Claude 3.5 Sonnet", "Claude 3.5 Haiku", "Claude 3 Opus"],
        "key_features": [
            "Interactive Artifacts UI for live code execution",
            "Projects feature for workspace memory & docs",
            "200,000 token context window",
            "Superior natural human-like prose & nuance"
        ],
        "pros": ["Ranked #1 for coding benchmarks", "Artifacts live preview is unmatched"],
        "cons": ["No native web search or image generation", "Strict 5-hour message limits during peak hours"],
        "url": "https://claude.ai/"
    },
    {
        "id": "gemini-advanced",
        "name": "Gemini Advanced",
        "provider": "Google",
        "monthly_usd": 19.99,
        "monthly_inr": 1950.0,
        "badge": "Best Overall Value",
        "models": ["Gemini 1.5 Pro", "Gemini 2.0 Flash", "Imagen 3"],
        "key_features": [
            "Includes 2 TB Google One Cloud Storage ($10/mo value free)",
            "Massive 2,000,000 token context window (analyze 1hr video/1000 page PDFs)",
            "Deep Google Docs, Gmail, Drive & YouTube integration",
            "Fastest multimodal processing speed"
        ],
        "pros": ["Free 2TB storage makes it effectively $10/mo", "Immense context window capacity"],
        "cons": ["System prompt guardrails can be strict"],
        "url": "https://one.google.com/explore-plan/gemini-advanced"
    },
    {
        "id": "cursor-pro",
        "name": "Cursor Pro",
        "provider": "Anysphere",
        "monthly_usd": 20.0,
        "monthly_inr": 1999.0,
        "badge": "Best AI Code Editor",
        "models": ["Claude 3.5 Sonnet", "GPT-4o", "Cursor Tab", "Custom Fast Models"],
        "key_features": [
            "Agentic Composer for multi-file autonomous edits",
            "Full codebase indexing & semantic code search",
            "Instant inline diffs and terminal command debugging",
            "Switch between OpenAI, Claude, and Gemini models freely"
        ],
        "pros": ["10x developer productivity boost", "Native VS Code fork with all extensions"],
        "cons": ["Requires local desktop app"],
        "url": "https://www.cursor.com/"
    }
]

AI_API_TOKEN_BOARD = [
    {"model": "DeepSeek-V3", "provider": "DeepSeek Direct", "input_per_million": 0.14, "output_per_million": 0.28, "context": "64k", "status": "🔥 Cheapest 90% savings"},
    {"model": "DeepSeek-R1 (Reasoning)", "provider": "DeepSeek Direct", "input_per_million": 0.55, "output_per_million": 2.19, "context": "64k", "status": "🔥 o1 parity at 1/20th cost"},
    {"model": "Gemini 1.5 Flash", "provider": "Google AI Studio", "input_per_million": 0.075, "output_per_million": 0.30, "context": "1M", "status": "Ultra Fast & Generous Free Tier"},
    {"model": "GPT-4o mini", "provider": "OpenAI", "input_per_million": 0.15, "output_per_million": 0.60, "context": "128k", "status": "Solid default for small tasks"},
    {"model": "Claude 3.5 Sonnet", "provider": "Anthropic", "input_per_million": 3.00, "output_per_million": 15.00, "context": "200k", "status": "Gold standard for complex coding"},
    {"model": "OpenAI o1", "provider": "OpenAI", "input_per_million": 15.00, "output_per_million": 60.00, "context": "200k", "status": "Deep science & math logic"}
]

CLOUD_VPS_PROVIDERS = [
    {
        "provider": "Hetzner Cloud",
        "plan": "CX22",
        "vcpu": "2 vCPU",
        "ram": "4 GB RAM",
        "storage": "40 GB NVMe SSD",
        "bandwidth": "20 TB Traffic",
        "price_eur": 3.79,
        "price_usd": 4.10,
        "price_inr": 355.0,
        "trap_score": "Honest",
        "badge": "Unbeatable Hardware/Dollar",
        "notes": "Fastest NVMe I/O in Europe & US, hourly billing, no contract traps."
    },
    {
        "provider": "DigitalOcean",
        "plan": "Basic Droplet",
        "vcpu": "1 vCPU",
        "ram": "1 GB RAM",
        "storage": "25 GB SSD",
        "bandwidth": "1 TB Traffic",
        "price_eur": 5.50,
        "price_usd": 6.00,
        "price_inr": 520.0,
        "trap_score": "Moderate",
        "badge": "Easiest Developer UX",
        "notes": "1-click Docker, WordPress, and database installs, predictable flat fees."
    },
    {
        "provider": "Vultr",
        "plan": "Cloud Compute",
        "vcpu": "1 vCPU",
        "ram": "1 GB RAM",
        "storage": "32 GB NVMe",
        "bandwidth": "1 TB Traffic",
        "price_eur": 5.50,
        "price_usd": 6.00,
        "price_inr": 520.0,
        "trap_score": "Moderate",
        "badge": "32+ Global Datacenters",
        "notes": "Includes Mumbai, Delhi, Tokyo, Singapore, Frankfurt, London locations."
    },
    {
        "provider": "AWS Lightsail",
        "plan": "Standard Tier",
        "vcpu": "1 vCPU",
        "ram": "2 GB RAM",
        "storage": "60 GB SSD",
        "bandwidth": "3 TB Traffic",
        "price_eur": 9.20,
        "price_usd": 10.00,
        "price_inr": 865.0,
        "trap_score": "Moderate",
        "badge": "Direct AWS Backbone",
        "notes": "Includes static IP, DNS management, and seamless VPC peering with AWS services."
    }
]

VPN_PROVIDERS = [
    {
        "provider": "Mullvad VPN",
        "promo_price_usd": 5.40,
        "renewal_price_usd": 5.40,
        "trap_score": "Honest",
        "trap_badge": "Zero Renewal Jump (Flat €5/mo Forever)",
        "logging_policy": "Strict Audited No-Logs (Account is just a random 16-digit number)",
        "features": ["No email required to register", "Cash/Monero accepted", "WireGuard native"],
        "url": "https://mullvad.net/"
    },
    {
        "provider": "Proton VPN",
        "promo_price_usd": 4.99,
        "renewal_price_usd": 9.99,
        "trap_score": "Moderate",
        "trap_badge": "100% Renewal Hike after 2 Years",
        "logging_policy": "Swiss Privacy Law Protected No-Logs",
        "features": ["NetShield Ad & Tracker blocker", "Tor over VPN", "Free tier available"],
        "url": "https://protonvpn.com/"
    },
    {
        "provider": "NordVPN",
        "promo_price_usd": 3.09,
        "renewal_price_usd": 8.29,
        "trap_score": "Bait-and-Switch",
        "trap_badge": "168% Renewal Increase + Auto-Billing",
        "logging_policy": "Audited No-Logs (Panama Jurisdiction)",
        "features": ["Meshnet for file sharing", "Threat Protection Pro", "Double VPN"],
        "url": "https://nordvpn.com/"
    }
]

STREAMING_BUNDLES = [
    {
        "platform": "Netflix",
        "basic_plan": "₹199 / $6.99 (Mobile/Standard with Ads)",
        "premium_plan": "₹649 / $22.99 (4K HDR Dolby Vision, 4 Screens)",
        "family_split_cost": "₹162 / $5.75 per person (4 members)",
        "telecom_bundle": "Included free on select Airtel & Jio Postpaid / Fiber broadband plans."
    },
    {
        "platform": "YouTube Premium",
        "basic_plan": "₹149 / $13.99 (Individual)",
        "premium_plan": "₹299 / $22.99 (Family 5 Members)",
        "family_split_cost": "₹60 / $4.60 per person (5 members)",
        "telecom_bundle": "Includes ad-free YouTube, offline downloads, background play, and YouTube Music."
    },
    {
        "platform": "Disney+ Hotstar",
        "basic_plan": "₹899 / yr (Super - 2 Screens)",
        "premium_plan": "₹1,499 / yr (Premium 4K - 4 Screens)",
        "family_split_cost": "₹31 / mo per person (4 members)",
        "telecom_bundle": "Bundled with Jio, Airtel, and Vi prepaid & broadband recharge plans."
    }
]

DAILY_GROCERY_ITEMS = [
    {
        "name": "Amul Taaza Homogenised Toned Milk (1 Litre)",
        "category": "Dairy & Milk",
        "blinkit": 74.0,
        "zepto": 72.0,
        "instamart": 75.0,
        "bigbasket": 70.0
    },
    {
        "name": "Aashirvaad Shudh Chakki Atta (5 kg)",
        "category": "Atta & Flours",
        "blinkit": 245.0,
        "zepto": 239.0,
        "instamart": 249.0,
        "bigbasket": 229.0
    },
    {
        "name": "Tata Salt Vacuum Evaporated (1 kg)",
        "category": "Pantry Essentials",
        "blinkit": 28.0,
        "zepto": 28.0,
        "instamart": 28.0,
        "bigbasket": 26.0
    },
    {
        "name": "Fortune Sunlite Refined Sunflower Oil (1 Litre)",
        "category": "Oils & Ghee",
        "blinkit": 149.0,
        "zepto": 145.0,
        "instamart": 152.0,
        "bigbasket": 139.0
    },
    {
        "name": "Nestle Maggi 2-Minute Masala Noodles (Pack of 12)",
        "category": "Snacks & Instant Food",
        "blinkit": 168.0,
        "zepto": 165.0,
        "instamart": 170.0,
        "bigbasket": 159.0
    },
    {
        "name": "Farm Fresh White Eggs (Pack of 30 Tray)",
        "category": "Eggs & Breakfast",
        "blinkit": 210.0,
        "zepto": 199.0,
        "instamart": 215.0,
        "bigbasket": 195.0
    }
]

class ServicesHub:
    def get_ai_subscriptions(self, currency: str = "USD") -> List[Dict[str, Any]]:
        return AI_SUBSCRIPTIONS

    def get_ai_token_board(self) -> List[Dict[str, Any]]:
        return AI_API_TOKEN_BOARD

    def get_cloud_vps(self, currency: str = "USD") -> List[Dict[str, Any]]:
        return CLOUD_VPS_PROVIDERS

    def get_vpn_providers(self) -> List[Dict[str, Any]]:
        return VPN_PROVIDERS

    def get_streaming_bundles(self) -> List[Dict[str, Any]]:
        return STREAMING_BUNDLES

    def calculate_grocery_basket(self, selected_indices: List[int] = None) -> Dict[str, Any]:
        items = DAILY_GROCERY_ITEMS
        if selected_indices:
            items = [DAILY_GROCERY_ITEMS[i] for i in selected_indices if i < len(DAILY_GROCERY_ITEMS)]
            
        blinkit_total = sum(item["blinkit"] for item in items)
        zepto_total = sum(item["zepto"] for item in items)
        instamart_total = sum(item["instamart"] for item in items)
        bigbasket_total = sum(item["bigbasket"] for item in items)

        # Add delivery & handling fee assumptions
        totals = {
            "Blinkit": {"subtotal": blinkit_total, "handling_fee": 16.0, "total": blinkit_total + 16.0, "time": "10-15 mins"},
            "Zepto": {"subtotal": zepto_total, "handling_fee": 15.0, "total": zepto_total + 15.0, "time": "10 mins"},
            "Swiggy Instamart": {"subtotal": instamart_total, "handling_fee": 18.0, "total": instamart_total + 18.0, "time": "15-20 mins"},
            "BigBasket BB Now": {"subtotal": bigbasket_total, "handling_fee": 0.0, "total": bigbasket_total, "time": "30 mins / scheduled"}
        }

        cheapest_platform = min(totals.items(), key=lambda x: x[1]["total"])[0]

        return {
            "items": items,
            "comparison": totals,
            "cheapest_store": cheapest_platform,
            "max_savings": max(v["total"] for v in totals.values()) - min(v["total"] for v in totals.values())
        }

services_hub = ServicesHub()

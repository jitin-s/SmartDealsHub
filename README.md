# ⚡ SmartDeals Hub: Multi-Platform Price Intelligence & Deal Tracker

A smart shopping assistant, price tracker, and digital service intelligence platform built with **FastAPI**, **SQLAlchemy**, and **React (Vite + TypeScript + Tailwind CSS)**.

---

## 🌟 Key Features

### 1. 🛒 Multi-Store E-Commerce Scraper (BuyHatke Style)
- **Direct Link or Search**: Paste any Amazon or Flipkart product URL, or search for gadgets (e.g. *Sony WH-1000XM5, iPhone 16, Mac Mini M4, S24 Ultra*).
- **Cross-Platform Comparison**: Side-by-side comparison across Amazon India, Flipkart, and Croma Retail with the cheapest store highlighted.
- **BuyHatke "Price Meter" Verdict**:
  - 🟢 **Great Price / Steal Deal!** (Within 5% of all-time low)
  - 🟡 **Fair / Average Price**
  - 🔴 **Overpriced / Wait for Drop**
- **Interactive Price Trend Graph**: Historical price chart with all-time lowest reference lines.
- **Bank Offers & Coupons Radar**: Uncovers 10% instant discounts on HDFC/ICICI/Axis cards.
- **AI Review Sentiment**: Top 3 Pros, Top 3 Cons, and Review Authenticity Score.
- **Loot Deals Radar**: Curated feed of items currently at 15%+ discounts.

### 2. 🌐 Domain Registrar & Renewal Transparency Hub (TLD-List Style)
- **True Cost Breakdown**: Compares 1st year promo vs. true renewal price vs. transfer price across **Cloudflare**, **Porkbun**, **Spaceship**, **Namecheap**, **GoDaddy**, **Hostinger**, and **BigRock**.
- **The "Renewal Trap" Exposer**: Flags free lifetime WHOIS privacy vs. expensive paid add-ons ($9.99/yr).
- **Interactive TCO Slider**: Computes 1 to 10-year Total Cost of Ownership.
- **Domain Transfer Savings Calculator**: Calculates exact yearly and 3-year savings by switching away from high-renewal registrars (e.g., GoDaddy -> Cloudflare/Porkbun).
- **TLD Price Inflation History**: Historical wholesale registry price hikes on `.com`, `.io`, and `.ai`.

### 3. 🤖 AI Subscriptions & Developer API Token Board
- **Flagship LLM Comparison**: ChatGPT Plus vs. Claude Pro vs. Gemini Advanced vs. Cursor Pro.
- **Developer API Token Board**: Live input and output cost per 1M tokens across DeepSeek-V3, DeepSeek-R1, Gemini Flash, GPT-4o mini, and Claude 3.5 Sonnet.

### 4. ☁️ Cloud VPS & Compute Hardware Benchmark
- Compares **Hetzner Cloud**, **DigitalOcean**, **Vultr**, and **AWS Lightsail**.
- Maximum hardware specs (vCPU, RAM, NVMe SSD, Bandwidth) per dollar.

### 5. 🔒 VPN Renewal Trap & Streaming Cost-Splitter
- Distinguishes honest flat-rate pricing (Mullvad €5 flat) from aggressive 2-year auto-renewals (NordVPN, Surfshark).
- OTT Streaming (Netflix, YouTube Premium, Hotstar) per-person family plan cost splitter and telecom bundle matcher.

### 6. 🥦 Quick-Commerce Grocery Basket Optimizer
- Interactive daily essentials cart (Milk, Atta, Salt, Oil, Maggi, Eggs).
- Compares **Blinkit**, **Zepto**, **Swiggy Instamart**, and **BigBasket** with delivery and handling fees included.

### 7. 🔔 Automated Price Drop Email Alerts
- Background **APScheduler** monitors tracked products every 30 minutes.
- When price drops below the user's target threshold, a rich HTML email alert is automatically dispatched with savings and direct buy links.
- Includes instant **"Send Simulated Test Email"** buttons to verify email generation right from the UI.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Python 3.10+**
- **Node.js 18+** & **npm**

### Option A: 1-Click Launch (Windows)
Double-click `start.bat` in the project root! It will launch both the backend and frontend simultaneously.

---

### Option B: 1-Command Cross-Platform Runner
Run this single command from the project root:
```bash
python run.py
```
This automatically boots both the FastAPI backend and Vite frontend together.

---

### Option C: Manual Terminal Launch

#### 1. Start the FastAPI Backend
```bash
cd backend
# Activate virtual environment
.venv\Scripts\activate   # Windows
# source .venv/bin/activate # Linux/Mac

# Run server
python -m uvicorn app.main:app --port 8000 --reload
```
- API Root: `http://localhost:8000`
- Interactive Swagger Docs: `http://localhost:8000/docs`

#### 2. Start the React Frontend
```bash
cd frontend
npm run dev
```
- Open your browser at: `http://localhost:5173`

---

## 🖼️ Real Product Images & CDN Referrer Handling
When scraping e-commerce giants like Amazon (`m.media-amazon.com`) and Flipkart (`rukminim2.flixcart.com`), direct CDN image links normally trigger HTTP 403 / broken image icons when embedded on external web domains due to strict `Referer` headers.

SmartDeals Hub resolves this automatically:
- Scraper parsers dynamically extract high-resolution image URLs from Amazon's `landingImage` / `data-a-dynamic-image` JSON and Flipkart's product picture cards.
- All product image tags in the React frontend enforce `referrerPolicy="no-referrer"` alongside an automatic fallback handler.
- Real selling site CDN images load smoothly and crisply on both local environments and production deployments!

---

## 🐙 Push to GitHub

To push this project to your GitHub account:

```bash
# 1. Create a new repository on GitHub (e.g. "smartdeals-hub" or "amazon-web-scraper")

# 2. Add your GitHub repository as the remote origin
git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPO_NAME>.git

# 3. Rename branch to main (if not already)
git branch -M main

# 4. Push all code to GitHub
git push -u origin main
```

---

## ▲ Deploy to Vercel

The project is fully pre-configured for **Vercel** with a unified monorepo setup:
- **Frontend**: Vite + React + Tailwind CSS statically built and cached by Vercel CDN.
- **Backend API**: FastAPI running as a Python Serverless Function (`api/index.py`).
- **Database**: Automatically detects Vercel Serverless environment and uses `/tmp/deals_hub.db`.

### Deployment Steps:
1. **Via Vercel Web Dashboard (Recommended)**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Select your GitHub repository (`smartdeals-hub`)
   - Keep default settings (`vercel.json` will automatically configure build routes)
   - Click **Deploy**!

2. **Via Vercel CLI**:
   ```bash
   npm i -g vercel
   vercel
   ```

---

## ⚙️ Email (SMTP) Configuration (Optional)
By default, email alerts are logged locally for instant testing and auditing in the **Watchlist & Alerts** tab. To deliver actual emails to user inboxes:
1. Create a `backend/.env` file:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-gmail-app-password
EMAIL_FROM=alerts@smartdealshub.com
EMAIL_FROM_NAME="SmartDeals Hub"
```
2. Restart the backend. All price drops will now be sent straight to real inboxes!

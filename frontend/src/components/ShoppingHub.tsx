import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Sparkles, 
  ExternalLink, 
  TrendingDown, 
  Bell, 
  ShieldCheck, 
  Clock, 
  Tag, 
  ThumbsUp, 
  ThumbsDown,
  ArrowRight
} from 'lucide-react';
import { type Product, scrapeProduct, fetchProducts, fetchProductHistory, fetchLootDeals } from '../services/api';
import { PriceChart } from './PriceChart';
import { AlertsModal } from './AlertsModal';

interface Props {
  countryCode: string;
  currencySymbol: string;
  onAlertUpdated: () => void;
}

export const ShoppingHub: React.FC<Props> = ({ countryCode, currencySymbol, onAlertUpdated }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [lootDeals, setLootDeals] = useState<any[]>([]);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  // Quick preset sample queries for 1-click test
  const quickPicks = [
    { label: 'Sony WH-1000XM5', q: 'Sony WH-1000XM5' },
    { label: 'iPhone 16', q: 'Apple iPhone 16' },
    { label: 'Mac Mini M4', q: 'Mac Mini M4' },
    { label: 'Samsung S24 Ultra', q: 'Samsung Galaxy S24 Ultra' }
  ];

  // Initial load: get seeded products & loot deals
  useEffect(() => {
    loadInitialData();
  }, [countryCode]);

  const loadInitialData = async () => {
    try {
      const deals = await fetchLootDeals(countryCode);
      setLootDeals(deals);

      const prods = await fetchProducts(countryCode);
      if (prods && prods.length > 0) {
        handleSelectProduct(prods[0]);
      }
    } catch (err) {
      console.error('Failed to load initial shopping data', err);
    }
  };

  const handleSelectProduct = async (product: Product) => {
    setActiveProduct(product);
    try {
      const hist = await fetchProductHistory(product.id);
      setHistoryData(hist.timeline || []);
      if (hist.price_meter) {
        setActiveProduct((prev) => (prev ? { ...prev, price_meter: hist.price_meter } : prev));
      }
    } catch (err) {
      console.error('Failed to load history', err);
    }
  };

  const handleSearch = async (targetQuery?: string) => {
    const q = targetQuery || query;
    if (!q.trim()) return;
    setLoading(true);
    try {
      const result = await scrapeProduct(q, countryCode);
      await handleSelectProduct(result);
      // Refresh deals
      const deals = await fetchLootDeals(countryCode);
      setLootDeals(deals);
    } catch (err) {
      console.error('Error scraping product', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Search Box */}
      <div className="relative rounded-3xl bg-gradient-to-r from-blue-900/60 via-slate-900 to-indigo-900/40 border border-slate-700/70 p-6 sm:p-10 shadow-2xl overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-4 border border-blue-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            BuyHatke-Powered Multi-Store Price Scanner
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Compare Amazon & Flipkart Prices. <br />
            <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
              Track History & Never Overpay.
            </span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
            Paste any Amazon or Flipkart URL or search a product name. We scrape live deals, uncover active bank offers, graph past price drops, and alert you by email.
          </p>

          {/* Search Input Bar */}
          <div className="mt-6 flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Paste Amazon / Flipkart URL or search (e.g. Sony WH-1000XM5, iPhone 16)..."
                className="w-full pl-12 pr-4 py-3.5 bg-slate-800/90 border border-slate-700 rounded-2xl text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-inner"
              />
            </div>
            <button
              onClick={() => handleSearch()}
              disabled={loading}
              className="px-7 py-3.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-2xl font-semibold text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 shrink-0"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Scraping...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Scan & Compare</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2 mt-4 text-xs text-slate-400">
            <span>Try popular picks:</span>
            {quickPicks.map((pick) => (
              <button
                key={pick.label}
                onClick={() => {
                  setQuery(pick.q);
                  handleSearch(pick.q);
                }}
                className="px-3 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors"
              >
                {pick.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active Product Detailed Inspection */}
      {activeProduct && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Product Visuals & Specs */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              {/* Product Platform Badge & Availability */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  {activeProduct.platform.toUpperCase()}
                </span>
                {activeProduct.in_stock ? (
                  <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    In Stock
                  </span>
                ) : (
                  <span className="text-xs text-red-400 font-semibold">Currently Unavailable</span>
                )}
              </div>

              {/* Product Image fetched directly from real selling site (Amazon/Flipkart CDN) */}
              <div className="w-full h-72 rounded-2xl bg-white p-6 flex items-center justify-center mb-6 overflow-hidden">
                <img
                  src={activeProduct.image_url}
                  alt={activeProduct.title}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80";
                  }}
                  className="max-h-full max-w-full object-contain hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Title & Ratings */}
              <h2 className="text-xl font-bold text-white leading-snug mb-3 line-clamp-2">
                {activeProduct.title}
              </h2>

              <div className="flex items-center gap-3 text-xs text-slate-400 mb-6">
                <span className="flex items-center gap-1 px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-300 font-bold">
                  ★ {activeProduct.rating}
                </span>
                <span>({activeProduct.review_count.toLocaleString()} verified ratings)</span>
                {activeProduct.is_prime_or_assured && (
                  <span className="px-2 py-0.5 rounded bg-blue-600/30 text-blue-300 font-semibold text-[11px]">
                    ✓ Assured / Prime
                  </span>
                )}
              </div>

              {/* Price Row */}
              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-800 mb-6">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-extrabold text-white font-mono">
                    {currencySymbol}{activeProduct.current_price.toLocaleString()}
                  </span>
                  {activeProduct.original_mrp > activeProduct.current_price && (
                    <>
                      <span className="text-base text-slate-500 line-through font-mono">
                        {currencySymbol}{activeProduct.original_mrp.toLocaleString()}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold text-xs">
                        {activeProduct.discount_percent}% OFF
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={activeProduct.product_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-center text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
              >
                <span>Buy on {activeProduct.platform.toUpperCase()}</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                onClick={() => setIsAlertModalOpen(true)}
                className="py-3.5 px-5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold rounded-xl text-sm transition-all flex items-center justify-center gap-2"
              >
                <Bell className="w-4 h-4 text-blue-400" />
                <span>Track Price Drop</span>
              </button>
            </div>
          </div>

          {/* Right Column: BuyHatke Price Meter, Cross-Platform Comparison & Price Graph */}
          <div className="lg:col-span-7 space-y-6">
            {/* BuyHatke Price Meter Card */}
            {activeProduct.price_meter && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <Clock className="w-4 h-4 text-blue-400" />
                    BuyHatke "Price Meter" Verdict
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    activeProduct.price_meter.verdict === 'GREAT_PRICE'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : activeProduct.price_meter.verdict === 'FAIR_PRICE'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {activeProduct.price_meter.label}
                  </span>
                </div>

                <p className="text-sm text-slate-300 mb-5">
                  {activeProduct.price_meter.description}
                </p>

                {/* Score stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-800 text-center">
                    <span className="text-[11px] text-slate-400 block">Lowest Recorded</span>
                    <span className="text-sm font-bold text-emerald-400 font-mono">
                      {currencySymbol}{activeProduct.price_meter.lowest_price.toLocaleString()}
                    </span>
                  </div>
                  <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-800 text-center">
                    <span className="text-[11px] text-slate-400 block">Average Price</span>
                    <span className="text-sm font-bold text-amber-300 font-mono">
                      {currencySymbol}{activeProduct.price_meter.average_price.toLocaleString()}
                    </span>
                  </div>
                  <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-800 text-center">
                    <span className="text-[11px] text-slate-400 block">Highest Recorded</span>
                    <span className="text-sm font-bold text-red-400 font-mono">
                      {currencySymbol}{activeProduct.price_meter.highest_price.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Cross-Platform Comparison Box (Amazon vs Flipkart vs Croma) */}
            {activeProduct.comparison && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <Tag className="w-4 h-4 text-blue-400" />
                    Cross-Platform Side-by-Side Comparison
                  </h3>
                  {activeProduct.comparison.savings_difference > 0 && (
                    <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full font-bold">
                      Save {currencySymbol}{activeProduct.comparison.savings_difference.toLocaleString()} on {activeProduct.comparison.cheapest_store.toUpperCase()}!
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Amazon Price */}
                  <div className={`p-4 rounded-2xl border text-center ${
                    activeProduct.comparison.cheapest_store === 'amazon'
                      ? 'bg-blue-950/40 border-blue-500/50 shadow-md shadow-blue-500/10'
                      : 'bg-slate-800/40 border-slate-800'
                  }`}>
                    <div className="text-xs font-bold text-slate-300 uppercase mb-1">Amazon India</div>
                    <div className="text-lg font-bold font-mono text-white">
                      {currencySymbol}{activeProduct.comparison.amazon_price.toLocaleString()}
                    </div>
                    {activeProduct.comparison.cheapest_store === 'amazon' && (
                      <span className="inline-block mt-2 px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] rounded-full font-bold">
                        Cheapest Store 🏆
                      </span>
                    )}
                  </div>

                  {/* Flipkart Price */}
                  <div className={`p-4 rounded-2xl border text-center ${
                    activeProduct.comparison.cheapest_store === 'flipkart'
                      ? 'bg-blue-950/40 border-blue-500/50 shadow-md shadow-blue-500/10'
                      : 'bg-slate-800/40 border-slate-800'
                  }`}>
                    <div className="text-xs font-bold text-slate-300 uppercase mb-1">Flipkart</div>
                    <div className="text-lg font-bold font-mono text-white">
                      {currencySymbol}{activeProduct.comparison.flipkart_price.toLocaleString()}
                    </div>
                    {activeProduct.comparison.cheapest_store === 'flipkart' && (
                      <span className="inline-block mt-2 px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] rounded-full font-bold">
                        Cheapest Store 🏆
                      </span>
                    )}
                  </div>

                  {/* Croma Price */}
                  <div className="p-4 rounded-2xl border bg-slate-800/40 border-slate-800 text-center">
                    <div className="text-xs font-bold text-slate-300 uppercase mb-1">Croma Retail</div>
                    <div className="text-lg font-bold font-mono text-white">
                      {currencySymbol}{activeProduct.comparison.croma_price.toLocaleString()}
                    </div>
                    <span className="inline-block mt-2 px-2 py-0.5 bg-slate-800 text-slate-400 text-[10px] rounded-full font-medium">
                      In-Store Pickup
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Interactive Price History Chart */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-blue-400" />
                    Price Trend Timeline (Last 30 Days)
                  </h3>
                  <p className="text-xs text-slate-400">Interactive historical tracking points</p>
                </div>
              </div>
              <PriceChart
                data={historyData}
                currencySymbol={currencySymbol}
                lowestPrice={activeProduct.price_meter?.lowest_price}
              />
            </div>

            {/* Bank Offers & AI Review Sentiment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Bank Offers */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
                <h4 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-emerald-400" />
                  Active Bank Offers & Coupons
                </h4>
                {activeProduct.bank_offers && activeProduct.bank_offers.length > 0 ? (
                  <ul className="space-y-2">
                    {activeProduct.bank_offers.map((offer, i) => (
                      <li key={i} className="text-xs text-slate-300 bg-slate-800/60 p-2.5 rounded-xl border border-slate-800 flex items-start gap-2">
                        <span className="text-emerald-400 font-bold mt-0.5">•</span>
                        <span>{offer}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-400">No active bank offers detected right now.</p>
                )}
              </div>

              {/* AI Review Summary */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-400" />
                    AI Customer Sentiment
                  </h4>
                  <span className="text-[11px] px-2 py-0.5 bg-blue-500/10 text-blue-300 rounded-full font-semibold">
                    {activeProduct.fake_review_score}% Authentic
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1 mb-1">
                      <ThumbsUp className="w-3 h-3" /> Top Pros
                    </span>
                    <ul className="space-y-1 text-slate-300 pl-2">
                      {(activeProduct.pros || ['Great build quality', 'Reliable performance']).map((p, i) => (
                        <li key={i}>• {p}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1 mb-1">
                      <ThumbsDown className="w-3 h-3" /> Things to Keep in Mind
                    </span>
                    <ul className="space-y-1 text-slate-400 pl-2">
                      {(activeProduct.cons || ['Standard packaging']).map((c, i) => (
                        <li key={i}>• {c}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Curated Daily "Loot Deals" Feed */}
      {lootDeals && lootDeals.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <span>🔥</span> Daily "Loot Deals" Radar
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Products currently at 15%+ discounts across Amazon & Flipkart
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {lootDeals.map((deal) => (
              <div
                key={deal.id}
                onClick={() => handleSearch(deal.title)}
                className="bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 transition-all duration-200 cursor-pointer group shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="w-full h-40 rounded-xl bg-white p-3 flex items-center justify-center mb-3 overflow-hidden">
                    <img
                      src={deal.image_url}
                      alt={deal.title}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80";
                      }}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>

                  <span className="inline-block px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[11px] font-bold mb-2">
                    {deal.deal_badge}
                  </span>

                  <h4 className="text-xs font-semibold text-white line-clamp-2 mb-2 group-hover:text-blue-400 transition-colors">
                    {deal.title}
                  </h4>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-white font-mono">
                      {currencySymbol}{deal.current_price.toLocaleString()}
                    </div>
                    {deal.original_mrp > deal.current_price && (
                      <div className="text-[10px] text-slate-500 line-through font-mono">
                        {currencySymbol}{deal.original_mrp.toLocaleString()}
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-blue-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Inspect</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Alert Subscription Modal */}
      {activeProduct && (
        <AlertsModal
          isOpen={isAlertModalOpen}
          onClose={() => setIsAlertModalOpen(false)}
          productId={activeProduct.id}
          productTitle={activeProduct.title}
          currentPrice={activeProduct.current_price}
          currency={activeProduct.currency}
          currencySymbol={currencySymbol}
          onSuccess={() => {
            onAlertUpdated();
          }}
        />
      )}
    </div>
  );
};

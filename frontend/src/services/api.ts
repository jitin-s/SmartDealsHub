import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 
  (typeof window !== 'undefined' && window.location.hostname === 'localhost' 
    ? 'http://localhost:8000/api' 
    : '/api');

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

export interface Product {
  id: number;
  title: string;
  brand?: string;
  asin_or_pid: string;
  platform: string;
  country: string;
  category: string;
  current_price: number;
  original_mrp: number;
  currency: string;
  discount_percent: number;
  rating: number;
  review_count: number;
  image_url: string;
  product_url: string;
  in_stock: boolean;
  is_prime_or_assured: boolean;
  bank_offers?: string[];
  pros?: string[];
  cons?: string[];
  fake_review_score?: number;
  price_meter?: {
    verdict: string;
    label: string;
    description: string;
    score: number;
    lowest_price: number;
    highest_price: number;
    average_price: number;
  };
  comparison?: {
    cheapest_store: string;
    amazon_price: number;
    flipkart_price: number;
    croma_price: number;
    savings_difference: number;
  };
}

export interface DomainItem {
  registrar: string;
  logo: string;
  trap_score: string;
  trap_badge: string;
  reg_price: number;
  renewal_price: number;
  transfer_price: number;
  privacy_free: boolean;
  privacy_cost: number;
  icann_included: boolean;
  total_tco: number;
  avg_per_year: number;
  features: string[];
  url: string;
  currency_symbol: string;
}

export interface Country {
  code: string;
  name: string;
  flag: string;
  currency: string;
  currency_symbol: string;
  usd_rate: number;
  shopping_platforms: string[];
  quick_commerce: string[];
  popular_tlds: string[];
}

export const fetchCountries = async (): Promise<Country[]> => {
  const res = await api.get('/country/');
  return res.data;
};

export const scrapeProduct = async (urlOrQuery: string, country: string = 'IN'): Promise<Product> => {
  const res = await api.post(`/products/scrape?url_or_query=${encodeURIComponent(urlOrQuery)}&country=${country}`);
  return res.data;
};

export const fetchProducts = async (country: string = 'IN', category?: string): Promise<Product[]> => {
  const url = category ? `/products/?country=${country}&category=${category}` : `/products/?country=${country}`;
  const res = await api.get(url);
  return res.data;
};

export const fetchProductHistory = async (productId: number) => {
  const res = await api.get(`/products/${productId}/history`);
  return res.data;
};

export const fetchLootDeals = async (country: string = 'IN') => {
  const res = await api.get(`/products/deals/loot?country=${country}`);
  return res.data;
};

export const compareDomains = async (tld: string = '.com', years: number = 3, currency: string = 'USD'): Promise<DomainItem[]> => {
  const res = await api.get(`/domains/compare?tld=${tld}&years=${years}&currency=${currency}`);
  return res.data;
};

export const fetchTransferSavings = async (current: string = 'GoDaddy', tld: string = '.com', currency: string = 'USD') => {
  const res = await api.get(`/domains/transfer-savings?current=${current}&tld=${tld}&currency=${currency}`);
  return res.data;
};

export const fetchDomainTrends = async () => {
  const res = await api.get('/domains/trends');
  return res.data;
};

export const searchDomainNames = async (name: string, currency: string = 'USD') => {
  const res = await api.get(`/domains/search?name=${encodeURIComponent(name)}&currency=${currency}`);
  return res.data;
};

export const fetchAIServices = async (currency: string = 'USD') => {
  const res = await api.get(`/services/ai?currency=${currency}`);
  return res.data;
};

export const fetchVPSServices = async (currency: string = 'USD') => {
  const res = await api.get(`/services/vps?currency=${currency}`);
  return res.data;
};

export const fetchVPNServices = async () => {
  const res = await api.get('/services/vpn');
  return res.data;
};

export const fetchStreamingServices = async () => {
  const res = await api.get('/services/streaming');
  return res.data;
};

export const calculateGroceryBasket = async (indices?: number[]) => {
  const res = await api.post('/services/grocery/basket', indices || null);
  return res.data;
};

export const subscribePriceAlert = async (productId: number, email: string, targetPrice: number, currency: string) => {
  const res = await api.post('/alerts/subscribe', {
    product_id: productId,
    user_email: email,
    target_price: targetPrice,
    currency
  });
  return res.data;
};

export const fetchAlerts = async () => {
  const res = await api.get('/alerts/');
  return res.data;
};

export const testTriggerAlert = async (alertId: number) => {
  const res = await api.post(`/alerts/test-trigger/${alertId}`);
  return res.data;
};

export const fetchAlertLogs = async () => {
  const res = await api.get('/alerts/logs');
  return res.data;
};

export default api;

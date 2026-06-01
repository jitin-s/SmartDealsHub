import React, { useState } from 'react';
import { Bell, Check, X, AlertCircle, Send } from 'lucide-react';
import { subscribePriceAlert, testTriggerAlert } from '../services/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  productId: number;
  productTitle: string;
  currentPrice: number;
  currency: string;
  currencySymbol: string;
  onSuccess: () => void;
}

export const AlertsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  productId,
  productTitle,
  currentPrice,
  currency,
  currencySymbol,
  onSuccess
}) => {
  const [email, setEmail] = useState('');
  const [targetPrice, setTargetPrice] = useState<number>(Math.round(currentPrice * 0.9));
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [createdAlertId, setCreatedAlertId] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleQuickPercent = (pct: number) => {
    setTargetPrice(Math.round(currentPrice * (1 - pct / 100)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setMessage({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const res = await subscribePriceAlert(productId, email, targetPrice, currency);
      setCreatedAlertId(res.alert_id);
      setMessage({
        type: 'success',
        text: `Alert registered! We'll email you at ${email} when the price drops below ${currencySymbol}${targetPrice.toLocaleString()}.`
      });
      onSuccess();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.detail || 'Failed to subscribe to alert.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateTest = async () => {
    if (!createdAlertId) return;
    setLoading(true);
    try {
      await testTriggerAlert(createdAlertId);
      setMessage({
        type: 'success',
        text: `⚡ Test alert generated & sent! Check the delivery log in the Watchlist tab.`
      });
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Failed to simulate alert.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">Set Price Drop Email Alert</h3>
            <p className="text-xs text-slate-400">Never miss a flash deal or discount</p>
          </div>
        </div>

        <div className="bg-slate-800/60 rounded-xl p-3 mb-4 border border-slate-800">
          <p className="text-xs text-slate-300 line-clamp-2 font-medium mb-1.5">{productTitle}</p>
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Current Price:</span>
            <span className="font-bold text-white font-mono text-sm">
              {currencySymbol}{currentPrice.toLocaleString()}
            </span>
          </div>
        </div>

        {message && (
          <div
            className={`p-3 rounded-xl mb-4 text-xs flex items-start gap-2 ${
              message.type === 'success'
                ? 'bg-emerald-900/30 border border-emerald-700/50 text-emerald-300'
                : 'bg-red-900/30 border border-red-700/50 text-red-300'
            }`}
          >
            {message.type === 'success' ? (
              <Check className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Your Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. yourname@gmail.com"
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300">
                Target Price Threshold ({currencySymbol})
              </label>
              <span className="text-[10px] text-blue-400 font-mono">
                {Math.round(((currentPrice - targetPrice) / currentPrice) * 100)}% off current
              </span>
            </div>
            <input
              type="number"
              required
              value={targetPrice}
              onChange={(e) => setTargetPrice(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono font-bold text-sm focus:outline-none focus:border-blue-500"
            />
            
            {/* Quick % drop pills */}
            <div className="flex gap-2 mt-2">
              {[5, 10, 15, 20].map((pct) => (
                <button
                  type="button"
                  key={pct}
                  onClick={() => handleQuickPercent(pct)}
                  className="flex-1 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-semibold text-slate-300"
                >
                  -{pct}%
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl font-medium text-sm transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
          >
            <Bell className="w-4 h-4" />
            <span>{loading ? 'Registering...' : 'Activate Price Drop Alert'}</span>
          </button>
        </form>

        {createdAlertId && (
          <div className="mt-4 pt-4 border-t border-slate-800 text-center">
            <button
              onClick={handleSimulateTest}
              disabled={loading}
              className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-medium py-1 px-3 rounded-lg hover:bg-blue-500/10 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Simulated Email Trigger Now (Test)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

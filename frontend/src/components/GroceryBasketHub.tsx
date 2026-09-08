import React, { useState, useEffect } from 'react';
import { Apple, ShoppingBag, Check, Zap, Clock, TrendingDown } from 'lucide-react';
import { calculateGroceryBasket } from '../services/api';

export const GroceryBasketHub: React.FC = () => {
  const [basketData, setBasketData] = useState<any>(null);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([0, 1, 2, 3, 4, 5]);

  useEffect(() => {
    loadBasket();
  }, [selectedIndices]);

  const loadBasket = async () => {
    try {
      const data = await calculateGroceryBasket(selectedIndices);
      setBasketData(data);
    } catch (err) {
      console.error('Failed to calculate basket', err);
    }
  };

  const toggleItem = (idx: number) => {
    setSelectedIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-lime-950/60 via-slate-900 to-emerald-950/40 border border-slate-700/70 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-500/20 text-lime-300 text-xs font-semibold mb-4 border border-lime-500/30">
            <Apple className="w-3.5 h-3.5" />
            Quick-Commerce 10-Min Grocery Optimizer
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Which 10-Minute Grocery App is Cheapest? <br />
            <span className="bg-gradient-to-r from-lime-400 via-emerald-300 to-teal-400 bg-clip-text text-transparent">
              Compare Blinkit, Zepto, Swiggy Instamart & BigBasket.
            </span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
            Select items in your daily grocery basket. We calculate your final out-of-pocket bill including surge charges, platform fees, and doorstep handling fees.
          </p>
        </div>
      </div>

      {basketData && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Interactive Grocery Checklist */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-lime-400" />
                Customize Daily Grocery Essentials
              </h3>
              <span className="text-xs text-slate-400">
                {selectedIndices.length} items in cart
              </span>
            </div>

            <div className="divide-y divide-slate-800">
              {basketData.items.map((item: any, idx: number) => {
                const isChecked = selectedIndices.includes(idx);
                return (
                  <div
                    key={item.name}
                    onClick={() => toggleItem(idx)}
                    className={`py-3.5 px-3 rounded-xl cursor-pointer transition-all flex items-center justify-between ${
                      isChecked ? 'bg-slate-800/40 hover:bg-slate-800/60' : 'opacity-50 hover:opacity-75'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                        isChecked ? 'bg-lime-600 border-lime-500 text-white' : 'border-slate-600'
                      }`}>
                        {isChecked && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white">{item.name}</div>
                        <div className="text-xs text-slate-400">{item.category}</div>
                      </div>
                    </div>

                    <div className="text-right font-mono text-xs text-slate-300">
                      <div>₹{item.zepto} (Zepto)</div>
                      <div className="text-[10px] text-slate-500">₹{item.blinkit} (Blinkit)</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Platform Comparison Cards */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="font-bold text-white text-lg flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-emerald-400" />
              Final Out-of-Pocket Basket Totals
            </h3>

            {Object.entries(basketData.comparison).map(([platform, data]: [string, any]) => {
              const isCheapest = platform === basketData.cheapest_store;
              return (
                <div
                  key={platform}
                  className={`p-5 rounded-3xl border transition-all ${
                    isCheapest
                      ? 'bg-emerald-950/30 border-emerald-500/50 shadow-xl shadow-emerald-500/10'
                      : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-white text-base">{platform}</span>
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5" />
                      {data.time}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between mb-3">
                    <span className="text-xs text-slate-400">
                      Subtotal ₹{data.subtotal.toFixed(2)} + Fees ₹{data.handling_fee.toFixed(2)}
                    </span>
                    <span className={`text-2xl font-extrabold font-mono ${
                      isCheapest ? 'text-emerald-400' : 'text-white'
                    }`}>
                      ₹{data.total.toFixed(2)}
                    </span>
                  </div>

                  {isCheapest && (
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 bg-emerald-500/20 px-3 py-1.5 rounded-xl border border-emerald-500/30">
                      <Zap className="w-4 h-4 text-emerald-400" />
                      <span>Cheapest Store Overall • Save up to ₹{basketData.max_savings.toFixed(2)}!</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

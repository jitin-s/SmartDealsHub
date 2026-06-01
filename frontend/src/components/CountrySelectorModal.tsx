import React from 'react';
import { Globe, Check, ShieldCheck } from 'lucide-react';
import type { Country } from '../services/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  countries: Country[];
  selectedCountry: Country | null;
  onSelectCountry: (country: Country) => void;
}

export const CountrySelectorModal: React.FC<Props> = ({
  isOpen,
  onClose,
  countries,
  selectedCountry,
  onSelectCountry
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-500/20 text-blue-400 mb-3">
            <Globe className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Select Your Region & Currency</h2>
          <p className="text-slate-400 text-sm mt-1">
            Tailor shopping platform scrapers (Amazon, Flipkart, Walmart), domain registrars, and price alerts to your location.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {countries.map((c) => {
            const isSelected = selectedCountry?.code === c.code;
            return (
              <button
                key={c.code}
                onClick={() => {
                  onSelectCountry(c);
                  onClose();
                }}
                className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all duration-150 ${
                  isSelected
                    ? 'border-blue-500 bg-blue-600/20 text-white ring-1 ring-blue-500'
                    : 'border-slate-800 bg-slate-800/60 hover:bg-slate-800 hover:border-slate-600 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{c.flag}</span>
                  <div>
                    <div className="font-semibold text-white">{c.name}</div>
                    <div className="text-xs text-slate-400">
                      Currency: <span className="font-mono text-blue-400 font-bold">{c.currency_symbol} {c.currency}</span>
                    </div>
                  </div>
                </div>
                {isSelected && <Check className="w-5 h-5 text-blue-400" />}
              </button>
            );
          })}
        </div>

        <div className="bg-slate-800/40 rounded-xl p-3.5 border border-slate-800 flex items-start gap-3 text-xs text-slate-400 mb-5">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <span>
            You can seamlessly switch regions and currencies at any time from the top navigation bar.
          </span>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-colors shadow-lg shadow-blue-600/30"
        >
          Confirm & Continue
        </button>
      </div>
    </div>
  );
};

import React from 'react';
import { 
  ShoppingCart, 
  Globe, 
  Cpu, 
  Server, 
  Shield, 
  Apple, 
  Bell, 
  ChevronDown,
  Sparkles
} from 'lucide-react';
import type { Country } from '../services/api';

export type TabType = 'shopping' | 'domains' | 'ai' | 'cloud' | 'vpn' | 'grocery' | 'alerts';

interface Props {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  selectedCountry: Country | null;
  onOpenCountryModal: () => void;
  activeAlertsCount: number;
}

export const Navbar: React.FC<Props> = ({
  activeTab,
  onTabChange,
  selectedCountry,
  onOpenCountryModal,
  activeAlertsCount
}) => {
  const navItems: { id: TabType; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'shopping', label: 'Shopping & Deals', icon: <ShoppingCart className="w-4 h-4" /> },
    { id: 'domains', label: 'Domains & TCO', icon: <Globe className="w-4 h-4" /> },
    { id: 'ai', label: 'AI Subscriptions', icon: <Cpu className="w-4 h-4" />, badge: '🔥 Hot' },
    { id: 'cloud', label: 'Cloud VPS', icon: <Server className="w-4 h-4" /> },
    { id: 'vpn', label: 'VPNs & Streaming', icon: <Shield className="w-4 h-4" /> },
    { id: 'grocery', label: 'Quick Grocery', icon: <Apple className="w-4 h-4" /> },
    { id: 'alerts', label: 'Watchlist', icon: <Bell className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onTabChange('shopping')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-white tracking-tight flex items-center gap-1.5">
                SmartDeals <span className="text-blue-400 font-medium">Hub</span>
              </span>
              <p className="text-[10px] text-slate-400 -mt-0.5 tracking-wide uppercase font-semibold">
                Multi-Platform Price Intelligence
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-800/60 p-1 rounded-xl border border-slate-700/60">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="bg-amber-500/20 text-amber-300 text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                      {item.badge}
                    </span>
                  )}
                  {item.id === 'alerts' && activeAlertsCount > 0 && (
                    <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                      {activeAlertsCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action: Country Switcher */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenCountryModal}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors shadow-sm"
              title="Change Country & Currency"
            >
              <span className="text-base">{selectedCountry?.flag || '🌐'}</span>
              <span className="font-bold text-blue-400 font-mono">
                {selectedCountry?.currency_symbol || '$'} {selectedCountry?.currency || 'USD'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation row */}
        <div className="flex md:hidden overflow-x-auto py-2 gap-1 border-t border-slate-800/80 scrollbar-none">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-1.5 whitespace-nowrap px-3 py-1 rounded-lg text-xs font-medium ${
                  isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

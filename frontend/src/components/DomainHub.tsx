import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Search, 
  ArrowRightLeft, 
  TrendingUp, 
  ExternalLink, 
  Check, 
  X
} from 'lucide-react';
import { type DomainItem, compareDomains, fetchTransferSavings, fetchDomainTrends, searchDomainNames } from '../services/api';

interface Props {
  currency: string;
  currencySymbol: string;
}

export const DomainHub: React.FC<Props> = ({ currency, currencySymbol }) => {
  const [selectedTld, setSelectedTld] = useState('.com');
  const [years, setYears] = useState(3);
  const [registrars, setRegistrars] = useState<DomainItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [transferSavings, setTransferSavings] = useState<any>(null);
  const [currentRegistrar, setCurrentRegistrar] = useState('GoDaddy');
  const [trends, setTrends] = useState<any[]>([]);

  const tldOptions = ['.com', '.in', '.io', '.ai', '.org', '.net'];

  useEffect(() => {
    loadComparison();
    loadTrends();
    loadSavings();
  }, [selectedTld, years, currency]);

  const loadComparison = async () => {
    try {
      const data = await compareDomains(selectedTld, years, currency);
      setRegistrars(data);
    } catch (err) {
      console.error('Failed to load domain comparison', err);
    }
  };

  const loadSavings = async () => {
    try {
      const data = await fetchTransferSavings(currentRegistrar, selectedTld, currency);
      setTransferSavings(data);
    } catch (err) {
      console.error('Failed to load transfer savings', err);
    }
  };

  const loadTrends = async () => {
    try {
      const data = await fetchDomainTrends();
      setTrends(data);
    } catch (err) {
      console.error('Failed to load trends', err);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const data = await searchDomainNames(searchQuery, currency);
      setSearchResults(data.results || []);
    } catch (err) {
      console.error('Failed to search domain', err);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-900/60 via-slate-900 to-purple-900/40 border border-slate-700/70 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-4 border border-indigo-500/30">
            <Globe className="w-3.5 h-3.5" />
            Domain Registrar & Renewal Transparency Hub
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Expose Hidden Domain Renewal Hikes. <br />
            <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-purple-400 bg-clip-text text-transparent">
              Calculate True Multi-Year Cost of Ownership.
            </span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
            Never fall for ₹99 or $0.99 introductory traps. Compare true 2nd-year renewal fees, hidden WHOIS privacy charges, ICANN fees, and registry price inflation trends.
          </p>

          {/* Domain Availability Scanner */}
          <div className="mt-6 flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Check domain availability (e.g. brandname, mystartup)..."
                className="w-full pl-12 pr-4 py-3.5 bg-slate-800/90 border border-slate-700 rounded-2xl text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-inner"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-7 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>Scan All TLDs</span>
            </button>
          </div>
        </div>
      </div>

      {/* Multi-TLD Search Results Grid */}
      {searchResults.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🔎</span> Availability Across Top TLDs for "{searchQuery}"
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {searchResults.map((res) => (
              <div
                key={res.domain}
                className="p-4 rounded-2xl bg-slate-800/50 border border-slate-800 flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-white font-mono text-base">{res.domain}</div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Cheapest on <span className="text-indigo-400 font-semibold">{res.best_registrar}</span>
                  </div>
                  <div className="text-xs text-slate-300 font-mono mt-1">
                    Reg: <strong className="text-emerald-400">{res.currency_symbol}{res.best_price}</strong> | Ren: {res.currency_symbol}{res.renewal_price}/yr
                  </div>
                </div>
                <a
                  href={res.buy_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 rounded-xl text-xs font-semibold transition-all flex items-center gap-1"
                >
                  <span>Register</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Controls: TLD Switcher & TCO Duration Slider */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        {/* TLD Pills */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Select Extension (TLD)
          </label>
          <div className="flex flex-wrap gap-2">
            {tldOptions.map((tld) => (
              <button
                key={tld}
                onClick={() => setSelectedTld(tld)}
                className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all ${
                  selectedTld === tld
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-105'
                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {tld}
              </button>
            ))}
          </div>
        </div>

        {/* TCO Slider */}
        <div className="w-full md:w-80">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Cost Duration
            </label>
            <span className="text-xs font-extrabold text-indigo-400 font-mono px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/30">
              {years} {years === 1 ? 'Year' : 'Years'} Total
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
            <span>1 yr</span>
            <span>3 yrs (Standard)</span>
            <span>5 yrs</span>
            <span>10 yrs</span>
          </div>
        </div>
      </div>

      {/* Registrar Comparison Matrix Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              {selectedTld} Registrar Price Matrix (Ranked by {years}-Year Total Cost)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Includes 1st year promo, subsequent renewals, WHOIS privacy, and ICANN fees.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> Honest
            </span>
            <span className="flex items-center gap-1 text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-400" /> Moderate
            </span>
            <span className="flex items-center gap-1 text-red-400">
              <span className="w-2 h-2 rounded-full bg-red-400" /> Bait-and-Switch
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/60 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-6">Registrar</th>
                <th className="py-3.5 px-4">Trap Score</th>
                <th className="py-3.5 px-4">1st Year Promo</th>
                <th className="py-3.5 px-4">True Renewal / yr</th>
                <th className="py-3.5 px-4">WHOIS Privacy</th>
                <th className="py-3.5 px-4 text-right">{years}-Yr Total Cost (TCO)</th>
                <th className="py-3.5 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {registrars.map((reg, idx) => (
                <tr
                  key={reg.registrar}
                  className={`hover:bg-slate-800/40 transition-colors ${
                    idx === 0 ? 'bg-indigo-950/20' : ''
                  }`}
                >
                  <td className="py-4 px-6">
                    <div className="font-bold text-white text-sm">{reg.registrar}</div>
                    <div className="text-[11px] text-slate-400">{reg.features.slice(0, 2).join(' • ')}</div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      reg.trap_score === 'Honest'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : reg.trap_score === 'Moderate'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-red-500/20 text-red-300 border border-red-500/30'
                    }`}>
                      {reg.trap_badge}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-mono font-bold text-white text-sm">
                    {currencySymbol}{reg.reg_price.toLocaleString()}
                  </td>
                  <td className="py-4 px-4 font-mono text-slate-300 text-sm">
                    {currencySymbol}{reg.renewal_price.toLocaleString()}
                  </td>
                  <td className="py-4 px-4">
                    {reg.privacy_free ? (
                      <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                        <Check className="w-4 h-4" /> Free Forever
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-400 font-semibold">
                        <X className="w-4 h-4" /> +{currencySymbol}{reg.privacy_cost}/yr
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="font-mono font-extrabold text-white text-base">
                      {currencySymbol}{reg.total_tco.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      ~{currencySymbol}{reg.avg_per_year}/yr
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <a
                      href={reg.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white border border-slate-700 transition-all font-medium text-xs"
                    >
                      <span>Visit</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Domain Transfer Savings Calculator Box */}
      {transferSavings && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1">
                <ArrowRightLeft className="w-4 h-4" />
                Domain Transfer Savings Calculator
              </div>
              <h3 className="text-xl font-bold text-white">
                How Much Will You Save by Moving Away from Your Current Registrar?
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-400">Current Registrar:</label>
              <select
                value={currentRegistrar}
                onChange={(e) => {
                  setCurrentRegistrar(e.target.value);
                  loadSavings();
                }}
                className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="GoDaddy">GoDaddy</option>
                <option value="Namecheap">Namecheap</option>
                <option value="Hostinger">Hostinger</option>
                <option value="BigRock (India Focus)">BigRock</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">Current Registrar Yearly Cost</span>
              <span className="text-xl font-bold text-slate-300 font-mono">
                {currencySymbol}{transferSavings.current_yearly_cost}
              </span>
              <span className="text-[11px] text-slate-500 block mt-1">Renewal + Privacy + ICANN</span>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/40">
              <span className="text-xs text-indigo-300 block mb-1">Recommended Wholesale ({transferSavings.recommended_registrar})</span>
              <span className="text-xl font-bold text-emerald-400 font-mono">
                {currencySymbol}{transferSavings.recommended_yearly_cost}
              </span>
              <span className="text-[11px] text-emerald-500 block mt-1">At-Cost Wholesale + Free Privacy</span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40">
              <span className="text-xs text-emerald-300 block mb-1">3-Year Accumulated Savings</span>
              <span className="text-2xl font-extrabold text-emerald-400 font-mono">
                {currencySymbol}{transferSavings.three_year_savings}
              </span>
              <span className="text-[11px] text-emerald-300 block mt-1">
                Save {currencySymbol}{transferSavings.yearly_savings} every single year
              </span>
            </div>
          </div>

          <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-800">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              4-Step Zero-Downtime Transfer Guide:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-slate-300">
              {transferSavings.transfer_steps.map((step: string, i: number) => (
                <div key={i} className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-800">
                  {step}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Historical TLD Price Trends */}
      {trends.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            Registry Wholesale Price Inflation History
          </div>
          <h3 className="text-xl font-bold text-white mb-4">
            How Registry Hikes Drive Up .COM, .IO, and .AI Prices
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {trends.map((tr) => (
              <div key={tr.tld} className="p-4 rounded-2xl bg-slate-800/50 border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-bold font-mono text-indigo-400">{tr.tld}</span>
                  <span className="text-xs text-slate-400">{tr.registry}</span>
                </div>
                <p className="text-xs text-slate-300 mb-3">{tr.notes}</p>
                <div className="space-y-1.5 font-mono text-xs">
                  {tr.trend_data.slice(-3).map((d: any) => (
                    <div key={d.year} className="flex justify-between text-slate-400 text-[11px]">
                      <span>{d.year}:</span>
                      <span>Wholesale: ${d.wholesale.toFixed(2)} → Avg Retail: ${d.retail_avg.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Cpu, Zap, Check, ExternalLink } from 'lucide-react';
import { fetchAIServices } from '../services/api';

interface Props {
  currency: string;
  currencySymbol: string;
}

export const AIServicesHub: React.FC<Props> = ({ currency }) => {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [tokenBoard, setTokenBoard] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, [currency]);

  const loadData = async () => {
    try {
      const data = await fetchAIServices(currency);
      setSubscriptions(data.subscriptions || []);
      setTokenBoard(data.api_token_board || []);
    } catch (err) {
      console.error('Failed to load AI services', err);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-blue-950/40 border border-slate-700/70 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold mb-4 border border-cyan-500/30">
            <Cpu className="w-3.5 h-3.5" />
            AI Subscription & LLM Token Benchmark
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Which AI Subscription Is Truly Worth \$20/mo? <br />
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
              Compare Features, Context Windows & API Token Pricing.
            </span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
            Side-by-side breakdown of ChatGPT Plus, Claude Pro, Gemini Advanced, Cursor Pro, and the live per-million-token developer API leaderboard.
          </p>
        </div>
      </div>

      {/* Flagship Subscription Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {subscriptions.map((sub) => {
          const priceDisplay = currency === 'INR' ? `₹${sub.monthly_inr}` : `$${sub.monthly_usd}`;
          return (
            <div
              key={sub.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between hover:border-slate-700 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{sub.provider}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {sub.badge}
                  </span>
                </div>

                <h3 className="text-xl font-extrabold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                  {sub.name}
                </h3>

                <div className="mb-4">
                  <span className="text-3xl font-extrabold text-white font-mono">{priceDisplay}</span>
                  <span className="text-xs text-slate-400"> / month</span>
                </div>

                {/* Models included */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {sub.models.map((m: string) => (
                    <span key={m} className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-300 font-mono">
                      {m}
                    </span>
                  ))}
                </div>

                {/* Key features */}
                <ul className="space-y-2 text-xs text-slate-300 mb-5">
                  {sub.key_features.map((feat: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href={sub.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-slate-800 hover:bg-cyan-600 hover:text-white text-slate-200 rounded-xl font-semibold text-xs transition-all flex items-center justify-center gap-2 border border-slate-700 hover:border-cyan-500"
              >
                <span>View {sub.name}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          );
        })}
      </div>

      {/* Real-time Per-1M-Token Developer API Board */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              Developer API Token Price Board (Per 1 Million Tokens)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Live pricing for raw LLM API calls — compare DeepSeek vs OpenAI vs Anthropic vs Google
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/60 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-6">Model</th>
                <th className="py-3.5 px-4">Provider</th>
                <th className="py-3.5 px-4">Input / 1M Tokens</th>
                <th className="py-3.5 px-4">Output / 1M Tokens</th>
                <th className="py-3.5 px-4">Context Window</th>
                <th className="py-3.5 px-6">Value Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {tokenBoard.map((item) => (
                <tr key={item.model} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-6 font-bold text-white font-mono text-sm">{item.model}</td>
                  <td className="py-4 px-4 text-slate-300">{item.provider}</td>
                  <td className="py-4 px-4 font-mono font-bold text-emerald-400 text-sm">
                    ${item.input_per_million.toFixed(3)}
                  </td>
                  <td className="py-4 px-4 font-mono font-bold text-cyan-400 text-sm">
                    ${item.output_per_million.toFixed(2)}
                  </td>
                  <td className="py-4 px-4 font-mono text-slate-400">{item.context}</td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-800 text-slate-200 border border-slate-700">
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

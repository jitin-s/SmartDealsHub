import React, { useState, useEffect } from 'react';
import { Server, HardDrive, Cpu, Wifi } from 'lucide-react';
import { fetchVPSServices } from '../services/api';

interface Props {
  currency: string;
  currencySymbol: string;
}

export const CloudVPSHub: React.FC<Props> = ({ currency }) => {
  const [providers, setProviders] = useState<any[]>([]);

  useEffect(() => {
    loadVPS();
  }, [currency]);

  const loadVPS = async () => {
    try {
      const data = await fetchVPSServices(currency);
      setProviders(data.providers || []);
    } catch (err) {
      console.error('Failed to load VPS services', err);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="rounded-3xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/40 border border-slate-700/70 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-4 border border-emerald-500/30">
            <Server className="w-3.5 h-3.5" />
            Cloud VPS & Compute Hardware Benchmark
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Maximum Hardware Specs Per Dollar. <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Compare Hetzner, DigitalOcean, Vultr & AWS Lightsail.
            </span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
            Uncover bandwidth overage costs, extra charges for dedicated IPv4 addresses, and true monthly pricing across top cloud server providers.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {providers.map((p) => {
          const price = currency === 'INR' ? `₹${p.price_inr}` : `$${p.price_usd}`;
          return (
            <div
              key={p.provider}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between hover:border-emerald-500/50 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{p.provider}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {p.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{p.plan}</h3>

                <div className="mb-6">
                  <span className="text-3xl font-extrabold text-white font-mono">{price}</span>
                  <span className="text-xs text-slate-400"> / month</span>
                </div>

                <div className="space-y-3 text-xs mb-6">
                  <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-800/60 border border-slate-800">
                    <Cpu className="w-4 h-4 text-emerald-400" />
                    <span className="font-semibold text-white">{p.vcpu}</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-800/60 border border-slate-800">
                    <HardDrive className="w-4 h-4 text-emerald-400" />
                    <span className="font-semibold text-white">{p.ram}</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-800/60 border border-slate-800">
                    <HardDrive className="w-4 h-4 text-teal-400" />
                    <span className="font-semibold text-white">{p.storage}</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-800/60 border border-slate-800">
                    <Wifi className="w-4 h-4 text-cyan-400" />
                    <span className="font-semibold text-white">{p.bandwidth}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed mb-4">{p.notes}</p>
              </div>

              <div className="pt-2">
                <span className={`inline-block w-full py-2 rounded-xl text-center text-xs font-bold ${
                  p.trap_score === 'Honest'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  Pricing Model: {p.trap_score}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

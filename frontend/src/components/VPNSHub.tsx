import React, { useState, useEffect } from 'react';
import { Shield, Tv, Check, ExternalLink, Users } from 'lucide-react';
import { fetchVPNServices, fetchStreamingServices } from '../services/api';

export const VPNSHub: React.FC = () => {
  const [vpns, setVpns] = useState<any[]>([]);
  const [streaming, setStreaming] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const vpnData = await fetchVPNServices();
      setVpns(vpnData.providers || []);

      const streamData = await fetchStreamingServices();
      setStreaming(streamData.bundles || []);
    } catch (err) {
      console.error('Failed to load VPN & streaming services', err);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* VPN Section Header */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-950/50 via-slate-900 to-rose-950/40 border border-slate-700/70 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-4 border border-amber-500/30">
            <Shield className="w-3.5 h-3.5" />
            VPN Renewal Trap & True Cost Detector
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Stop Falling for 2-Year VPN Promo Traps. <br />
            <span className="bg-gradient-to-r from-amber-400 via-orange-300 to-rose-400 bg-clip-text text-transparent">
              Flat Pricing vs 150%+ Auto-Renewal Hikes.
            </span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
            Compare honest flat-rate privacy services like Mullvad (€5/mo forever, no email required) versus promotional VPNs that quietly hike your card upon renewal.
          </p>
        </div>
      </div>

      {/* VPN Provider Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {vpns.map((vpn) => (
          <div
            key={vpn.provider}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-bold text-white">{vpn.provider}</h3>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  vpn.trap_score === 'Honest'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {vpn.trap_badge}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-800 mb-4">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-xs text-slate-400">Intro / Promo Price:</span>
                  <span className="text-base font-bold font-mono text-white">${vpn.promo_price_usd}/mo</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-slate-400">True Renewal Rate:</span>
                  <span className={`text-base font-bold font-mono ${
                    vpn.trap_score === 'Honest' ? 'text-emerald-400' : 'text-red-400'
                  }`}>
                    ${vpn.renewal_price_usd}/mo
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-300 mb-4">
                <strong className="text-slate-400 block mb-1">Logging Policy:</strong>
                {vpn.logging_policy}
              </div>

              <ul className="space-y-1.5 text-xs text-slate-400 mb-6">
                {vpn.features.map((f: string, i: number) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-400" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <a
              href={vpn.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold text-center flex items-center justify-center gap-2 border border-slate-700"
            >
              <span>Visit {vpn.provider}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        ))}
      </div>

      {/* Streaming OTT & Telecom Perks Section */}
      <div className="mt-12 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-400 mb-2">
          <Tv className="w-4 h-4" />
          OTT Streaming & Family Plan Cost-Splitter
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">
          Save Up to 75% on Entertainment with Family Sharing & Telecom Bundles
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          Check per-member cost splits and telecom inclusions before purchasing direct subscriptions.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {streaming.map((item) => (
            <div key={item.platform} className="p-5 rounded-2xl bg-slate-800/50 border border-slate-800">
              <h4 className="text-lg font-bold text-white mb-3 flex items-center justify-between">
                <span>{item.platform}</span>
                <span className="p-1 rounded-lg bg-rose-500/10 text-rose-400">
                  <Users className="w-4 h-4" />
                </span>
              </h4>

              <div className="space-y-2 text-xs mb-4">
                <div className="flex justify-between text-slate-400">
                  <span>Single / Basic:</span>
                  <span className="font-mono text-slate-200">{item.basic_plan}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Premium Plan:</span>
                  <span className="font-mono text-slate-200">{item.premium_plan}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 mb-3">
                <span className="text-[11px] text-emerald-400 font-bold block mb-0.5">Family Cost-Split:</span>
                <span className="text-sm font-bold text-emerald-300 font-mono">{item.family_split_cost}</span>
              </div>

              <div className="text-[11px] text-slate-400 leading-relaxed bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60">
                <strong className="text-slate-300 block mb-0.5">Telecom Perks:</strong>
                {item.telecom_bundle}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

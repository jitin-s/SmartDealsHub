import React, { useState, useEffect } from 'react';
import { Bell, Send, Mail, RefreshCw } from 'lucide-react';
import { fetchAlerts, testTriggerAlert, fetchAlertLogs } from '../services/api';

interface Props {
  currencySymbol: string;
}

export const AlertsView: React.FC<Props> = ({ currencySymbol }) => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const alertData = await fetchAlerts();
      setAlerts(alertData);

      const logData = await fetchAlertLogs();
      setLogs(logData);
    } catch (err) {
      console.error('Failed to load alerts', err);
    }
  };

  const handleTriggerTest = async (alertId: number) => {
    setActionMessage(null);
    try {
      const res = await testTriggerAlert(alertId);
      setActionMessage(`⚡ ${res.message}! Check the sent log below.`);
      await loadData();
    } catch (err) {
      console.error('Failed to trigger alert test', err);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/40 border border-slate-700/70 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-4 border border-blue-500/30">
            <Bell className="w-3.5 h-3.5" />
            Active Watchlist & Automated Price Monitors
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Tracked Items & Email Alerts. <br />
            <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
              Continuous Background Price Monitoring.
            </span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
            Our background worker monitors prices every 30 minutes. When a product drops to or below your target price, an automated HTML email notification is dispatched instantly.
          </p>
        </div>
      </div>

      {actionMessage && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 text-sm flex items-center justify-between shadow-lg">
          <span>{actionMessage}</span>
          <button onClick={() => setActionMessage(null)} className="text-xs underline hover:text-white">
            Dismiss
          </button>
        </div>
      )}

      {/* Active Alerts Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span>🎯</span> Active Watchlist Items ({alerts.length})
          </h3>
          <button
            onClick={loadData}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium border border-slate-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>

        {alerts.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400">
            <Bell className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-semibold text-white">No items tracked yet</p>
            <p className="text-xs text-slate-500 mt-1">
              Go to the Shopping tab, search any product, and click "Track Price Drop" to set an alert.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {alerts.map((al) => (
              <div
                key={al.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      {al.platform}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      al.is_triggered
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {al.is_triggered ? 'Triggered & Sent' : 'Actively Monitoring'}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white line-clamp-2 mb-3">
                    {al.product_title}
                  </h4>

                  <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-800 space-y-2 text-xs mb-4">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Current Price:</span>
                      <span className="font-bold text-white font-mono">
                        {currencySymbol}{al.current_price.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Target Alert Price:</span>
                      <span className="font-bold text-emerald-400 font-mono">
                        {currencySymbol}{al.target_price.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-700/50 text-[11px]">
                      <span className="text-slate-400">Notify:</span>
                      <span className="text-blue-400 truncate max-w-[170px]">{al.user_email}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => handleTriggerTest(al.id)}
                    className="w-full py-2.5 px-3 bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Simulated Test Email</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dispatched Notification History Log */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-400" />
              Dispatched Email Alerts Audit Log
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Live delivery log of price drop notifications generated by the scheduler or manual triggers
            </p>
          </div>
        </div>

        {logs.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            No notification logs yet. Click "Send Simulated Test Email" above to trigger an alert.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/60 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-6">Recipient Email</th>
                  <th className="py-3.5 px-4">Subject</th>
                  <th className="py-3.5 px-4">Old → New Price</th>
                  <th className="py-3.5 px-4">Platform</th>
                  <th className="py-3.5 px-4">Delivery Mode</th>
                  <th className="py-3.5 px-6">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono">
                {logs.map((log, i) => (
                  <tr key={i} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-6 text-white font-sans">{log.to}</td>
                    <td className="py-3.5 px-4 text-slate-300 font-sans truncate max-w-xs">{log.subject}</td>
                    <td className="py-3.5 px-4 text-emerald-400 font-bold">
                      {currencySymbol}{log.old_price?.toLocaleString()} → {currencySymbol}{log.new_price?.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 uppercase">{log.platform}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-slate-500 text-[11px] font-sans">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

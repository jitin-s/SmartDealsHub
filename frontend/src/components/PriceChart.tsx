import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from 'recharts';

interface Props {
  data: { date: string; full_date: string; price: number }[];
  currencySymbol: string;
  lowestPrice?: number;
}

export const PriceChart: React.FC<Props> = ({
  data,
  currencySymbol,
  lowestPrice
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-500 text-sm">
        No price history recorded yet.
      </div>
    );
  }

  const minVal = Math.min(...data.map((d) => d.price));
  const maxVal = Math.max(...data.map((d) => d.price));
  const yDomain = [Math.floor(minVal * 0.95), Math.ceil(maxVal * 1.05)];

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="#64748b" 
            tickLine={false} 
            axisLine={false}
            tick={{ fontSize: 11 }}
          />
          <YAxis 
            domain={yDomain} 
            stroke="#64748b" 
            tickLine={false} 
            axisLine={false}
            tick={{ fontSize: 11 }}
            tickFormatter={(val) => `${currencySymbol}${val >= 1000 ? `${(val/1000).toFixed(1)}k` : val}`}
          />
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                return (
                  <div className="bg-slate-900 border border-slate-700 p-2.5 rounded-lg shadow-xl text-xs">
                    <div className="text-slate-400 mb-1">{item.full_date || item.date}</div>
                    <div className="font-bold text-white text-sm">
                      {currencySymbol}{item.price.toLocaleString()}
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          {lowestPrice && (
            <ReferenceLine 
              y={lowestPrice} 
              stroke="#10b981" 
              strokeDasharray="4 4" 
              label={{ value: 'All-Time Low', fill: '#10b981', fontSize: 10, position: 'insideBottomRight' }} 
            />
          )}
          <Area
            type="monotone"
            dataKey="price"
            stroke="#3b82f6"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#priceGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

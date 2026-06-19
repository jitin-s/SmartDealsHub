import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface FlashSaleTimerProps {
  hoursLeft?: number;
}

export const FlashSaleTimer: React.FC<FlashSaleTimerProps> = ({ hoursLeft = 6 }) => {
  const [seconds, setSeconds] = useState(hoursLeft * 3600);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] font-mono font-semibold">
      <Clock className="w-3 h-3 animate-spin text-amber-400" />
      <span>{String(h).padStart(2, '0')}:{String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}</span>
    </div>
  );
};

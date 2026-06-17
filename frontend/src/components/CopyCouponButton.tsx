import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyCouponProps {
  code: string;
}

export const CopyCouponButton: React.FC<CopyCouponProps> = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-mono font-medium transition-colors"
      title="Click to copy coupon code"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
      <span>{copied ? 'COPIED!' : code}</span>
    </button>
  );
};

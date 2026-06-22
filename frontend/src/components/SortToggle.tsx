import React from 'react';
import { ArrowUpDown } from 'lucide-react';

export type SortOption = 'discount_desc' | 'recent' | 'price_asc' | 'price_desc';

interface SortToggleProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export const SortToggle: React.FC<SortToggleProps> = ({ currentSort, onSortChange }) => {
  return (
    <div className="flex items-center gap-2 text-xs">
      <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
      <span className="text-slate-400 font-medium">Sort by:</span>
      <select
        value={currentSort}
        onChange={(e) => onSortChange(e.target.value as SortOption)}
        className="bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-blue-500"
      >
        <option value="discount_desc">Highest Discount</option>
        <option value="recent">Recently Added</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
      </select>
    </div>
  );
};

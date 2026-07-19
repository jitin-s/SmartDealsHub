export const formatPriceDiscount = (mrp: number, current: number): string => {
  if (!mrp || !current || mrp <= current) return '';
  const pct = Math.round(((mrp - current) / mrp) * 100);
  return `${pct}% OFF`;
};

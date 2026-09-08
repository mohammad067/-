const FA = "۰۱۲۳۴۵۶۷۸۹٠١٢٣٤٥٦٧٨٩";
const EN = "01234567890123456789";

export function toEnDigits(value: string) {
  return value.replace(/[۰-۹٠-٩]/g, (ch) => EN[FA.indexOf(ch)] || ch);
}

export function weightKgFromLabel(label?: string) {
  if (!label) return 10;
  const n = Number(toEnDigits(label).replace(/[^٠-٩0-9.]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : 10;
}

export function estimateShipping(args: { province: string; totalKg: number }) {
  const north = args.province === "گیلان" || args.province === "مازندران";
  const base = north ? 35000 : 55000;
  const perKg = north ? 2500 : 4000;
  return base + Math.max(0, args.totalKg) * perKg;
}

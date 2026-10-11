export function toEnDigits(value: string) {
  const map: Record<string, string> = {
    "۰": "0", "۱": "1", "۲": "2", "۳": "3", "۴": "4", "۵": "5", "۶": "6", "۷": "7", "۸": "8", "۹": "9",
    "٠": "0", "١": "1", "٢": "2", "٣": "3", "٤": "4", "٥": "5", "٦": "6", "٧": "7", "٨": "8", "٩": "9",
  };
  return value.replace(/[۰-۹٠-٩]/g, (ch) => map[ch] || ch);
}

export function weightKgFromLabel(label?: string) {
  if (!label) return 10;
  const match = toEnDigits(label).match(/\d+/);
  const n = match ? Number(match[0]) : 10;
  return n > 0 ? n : 10;
}

export function estimateShipping(args: { province: string; totalKg: number }) {
  const north = args.province === "گیلان" || args.province === "مازندران";
  const base = north ? 35000 : 55000;
  const perKg = north ? 2500 : 4000;
  return Math.round(base + Math.max(0, args.totalKg) * perKg);
}

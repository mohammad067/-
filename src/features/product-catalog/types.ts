export interface Product {
  id: string;
  slug: string;
  name: string;
  variety: "هاشمی" | "صدری" | "دم‌سیاه" | "طارم" | "قهوه‌ای";
  province: "گیلان" | "مازندران" | "گلستان";
  harvestYear: string;
  weight: string; // e.g. "۱۰ کیلوگرم"
  price: number; // e.g. 1450000 (stored in Tomans)
  discountPercent?: number; // e.g. 10 for 10%
  inStock: boolean;
  stockCount: number;
  rating: number;
  reviewsCount: number;
  imageChar: string; // The central calligraphic letter for glass art
  summary: string;
  description: string;
  aromaScore: number; // 1-5 rating for scent
  lengthScore: number; // 1-5 rating for elongation
  region: string; // e.g., "آستانه اشرفیه"
}

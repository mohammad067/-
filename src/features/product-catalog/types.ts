export interface Product {
  id: string;
  slug: string;
  name: string;
  variety: "هاشمی" | "صدری" | "دم‌سیاه" | "طارم" | "فجر" | "شیرودی";
  province: "گیلان" | "مازندران";
  harvestYear: string;
  weight: string;
  price: number;
  discountPercent?: number;
  inStock: boolean;
  stockCount: number;
  rating: number;
  reviewsCount: number;
  imageChar: string;
  summary: string;
  description: string;
  aromaScore: number;
  lengthScore: number;
  region: string;
}

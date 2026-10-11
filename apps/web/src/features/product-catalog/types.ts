export interface Product {
  id: string;
  variantId: string;
  slug: string;
  name: string;
  variety: string;
  province: string;
  harvestYear: string;
  weight: string;
  price: number;
  discountPercent?: number;
  inStock: boolean;
  stockCount: number;
  rating: number;
  reviewsCount: number;
  imageChar: string;
  imageUrl: string;
  summary: string;
  description: string;
  aromaScore: number;
  lengthScore: number;
  region: string;
}

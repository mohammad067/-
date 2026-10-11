import { MainLayout } from "@/components/layout/MainLayout";
import { WishlistContent } from "@/features/product-catalog/components/WishlistContent";
import { getProducts } from "@/lib/server/catalog";

export default async function WishlistPage() {
  const products = await getProducts();

  return (
    <MainLayout>
      <WishlistContent products={products} />
    </MainLayout>
  );
}

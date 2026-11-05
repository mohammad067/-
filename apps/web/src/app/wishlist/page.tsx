import { MainLayout } from "@/components/layout/MainLayout";
import { WishlistContent } from "@/features/product-catalog/components/WishlistContent";
import { getProducts } from "@/lib/server/catalog";
import { currentUser } from "@/lib/server/commerce-api";
import { redirect } from "next/navigation";

export default async function WishlistPage() {
  if (!await currentUser()) redirect("/login?next=%2Fwishlist");

  const products = await getProducts();

  return (
    <MainLayout>
      <WishlistContent products={products} />
    </MainLayout>
  );
}

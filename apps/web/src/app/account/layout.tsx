import { MainLayout } from "@/components/layout/MainLayout";
import { currentUser } from "@/lib/server/commerce-api";
import { redirect } from "next/navigation";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  if (!await currentUser()) redirect("/login?next=%2Faccount%2Fprofile");

  return <MainLayout>{children}</MainLayout>;
}

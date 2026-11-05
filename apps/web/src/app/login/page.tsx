import { MainLayout } from "@/components/layout/MainLayout";
import { AuthForm } from "@/features/auth/AuthForm";

function safeReturnTo(value: string | string[] | undefined): string {
  const path = Array.isArray(value) ? value[0] : value;
  return path?.startsWith("/") && !path.startsWith("//") ? path : "/account/profile";
}

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string | string[] }> }) {
  const returnTo = safeReturnTo((await searchParams).next);
  return <MainLayout><section className="px-4 py-12"><AuthForm initialMode="login" returnTo={returnTo} /></section></MainLayout>;
}

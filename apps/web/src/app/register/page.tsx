import { MainLayout } from "@/components/layout/MainLayout";
import { AuthForm } from "@/features/auth/AuthForm";

export default function RegisterPage() {
  return <MainLayout><section className="px-4 py-12"><AuthForm initialMode="register" /></section></MainLayout>;
}

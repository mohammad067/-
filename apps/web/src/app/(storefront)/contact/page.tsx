import type { Metadata } from "next";
import Link from "next/link";
import { Clock3, Phone, ShieldCheck, Truck } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { SITE_CONTACT } from "@/config/site";

export const metadata: Metadata = {
  title: "تماس با ما | طلای شالیزار",
  description: "شماره تماس پشتیبانی طلای شالیزار برای پرسش درباره محصول، سفارش و ارسال.",
};

export default function ContactPage() {
  return (
    <MainLayout>
      <div className="mx-auto w-full max-w-5xl px-4 py-12 text-right md:px-8 md:py-16">
        <header className="mb-10">
          <p className="mb-3 text-sm font-bold text-accent">پاسخ‌گویی و پشتیبانی</p>
          <h1 className="text-3xl font-extrabold text-primary md:text-5xl">تماس با طلای شالیزار</h1>
          <p className="mt-4 max-w-2xl text-sm leading-8 text-muted-foreground md:text-base">
            برای پرسش درباره محصولات، ثبت و پیگیری سفارش یا شرایط ارسال، مستقیماً با پشتیبانی تماس بگیرید.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-[#E5E2DA] bg-white/75 p-7 shadow-sm md:p-10">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Phone className="h-7 w-7" />
            </div>
            <h2 className="text-xl font-bold text-primary">شماره تماس پشتیبانی</h2>
            <a
              href={SITE_CONTACT.phoneHref}
              dir="ltr"
              className="mt-4 block w-fit text-3xl font-extrabold tracking-wide text-accent md:text-4xl"
            >
              {SITE_CONTACT.phoneDisplay}
            </a>
            <p className="mt-5 text-sm leading-7 text-muted-foreground">
              هنگام پیگیری، شماره سفارش را آماده داشته باشید تا درخواست شما سریع‌تر بررسی شود.
            </p>
            <a href={SITE_CONTACT.phoneHref} className="mt-7 inline-flex rounded-full bg-primary px-7 py-3 text-sm font-bold text-white">
              تماس با پشتیبانی
            </a>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-[#E5E2DA] bg-white/60 p-5">
              <Clock3 className="mb-3 h-5 w-5 text-accent" />
              <h2 className="font-bold text-primary">موضوع تماس</h2>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">راهنمای انتخاب برنج، وضعیت سفارش، ارسال، مغایرت یا درخواست مرجوعی.</p>
            </div>
            <div className="rounded-2xl border border-[#E5E2DA] bg-white/60 p-5">
              <Truck className="mb-3 h-5 w-5 text-accent" />
              <h2 className="font-bold text-primary">ارسال و مرجوعی</h2>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">پیش از تماس می‌توانید جزئیات ارسال و شرایط بازگشت کالا را مطالعه کنید.</p>
              <div className="mt-3 flex flex-wrap gap-3 text-sm font-semibold text-primary">
                <Link href="/shipping">شرایط ارسال</Link>
                <Link href="/returns">شرایط مرجوعی</Link>
              </div>
            </div>
            <div className="rounded-2xl border border-[#E5E2DA] bg-white/60 p-5">
              <ShieldCheck className="mb-3 h-5 w-5 text-accent" />
              <h2 className="font-bold text-primary">حفظ اطلاعات شما</h2>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">کد ورود، رمز عبور یا اطلاعات کامل کارت بانکی را تلفنی در اختیار هیچ‌کس قرار ندهید.</p>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}

"use client";

import React from "react";
import { Typography } from "@/components/ui/Typography";
import { Logo } from "../ui/Logo";
import { Instagram } from "lucide-react";
import Link from "next/link";
import { SITE_CONTACT } from "@/config/site";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#F3EEE4] border-t border-[#E5E2DA] py-8 px-4 mt-8" dir="rtl">
      <div className="max-w-7xl mx-auto grid grid-cols-1 gap-8 md:grid-cols-4 md:gap-10">
        <div className="flex flex-col gap-3 items-start">
          <Logo />
          <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
            برنج گیلان و مازندران با اطلاعات روشن درباره نوع برنج، محل کشت و سال برداشت.
          </p>
          <a
            href="https://www.instagram.com/Shalizar_Gold/"
            target="_blank"
            rel="noreferrer"
            className="w-10 h-10 rounded-full bg-white border border-[#E5E2DA] flex items-center justify-center"
            aria-label="اینستاگرام طلای شالیزار"
          >
            <Instagram className="w-4 h-4" />
          </a>
        </div>
        <div className="flex flex-col gap-2">
            <Typography variant="h4" className="font-semibold text-primary text-base">انواع برنج</Typography>
            <Link href="/products?variety=هاشمی" className="text-sm text-muted-foreground">هاشمی</Link>
            <Link href="/products?variety=دم‌سیاه" className="text-sm text-muted-foreground">دم‌سیاه</Link>
            <Link href="/products?variety=طارم" className="text-sm text-muted-foreground">طارم</Link>
            <Link href="/products?variety=صدری" className="text-sm text-muted-foreground">صدری</Link>
        </div>
        <div className="flex flex-col gap-2">
          <Typography variant="h4" className="font-semibold text-primary text-base">راهنمای خرید</Typography>
          <Link href="/terms" className="text-sm text-muted-foreground">قوانین و شرایط</Link>
          <Link href="/privacy" className="text-sm text-muted-foreground">حریم خصوصی</Link>
          <Link href="/returns" className="text-sm text-muted-foreground">مرجوعی و بازگشت وجه</Link>
          <Link href="/shipping" className="text-sm text-muted-foreground">ارسال و تحویل</Link>
        </div>
        <div className="flex flex-col gap-2">
          <Typography variant="h4" className="font-semibold text-primary text-base">ارتباط با ما</Typography>
          <a href={SITE_CONTACT.phoneHref} dir="ltr" className="w-fit text-sm font-semibold text-primary">{SITE_CONTACT.phoneDisplay}</a>
          <Link href="/contact" className="text-sm text-muted-foreground">تماس و پشتیبانی</Link>
          <Link href="/products" className="text-sm text-muted-foreground">فروشگاه</Link>
          <Link href="/wishlist" className="text-sm text-muted-foreground">علاقه‌مندی‌ها</Link>
        </div>
      </div>
      <p className="max-w-7xl mx-auto border-t border-[#E5E2DA] mt-8 pt-4 text-center text-[11px] text-muted-foreground">
        © طلای شالیزار — تمامی حقوق محفوظ است.
      </p>
    </footer>
  );
};

Footer.displayName = "Footer";

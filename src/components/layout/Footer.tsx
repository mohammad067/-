"use client";

import React, { useState } from "react";
import { Typography } from "@/components/ui/Typography";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Logo } from "../ui/Logo";
import { Instagram } from "lucide-react";
import Link from "next/link";

export const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const subscribe = (event: React.FormEvent) => {
    event.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setMessage("لطفاً یک ایمیل معتبر وارد کنید.");
      return;
    }
    const emails = JSON.parse(localStorage.getItem("shalizar-newsletter") || "[]") as string[];
    localStorage.setItem("shalizar-newsletter", JSON.stringify(Array.from(new Set([...emails, email]))));
    setEmail("");
    setMessage("ایمیل شما با موفقیت ثبت شد.");
  };

  return (
    <footer className="w-full bg-primary/5 dark:bg-[#070b09] border-t border-border/45 py-16 px-4 md:px-8 mt-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-right">
        {/* Brand & Description */}
        <div className="md:col-span-2 flex flex-col gap-5">
          <div className="mb-2">
            <Logo />
          </div>
          <Typography variant="body-sm" className="max-w-md text-muted-foreground leading-relaxed text-sm">
            مجموعه طلای شالیزار با تکیه بر نسل‌ها تجربه کشاورزی اصیل، مرغوب‌ترین ارقام برنج ارگانیک و درجه یک ایرانی را به صورت دست‌چین و با بسته‌بندی‌های لوکس و نفیس به خانه‌های شما هدیه می‌دهد. کیفیت اصیل ایرانی شایسته سفره‌های شماست.
          </Typography>

          {/* Social Media Links */}
          <div className="flex items-center gap-4 mt-2 justify-start">
            <a href="https://www.instagram.com/Shalizar_Gold/" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-muted/20 hover:bg-accent hover:text-white flex items-center justify-center text-foreground transition-all" title="اینستاگرام">
              <Instagram className="w-4.5 h-4.5" />
            </a>
          </div>
        </div>

        {/* Categories & Navigation */}
        <div className="flex flex-col gap-4">
          <Typography variant="h4" className="font-semibold text-primary dark:text-accent">
            دسته‌بندی ارقام برتر
          </Typography>
          <div className="flex flex-col gap-2.5">
            <Link href="/products?variety=هاشمی" className="text-sm text-muted-foreground hover:text-accent transition-colors">برنج هاشمی گیلان</Link>
            <Link href="/products?variety=دم‌سیاه" className="text-sm text-muted-foreground hover:text-accent transition-colors">برنج دم‌سیاه</Link>
            <Link href="/products?variety=طارم" className="text-sm text-muted-foreground hover:text-accent transition-colors">برنج طارم محلی</Link>
            <Link href="/products?variety=قهوه‌ای" className="text-sm text-muted-foreground hover:text-accent transition-colors">برنج قهوه‌ای</Link>
          </div>
        </div>

        {/* Newsletter & Contact */}
        <div className="flex flex-col gap-4">
          <Typography variant="h4" className="font-semibold text-primary dark:text-accent">
            خبرنامه طلایی شالیزار
          </Typography>
          <Typography variant="body-sm" className="text-muted-foreground text-xs leading-relaxed">
            جهت اطلاع از زمان دقیق برداشت‌های جدید سالانه و کدهای تخفیف اختصاصی، ایمیل خود را ثبت کنید:
          </Typography>
          <form onSubmit={subscribe} className="flex flex-col gap-2 mt-1">
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="نشانی ایمیل شما"
              className="py-2.5 px-4 rounded-full text-xs"
            />
            <Button variant="accent" size="sm" className="w-full py-2.5 text-xs font-semibold">
              اشتراک در خبرنامه شالیزار
            </Button>
            {message && <p className="text-xs text-muted-foreground" role="status">{message}</p>}
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-border/20 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-center gap-4 text-xs text-muted-foreground">
        <p>© ۱۴۰۵ تمامی حقوق مادی و معنوی این سامانه متعلق به طلای شالیزار است.</p>
        <p className="font-light">طراحی و توسعه فروشگاه طلای شالیزار</p>
      </div>
    </footer>
  );
};

Footer.displayName = "Footer";

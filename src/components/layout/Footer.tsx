import React from "react";
import { Typography } from "@/components/ui/Typography";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Instagram, Send, Youtube } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-primary/5 dark:bg-[#070b09] border-t border-border/45 py-16 px-4 md:px-8 mt-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-right">
        {/* Brand & Description */}
        <div className="md:col-span-2 flex flex-col gap-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-accent/10 flex items-center justify-center border border-primary/20 dark:border-accent/25">
              <span className="text-primary dark:text-accent font-serif font-semibold text-lg">ش</span>
            </div>
            <Typography variant="h3" className="font-bold text-primary dark:text-accent tracking-wide">
              طلای شالیزار
            </Typography>
          </div>
          <Typography variant="body-sm" className="max-w-md text-muted-foreground leading-relaxed text-sm">
            مجموعه طلای شالیزار با تکیه بر نسل‌ها تجربه کشاورزی اصیل، مرغوب‌ترین ارقام برنج ارگانیک و درجه یک ایرانی را به صورت دست‌چین و با بسته‌بندی‌های لوکس و نفیس به خانه‌های شما هدیه می‌دهد. کیفیت اصیل ایرانی شایسته سفره‌های شماست.
          </Typography>

          {/* Social Media Links */}
          <div className="flex items-center gap-4 mt-2 justify-start">
            <a href="#" className="w-9 h-9 rounded-full bg-muted/20 hover:bg-accent hover:text-white flex items-center justify-center text-foreground transition-all" title="اینستاگرام">
              <Instagram className="w-4.5 h-4.5" />
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-muted/20 hover:bg-accent hover:text-white flex items-center justify-center text-foreground transition-all" title="تلگرام">
              <Send className="w-4.5 h-4.5" />
            </a>
            <a href="#" className="w-9 h-9 rounded-full bg-muted/20 hover:bg-accent hover:text-white flex items-center justify-center text-foreground transition-all" title="آپارات">
              <Youtube className="w-4.5 h-4.5" />
            </a>
          </div>
        </div>

        {/* Categories & Navigation */}
        <div className="flex flex-col gap-4">
          <Typography variant="h4" className="font-semibold text-primary dark:text-accent">
            دسته‌بندی ارقام برتر
          </Typography>
          <div className="flex flex-col gap-2.5">
            <a href="#products-showcase" className="text-sm text-muted-foreground hover:text-accent transition-colors">برنج هاشمی گیلان</a>
            <a href="#products-showcase" className="text-sm text-muted-foreground hover:text-accent transition-colors">برنج دم‌سیاه سلطنتی</a>
            <a href="#products-showcase" className="text-sm text-muted-foreground hover:text-accent transition-colors">برنج طارم معطر محلی</a>
            <a href="#products-showcase" className="text-sm text-muted-foreground hover:text-accent transition-colors">برنج قهوه‌ای هاشمی رژیمی</a>
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
          <div className="flex flex-col gap-2 mt-1">
            <Input
              placeholder="نشانی ایمیل شما"
              className="py-2.5 px-4 rounded-full text-xs"
            />
            <Button variant="accent" size="sm" className="w-full py-2.5 text-xs font-semibold">
              اشتراک در خبرنامه شالیزار
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-border/20 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-center gap-4 text-xs text-muted-foreground">
        <p>© ۱۴۰۳ تمامی حقوق مادی و معنوی این سامانه متعلق به شرکت طلای شالیزار (شمال) می‌باشد.</p>
        <p className="font-light">طراحی و مهندسی نرم‌افزار لوکس توسط دپارتمان معماری فرانت‌اند</p>
      </div>
    </footer>
  );
};

Footer.displayName = "Footer";

import React from "react";
import { notFound } from "next/navigation";
import { MOCK_PRODUCTS } from "@/features/product-catalog/data/products";
import { MainLayout } from "@/components/layout/MainLayout";
import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Glass } from "@/components/ui/Glass";
import { Star, MapPin, ShoppingBag, ArrowRight, ShieldCheck, Flame, Info } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

// Generate dynamic page title metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const product = MOCK_PRODUCTS.find((p) => p.slug === resolvedParams.slug);

  if (!product) {
    return {
      title: "محصول یافت نشد | طلای شالیزار",
    };
  }

  return {
    title: `${product.name} | فروشگاه طلای شالیزار`,
    description: product.summary,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const product = MOCK_PRODUCTS.find((p) => p.slug === resolvedParams.slug);

  if (!product) {
    notFound();
  }

  const {
    name,
    variety,
    province,
    harvestYear,
    weight,
    price,
    discountPercent,
    inStock,
    rating,
    imageChar,
    description,
    aromaScore,
    lengthScore,
    region,
  } = product;

  const finalPrice = discountPercent ? price * (1 - discountPercent / 100) : price;
  const formattedPrice = finalPrice.toLocaleString("fa-IR") + " تومان";
  const formattedOldPrice = price.toLocaleString("fa-IR") + " تومان";

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8 py-12 text-right">
        {/* Back Link */}
        <div className="mb-8 flex items-center justify-start">
          <Link href="/products" className="text-xs text-muted-foreground hover:text-accent flex items-center gap-1.5 transition-colors">
            <ArrowRight className="w-4 h-4" />
            بازگشت به گالری محصولات ممتاز
          </Link>
        </div>

        {/* Product details template */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

          {/* Visual Presentation Element (Left column) */}
          <div className="relative h-[450px] md:h-[550px] rounded-3xl bg-gradient-to-tr from-[#2F5D50]/15 via-background to-background dark:from-[#0E1412] dark:via-[#111A16]/90 dark:to-[#0E1412] flex items-center justify-center border border-border/40 overflow-hidden">
            {/* Ambient floating design */}
            <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-[#C8A75D]/10 rounded-full blur-[90px] mix-blend-screen" />

            <div className="relative w-48 h-48 rounded-full bg-white/50 dark:bg-black/40 backdrop-blur-md border border-white/40 flex flex-col items-center justify-center shadow-2xl scale-110">
              <span className="text-primary dark:text-accent font-serif text-5xl font-extrabold">{imageChar}</span>
              <span className="text-[11px] text-muted-foreground/80 tracking-widest mt-1 font-light">بسته‌بندی خلاقانه</span>
            </div>

            {discountPercent && (
              <Badge variant="accent" className="absolute top-6 right-6 text-xs font-bold px-4 py-1.5">
                ویژه برداشت: {discountPercent.toLocaleString("fa-IR")}٪ تخفیف
              </Badge>
            )}

            <Badge variant={inStock ? "success" : "warning"} className="absolute top-6 left-6 text-xs font-medium px-4 py-1.5">
              {inStock ? "موجود در شالیزار شمال" : "موجودی اتمام یافته"}
            </Badge>
          </div>

          {/* Details and Actions Element (Right column) */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 justify-start text-xs text-accent font-semibold">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  استان {province}، {region}
                </span>
                <span>•</span>
                <span>رقم سنتی ممتاز {variety}</span>
              </div>
              <Typography variant="serif-title" className="text-3xl md:text-4xl font-extrabold mt-2 leading-tight">
                {name}
              </Typography>
              <div className="flex items-center gap-3 justify-start mt-3">
                <div className="flex items-center gap-1 bg-accent/15 px-2.5 py-1 rounded-md text-xs font-bold text-[#B79650]">
                  <span>{rating.toLocaleString("fa-IR")}</span>
                  <Star className="w-3.5 h-3.5 fill-accent stroke-none" />
                </div>
                <span className="text-xs text-muted-foreground font-light">({rating.toLocaleString("fa-IR")} امتیاز خریداران شالیزار)</span>
              </div>
            </div>

            <hr className="border-border/30" />

            {/* Description and copy */}
            <div className="flex flex-col gap-3">
              <Typography variant="h4" className="font-bold text-lg text-primary dark:text-accent">شناسنامه محصول ممتاز</Typography>
              <Typography variant="body" className="text-muted-foreground text-sm leading-relaxed">
                {description}
              </Typography>
            </div>

            {/* Quality Score Bar Charts */}
            <div className="flex flex-col gap-4 bg-primary/5 dark:bg-black/10 p-6 rounded-3xl border border-border/30">
              <Typography variant="h4" className="text-sm font-bold flex items-center gap-1.5 text-primary dark:text-accent">
                <Info className="w-4 h-4 stroke-1.5" />
                آنالیز کیفیت آزمایشگاهی (موسسه تحقیقات برنج)
              </Typography>

              {/* Aroma Score */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-accent">عالی (۵ از ۵)</span>
                  <span className="text-foreground/80">شاخص میزان عطر طبیعی شالیزار</span>
                </div>
                <div className="w-full h-1.5 bg-border/40 rounded-full overflow-hidden">
                  <div className="h-full bg-accent rounded-full" style={{ width: `${(aromaScore / 5) * 100}%` }} />
                </div>
              </div>

              {/* Elongation Score */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-accent">{lengthScore} از ۵</span>
                  <span className="text-foreground/80">میزان قد کشیدگی و ری‌دهی دانه</span>
                </div>
                <div className="w-full h-1.5 bg-border/40 rounded-full overflow-hidden">
                  <div className="h-full bg-accent rounded-full" style={{ width: `${(lengthScore / 5) * 100}%` }} />
                </div>
              </div>
            </div>

            {/* Key Specs Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-xs">
              <Glass rounded="sm" className="p-3.5 flex flex-col gap-1">
                <span className="text-muted-foreground">سال برداشت</span>
                <span className="font-bold">{harvestYear}</span>
              </Glass>
              <Glass rounded="sm" className="p-3.5 flex flex-col gap-1">
                <span className="text-muted-foreground">کیسه بسته‌بندی</span>
                <span className="font-bold">{weight}</span>
              </Glass>
              <Glass rounded="sm" className="p-3.5 flex flex-col gap-1">
                <span className="text-muted-foreground">روش بوجاری</span>
                <span className="font-bold">۳ مرحله بوجار لوکس</span>
              </Glass>
              <Glass rounded="sm" className="p-3.5 flex flex-col gap-1">
                <span className="text-muted-foreground">آبیاری مزارع</span>
                <span className="font-bold">۱۰۰٪ آب شیرین رود</span>
              </Glass>
            </div>

            <hr className="border-border/30" />

            {/* Purchase CTA block */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-white/20 dark:bg-black/5 p-6 rounded-3xl border border-border/40">
              <div className="flex flex-col text-right">
                {discountPercent && (
                  <span className="text-xs text-muted-foreground/60 line-through mb-1">
                    {formattedOldPrice}
                  </span>
                )}
                <span className="text-xs text-muted-foreground font-light mb-0.5">مبلغ قابل پرداخت برای هر کیسه:</span>
                <span className="text-2xl font-black text-primary dark:text-accent">{formattedPrice}</span>
              </div>

              <Button
                variant="accent"
                size="lg"
                disabled={!inStock}
                className="w-full sm:w-auto shadow-xl hover:scale-105 font-bold gap-2 text-sm px-8 py-4"
              >
                <ShoppingBag className="w-5 h-5 stroke-1.5" />
                {inStock ? "افزودن به سبد خرید لوکس" : "پیش‌فروش محصول"}
              </Button>
            </div>

            {/* Quality Seals */}
            <div className="flex items-center justify-start gap-4 text-xs text-muted-foreground mt-2">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                ضمانت خلوص ۱۰۰٪ مزارع شمال
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Flame className="w-4 h-4 text-accent" />
                تست عطر و پخت فیزیکی تضمین شده
              </span>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

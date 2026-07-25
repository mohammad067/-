"use client";

import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Hero } from "@/components/layout/Hero";
import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Glass } from "@/components/ui/Glass";
import { LoadingState } from "@/components/common/LoadingState";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { Star, Eye, Layers, Palette, ShieldCheck, Flame } from "lucide-react";

// Static premium placeholder products
const PREMIUM_PRODUCTS = [
  {
    id: "prod-1",
    name: "برنج هاشمی فوق ممتاز گیلان",
    region: "گیلان، آستانه اشرفیه",
    rating: 4.9,
    price: "۱,۴۵۰,۰۰۰ تومان",
    unit: "بسته‌بندی ۱۰ کیلوگرم",
    tag: "پرفروش‌ترین ارگانیک",
    badgeVariant: "success" as const,
    imageChar: "هاشمی",
    desc: "برنجی بی‌نظیر با قد کشیدگی فوق‌العاده و عطر طبیعی بسیار ماندگار پس از پخت، تایید شده مزارع نمونه آستانه.",
  },
  {
    id: "prod-2",
    name: "برنج دم‌سیاه سلطنتی صدری",
    region: "گیلان، صومعه‌سرا",
    rating: 5.0,
    price: "۱,۸۹۰,۰۰۰ تومان",
    unit: "بسته‌بندی ۱۰ کیلوگرم",
    tag: "شاهانه و مجلسی",
    badgeVariant: "accent" as const,
    imageChar: "صدری",
    desc: "کمیاب‌ترین و مجلل‌ترین برنج ایرانی با دانه سفید گچی خیره‌کننده و عطر قوی و بافتی نرم و رویایی.",
  },
  {
    id: "prod-3",
    name: "برنج کشت دوم طارم محلی دابودشت",
    region: "مازندران، فریدونکنار",
    rating: 4.8,
    price: "۱,۶۸۰,۰۰۰ تومان",
    unit: "بسته‌بندی ۱۰ کیلوگرم",
    tag: "معطر برداشت پاییز",
    badgeVariant: "primary" as const,
    imageChar: "طارم",
    desc: "محصول کشت دوم برداشت شده در خنکای پاییز با عطر چند برابر و هضم استثنایی مخصوص سخت‌پسندان.",
  },
];

export default function DesignSystemPage() {
  const [activeStateDemo, setActiveStateDemo] = useState<"none" | "loading" | "empty" | "error">("none");
  const [inputDemoValue, setInputDemoValue] = useState("");
  const [inputError, setInputError] = useState("");

  const handleInputDemoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputDemoValue(val);
    if (val.length > 0 && val.length < 11) {
      setInputError("شماره تلفن وارد شده باید ۱۱ رقمی باشد (مثال: ۰۹۱۲۳۴۵۶۷۸۹)");
    } else {
      setInputError("");
    }
  };

  return (
    <MainLayout>
      {/* Cinematic Hero Segment */}
      <Hero />

      {/* Section: Premium Rice Products Catalog Preview */}
      <section id="products-showcase" className="max-w-7xl mx-auto w-full px-4 md:px-8 py-20">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 text-right gap-4">
          <div className="flex flex-col gap-2">
            <Badge variant="primary" className="w-fit self-end gap-1 px-3 py-1 bg-primary/10 text-primary">
              <Star className="w-3.5 h-3.5 text-accent fill-accent" />
              انتخاب خاص سفره‌های مجلل
            </Badge>
            <Typography variant="serif-title" className="text-3xl md:text-4xl lg:text-5xl font-bold mt-2">
              سبد محصولات سلطنتی طلای شالیزار
            </Typography>
            <Typography variant="body" className="max-w-xl text-muted-foreground mt-2">
              هر دانه برنج داستانی از مهارت دست کشاورزان گیلان و مازندران است. برنج‌های ما پیش از بسته‌بندی ۳ مرحله کنترل کیفیت دقیق را طی می‌کنند.
            </Typography>
          </div>
          <div className="hidden md:block">
            <Button variant="outline" className="border-border text-foreground hover:border-accent">
              مشاهده کل کالکشن برداشت جدید
            </Button>
          </div>
        </div>

        {/* Catalog grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PREMIUM_PRODUCTS.map((product) => (
            <Card key={product.id} variant="glass-premium" className="flex flex-col h-full text-right">
              {/* Simulated luxury image/artwork overlay */}
              <div className="relative h-64 bg-gradient-to-b from-[#2F5D50]/15 to-transparent flex items-center justify-center border-b border-border/30 overflow-hidden group">
                <div className="absolute inset-0 bg-primary/5 group-hover:scale-105 transition-transform duration-700" />
                <div className="z-10 w-24 h-24 rounded-full bg-white/45 dark:bg-black/30 backdrop-blur-md border border-white/40 flex flex-col items-center justify-center shadow-lg group-hover:rotate-12 transition-all duration-700">
                  <span className="text-primary dark:text-accent font-serif text-2xl font-bold">{product.imageChar}</span>
                  <span className="text-[9px] text-muted-foreground/80 tracking-tight mt-0.5">۱۰۰٪ اصل</span>
                </div>
                <Badge variant={product.badgeVariant} className="absolute top-4 right-4 text-[11px] font-medium">
                  {product.tag}
                </Badge>
                <div className="absolute bottom-3 left-4 flex items-center gap-1.5 px-2.5 py-1 rounded-md glass text-xs font-semibold">
                  <span>{product.rating}</span>
                  <Star className="w-3.5 h-3.5 text-accent fill-accent" />
                </div>
              </div>

              <CardHeader className="p-6 pb-2">
                <Typography variant="body-sm" className="text-[#C8A75D] font-light text-xs">
                  {product.region}
                </Typography>
                <Typography variant="h3" className="text-xl font-bold text-primary dark:text-foreground mt-1">
                  {product.name}
                </Typography>
              </CardHeader>

              <CardBody className="p-6 py-2 flex-grow">
                <Typography variant="body-sm" className="text-muted-foreground leading-relaxed text-sm">
                  {product.desc}
                </Typography>
              </CardBody>

              <CardFooter className="p-6 pt-4 flex items-center justify-between">
                <div className="flex flex-col text-right">
                  <span className="text-[10px] text-muted-foreground font-light">قیمت مبدا برداشت:</span>
                  <span className="text-lg font-bold text-primary dark:text-accent">{product.price}</span>
                </div>
                <Button variant="accent" size="sm" className="px-5 py-2.5 text-xs">
                  خرید اختصاصی
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Section: Interactive Brand Design System Demo */}
      <section id="design-system" className="max-w-7xl mx-auto w-full px-4 md:px-8 py-20 border-t border-border/30">
        <div className="flex flex-col gap-2 text-right mb-12">
          <Badge variant="accent" className="w-fit self-end gap-1">
            <Layers className="w-3.5 h-3.5 text-accent" />
            توسعه‌پذیری معماری فرانت‌اند
          </Badge>
          <Typography variant="serif-title" className="text-3xl md:text-4xl font-bold mt-2">
            سیستم دیزاین و توکن‌های بصری برند (Luxury Design System)
          </Typography>
          <Typography variant="body-sm" className="text-muted-foreground max-w-2xl mt-1">
            این بخش نمایشی زنده از توکن‌های طراحی است که با رعایت اصول لوکس‌گرایی، فاصله‌گذاری دقیق، سایه‌های ملایم و استانداردهای دسترسی‌پذیری عالی خلق شده‌اند.
          </Typography>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 text-right">
          {/* Color Palette and Typography Showcase */}
          <div className="flex flex-col gap-8">
            <Card variant="default" className="p-8 flex flex-col gap-6">
              <div className="flex items-center gap-3 border-b border-border/30 pb-4">
                <Palette className="w-5 h-5 text-accent" />
                <Typography variant="h3" className="font-bold">پالت رنگی لوکس و مینیمال</Typography>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-xs">
                <div className="flex flex-col gap-2">
                  <div className="h-16 w-full rounded-2xl bg-primary border border-primary/20 flex items-center justify-center text-white font-bold">#2F5D50</div>
                  <span className="font-medium text-foreground">سبز شالیزار (Primary)</span>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="h-16 w-full rounded-2xl bg-accent border border-accent/20 flex items-center justify-center text-foreground font-bold">#C8A75D</div>
                  <span className="font-medium text-foreground">طلایی شامپاینی (Accent)</span>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="h-16 w-full rounded-2xl bg-[#F8F6F2] border border-border flex items-center justify-center text-foreground font-bold">#F8F6F2</div>
                  <span className="font-medium text-foreground">سفید گرم (Background)</span>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="h-16 w-full rounded-2xl bg-[#0E1412] border border-border flex items-center justify-center text-white font-bold">#0E1412</div>
                  <span className="font-medium text-foreground">ابسیدین تیره (Dark BG)</span>
                </div>
              </div>
            </Card>

            <Card variant="default" className="p-8 flex flex-col gap-6">
              <div className="flex items-center gap-3 border-b border-border/30 pb-4">
                <Flame className="w-5 h-5 text-accent" />
                <Typography variant="h3" className="font-bold">انواع دکمه‌ها و کلیدهای واکنشی</Typography>
              </div>

              <div className="flex flex-wrap gap-4 justify-start">
                <Button variant="primary">دکمه اصلی شالیزار</Button>
                <Button variant="accent">دکمه ویژه طلایی</Button>
                <Button variant="outline">دکمه دورخط ظریف</Button>
                <Button variant="ghost">دکمه گوست</Button>
                <Button variant="glass">دکمه شیشه‌ای (Glass)</Button>
              </div>
            </Card>
          </div>

          {/* Inputs & Form Validation Showcase */}
          <div className="flex flex-col gap-8">
            <Card variant="default" className="p-8 flex flex-col gap-6">
              <div className="flex items-center gap-3 border-b border-border/30 pb-4">
                <ShieldCheck className="w-5 h-5 text-accent" />
                <Typography variant="h3" className="font-bold">فرم‌ها و فیلدهای ورودی (زنده)</Typography>
              </div>

              <div className="flex flex-col gap-4">
                <Input
                  label="شماره همراه جهت عضویت لوکس و اطلاع از تخفیف‌ها"
                  placeholder="مثال: ۰۹۱۲۳۴۵۶۷۸۹"
                  value={inputDemoValue}
                  onChange={handleInputDemoChange}
                  error={inputError}
                  helperText="ما هرگز شماره شما را اسپم نمی‌کنیم. فقط پیشنهادات بسیار محدود ممتاز ارسال می‌شود."
                />
                <div className="flex gap-2 justify-end mt-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      if (!inputDemoValue) {
                        setInputError("لطفاً شماره همراه خود را وارد کنید.");
                      } else if (inputDemoValue.length !== 11) {
                        setInputError("شماره همراه نامعتبر است (باید ۱۱ رقم باشد).");
                      } else {
                        alert("سپاس! عضویت طلایی شما با موفقیت شبیه‌سازی شد.");
                        setInputError("");
                      }
                    }}
                  >
                    عضویت در باشگاه مشتریان
                  </Button>
                </div>
              </div>
            </Card>

            {/* Badges and Layout tokens */}
            <Card variant="default" className="p-8 flex flex-col gap-6">
              <Typography variant="h3" className="font-bold border-b border-border/30 pb-4">نشان‌ها و مدال‌های ارگانیک (Badges)</Typography>
              <div className="flex flex-wrap gap-3">
                <Badge variant="primary">کشت محلی ارگانیک</Badge>
                <Badge variant="accent">سلطنتی صدری</Badge>
                <Badge variant="success">موجود در انبار رشت</Badge>
                <Badge variant="warning">موجودی محدود پاییز</Badge>
                <Badge variant="outline">بدون ترکیب و تراریخته</Badge>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Section: Systems States Simulation Board */}
      <section id="demo-states" className="max-w-7xl mx-auto w-full px-4 md:px-8 py-20 border-t border-border/30">
        <div className="flex flex-col gap-2 text-right mb-12">
          <Badge variant="primary" className="w-fit self-end gap-1">
            <Eye className="w-3.5 h-3.5" />
            شبیه‌ساز معماری سامانه
          </Badge>
          <Typography variant="serif-title" className="text-3xl md:text-4xl font-bold mt-2">
            شبیه‌ساز پاسخ‌دهی و حالت‌های متغیر سامانه (State Visualizer)
          </Typography>
          <Typography variant="body-sm" className="text-muted-foreground max-w-2xl mt-1">
            با استفاده از دکمه‌های کنترلی زیر، می‌توانید سه حالت حیاتی مهندسی وب (درحال بارگذاری، بدون نتیجه، و بروز خطا) را به صورت کاملاً تعاملی شبیه‌سازی و مشاهده نمایید.
          </Typography>
        </div>

        <Card variant="default" className="p-8 text-right flex flex-col gap-8">
          {/* Dynamic Controller selectors */}
          <div className="flex flex-wrap gap-3 justify-center bg-background/40 p-3.5 rounded-full border border-border/50 max-w-xl mx-auto">
            <Button
              variant={activeStateDemo === "none" ? "accent" : "outline"}
              size="sm"
              onClick={() => setActiveStateDemo("none")}
            >
              نمایش محتوای محصولات ممتاز
            </Button>
            <Button
              variant={activeStateDemo === "loading" ? "accent" : "outline"}
              size="sm"
              onClick={() => setActiveStateDemo("loading")}
            >
              شبیه‌سازی حالت Loading
            </Button>
            <Button
              variant={activeStateDemo === "empty" ? "accent" : "outline"}
              size="sm"
              onClick={() => setActiveStateDemo("empty")}
            >
              شبیه‌سازی حالت Empty
            </Button>
            <Button
              variant={activeStateDemo === "error" ? "accent" : "outline"}
              size="sm"
              onClick={() => setActiveStateDemo("error")}
            >
              شبیه‌سازی حالت Error
            </Button>
          </div>

          {/* Dynamic Render Sandbox area */}
          <div className="border border-border/40 rounded-3xl p-6 min-h-[350px] flex items-center justify-center bg-white/10 dark:bg-black/5 backdrop-blur-sm">
            {activeStateDemo === "none" && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full animate-fade-in">
                {PREMIUM_PRODUCTS.map((prod) => (
                  <Glass key={prod.id} rounded="lg" className="p-6 flex flex-col gap-3 justify-between">
                    <div className="flex justify-between items-center">
                      <Badge variant="outline">{prod.region}</Badge>
                      <span className="text-xs font-serif text-accent">{prod.imageChar}</span>
                    </div>
                    <Typography variant="h4" className="font-bold text-primary dark:text-foreground">
                      {prod.name}
                    </Typography>
                    <Typography variant="body-sm" className="text-muted-foreground text-xs leading-relaxed line-clamp-2">
                      {prod.desc}
                    </Typography>
                    <div className="flex justify-between items-center border-t border-border/20 pt-3">
                      <span className="text-xs font-light text-muted-foreground">{prod.unit}</span>
                      <span className="text-sm font-semibold text-[#C8A75D]">{prod.price}</span>
                    </div>
                  </Glass>
                ))}
              </div>
            )}

            {activeStateDemo === "loading" && <LoadingState />}

            {activeStateDemo === "empty" && (
              <EmptyState
                title="هیچ رقمی یافت نشد"
                description="هیچ برنجی با پارامترهای فیلتر شبیه‌سازی انتخاب شده همخوانی ندارد. لطفاً دکمه تغییر حالت شبیه‌ساز را کلیک کنید."
                action={
                  <Button variant="accent" size="sm" onClick={() => setActiveStateDemo("none")}>
                    ریست شبیه‌ساز و نمایش محصولات
                  </Button>
                }
              />
            )}

            {activeStateDemo === "error" && (
              <ErrorState
                title="عدم پاسخ‌دهی سرور کشت مرکزی"
                description="سرور کنترل دما و رطوبت شالیزار مرکزی موقتاً در دسترس نیست. این خطا شبیه‌سازی شده است تا مقاومت لایه فرانت‌اند را اثبات کند."
                onRetry={() => setActiveStateDemo("none")}
              />
            )}
          </div>
        </Card>
      </section>
    </MainLayout>
  );
}

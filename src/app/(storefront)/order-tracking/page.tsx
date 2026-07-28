"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MainLayout } from "@/components/layout/MainLayout";
import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Glass } from "@/components/ui/Glass";
import { Badge } from "@/components/ui/Badge";
import {
  Search,
  CheckCircle,
  Package,
  Truck,
  FileText,
  MapPin,
  Clock,
  CreditCard,
  XCircle,
  Hash,
  Phone
} from "lucide-react";

// Mock Database of Orders
const MOCK_ORDERS: Record<string, {
  orderId: string;
  mobile: string;
  productName: string;
  quantity: number;
  weight: string;
  amount: string;
  date: string;
  deliveryMethod: string;
  trackingNumber: string;
  paymentStatus: string;
  currentStep: number; // 0: ثبت سفارش, 1: در حال آماده‌سازی, 2: بسته‌بندی, 3: تحویل به پست, 4: تحویل شده
}> = {
  "TS-24081254": {
    orderId: "TS-24081254",
    mobile: "09123456789",
    productName: "برنج دم‌سیاه فوق ممتاز کیاشهر",
    quantity: 2,
    weight: "۲۰ کیلوگرم",
    amount: "۲,۹۰۰,۰۰۰ تومان",
    date: "۱۴۰۳/۰۵/۲۲",
    deliveryMethod: "ارسال اختصاصی بیمه‌شده تیپاکس",
    trackingNumber: "TPX-9988112233",
    paymentStatus: "پرداخت شده (موفق)",
    currentStep: 3, // Delivery to post (current step index 3)
  },
  "TS-24091530": {
    orderId: "TS-24091530",
    mobile: "09129998877",
    productName: "برنج طارم معطر فریدونکنار",
    quantity: 1,
    weight: "۱۰ کیلوگرم",
    amount: "۱,۳۵۰,۰۰۰ تومان",
    date: "۱۴۰۳/۰۶/۱۵",
    deliveryMethod: "ارسال اختصاصی بیمه‌شده پست پیشتاز",
    trackingNumber: "PST-4455667788",
    paymentStatus: "پرداخت شده (موفق)",
    currentStep: 4, // Delivered
  },
  "TS-24100512": {
    orderId: "TS-24100512",
    mobile: "09351234567",
    productName: "برنج هاشمی درجه یک آستانه اشرفیه",
    quantity: 5,
    weight: "۵۰ کیلوگرم",
    amount: "۶,۸۰۰,۰۰۰ تومان",
    date: "۱۴۰۳/۰۷/۰۵",
    deliveryMethod: "ارسال ویژه باربری شالیزار",
    trackingNumber: "BRB-12003344",
    paymentStatus: "پرداخت در محل (در انتظار تحویل)",
    currentStep: 1, // Preparing
  }
};

const TIMELINE_STEPS = [
  { label: "ثبت سفارش", icon: FileText },
  { label: "در حال آماده‌سازی", icon: Clock },
  { label: "بسته‌بندی", icon: Package },
  { label: "تحویل به پست", icon: Truck },
  { label: "تحویل شده", icon: CheckCircle }
];

export default function OrderTrackingPage() {
  const [orderIdInput, setOrderIdInput] = useState("");
  const [mobileInput, setMobileInput] = useState("");
  const [errors, setErrors] = useState<{ orderId?: string; mobile?: string }>({});
  const [isSearched, setIsSearched] = useState(false);
  const [searchedOrder, setSearchedOrder] = useState<typeof MOCK_ORDERS[string] | null>(null);

  const validate = () => {
    const newErrors: { orderId?: string; mobile?: string } = {};

    if (!orderIdInput.trim()) {
      newErrors.orderId = "لطفاً شماره سفارش خود را وارد کنید.";
    }

    if (!mobileInput.trim()) {
      newErrors.mobile = "لطفاً شماره موبایل خود را وارد کنید.";
    } else {
      const mobileRegex = /^09\d{9}$/;
      if (!mobileRegex.test(mobileInput.trim())) {
        newErrors.mobile = "شماره موبایل وارد شده معتبر نیست. (مثال: ۰۹۱۲۳۴۵۶۷۸۹)";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTracking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const formattedOrderId = orderIdInput.trim().toUpperCase();
    const formattedMobile = mobileInput.trim();

    const matchedOrder = MOCK_ORDERS[formattedOrderId];
    if (matchedOrder && matchedOrder.mobile === formattedMobile) {
      setSearchedOrder(matchedOrder);
    } else {
      setSearchedOrder(null);
    }
    setIsSearched(true);
  };

  const resetSearch = () => {
    setOrderIdInput("");
    setMobileInput("");
    setErrors({});
    setIsSearched(false);
    setSearchedOrder(null);
  };

  return (
    <MainLayout>
      {/* Cinematic Elegant Hero Background Wrapper */}
      <section className="relative py-24 px-4 overflow-hidden text-center border-b border-border/20 bg-gradient-to-b from-[#2F5D50]/10 via-background to-background dark:from-[#0E1412]/50 dark:via-background dark:to-background">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-4">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="accent" className="gap-2 px-4 py-1.5 bg-accent/10 text-accent border border-accent/30 text-xs">
              سامانه هوشمند پیگیری مرسولات طلای شالیزار
            </Badge>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <Typography
              variant="h1"
              className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary dark:text-accent font-serif leading-tight"
            >
              پیگیری سفارش
            </Typography>
            <Typography
              variant="body"
              className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mt-3 font-light leading-relaxed"
            >
              با وارد کردن اطلاعات سفارش، آخرین وضعیت سفارش خود را به همراه کد رهگیری مرسوله پستی مشاهده کنید.
            </Typography>
          </motion.div>
        </div>
      </section>

      {/* Main Interactive Workspace Area */}
      <section className="max-w-4xl mx-auto w-full px-4 md:px-8 py-16 flex-grow flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {!isSearched ? (
            /* Search Form Card Component */
            <motion.div
              key="tracking-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Card variant="glass-premium" className="max-w-xl mx-auto shadow-2xl rounded-2xl border border-border/40 p-6 md:p-8 text-right">
                <CardHeader className="p-0 pb-6 border-b border-border/20 flex flex-col gap-2">
                  <div className="w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-1">
                    <Search className="w-6 h-6 stroke-1.5" />
                  </div>
                  <Typography variant="h3" className="text-xl font-bold text-primary dark:text-accent">
                    جستجوی سریع سفارش
                  </Typography>
                  <Typography variant="body-sm" className="text-muted-foreground text-xs font-light">
                    کد پیگیری با پسوند TS و شماره همراه ثبت‌شده در زمان خرید را وارد کنید.
                  </Typography>
                </CardHeader>

                <CardBody className="p-0 pt-6">
                  <form onSubmit={handleTracking} className="flex flex-col gap-5">
                    {/* Order ID Input */}
                    <div className="flex flex-col gap-2">
                      <label htmlFor="orderId" className="text-sm font-semibold text-foreground flex items-center gap-1.5 justify-start">
                        <Hash className="w-4 h-4 text-accent" />
                        شماره سفارش
                      </label>
                      <Input
                        id="orderId"
                        type="text"
                        placeholder="مثال: TS-24081254"
                        value={orderIdInput}
                        onChange={(e) => setOrderIdInput(e.target.value)}
                        className={`px-5 py-3.5 text-center text-sm tracking-widest font-mono rounded-xl border-border/60 ${errors.orderId ? "border-destructive focus:ring-destructive" : ""}`}
                        aria-invalid={!!errors.orderId}
                        aria-describedby={errors.orderId ? "orderId-error" : undefined}
                      />
                      {errors.orderId && (
                        <span id="orderId-error" className="text-xs text-destructive mt-1 font-medium block">
                          {errors.orderId}
                        </span>
                      )}
                    </div>

                    {/* Mobile Number Input */}
                    <div className="flex flex-col gap-2">
                      <label htmlFor="mobile" className="text-sm font-semibold text-foreground flex items-center gap-1.5 justify-start">
                        <Phone className="w-4 h-4 text-accent" />
                        شماره موبایل همراه
                      </label>
                      <Input
                        id="mobile"
                        type="text"
                        placeholder="مثال: ۰۹۱۲۳۴۵۶۷۸۹"
                        value={mobileInput}
                        onChange={(e) => setMobileInput(e.target.value)}
                        className={`px-5 py-3.5 text-center text-sm tracking-wider font-mono rounded-xl border-border/60 ${errors.mobile ? "border-destructive focus:ring-destructive" : ""}`}
                        aria-invalid={!!errors.mobile}
                        aria-describedby={errors.mobile ? "mobile-error" : undefined}
                      />
                      {errors.mobile && (
                        <span id="mobile-error" className="text-xs text-destructive mt-1 font-medium block">
                          {errors.mobile}
                        </span>
                      )}
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      variant="accent"
                      size="lg"
                      className="w-full py-4 text-sm font-bold shadow-lg hover:scale-102 active:scale-98 transition-all mt-4"
                    >
                      پیگیری وضعیت سفارش
                    </Button>
                  </form>
                </CardBody>
              </Card>
            </motion.div>
          ) : searchedOrder ? (
            /* Results & Timeline Success Component */
            <motion.div
              key="tracking-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 20 }}
              className="flex flex-col gap-8 text-right"
            >
              {/* Timeline Card */}
              <Glass rounded="lg" className="p-6 md:p-8 border border-border/40 shadow-xl flex flex-col gap-8">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-border/20 pb-5">
                  <div className="flex flex-col gap-1 text-center sm:text-right">
                    <Typography variant="h3" className="text-lg font-bold text-primary dark:text-accent flex items-center gap-2 justify-center sm:justify-start">
                      سفارش شماره {searchedOrder.orderId}
                    </Typography>
                    <Typography variant="body-sm" className="text-muted-foreground text-xs font-light">
                      تاریخ ثبت سفارش: {searchedOrder.date}
                    </Typography>
                  </div>
                  <Badge variant="success" className="px-3.5 py-1 text-xs font-semibold">
                    {searchedOrder.currentStep === 4 ? "تحویل شده" : "در حال پردازش مرسوله"}
                  </Badge>
                </div>

                {/* Vertical / Horizontal Tracking Timeline */}
                <div className="relative py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-4 w-full">
                  {/* Background progress bar line */}
                  <div className="absolute top-[24px] bottom-[24px] right-[24px] md:right-0 md:bottom-auto md:top-1/2 left-auto md:left-0 w-0.5 md:w-full h-[calc(100%-48px)] md:h-0.5 bg-border/30 z-0" />

                  {/* Active highlighted bar line */}
                  <div
                    className="absolute right-[24px] md:right-0 top-[24px] md:top-1/2 w-0.5 md:h-0.5 bg-accent z-0 transition-all duration-1000"
                    style={{
                      height: typeof window !== "undefined" && window.innerWidth < 768 ? `${(searchedOrder.currentStep / 4) * 100}%` : "auto",
                      width: typeof window !== "undefined" && window.innerWidth >= 768 ? `${(searchedOrder.currentStep / 4) * 100}%` : "auto",
                    }}
                  />

                  {TIMELINE_STEPS.map((step, idx) => {
                    const StepIcon = step.icon;
                    const isCompleted = idx < searchedOrder.currentStep;
                    const isCurrent = idx === searchedOrder.currentStep;
                    const isUpcoming = idx > searchedOrder.currentStep;

                    return (
                      <div key={idx} className="flex md:flex-col items-center gap-4 md:gap-3 z-10 w-full md:w-auto">
                        {/* Interactive Step Bubble Indicator */}
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 shadow-md ${
                            isCompleted
                              ? "bg-accent text-white"
                              : isCurrent
                              ? "bg-primary text-white border-2 border-accent scale-110 shadow-lg shadow-accent/20"
                              : "bg-background border-2 border-border/40 text-muted-foreground"
                          }`}
                        >
                          {isCompleted ? (
                            <span className="text-base font-bold">✓</span>
                          ) : (
                            <StepIcon className="w-5 h-5 stroke-1.5" />
                          )}
                        </div>

                        {/* Step Details */}
                        <div className="flex flex-col text-right md:text-center">
                          <span
                            className={`text-xs md:text-sm font-semibold transition-colors duration-300 ${
                              isCurrent ? "text-primary dark:text-accent" : isCompleted ? "text-foreground" : "text-muted-foreground/60"
                            }`}
                          >
                            {step.label}
                          </span>
                          {isCurrent && (
                            <span className="text-[10px] text-accent font-medium mt-0.5 animate-pulse">
                              گام فعلی پردازش
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Glass>

              {/* Order Specific Details Card Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Info Column */}
                <Glass rounded="lg" className="p-6 border border-border/30 shadow-md flex flex-col gap-4">
                  <Typography variant="h4" className="text-sm font-bold text-primary dark:text-accent border-b border-border/20 pb-2.5">
                    جزئیات اقلام سفارش
                  </Typography>

                  <div className="flex flex-col gap-3 text-sm">
                    <div className="flex justify-between items-center py-1 border-b border-border/10">
                      <span className="text-muted-foreground">نام محصول ممتاز</span>
                      <span className="font-semibold text-foreground">{searchedOrder.productName}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-border/10">
                      <span className="text-muted-foreground">تعداد</span>
                      <span className="font-semibold text-foreground">{searchedOrder.quantity} کیسه</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-border/10">
                      <span className="text-muted-foreground">وزن مجموع</span>
                      <span className="font-semibold text-foreground">{searchedOrder.weight}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-muted-foreground">مبلغ نهایی فاکتور</span>
                      <span className="font-bold text-primary dark:text-accent">{searchedOrder.amount}</span>
                    </div>
                  </div>
                </Glass>

                {/* Delivery & Status Column */}
                <Glass rounded="lg" className="p-6 border border-border/30 shadow-md flex flex-col gap-4">
                  <Typography variant="h4" className="text-sm font-bold text-primary dark:text-accent border-b border-border/20 pb-2.5">
                    اطلاعات ارسال و پرداخت
                  </Typography>

                  <div className="flex flex-col gap-3 text-sm">
                    <div className="flex justify-between items-center py-1 border-b border-border/10">
                      <span className="text-muted-foreground">روش ارسال</span>
                      <span className="font-semibold text-foreground flex items-center gap-1.5">
                        <Truck className="w-4 h-4 text-accent" />
                        {searchedOrder.deliveryMethod}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-border/10">
                      <span className="text-muted-foreground">کد رهگیری مرسوله</span>
                      <span className="font-mono font-bold text-accent tracking-wide">{searchedOrder.trackingNumber}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-border/10">
                      <span className="text-muted-foreground">وضعیت پرداخت</span>
                      <span className="font-semibold text-foreground flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-accent" />
                        {searchedOrder.paymentStatus}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-muted-foreground">بسته‌بندی شناسنامه‌دار</span>
                      <span className="text-xs text-emerald-600 font-bold">بله (۱۰۰٪ اصل تضمینی)</span>
                    </div>
                  </div>
                </Glass>
              </div>

              {/* Action Buttons to tracking or back */}
              <div className="flex justify-center mt-4">
                <Button variant="outline" size="lg" onClick={resetSearch} className="px-8 border-border/60 hover:bg-muted/10">
                  پیگیری مجدد سفارش دیگر
                </Button>
              </div>
            </motion.div>
          ) : (
            /* Premium Empty State Component */
            <motion.div
              key="tracking-empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="text-center max-w-md mx-auto"
            >
              <Glass rounded="lg" className="p-8 md:p-12 border border-border/30 shadow-xl flex flex-col items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
                  <XCircle className="w-8 h-8 stroke-1.5" />
                </div>
                <Typography variant="serif-title" className="text-2xl font-bold text-primary dark:text-accent">
                  سفارشی پیدا نشد
                </Typography>
                <Typography variant="body" className="text-sm text-muted-foreground leading-relaxed font-light">
                  شماره سفارش وارد شده صحیح نیست یا سفارشی با این مشخصات و شماره همراه ثبت نشده است. لطفاً دقت فرموده و دوباره تلاش نمایید.
                </Typography>
                <Button variant="accent" size="lg" onClick={resetSearch} className="w-full font-bold mt-2 shadow-lg">
                  تلاش مجدد
                </Button>
              </Glass>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </MainLayout>
  );
}

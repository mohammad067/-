"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MainLayout } from "@/components/layout/MainLayout";
import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  Search,
  CheckCircle2,
  Package,
  Truck,
  FileText,
  MapPin,
  Clock,
  CreditCard,
  XCircle,
  Hash,
  Phone,
  User,
  Scale
} from "lucide-react";

// Mock Database of Orders with full details
interface MockOrder {
  orderId: string;
  mobile: string;
  customerName: string;
  productName: string;
  quantity: number;
  weight: string;
  amount: string;
  date: string;
  estimatedDeliveryDate: string;
  deliveryMethod: string;
  courier: string;
  trackingNumber: string;
  paymentStatus: string;
  shippingAddress: string;
  currentStep: number; // 0: ثبت سفارش, 1: تایید پرداخت, 2: آماده سازی, 3: بسته بندی, 4: تحویل به پست, 5: در حال ارسال, 6: تحویل شده
}

const MOCK_ORDERS: Record<string, MockOrder> = {
  "TS-24081254": {
    orderId: "TS-24081254",
    mobile: "09123456789",
    customerName: "علیرضا کریمی",
    productName: "برنج دم‌سیاه فوق ممتاز کیاشهر",
    quantity: 2,
    weight: "۲۰ کیلوگرم",
    amount: "۲,۹۰۰,۰۰۰ تومان",
    date: "۱۴۰۳/۰۵/۲۲",
    estimatedDeliveryDate: "۱۴۰۳/۰۵/۲۶",
    deliveryMethod: "ارسال اکسپرس سریع",
    courier: "تیپاکس (Tipax)",
    trackingNumber: "TPX-9988112233",
    paymentStatus: "پرداخت تایید شده (موفق)",
    shippingAddress: "گیلان، رشت، بلوار گلسار، خیابان ۱۰۴، پلاک ۱۲",
    currentStep: 4, // تحویل به پست
  },
  "TS-24091530": {
    orderId: "TS-24091530",
    mobile: "09129998877",
    customerName: "مریم حسینی",
    productName: "برنج طارم معطر فریدونکنار",
    quantity: 1,
    weight: "۱۰ کیلوگرم",
    amount: "۱,۳۵۰,۰۰۰ تومان",
    date: "۱۴۰۳/۰۶/۱۵",
    estimatedDeliveryDate: "۱۴۰۳/۰۶/۱۹",
    deliveryMethod: "ارسال اختصاصی بیمه‌شده",
    courier: "پست پیشتاز جمهوری اسلامی",
    trackingNumber: "PST-4455667788",
    paymentStatus: "پرداخت تایید شده (موفق)",
    shippingAddress: "تهران، شهرک غرب، فاز ۳، خیابان حافظ، کوچه نیلوفر، پلاک ۵",
    currentStep: 6, // تحویل شده
  },
  "TS-24100512": {
    orderId: "TS-24100512",
    mobile: "09351234567",
    customerName: "سارا احمدی",
    productName: "برنج هاشمی درجه یک آستانه اشرفیه",
    quantity: 5,
    weight: "۵۰ کیلوگرم",
    amount: "۶,۸۰۰,۰۰۰ تومان",
    date: "۱۴۰۳/۰۷/۰۵",
    estimatedDeliveryDate: "۱۴۰۳/۰۷/۰۹",
    deliveryMethod: "ارسال ویژه باربری شالیزار",
    courier: "باربری شالیزار اختصاصی",
    trackingNumber: "BRB-12003344",
    paymentStatus: "پرداخت در محل (در انتظار تحویل)",
    shippingAddress: "اصفهان، خیابان خاقانی، مجتمع پارس، واحد ۳",
    currentStep: 2, // آماده سازی سفارش
  }
};

const TIMELINE_STEPS = [
  { label: "سفارش ثبت شد", icon: FileText, desc: "اطلاعات سفارش شما با موفقیت ثبت گردید.", time: "ساعت ۱۰:۳۰" },
  { label: "پرداخت تایید شد", icon: CreditCard, desc: "تراکنش مالی تایید و سند پرداخت صادر شد.", time: "ساعت ۱۰:۳۲" },
  { label: "آماده سازی سفارش", icon: Clock, desc: "دانه برنج بوجار و در حال پر شدن در کیسه پارچه‌ای است.", time: "ساعت ۱۴:۱۵" },
  { label: "بسته بندی", icon: Package, desc: "کیسه‌ها پلمپ شده و به کارتن ضد رطوبت انتقال یافتند.", time: "روز بعد - ساعت ۹:۰۰" },
  { label: "تحویل به پست", icon: Truck, desc: "محموله تحویل باجه اکسپرس شد.", time: "روز بعد - ساعت ۱۱:۴۵" },
  { label: "در حال ارسال", icon: MapPin, desc: "بسته در مسیر ترانزیت مقصد نهایی شما می‌باشد.", time: "در حال حرکت" },
  { label: "تحویل شده", icon: CheckCircle2, desc: "برنج اصیل با افتخار به سفره شما تقدیم گردید.", time: "اتمام فرآیند" }
];

function OrderTrackingContent() {
  const searchParams = useSearchParams();

  const initialOrderId = searchParams.get("orderId")?.trim().toUpperCase() || "";
  const initialMobile = searchParams.get("mobile")?.trim() || "";

  const [orderIdInput, setOrderIdInput] = useState(initialOrderId);
  const [mobileInput, setMobileInput] = useState(initialMobile);
  const [errors, setErrors] = useState<{ orderId?: string; mobile?: string }>({});

  const [searchedOrder, setSearchedOrder] = useState<MockOrder | null>(() => {
    if (initialOrderId && initialMobile) {
      if (initialOrderId.startsWith("SHALI-") && !MOCK_ORDERS[initialOrderId]) {
        MOCK_ORDERS[initialOrderId] = {
          orderId: initialOrderId,
          mobile: initialMobile,
          customerName: "مشتری گران‌قدر شالیزار",
          productName: "برنج هاشمی فوق ممتاز گیلان",
          quantity: 2,
          weight: "۲۰ کیلوگرم",
          amount: "۲,۷۰۰,۰۰۰ تومان",
          date: "امروز",
          estimatedDeliveryDate: "۳ روز آینده",
          deliveryMethod: "ارسال اختصاصی اکسپرس سریع",
          courier: "تیپاکس (Tipax)",
          trackingNumber: "TPX-" + Math.floor(100000000 + Math.random() * 900000000),
          paymentStatus: "پرداخت تایید شده (موفق)",
          shippingAddress: "آدرس ثبت شده خریدار در سیستم شالیزار",
          currentStep: 1,
        };
      }
      const matchedOrder = MOCK_ORDERS[initialOrderId];
      return matchedOrder && matchedOrder.mobile === initialMobile ? matchedOrder : null;
    }
    return null;
  });

  const [isSearched, setIsSearched] = useState(() => {
    return !!(initialOrderId && initialMobile);
  });

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
        newErrors.mobile = "شماره همراه باید معتبر و ۱۱ رقمی باشد. مثال: ۰۹۱۲۳۴۵۶۷۸۹";
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

    if (formattedOrderId.startsWith("SHAL-") && !MOCK_ORDERS[formattedOrderId]) {
      MOCK_ORDERS[formattedOrderId] = {
        orderId: formattedOrderId,
        mobile: formattedMobile,
        customerName: "مشتری گران‌قدر شالیزار",
        productName: "برنج هاشمی فوق ممتاز گیلان",
        quantity: 2,
        weight: "۲۰ کیلوگرم",
        amount: "۲,۷۰۰,۰۰۰ تومان",
        date: "امروز",
        estimatedDeliveryDate: "۳ روز آینده",
        deliveryMethod: "ارسال اختصاصی اکسپرس سریع",
        courier: "تیپاکس (Tipax)",
        trackingNumber: "TPX-" + Math.floor(100000000 + Math.random() * 900000000),
        paymentStatus: "پرداخت تایید شده (موفق)",
        shippingAddress: "آدرس ثبت شده خریدار در سیستم شالیزار",
        currentStep: 1,
      };
    }

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
    <div className="w-full transition-colors duration-500 py-12 bg-[#F8F6F1]">
      <div className="max-w-5xl mx-auto w-full px-4 md:px-8 flex-grow flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {!isSearched ? (
            /* SEARCH INPUT FORM CARD */
            <motion.div
              key="tracking-form"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
              <div className="max-w-xl mx-auto shadow-[0_8px_40px_rgba(0,0,0,0.06)] rounded-3xl border border-[#EDE8DF] p-8 md:p-10 text-right bg-white text-[#1E2A24]">
                <div className="p-0 pb-6 border-b border-[#EDE8DF] flex flex-col gap-3">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-r from-[#C8A75D] to-[#E5C983] text-[#0A100E] flex items-center justify-center shadow-[0_0_20px_rgba(200,167,93,0.25)]">
                    <Search className="w-7 h-7" />
                  </div>
                  <Typography variant="h3" className="text-2xl font-bold text-[#1E2A24]">
                    رهگیری اصالت و وضعیت مرسوله
                  </Typography>
                  <Typography variant="body-sm" className="text-[#5C6B63] text-xs font-light leading-relaxed">
                    شماره فاکتور خرید (مثال: TS-24081254) به همراه شماره موبایل خود را جهت رصد زنده و تحویل پستی وارد فرمایید.
                  </Typography>
                </div>

                <div className="p-0 pt-6">
                  <form onSubmit={handleTracking} className="flex flex-col gap-6">
                    {/* Order ID Input */}
                    <div className="flex flex-col gap-2.5">
                      <label htmlFor="orderId" className="text-xs font-bold text-[#3F4F4A] pr-1 flex items-center gap-1.5 justify-start">
                        <Hash className="w-4 h-4 text-[#C8A75D]" />
                        کد پیگیری شالیزار
                      </label>
                      <input
                        id="orderId"
                        type="text"
                        placeholder="TS-24081254 یا SHALI-xxxxxx"
                        value={orderIdInput}
                        onChange={(e) => setOrderIdInput(e.target.value)}
                        className={`px-5 py-4 text-center text-sm font-semibold tracking-widest font-mono rounded-xl border border-[#E5E2DA] bg-white text-[#1E2A24] placeholder-[#A2B3AC] focus:border-[#C8A75D] focus:ring-1 focus:ring-[#C8A75D] outline-none ${errors.orderId ? "border-red-500 focus:ring-red-500" : ""}`}
                        aria-invalid={!!errors.orderId}
                        aria-describedby={errors.orderId ? "orderId-error" : undefined}
                      />
                      {errors.orderId && (
                        <span id="orderId-error" className="text-xs text-red-500 mt-1 font-semibold block">
                          {errors.orderId}
                        </span>
                      )}
                    </div>

                    {/* Mobile Input */}
                    <div className="flex flex-col gap-2.5">
                      <label htmlFor="mobile" className="text-xs font-bold text-[#3F4F4A] pr-1 flex items-center gap-1.5 justify-start">
                        <Phone className="w-4 h-4 text-[#C8A75D]" />
                        شماره موبایل گیرنده
                      </label>
                      <input
                        id="mobile"
                        type="text"
                        placeholder="مثال: ۰۹۱۲۳۴۵۶۷۸۹"
                        value={mobileInput}
                        onChange={(e) => setMobileInput(e.target.value)}
                        className={`px-5 py-4 text-center text-sm font-semibold tracking-widest font-mono rounded-xl border border-[#E5E2DA] bg-white text-[#1E2A24] placeholder-[#A2B3AC] focus:border-[#C8A75D] focus:ring-1 focus:ring-[#C8A75D] outline-none ${errors.mobile ? "border-red-500 focus:ring-red-500" : ""}`}
                        aria-invalid={!!errors.mobile}
                        aria-describedby={errors.mobile ? "mobile-error" : undefined}
                      />
                      {errors.mobile && (
                        <span id="mobile-error" className="text-xs text-red-500 mt-1 font-semibold block">
                          {errors.mobile}
                        </span>
                      )}
                    </div>

                    <Button
                      type="submit"
                      variant="accent"
                      size="lg"
                      className="w-full py-4 text-xs font-extrabold shadow-[0_4px_20px_rgba(200,167,93,0.3)] bg-gradient-to-r from-[#C8A75D] to-[#E5C983] text-[#0A100E] hover:shadow-[0_0_25px_rgba(200,167,93,0.5)] hover:scale-[1.02] transition-all mt-4 border-none"
                    >
                      پیگیری وضعیت سفارش
                    </Button>
                  </form>
                </div>
              </div>
            </motion.div>
          ) : searchedOrder ? (
            /* PREMIUM RESULTS VIEW & TIMELINE EXPERIENCE */
            <motion.div
              key="tracking-success"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 90, damping: 14 }}
              className="flex flex-col gap-8 text-right w-full"
            >
              {/* Header / Meta Card */}
              <div className="p-6 md:p-8 border border-[#EDE8DF] shadow-[0_8px_40px_rgba(0,0,0,0.05)] rounded-3xl flex flex-col md:flex-row justify-between items-center gap-6 bg-white text-[#1E2A24]">
                <div className="flex flex-col gap-2 text-center md:text-right">
                  <div className="flex items-center gap-3 justify-center md:justify-start">
                    <span className="text-xl md:text-2xl font-extrabold text-[#1E2A24]">
                      وضعیت نهایی مرسوله
                    </span>
                    <Badge className="bg-[#F5F0E6] text-[#8B7355] font-mono font-bold text-xs border-0 px-3 py-1 rounded-full">
                      {searchedOrder.orderId}
                    </Badge>
                  </div>
                  <span className="text-[#5C6B63] text-xs font-medium">
                    سفارش تحت کارشناسی اصالت دانه طلایی و تضمین کشت ارگانیک
                  </span>
                </div>

                <div className="flex flex-col items-center md:items-end gap-1.5 text-xs text-[#5C6B63]">
                  <span>
                    کد رهگیری پستی:{" "}
                    <strong className="font-mono text-[#C8A75D] text-sm">{searchedOrder.trackingNumber}</strong>
                  </span>
                  <span>
                    تخمین زمان تحویل:{" "}
                    <strong className="text-[#1E2A24]">{searchedOrder.estimatedDeliveryDate}</strong>
                  </span>
                </div>
              </div>

              {/* Luxurious Vertical Process Tracking Timeline */}
              <div className="p-6 md:p-10 border border-[#EDE8DF] shadow-[0_8px_40px_rgba(0,0,0,0.05)] rounded-3xl bg-white text-[#1E2A24]">
                <span className="block text-lg font-bold text-[#2F5D50] border-b border-[#EDE8DF] pb-4 mb-8">
                  روند زنده بوجاری، بسته‌بندی و ارسال محصول
                </span>

                <div className="relative flex flex-col gap-8 pr-2">
                  {/* Visual Connector Line */}
                  <div className="absolute top-[22px] bottom-[22px] right-[19px] w-[2px] bg-[#E8E4DB] z-0" />
                  <div
                    className="absolute top-[22px] right-[19px] w-[2px] bg-[#C8A75D] z-0 transition-all duration-1000"
                    style={{
                      height: `${(searchedOrder.currentStep / 6) * 100}%`
                    }}
                  />

                  {TIMELINE_STEPS.map((step, idx) => {
                    const StepIcon = step.icon;
                    const isCompleted = idx < searchedOrder.currentStep;
                    const isCurrent = idx === searchedOrder.currentStep;
                    const isUpcoming = idx > searchedOrder.currentStep;

                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.08 }}
                        className="flex items-start gap-5 z-10 relative"
                      >
                        {/* Timeline status point */}
                        <div className="relative flex items-center justify-center shrink-0">
                          {isCompleted && (
                            <div className="w-10 h-10 rounded-full bg-[#2F5D50] text-white flex items-center justify-center shadow-[0_0_12px_rgba(47,93,80,0.25)]">
                              <span className="text-sm font-bold">✓</span>
                            </div>
                          )}
                          {isCurrent && (
                            <div className="w-10 h-10 rounded-full bg-[#E8D9B5] text-[#8B7355] flex items-center justify-center shadow-[0_0_16px_rgba(200,167,93,0.35)] border border-[#C8A75D]/40">
                              <StepIcon className="w-4.5 h-4.5" />
                            </div>
                          )}
                          {isUpcoming && (
                            <div className="w-10 h-10 rounded-full bg-[#F0EDE6] text-[#B0B8B2] flex items-center justify-center border border-[#E5E2DA]">
                              <StepIcon className="w-4.5 h-4.5" />
                            </div>
                          )}
                        </div>

                        {/* Description block */}
                        <div className="flex-1 flex flex-col text-right pt-1">
                          <div className="flex items-center justify-between gap-3">
                            <span
                              className={`text-sm font-bold ${
                                isCurrent
                                  ? "text-[#2F5D50]"
                                  : isCompleted
                                  ? "text-[#1E2A24]"
                                  : "text-[#9AA5A0]"
                              }`}
                            >
                              {step.label}
                            </span>
                            <span className="text-[11px] text-[#8A9590] font-medium whitespace-nowrap">
                              {step.time}
                            </span>
                          </div>
                          <span
                            className={`text-xs mt-1 leading-relaxed ${
                              isUpcoming ? "text-[#B0B8B2]" : "text-[#5C6B63]"
                            }`}
                          >
                            {step.desc}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Information Grid Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Card 1: Client & Payment Details */}
                <div className="p-6 md:p-7 border border-[#EDE8DF] shadow-[0_8px_30px_rgba(0,0,0,0.04)] rounded-3xl bg-white text-[#1E2A24]">
                  <span className="block text-base font-bold text-[#C8A75D] border-b border-[#EDE8DF] pb-3 mb-4 flex items-center gap-2 justify-start">
                    <User className="w-4 h-4" />
                    اطلاعات خریدار و پرداخت
                  </span>

                  <div className="flex flex-col gap-3 text-xs">
                    <div className="flex justify-between items-center py-2.5 border-b border-[#F0EDE6]">
                      <span className="text-[#5C6B63] font-medium">نام خریدار</span>
                      <span className="font-bold text-[#1E2A24]">{searchedOrder.customerName}</span>
                    </div>
                    <div className="flex justify-between items-center py-2.5 border-b border-[#F0EDE6]">
                      <span className="text-[#5C6B63] font-medium">شماره همراه</span>
                      <span className="font-mono font-bold text-[#1E2A24]">{searchedOrder.mobile}</span>
                    </div>
                    <div className="flex justify-between items-center py-2.5 border-b border-[#F0EDE6]">
                      <span className="text-[#5C6B63] font-medium">تاریخ ثبت فاکتور</span>
                      <span className="font-bold text-[#1E2A24]">{searchedOrder.date}</span>
                    </div>
                    <div className="flex justify-between items-center py-2.5 border-b border-[#F0EDE6]">
                      <span className="text-[#5C6B63] font-medium">وضعیت تایید مالی</span>
                      <span className="font-bold text-[#2F5D50] bg-[#E8F0EC] px-2.5 py-1 rounded-md text-[11px]">
                        {searchedOrder.paymentStatus}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2.5">
                      <span className="text-[#5C6B63] font-medium">مجموع کل فاکتور</span>
                      <span className="font-black text-[#1E2A24] text-sm">{searchedOrder.amount}</span>
                    </div>
                  </div>
                </div>

                {/* Card 2: Courier & Shipping Info */}
                <div className="p-6 md:p-7 border border-[#EDE8DF] shadow-[0_8px_30px_rgba(0,0,0,0.04)] rounded-3xl bg-white text-[#1E2A24]">
                  <span className="block text-base font-bold text-[#C8A75D] border-b border-[#EDE8DF] pb-3 mb-4 flex items-center gap-2 justify-start">
                    <Truck className="w-4 h-4" />
                    اطلاعات لجستیک و ارسال مرسوله
                  </span>

                  <div className="flex flex-col gap-3 text-xs">
                    <div className="flex justify-between items-center py-2.5 border-b border-[#F0EDE6]">
                      <span className="text-[#5C6B63] font-medium">شرکت همکار لجستیک</span>
                      <span className="font-bold text-[#1E2A24]">{searchedOrder.courier}</span>
                    </div>
                    <div className="flex justify-between items-center py-2.5 border-b border-[#F0EDE6]">
                      <span className="text-[#5C6B63] font-medium">روش ارسال منتخب</span>
                      <span className="font-bold text-[#1E2A24]">{searchedOrder.deliveryMethod}</span>
                    </div>
                    <div className="flex justify-between items-center py-2.5 border-b border-[#F0EDE6]">
                      <span className="text-[#5C6B63] font-medium">وزن خالص کیسه برنج</span>
                      <span className="font-bold text-[#1E2A24] flex items-center gap-1">
                        <Scale className="w-3.5 h-3.5 text-[#C8A75D]" />
                        {searchedOrder.weight}
                      </span>
                    </div>
                    <div className="flex justify-between items-start py-2.5 border-b border-[#F0EDE6]">
                      <span className="text-[#5C6B63] shrink-0 font-medium">نشانی تحویل گیرنده</span>
                      <span className="font-bold text-[#1E2A24] text-left leading-relaxed max-w-[210px]">
                        {searchedOrder.shippingAddress}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2.5">
                      <span className="text-[#5C6B63] font-medium">بارنامه پستی (MOCK)</span>
                      <span className="font-mono font-bold text-[#C8A75D] tracking-wider bg-[#F8F3E8] px-2.5 py-1 rounded-md text-[11px]">
                        {searchedOrder.trackingNumber}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Back controls */}
              <div className="flex justify-center mt-4">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={resetSearch}
                  className="px-10 py-3.5 text-xs font-bold rounded-full border border-[#E0D9CE] text-[#1E2A24] hover:text-[#C8A75D] hover:bg-[#F8F3E8] hover:border-[#C8A75D]/40 transition-all cursor-pointer bg-white"
                >
                  پیگیری مرسوله دیگر
                </Button>
              </div>
            </motion.div>
          ) : (
            /* PREMIUM EMPTY STATE CARD */
            <motion.div
              key="tracking-empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="text-center max-w-md mx-auto"
            >
              <div className="p-10 border border-[#EDE8DF] shadow-[0_8px_40px_rgba(0,0,0,0.05)] rounded-3xl flex flex-col items-center gap-6 bg-white text-[#1E2A24]">
                <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
                  <XCircle className="w-9 h-9" />
                </div>
                <span className="text-2xl font-bold text-[#1E2A24]">
                  سفارشی پیدا نشد
                </span>
                <span className="text-sm text-[#5C6B63] leading-relaxed font-light">
                  اطلاعات وارد شده صحیح نیست یا سفارشی با این مشخصات در طلای شالیزار وجود ندارد. لطفاً شماره فاکتور خود را مجدد بررسی فرمایید.
                </span>
                <Button
                  variant="accent"
                  size="lg"
                  onClick={resetSearch}
                  className="w-full font-bold mt-2 shadow-lg bg-gradient-to-r from-[#C8A75D] to-[#E5C983] hover:shadow-[0_0_20px_rgba(200,167,93,0.4)] text-[#0A100E] border-none"
                >
                  تلاش مجدد
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function OrderTrackingPage() {
  return (
    <MainLayout>
      {/* Cinematic Elegant Hero Background Wrapper */}
      <section className="relative py-20 px-4 overflow-hidden text-center border-b border-[#EDE8DF] bg-gradient-to-b from-[#F0F4F1] via-[#F8F6F1] to-[#F8F6F1]">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#C8A75D]/8 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center gap-4">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="gap-2 px-4 py-1.5 bg-[#F5F0E6] text-[#8B7355] border border-[#E8D9B5] text-xs rounded-full font-medium">
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
              className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#1E2A24] font-serif leading-tight"
            >
              پیگیری سفارش
            </Typography>
            <Typography
              variant="body"
              className="text-sm md:text-base text-[#5C6B63] max-w-xl mx-auto mt-3 font-light leading-relaxed"
            >
              با وارد کردن اطلاعات سفارش، آخرین وضعیت سفارش خود را مشاهده کنید.
            </Typography>
          </motion.div>
        </div>
      </section>

      {/* Main Interactive Workspace Area wrapping search params inside Suspense */}
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[400px] bg-[#F8F6F1]">
            <span className="w-10 h-10 border-4 border-[#C8A75D] border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <OrderTrackingContent />
      </Suspense>
    </MainLayout>
  );
}

export const dynamic = "force-dynamic";
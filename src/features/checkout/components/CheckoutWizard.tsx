"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  Phone,
  MapPin,
  Mail,
  Truck,
  CreditCard,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  ShoppingBag,
  ShieldCheck,
  Calendar
} from "lucide-react";
import { useCatalogStore } from "../../product-catalog/store";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { Badge } from "@/components/ui/Badge";

// Premium Iranian Provinces list
const PROVINCES = [
  "تهران",
  "گیلان",
  "مازندران",
  "اصفهان",
  "خراسان رضوی",
  "فارس",
  "آذربایجان شرقی",
  "البرز",
  "خوزستان",
  "یزد",
  "کرمان",
  "قم",
  "همدان"
];

interface FormErrors {
  fullName?: string;
  phone?: string;
  province?: string;
  city?: string;
  address?: string;
  postalCode?: string;
}

export const CheckoutWizard: React.FC = () => {
  const {
    cart,
    isCheckoutOpen,
    setIsCheckoutOpen,
    clearCart
  } = useCatalogStore();

  const [mounted, setMounted] = useState(false);

  // Steps: 1 = Address/Info, 2 = Shipping Method, 3 = Review, 4 = Confirmation
  const [step, setStep] = useState(1);

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [province, setProvince] = useState("تهران");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");

  // Delivery Method Selection
  const [deliveryMethod, setDeliveryMethod] = useState("standard"); // standard, tipax, vip

  // Loading indicator for order submit
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState("");

  // Validation state
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  // Compute Cart Prices
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Shipping prices based on delivery selection
  const isFreeShippingAvailable = subtotal > 3000000;
  let shippingCost = 0;
  if (deliveryMethod === "standard") {
    shippingCost = isFreeShippingAvailable ? 0 : 45000;
  } else if (deliveryMethod === "tipax") {
    shippingCost = 85000;
  } else if (deliveryMethod === "vip") {
    shippingCost = 150000;
  }

  const grandTotal = subtotal + shippingCost;

  // Validation logic
  const validateForm = (): boolean => {
    const tempErrors: FormErrors = {};

    if (!fullName.trim()) {
      tempErrors.fullName = "نام و نام خانوادگی الزامی است.";
    }

    // Iranian mobile standard: 09 followed by 9 digits
    const cleanPhone = phone.trim();
    if (!cleanPhone) {
      tempErrors.phone = "شماره تلفن همراه الزامی است.";
    } else if (!/^09\d{9}$/.test(cleanPhone)) {
      tempErrors.phone = "شماره همراه معتبر نیست. مثال: ۰۹۱۲۳۴۵۶۷۸۹";
    }

    if (!city.trim()) {
      tempErrors.city = "نام شهر الزامی است.";
    }

    if (!address.trim()) {
      tempErrors.address = "آدرس دقیق پستی الزامی است.";
    }

    // 10 digits postal code
    const cleanPostal = postalCode.trim();
    if (!cleanPostal) {
      tempErrors.postalCode = "کد پستی ۱۰ رقمی الزامی است.";
    } else if (!/^\d{10}$/.test(cleanPostal)) {
      tempErrors.postalCode = "کد پستی باید دقیقا ۱۰ رقم بدون خط تیره باشد.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (validateForm()) {
        setStep(2);
      }
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmitOrder = () => {
    setIsSubmitting(true);
    // Simulate premium payment submission
    setTimeout(() => {
      setIsSubmitting(false);
      const generatedOrderNum = "SHALI-" + Math.floor(100000 + Math.random() * 900000);
      setOrderId(generatedOrderNum);
      setStep(4);
    }, 2000);
  };

  const handleCloseAndReset = () => {
    setIsCheckoutOpen(false);
    clearCart();
    setStep(1);
    setFullName("");
    setPhone("");
    setEmail("");
    setProvince("تهران");
    setCity("");
    setAddress("");
    setPostalCode("");
    setDeliveryMethod("standard");
  };

  // Convert English numbers to Persian for premium feel
  const toPersianNum = (num: number | string): string => {
    return num.toLocaleString("fa-IR");
  };

  return (
    <AnimatePresence>
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto font-sans">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => step < 4 && setIsCheckoutOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-md"
          />

          {/* Modal Container */}
          <div className="flex min-h-screen items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="relative w-full max-w-4xl bg-background/95 dark:bg-[#0A100E]/95 border border-border/40 rounded-3xl overflow-hidden shadow-2xl z-10 text-right"
            >
              {/* Header block */}
              <div className="px-6 py-5 border-b border-border/10 flex items-center justify-between bg-primary/2 dark:bg-white/2">
                {step < 4 ? (
                  <button
                    onClick={() => setIsCheckoutOpen(false)}
                    className="p-2 rounded-full hover:bg-muted/20 text-foreground transition-all cursor-pointer"
                    title="انصراف و خروج"
                  >
                    <X className="w-5 h-5" />
                  </button>
                ) : (
                  <div className="w-9 h-9" />
                )}

                {/* Wizard Title */}
                <Typography variant="h3" className="text-lg md:text-xl font-bold text-primary dark:text-foreground">
                  {step === 4 ? "سفارش شما با موفقیت ثبت شد" : "تکمیل نهایی خرید ممتاز شالیزار"}
                </Typography>
              </div>

              {/* Step Progress Indicators */}
              {step < 4 && (
                <div className="px-6 py-4 bg-primary/5 dark:bg-accent/5 border-b border-border/10 flex items-center justify-center gap-2 md:gap-4 text-xs font-semibold overflow-x-auto">
                  <div className={`flex items-center gap-1.5 shrink-0 ${step >= 3 ? "text-primary dark:text-accent" : "text-muted-foreground"}`}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center border ${step >= 3 ? "border-primary dark:border-accent bg-primary/10" : "border-muted-foreground/30"}`}>
                      ۳
                    </span>
                    <span>تایید نهایی سفارش</span>
                  </div>
                  <span className="text-muted-foreground/30 font-light">• • •</span>
                  <div className={`flex items-center gap-1.5 shrink-0 ${step >= 2 ? "text-primary dark:text-accent" : "text-muted-foreground"}`}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center border ${step >= 2 ? "border-primary dark:border-accent bg-primary/10" : "border-muted-foreground/30"}`}>
                      ۲
                    </span>
                    <span>روش ارسال شالیزار</span>
                  </div>
                  <span className="text-muted-foreground/30 font-light">• • •</span>
                  <div className={`flex items-center gap-1.5 shrink-0 ${step >= 1 ? "text-primary dark:text-accent" : "text-muted-foreground"}`}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center border ${step >= 1 ? "border-primary dark:border-accent bg-primary/10" : "border-muted-foreground/30"}`}>
                      ۱
                    </span>
                    <span>اطلاعات گیرنده و آدرس</span>
                  </div>
                </div>
              )}

              {/* Main Body */}
              <div className="p-6 md:p-8">
                {step === 1 && (
                  /* STEP 1: Address & Details Form */
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Left Panel: Small Summary */}
                    <div className="md:col-span-4 space-y-4 border border-border/10 p-5 rounded-2xl bg-primary/2 dark:bg-white/2 order-last md:order-first">
                      <Typography variant="serif-title" className="text-sm font-bold border-b border-border/10 pb-2 mb-3">
                        خلاصه سبد خرید ممتاز
                      </Typography>
                      <div className="max-h-52 overflow-y-auto divide-y divide-border/5 space-y-3">
                        {cart.map((item) => (
                          <div key={item.id} className="flex justify-between items-center text-xs py-2 gap-3">
                            <span className="text-muted-foreground">
                              {toPersianNum(item.quantity)} × {toPersianNum(item.price)} ت
                            </span>
                            <span className="font-semibold text-foreground line-clamp-1 text-right flex-1">
                              {item.name}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-border/10 pt-3 text-right">
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          <span>{toPersianNum(subtotal)} تومان</span>
                          <span>جمع کل اقلام:</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Panel: Address Inputs Form */}
                    <div className="md:col-span-8 space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Full Name */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-muted-foreground flex items-center gap-1 justify-start">
                            <User className="w-3.5 h-3.5 text-accent" />
                            نام و نام خانوادگی گیرنده <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="مثال: علی محمدی شالیکار"
                            className={`w-full px-4 py-3 text-xs rounded-xl bg-primary/5 dark:bg-white/5 border focus:outline-none focus:ring-2 focus:ring-accent transition-all ${errors.fullName ? "border-red-500" : "border-border/20"}`}
                          />
                          {errors.fullName && (
                            <span className="text-[10px] text-red-500 font-semibold flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {errors.fullName}
                            </span>
                          )}
                        </div>

                        {/* Phone */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-muted-foreground flex items-center gap-1 justify-start">
                            <Phone className="w-3.5 h-3.5 text-accent" />
                            شماره تلفن همراه گیرنده <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="مثال: ۰۹۱۲۳۴۵۶۷۸۹"
                            className={`w-full px-4 py-3 text-xs rounded-xl bg-primary/5 dark:bg-white/5 border focus:outline-none focus:ring-2 focus:ring-accent transition-all ${errors.phone ? "border-red-500" : "border-border/20"}`}
                          />
                          {errors.phone && (
                            <span className="text-[10px] text-red-500 font-semibold flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {errors.phone}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Province Select */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-muted-foreground flex items-center gap-1 justify-start">
                            <MapPin className="w-3.5 h-3.5 text-accent" />
                            استان <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={province}
                            onChange={(e) => setProvince(e.target.value)}
                            className="w-full px-4 py-3 text-xs rounded-xl bg-primary/5 dark:bg-white/5 border border-border/20 focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                          >
                            {PROVINCES.map((prov) => (
                              <option key={prov} value={prov} className="dark:bg-[#0E1412] text-foreground">
                                {prov}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* City */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-muted-foreground flex items-center gap-1 justify-start">
                            <MapPin className="w-3.5 h-3.5 text-accent" />
                            شهر <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="مثال: تهران / رشت"
                            className={`w-full px-4 py-3 text-xs rounded-xl bg-primary/5 dark:bg-white/5 border focus:outline-none focus:ring-2 focus:ring-accent transition-all ${errors.city ? "border-red-500" : "border-border/20"}`}
                          />
                          {errors.city && (
                            <span className="text-[10px] text-red-500 font-semibold flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {errors.city}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Detailed Address */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-muted-foreground flex items-center gap-1 justify-start">
                          <MapPin className="w-3.5 h-3.5 text-accent" />
                          آدرس دقیق پستی <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          rows={2}
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="مثال: خیابان شریعتی، کوچه بهار، پلاک ۱۰، واحد ۴"
                          className={`w-full px-4 py-3 text-xs rounded-xl bg-primary/5 dark:bg-white/5 border focus:outline-none focus:ring-2 focus:ring-accent transition-all ${errors.address ? "border-red-500" : "border-border/20"}`}
                        />
                        {errors.address && (
                          <span className="text-[10px] text-red-500 font-semibold flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.address}
                          </span>
                        )}
                      </div>

                      {/* Postal Code & optional Email */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Postal Code */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-muted-foreground flex items-center gap-1 justify-start">
                            <MapPin className="w-3.5 h-3.5 text-accent" />
                            کد پستی ۱۰ رقمی <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            maxLength={10}
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                            placeholder="مثال: ۱۲۳۴۵۶۷۸۹۰"
                            className={`w-full px-4 py-3 text-xs rounded-xl bg-primary/5 dark:bg-white/5 border focus:outline-none focus:ring-2 focus:ring-accent transition-all ${errors.postalCode ? "border-red-500" : "border-border/20"}`}
                          />
                          {errors.postalCode && (
                            <span className="text-[10px] text-red-500 font-semibold flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" />
                              {errors.postalCode}
                            </span>
                          )}
                        </div>

                        {/* Email */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-muted-foreground flex items-center gap-1 justify-start">
                            <Mail className="w-3.5 h-3.5 text-accent" />
                            آدرس ایمیل (اختیاری)
                          </label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="مثال: client@example.com"
                            className="w-full px-4 py-3 text-xs rounded-xl bg-primary/5 dark:bg-white/5 border border-border/20 focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  /* STEP 2: Delivery Method Selection */
                  <div className="space-y-6">
                    <Typography variant="serif-title" className="text-base font-bold text-primary dark:text-foreground mb-4">
                      انتخاب روش باربری و تحویل شالیزار
                    </Typography>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Standard Delivery */}
                      <div
                        onClick={() => setDeliveryMethod("standard")}
                        className={`p-5 rounded-2xl border cursor-pointer flex flex-col justify-between gap-4 transition-all hover:shadow-md ${deliveryMethod === "standard" ? "border-accent bg-accent/5 ring-1 ring-accent" : "border-border/10 bg-primary/2 dark:bg-white/2"}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className={`p-2 rounded-full ${deliveryMethod === "standard" ? "bg-accent/15 text-accent" : "bg-muted/10 text-muted-foreground"}`}>
                            <Truck className="w-5 h-5" />
                          </span>
                          <span className="text-xs font-extrabold text-accent">برداشت محلی</span>
                        </div>
                        <div>
                          <Typography variant="h4" className="text-sm font-bold text-foreground">
                            پست پیشتاز سفارشی
                          </Typography>
                          <p className="text-[11px] text-muted-foreground mt-1 font-light">
                            ارسال بیمه‌شده توسط شرکت ملی پست. زمان رسیدن بین ۳ الی ۵ روز کاری.
                          </p>
                        </div>
                        <div className="border-t border-border/15 pt-3 flex justify-between items-center text-xs font-bold">
                          <span className="text-primary dark:text-accent">
                            {isFreeShippingAvailable ? "رایگان (هدیه)" : "۴۵,۰۰۰ تومان"}
                          </span>
                          <span className="text-muted-foreground/60">هزینه ارسال</span>
                        </div>
                      </div>

                      {/* Tipax Express */}
                      <div
                        onClick={() => setDeliveryMethod("tipax")}
                        className={`p-5 rounded-2xl border cursor-pointer flex flex-col justify-between gap-4 transition-all hover:shadow-md ${deliveryMethod === "tipax" ? "border-accent bg-accent/5 ring-1 ring-accent" : "border-border/10 bg-primary/2 dark:bg-white/2"}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className={`p-2 rounded-full ${deliveryMethod === "tipax" ? "bg-accent/15 text-accent" : "bg-muted/10 text-muted-foreground"}`}>
                            <Truck className="w-5 h-5" />
                          </span>
                          <span className="text-xs font-extrabold text-accent">اکسپرس سریع</span>
                        </div>
                        <div>
                          <Typography variant="h4" className="text-sm font-bold text-foreground">
                            پیشتاز باربری تیپاکس
                          </Typography>
                          <p className="text-[11px] text-muted-foreground mt-1 font-light">
                            بسته‌بندی ویژه جهت جلوگیری از رطوبت برنج. زمان رسیدن بین ۱ الی ۲ روز کاری.
                          </p>
                        </div>
                        <div className="border-t border-border/15 pt-3 flex justify-between items-center text-xs font-bold">
                          <span className="text-primary dark:text-accent">۸۵,۰۰۰ تومان</span>
                          <span className="text-muted-foreground/60">هزینه ارسال</span>
                        </div>
                      </div>

                      {/* VIP Carrier */}
                      <div
                        onClick={() => setDeliveryMethod("vip")}
                        className={`p-5 rounded-2xl border cursor-pointer flex flex-col justify-between gap-4 transition-all hover:shadow-md ${deliveryMethod === "vip" ? "border-accent bg-accent/5 ring-1 ring-accent" : "border-border/10 bg-primary/2 dark:bg-white/2"}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className={`p-2 rounded-full ${deliveryMethod === "vip" ? "bg-accent/15 text-accent" : "bg-muted/10 text-muted-foreground"}`}>
                            <ShieldCheck className="w-5 h-5" />
                          </span>
                          <span className="text-xs font-extrabold text-accent">VIP شالیزار</span>
                        </div>
                        <div>
                          <Typography variant="h4" className="text-sm font-bold text-foreground">
                            حمل اختصاصی طلای شالیزار
                          </Typography>
                          <p className="text-[11px] text-muted-foreground mt-1 font-light">
                            ارسال ویژه با بیمه نامه کامل تضمین عطر و پلمپ کامل گونی. ارسال مستقیم همکار شالیزار.
                          </p>
                        </div>
                        <div className="border-t border-border/15 pt-3 flex justify-between items-center text-xs font-bold">
                          <span className="text-primary dark:text-accent">۱۵۰,۰۰۰ تومان</span>
                          <span className="text-muted-foreground/60">هزینه ارسال</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  /* STEP 3: Order Review & Submit */
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                      {/* Right Panel: Customer info review */}
                      <div className="md:col-span-7 space-y-4 text-right">
                        <Typography variant="serif-title" className="text-base font-bold text-primary dark:text-foreground border-b border-border/10 pb-2">
                          اطلاعات ارسال و تحویل نهایی
                        </Typography>

                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div className="p-4 rounded-xl border border-border/5 bg-primary/2 dark:bg-white/2">
                            <span className="text-muted-foreground block mb-1">گیرنده سفارش:</span>
                            <strong className="text-foreground">{fullName}</strong>
                          </div>
                          <div className="p-4 rounded-xl border border-border/5 bg-primary/2 dark:bg-white/2">
                            <span className="text-muted-foreground block mb-1">تلفن تماس:</span>
                            <strong className="text-foreground">{toPersianNum(phone)}</strong>
                          </div>
                        </div>

                        <div className="p-4 rounded-xl border border-border/5 bg-primary/2 dark:bg-white/2 text-xs">
                          <span className="text-muted-foreground block mb-1">نشانی دقیق تحویل:</span>
                          <strong className="text-foreground">
                            استان {province}، شهر {city}، {address}
                          </strong>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div className="p-4 rounded-xl border border-border/5 bg-primary/2 dark:bg-white/2">
                            <span className="text-muted-foreground block mb-1">کد پستی گیرنده:</span>
                            <strong className="text-foreground">{toPersianNum(postalCode)}</strong>
                          </div>
                          <div className="p-4 rounded-xl border border-border/5 bg-primary/2 dark:bg-white/2">
                            <span className="text-muted-foreground block mb-1">باربری انتخابی:</span>
                            <strong className="text-foreground">
                              {deliveryMethod === "standard"
                                ? "پست پیشتاز سفارشی"
                                : deliveryMethod === "tipax"
                                ? "پیشتاز باربری تیپاکس"
                                : "حمل اختصاصی VIP شالیزار"}
                            </strong>
                          </div>
                        </div>
                      </div>

                      {/* Left Panel: Final Payment Breakdown */}
                      <div className="md:col-span-5 space-y-4 border border-accent/20 p-6 rounded-2xl bg-primary/5 dark:bg-accent/5">
                        <Typography variant="serif-title" className="text-base font-bold text-foreground border-b border-border/10 pb-2">
                          صورت‌حساب نهایی
                        </Typography>

                        <div className="space-y-3 text-xs text-muted-foreground text-right">
                          <div className="flex justify-between items-center">
                            <span className="text-foreground font-semibold">{toPersianNum(subtotal)} تومان</span>
                            <span>قیمت کل اقلام برنج:</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-foreground font-semibold">
                              {shippingCost === 0 ? "رایگان (ارسال هدیه)" : `${toPersianNum(shippingCost)} تومان`}
                            </span>
                            <span>هزینه بسته‌بندی و باربری:</span>
                          </div>
                          <hr className="border-border/10 my-3" />
                          <div className="flex justify-between items-center text-sm font-extrabold text-primary dark:text-accent">
                            <span>{toPersianNum(grandTotal)} تومان</span>
                            <span>مبلغ نهایی قابل پرداخت:</span>
                          </div>
                        </div>

                        {/* Trust badge */}
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground bg-background/50 dark:bg-black/20 p-2.5 rounded-lg border border-border/5 mt-4">
                          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                          پرداخت امن با پروتکل معتبر بانکی شتاب
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  /* STEP 4: Success / Confirmation */
                  <div className="text-center py-12 px-4 space-y-6 max-w-xl mx-auto">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", damping: 15, stiffness: 200 }}
                      className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto"
                    >
                      <CheckCircle className="w-12 h-12 text-emerald-500" />
                    </motion.div>

                    <div className="space-y-2">
                      <Typography variant="serif-title" className="text-xl md:text-2xl font-bold text-primary dark:text-emerald-500">
                        برداشت عطر اصالت؛ سفارش با موفقیت ثبت شد!
                      </Typography>
                      <Typography variant="body-sm" className="text-muted-foreground text-sm max-w-md mx-auto">
                        آقای/خانم <strong className="text-foreground">{fullName}</strong>، سفارش شما ثبت گردید و در اسرع وقت بسته‌بندی خواهد شد. کد رهگیری سفارش و جزئیات ارسال برای شما فعال شد.
                      </Typography>
                    </div>

                    {/* Order Details box */}
                    <div className="bg-primary/2 dark:bg-white/2 border border-border/10 p-5 rounded-2xl divide-y divide-border/10 text-right space-y-3 text-xs text-muted-foreground">
                      <div className="flex justify-between items-center pb-2">
                        <span className="text-primary dark:text-accent font-mono font-bold text-sm tracking-wide">
                          {orderId}
                        </span>
                        <span>کد پیگیری شالیزار:</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-foreground font-semibold">
                          {province}، {city}
                        </span>
                        <span>مقصد ارسال:</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-foreground font-semibold">
                          {deliveryMethod === "standard"
                            ? "پست پیشتاز سفارشی (۳ تا ۵ روز)"
                            : deliveryMethod === "tipax"
                            ? "تیپاکس سریع (۱ تا ۲ روز)"
                            : "حمل اختصاصی VIP (۱ روز)"}
                        </span>
                        <span>شیوه باربری:</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 text-sm font-bold text-primary dark:text-accent">
                        <span>{toPersianNum(grandTotal)} تومان</span>
                        <span>مبلغ پرداخت شده:</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground justify-center">
                      <Calendar className="w-4 h-4 text-accent" />
                      یک پیامک تایید با اطلاعات بارنامه به محض تحویل به باربری به شماره{" "}
                      <strong>{toPersianNum(phone)}</strong> ارسال خواهد شد.
                    </div>

                    <Button
                      variant="accent"
                      onClick={handleCloseAndReset}
                      className="px-10 py-3.5 text-xs font-bold rounded-full hover:scale-102 transition-transform cursor-pointer"
                    >
                      بازگشت به شالیزار و اتمام فرآیند
                    </Button>
                  </div>
                )}
              </div>

              {/* Wizard Footer Navigation Controls */}
              {step < 4 && (
                <div className="px-6 py-5 border-t border-border/10 flex items-center justify-between bg-primary/2 dark:bg-white/2">
                  {/* Next / Submit Button */}
                  {step === 3 ? (
                    <Button
                      variant="accent"
                      disabled={isSubmitting}
                      onClick={handleSubmitOrder}
                      className="px-8 py-3 text-xs font-bold gap-2 rounded-full cursor-pointer hover:shadow-lg transition-all"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                          در حال ارسال به درگاه بانکی...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4" />
                          پرداخت نهایی و ثبت سفارش
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      variant="accent"
                      onClick={handleNextStep}
                      className="px-8 py-3 text-xs font-bold gap-1.5 rounded-full cursor-pointer hover:scale-102 transition-transform"
                    >
                      <span>تایید و ادامه مسیر</span>
                      <ArrowLeft className="w-4 h-4" />
                    </Button>
                  )}

                  {/* Back / Close button */}
                  {step > 1 ? (
                    <button
                      onClick={handlePrevStep}
                      className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                      <ArrowRight className="w-4 h-4" />
                      مرحله قبل
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsCheckoutOpen(false)}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                      انصراف و بستن
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

CheckoutWizard.displayName = "CheckoutWizard";

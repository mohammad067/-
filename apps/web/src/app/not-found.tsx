import React from "react";
import Link from "next/link";
import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { MainLayout } from "@/components/layout/MainLayout";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <MainLayout>
      <div className="min-h-[65vh] flex flex-col items-center justify-center p-8 text-center animate-fade-in max-w-xl mx-auto">
        <div className="w-20 h-20 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-8">
          <Compass className="w-10 h-10 stroke-1" />
        </div>
        <Typography variant="serif-title" className="text-3xl md:text-4xl font-bold mb-4">
          صفحه مورد نظر یافت نشد
        </Typography>
        <Typography variant="body-sm" className="text-muted-foreground mb-8 leading-relaxed">
          متاسفانه آدرس مورد نظر شما در شالیزارهای طلای شمال یافت نشد. ممکن است صفحه تغییر کرده باشد یا آدرس را اشتباه تایپ کرده باشید.
        </Typography>
        <div className="flex gap-4">
          <Link href="/">
            <Button variant="accent">
              بازگشت به خانه
            </Button>
          </Link>
          <a href="#products-showcase">
            <Button variant="outline">
              مشاهده محصولات ممتاز
            </Button>
          </a>
        </div>
      </div>
    </MainLayout>
  );
}

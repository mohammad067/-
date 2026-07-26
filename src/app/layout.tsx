import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "فروشگاه برنج لوکس ایرانی | اصالت و کیفیت برتر",
  description: "تجربه خرید مستقیم و آنلاین مرغوب‌ترین ارقام برنج اصیل ایرانی (هاشمی، صدری، دم‌سیاه) با بسته‌بندی نفیس و ارسال اختصاصی.",
  alternates: {
    canonical: "https://rice-shop.ir",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <link
          href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css"
          rel="stylesheet"
          type="text/css"
        />
      </head>
      <body className="antialiased min-h-screen font-sans selection:bg-[#C8A75D] selection:text-[#0E1412]">
        {children}
      </body>
    </html>
  );
}

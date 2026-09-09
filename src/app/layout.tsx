import type { Metadata } from "next";
import "../styles/globals.css";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  metadataBase: new URL("https://talaye-shalizar.vercel.app"),
  title: "طلای شالیزار | برنج شمال گیلان و مازندران",
  description: "خرید برنج شمال از شالیزار گیلان و مازندران؛ هاشمی، طارم، صدری و دم‌سیاه با مبدأ مشخص.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link
          href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen bg-[#F8F6F2] text-[#1E2522] text-[15px] font-[Vazirmatn,system-ui,sans-serif]">
        {children}
        <Analytics />
      </body>
    </html>
  );
}

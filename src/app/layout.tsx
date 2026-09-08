import type { Metadata } from "next";
import "../styles/globals.css";
import { Analytics } from "@vercel/analytics/next"

export const metadata: Metadata = {
  metadataBase: new URL("https://talaye-shalizar.vercel.app"),
  title: "طلای شالیزار | برنج شمال گیلان و مازندران",
  description: "خرید برنج شمال از شالیزار گیلان و مازندران؛ هاشمی، طارم، صدری و دم‌سیاه با مبدأ مشخص.",
  alternates: {
    canonical: "https://talaye-shalizar.vercel.app",
  },
  openGraph: {
    title: "طلای شالیزار | برنج شمال",
    description: "برنج گیلان و مازندران، مستقیم از شالیزار.",
    url: "https://talaye-shalizar.vercel.app",
    siteName: "طلای شالیزار",
    images: [
      {
        url: "/icon.png",
        width: 800,
        height: 800,
        alt: "لوگوی طلای شالیزار",
      },
    ],
    locale: "fa_IR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className="scroll-smooth">
      <head>
        <link
          href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css"
          rel="stylesheet"
          type="text/css"
        />
      </head>
      <body className="antialiased min-h-screen font-sans selection:bg-[#C8A75D] selection:text-[#0E1412] bg-[#F8F6F2] text-[#1E2522] dark:bg-[#0E1412] dark:text-[#F1EFEA]">
        {children}
        <Analytics />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Montserrat, Bebas_Neue } from "next/font/google";
import "./globals.css";
import { PageTransition } from "@/components/layout/PageTransition";
import { ConditionalShell } from "@/components/layout/ConditionalShell";

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-sans" });
const bebas = Bebas_Neue({ weight: "400", subsets: ["latin"], variable: "--font-heading" });

export const metadata: Metadata = {
  title: "Lay Day Hostels",
  description: "Lay Day has been the trailblazer in Bali's hostel scene modest hostel in Canggu with just 30 beds, a small pool, and a cosy little bar grew to become a ...",
  icons: {
    icon: "/logo-layday.png",
  },
};

import { Suspense } from "react";
import { MetaPixel } from "@/components/layout/MetaPixel";
import { GoogleAdsPixel } from "@/components/layout/GoogleAdsPixel";
import { GoogleAnalyticsPixel } from "@/components/layout/GoogleAnalyticsPixel";
import { GoogleTagManager } from "@/components/layout/GoogleTagManager";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://www.youtube.com" />
        <link rel="preconnect" href="https://www.google.com" />
      </head>
      <body className={`${montserrat.variable} ${bebas.variable} font-sans antialiased bg-[#EBE6D8] text-[#004A61] flex flex-col min-h-screen`}>
        <Suspense fallback={null}>
          <MetaPixel />
          <GoogleAdsPixel />
          <GoogleAnalyticsPixel />
          <GoogleTagManager />
        </Suspense>
        <ConditionalShell>
          <PageTransition>
            {children}
            <Analytics />
            <SpeedInsights />
          </PageTransition>
        </ConditionalShell>
      </body>
    </html>
  );
}

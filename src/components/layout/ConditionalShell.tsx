"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";


const STANDALONE_ROUTES = ["/creator-week-gili-t", "/11-years-layday"];

export function ConditionalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStandalone = STANDALONE_ROUTES.some((r) => pathname.startsWith(r)) || pathname.endsWith("-lp");
  const isCompletelyStandalone = pathname.startsWith("/opening-party-gilit");

  if (isCompletelyStandalone) {
    return <>{children}</>;
  }

  if (isStandalone) {
    return (
      <>
        {children}

      </>
    );
  }

  return (
    <>
      <Navbar />
      {children}

      <Footer />
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { captureAttribution, CLOUDBEDS_CONFIG } from "@/lib/tracking";

function getGtmIdForPath(pathname: string): string | null {
  if (pathname.includes("coday")) {
    return CLOUDBEDS_CONFIG.coday.gtmId;
  }
  if (pathname.includes("gilit")) {
    return CLOUDBEDS_CONFIG.gilit.gtmId;
  }
  if (pathname.includes("canggu")) {
    return CLOUDBEDS_CONFIG.canggu.gtmId;
  }
  // Default to Canggu container for general pages
  return CLOUDBEDS_CONFIG.canggu.gtmId;
}

export function GoogleTagManager() {
  const pathname = usePathname();
  const [loadedContainers, setLoadedContainers] = useState<Set<string>>(new Set());

  useEffect(() => {
    // 1. Capture and persist incoming attribution (gclid, utm_*, fbclid)
    captureAttribution();

    if (!pathname) return;

    const gtmId = getGtmIdForPath(pathname);
    if (!gtmId) return;

    // 2. Initialize GTM script if not already loaded for this container
    if (!loadedContainers.has(gtmId)) {
      setLoadedContainers((prev) => new Set(prev).add(gtmId));

      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        'gtm.start': new Date().getTime(),
        event: 'gtm.js'
      });

      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;
      document.head.appendChild(script);
    }
  }, [pathname, loadedContainers]);

  return null;
}

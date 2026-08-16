"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function getPixelIdForPath(pathname: string, origin?: string | null) {
  const target = origin || pathname;

  if (target.includes("coday")) {
    return process.env.NEXT_PUBLIC_META_PIXEL_ID_CODAY;
  }
  if (target.includes("gilit")) {
    return process.env.NEXT_PUBLIC_META_PIXEL_ID_LDGILIT;
  }
  if (target.includes("uluwatu")) {
    return process.env.NEXT_PUBLIC_META_PIXEL_ID_LDULUWATU;
  }
  if (target.includes("canggu")) {
    return process.env.NEXT_PUBLIC_META_PIXEL_ID_LDCANGGU;
  }
  if (target.includes("vice")) {
    return process.env.NEXT_PUBLIC_META_PIXEL_ID_VICE;
  }
  // Default to Canggu for the main site too
  return process.env.NEXT_PUBLIC_META_PIXEL_ID_LDCANGGU;
}

export function MetaPixel() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loadedPixels, setLoadedPixels] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!pathname) return;

    const origin: string | null = null;
    // We now rely on the pathname containing the venue name (e.g. /booking-confirmation/canggu)

    const pixelId = getPixelIdForPath(pathname, origin);
    if (!pixelId) return;

    // Load Pixel script if not already loaded
    if (!loadedPixels.has(pixelId)) {
      setLoadedPixels((prev) => new Set(prev).add(pixelId));

      const script = document.createElement("script");
      script.id = `meta-pixel-${pixelId}`;
      script.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        
        fbq('init', '${pixelId}');
        fbq('track', 'PageView');
      `;
      document.head.appendChild(script);
    } else {
      // If already loaded, just trigger PageView
      if (typeof window !== "undefined" && (window as any).fbq) {
        (window as any).fbq('track', 'PageView');
      }
    }
  }, [pathname, searchParams, loadedPixels]);

  return null;
}

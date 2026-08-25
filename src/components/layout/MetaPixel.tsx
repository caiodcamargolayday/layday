"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function getPixelIdsForPath(pathname: string, origin?: string | null): string[] {
  const target = origin || pathname;

  if (target.includes("11-years-layday") || target.includes("anniversary-canggu") || target.includes("anniversary-gilit")) {
    const cangguId = process.env.NEXT_PUBLIC_META_PIXEL_ID_ANNIVERSARY_CANGGU || process.env.NEXT_PUBLIC_META_PIXEL_ID_ANNIVERSARY || "1392233983092323";
    const gilitId = process.env.NEXT_PUBLIC_META_PIXEL_ID_ANNIVERSARY_GILIT || "1036889488979198";
    return [cangguId, gilitId].filter(Boolean) as string[];
  }
  if (target.includes("2-years-layday-uluwatu") || target.includes("anniversary-uluwatu")) {
    return [process.env.NEXT_PUBLIC_META_PIXEL_ID_ANNIVERSARY_ULUWATU || "1035484145914151"].filter(Boolean) as string[];
  }
  if (target.includes("coday")) {
    return [process.env.NEXT_PUBLIC_META_PIXEL_ID_CODAY].filter(Boolean) as string[];
  }
  if (target.includes("gilit")) {
    return [process.env.NEXT_PUBLIC_META_PIXEL_ID_LDGILIT].filter(Boolean) as string[];
  }
  if (target.includes("uluwatu")) {
    return [process.env.NEXT_PUBLIC_META_PIXEL_ID_LDULUWATU].filter(Boolean) as string[];
  }
  if (target.includes("canggu")) {
    return [process.env.NEXT_PUBLIC_META_PIXEL_ID_LDCANGGU].filter(Boolean) as string[];
  }
  if (target.includes("vice")) {
    return [process.env.NEXT_PUBLIC_META_PIXEL_ID_VICE].filter(Boolean) as string[];
  }
  // Default to Canggu for the main site too
  return [process.env.NEXT_PUBLIC_META_PIXEL_ID_LDCANGGU].filter(Boolean) as string[];
}

export function MetaPixel() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loadedPixels, setLoadedPixels] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!pathname) return;

    const origin: string | null = null;
    const pixelIds = getPixelIdsForPath(pathname, origin);
    if (!pixelIds || pixelIds.length === 0) return;

    // Ensure base fbevents script is loaded once
    if (typeof window !== "undefined" && !(window as any).fbq) {
      const script = document.createElement("script");
      script.id = "meta-pixel-base";
      script.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
      `;
      document.head.appendChild(script);
    }

    pixelIds.forEach((pixelId) => {
      if (!loadedPixels.has(pixelId)) {
        setLoadedPixels((prev) => new Set(prev).add(pixelId));
        if (typeof window !== "undefined" && (window as any).fbq) {
          (window as any).fbq("init", pixelId);
          (window as any).fbq("track", "PageView");
        } else {
          // If script tag just appended, wait or init inline
          const initScript = document.createElement("script");
          initScript.id = `meta-pixel-init-${pixelId}`;
          initScript.innerHTML = `
            if (window.fbq) {
              fbq('init', '${pixelId}');
              fbq('track', 'PageView');
            }
          `;
          document.head.appendChild(initScript);
        }
      } else {
        // If already loaded, just trigger PageView
        if (typeof window !== "undefined" && (window as any).fbq) {
          (window as any).fbq("track", "PageView");
        }
      }
    });
  }, [pathname, searchParams, loadedPixels]);

  return null;
}

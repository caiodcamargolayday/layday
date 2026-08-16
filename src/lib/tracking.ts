/**
 * Central Attribution & Cloudbeds Tracking Utility
 * Captures, stores, and propagates Google Ads (gclid/gbraid/wbraid), UTMs,
 * and Meta parameters across domains into Cloudbeds Booking Engine.
 */

export const CLOUDBEDS_CONFIG = {
  canggu: {
    name: "Lay Day Canggu",
    code: "idPO4I",
    url: "https://hotels.cloudbeds.com/en/reservation/idPO4I?currency=idr",
    gtmId: process.env.NEXT_PUBLIC_GTM_ID_LDCANGGU || "GTM-MGM8GCS4",
    googleAdsId: process.env.NEXT_PUBLIC_GOOGLE_ADS_ID_CANGGU || "AW-18281940342",
    googleAdsLabel: process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL_CANGGU,
    metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID_LDCANGGU || "976155272048859",
  },
  gilit: {
    name: "Lay Day Gili T",
    code: "4fbPDV",
    url: "https://hotels.cloudbeds.com/en/reservation/4fbPDV?currency=idr",
    gtmId: process.env.NEXT_PUBLIC_GTM_ID_LDGILIT || "GTM-WZKVRS2X",
    googleAdsId: process.env.NEXT_PUBLIC_GOOGLE_ADS_ID_GILIT || "AW-18224532346",
    googleAdsLabel: process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL_GILIT,
    metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID_LDGILIT || "1264553262088469",
  },
  coday: {
    name: "Coday Uluwatu",
    code: "WEE9oP",
    url: "https://hotels.cloudbeds.com/en/reservation/WEE9oP?currency=idr",
    gtmId: process.env.NEXT_PUBLIC_GTM_ID_CODAY || "GTM-PVR4M6DK",
    googleAdsId: process.env.NEXT_PUBLIC_GOOGLE_ADS_ID_CODAY_ULUWATU || "AW-18282445976",
    googleAdsLabel: process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL_CODAY_ULUWATU || "EejrCLHk1dAcEJj5341E",
    metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID_CODAY || "1944025092892970",
  },
  uluwatu: {
    name: "Lay Day Uluwatu",
    code: "10021",
    url: "https://www.simplebooking.it/ibe2/hotel/10021?lang=EN&cur=IDR",
    googleAdsId: process.env.NEXT_PUBLIC_GOOGLE_ADS_ID_LAYDAY_ULUWATU || process.env.NEXT_PUBLIC_GOOGLE_ADS_ID_ULUWATU || "AW-18002704389",
    googleAdsLabel: process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL_ULUWATU_BOOKING,
    metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID_LDULUWATU || "1188168500073960",
  }
} as const;

export type VenueKey = keyof typeof CLOUDBEDS_CONFIG;

const ATTRIBUTION_KEYS = [
  'gclid',
  'gbraid',
  'wbraid',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'fbclid',
  '_fbp',
  '_fbc',
] as const;

const STORAGE_KEY = 'layday_attribution_params';

/**
 * Capture incoming query parameters and persist them to sessionStorage & localStorage
 */
export function captureAttribution(): void {
  if (typeof window === 'undefined') return;

  try {
    const currentParams = new URLSearchParams(window.location.search);
    const existingStored = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY) || '{}');
    const updated: Record<string, string> = { ...existingStored };

    let hasNew = false;
    ATTRIBUTION_KEYS.forEach((key) => {
      const val = currentParams.get(key);
      if (val) {
        updated[key] = val;
        hasNew = true;
      }
    });

    if (hasNew || Object.keys(existingStored).length === 0) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  } catch (e) {
    console.error('[Tracking] Error capturing attribution:', e);
  }
}

/**
 * Retrieve current combined attribution parameters
 */
export function getAttributionParams(): Record<string, string> {
  if (typeof window === 'undefined') return {};

  try {
    const currentParams = new URLSearchParams(window.location.search);
    const stored = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY) || '{}');
    const combined: Record<string, string> = { ...stored };

    ATTRIBUTION_KEYS.forEach((key) => {
      const val = currentParams.get(key);
      if (val) combined[key] = val;
    });

    return combined;
  } catch {
    return {};
  }
}

/**
 * Build a fully decorated Cloudbeds reservation URL carrying all Google Ads & Meta attribution parameters
 */
export function buildCloudbedsUrl(venue: 'canggu' | 'gilit' | 'coday', extraParams?: Record<string, string | number | undefined>): string {
  const config = CLOUDBEDS_CONFIG[venue];
  if (!config) return '';

  const url = new URL(config.url);
  const attribution = getAttributionParams();

  // Attach all attribution parameters (gclid, utm_*, fbclid)
  Object.entries(attribution).forEach(([key, val]) => {
    if (val) url.searchParams.set(key, val);
  });

  // Attach any room / date custom parameters
  if (extraParams) {
    Object.entries(extraParams).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        url.searchParams.set(k, String(v));
      }
    });
  }

  return url.toString();
}

/**
 * Open Cloudbeds reservation with tracking events & attribution preserved
 */
export function openCloudbedsBooking(
  venue: 'canggu' | 'gilit' | 'coday',
  extraParams?: Record<string, string | number | undefined>
): void {
  if (typeof window === 'undefined') return;

  try {
    // 1. Persist venue origin in storage
    localStorage.setItem('booking_origin', venue);
    sessionStorage.setItem('booking_origin', venue);

    // 2. Track Meta InitiateCheckout
    if ((window as any).fbq) {
      (window as any).fbq('track', 'InitiateCheckout', {
        content_name: CLOUDBEDS_CONFIG[venue].name,
        currency: 'IDR',
      });
    }

    // 3. Track Google Analytics / Google Ads begin_checkout
    if ((window as any).gtag) {
      (window as any).gtag('event', 'begin_checkout', {
        currency: 'IDR',
        items: [{ item_name: CLOUDBEDS_CONFIG[venue].name }],
      });
    }

    // 4. Push to GTM dataLayer
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({
      event: 'begin_checkout',
      venue,
      ecommerce: {
        currency: 'IDR',
        items: [{ item_name: CLOUDBEDS_CONFIG[venue].name }],
      }
    });

    // 5. Open decorated destination URL
    const targetUrl = buildCloudbedsUrl(venue, extraParams);
    window.open(targetUrl, '_blank');
  } catch (err) {
    console.error('[Tracking] Booking redirection error:', err);
    window.open(CLOUDBEDS_CONFIG[venue].url, '_blank');
  }
}

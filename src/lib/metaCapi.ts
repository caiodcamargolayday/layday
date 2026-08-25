import crypto from 'crypto';

const API_VERSION = 'v21.0';

export function getCapiConfigs(origin: string): Array<{ pixelId: string; accessToken: string }> {
  if (origin === 'anniversary' || origin === 'anniversary-canggu' || origin === '11-years-layday') {
    const configs: Array<{ pixelId: string; accessToken: string }> = [];

    // Canggu Dataset
    const cangguPixel = process.env.NEXT_PUBLIC_META_PIXEL_ID_ANNIVERSARY_CANGGU || process.env.NEXT_PUBLIC_META_PIXEL_ID_ANNIVERSARY || '1392233983092323';
    const cangguToken = process.env.META_ACCESS_TOKEN_ANNIVERSARY_CANGGU || process.env.META_ACCESS_TOKEN_ANNIVERSARY || 'EAAYA08KKYP4BSXV9LXzO9ovjTLM6m6STy9vZBWScpoMUcJbQ22qcs63bt6rC2rhv7NsnndXwhuCTGnAZBFAEQjAEkEMjQdsqTnl0op9tR62HOgEvgcjYTWGQYu5C0zX5jZBD1EmiZAliNh3RdpS65homAlMmYL2sH1sIFM9ORya1bZCevUaHdndDhgyZAT2QZDZD';
    if (cangguPixel && cangguToken) {
      configs.push({ pixelId: cangguPixel, accessToken: cangguToken });
    }

    // Gili T Dataset
    const gilitPixel = process.env.NEXT_PUBLIC_META_PIXEL_ID_ANNIVERSARY_GILIT || '1036889488979198';
    const gilitToken = process.env.META_ACCESS_TOKEN_ANNIVERSARY_GILIT || 'EAARrizXTDwMBSSRiv6tURLZCs3XdYQVhMJuKo9UgkE9d1qXOUbqyAkHSVwqKnyw53T13TsGTcZBeSl0bUHmb7RRpEuk5V6ZAVOJ4BhjTwxN9GZAmXxO8aPpQcmSrkiJDVLQK1EIKL8PGS8PcUp7AOZCUoLXvXBQJorZC33Izj41jSBPt7oxJOUiwKZBm99SlQZDZD';
    if (gilitPixel && gilitToken) {
      configs.push({ pixelId: gilitPixel, accessToken: gilitToken });
    }

    return configs;
  }

  if (origin === 'anniversary-gilit') {
    return [{
      pixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID_ANNIVERSARY_GILIT || '1036889488979198',
      accessToken: process.env.META_ACCESS_TOKEN_ANNIVERSARY_GILIT || 'EAARrizXTDwMBSSRiv6tURLZCs3XdYQVhMJuKo9UgkE9d1qXOUbqyAkHSVwqKnyw53T13TsGTcZBeSl0bUHmb7RRpEuk5V6ZAVOJ4BhjTwxN9GZAmXxO8aPpQcmSrkiJDVLQK1EIKL8PGS8PcUp7AOZCUoLXvXBQJorZC33Izj41jSBPt7oxJOUiwKZBm99SlQZDZD',
    }];
  }

  if (origin === 'anniversary-uluwatu' || origin === '2-years-layday-uluwatu') {
    return [{
      pixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID_ANNIVERSARY_ULUWATU || '1035484145914151',
      accessToken: process.env.META_ACCESS_TOKEN_ANNIVERSARY_ULUWATU || 'EAANDHKnVCjkBSYuAMjZB7EuU74wc0r5YrDZAlmrtkgxZByC8MDfivPsKzG4NcW7Du42Lmu38z6MPvi84mxWX2X3mcPGkMVqru5smb8hDwp3sKVIQbZAj1WzT7sG2MAhV5rsCBSxicf48IA9oll2Ct0TSqz3HK46oZB1xZBcEnmLNQ2pDHN1vRQsLHSznN6SAZDZD',
    }];
  }

  const single = getCapiConfig(origin);
  if (single.pixelId && single.accessToken) {
    return [{ pixelId: single.pixelId, accessToken: single.accessToken }];
  }
  return [];
}

export function getCapiConfig(origin: string) {
  if (origin === 'anniversary' || origin === 'anniversary-canggu' || origin === '11-years-layday') {
    return {
      pixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID_ANNIVERSARY_CANGGU || process.env.NEXT_PUBLIC_META_PIXEL_ID_ANNIVERSARY || '1392233983092323',
      accessToken: process.env.META_ACCESS_TOKEN_ANNIVERSARY_CANGGU || process.env.META_ACCESS_TOKEN_ANNIVERSARY || 'EAAYA08KKYP4BSXV9LXzO9ovjTLM6m6STy9vZBWScpoMUcJbQ22qcs63bt6rC2rhv7NsnndXwhuCTGnAZBFAEQjAEkEMjQdsqTnl0op9tR62HOgEvgcjYTWGQYu5C0zX5jZBD1EmiZAliNh3RdpS65homAlMmYL2sH1sIFM9ORya1bZCevUaHdndDhgyZAT2QZDZD',
    };
  }
  if (origin === 'anniversary-gilit') {
    return {
      pixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID_ANNIVERSARY_GILIT || '1036889488979198',
      accessToken: process.env.META_ACCESS_TOKEN_ANNIVERSARY_GILIT || 'EAARrizXTDwMBSSRiv6tURLZCs3XdYQVhMJuKo9UgkE9d1qXOUbqyAkHSVwqKnyw53T13TsGTcZBeSl0bUHmb7RRpEuk5V6ZAVOJ4BhjTwxN9GZAmXxO8aPpQcmSrkiJDVLQK1EIKL8PGS8PcUp7AOZCUoLXvXBQJorZC33Izj41jSBPt7oxJOUiwKZBm99SlQZDZD',
    };
  }
  if (origin === 'anniversary-uluwatu' || origin === '2-years-layday-uluwatu') {
    return {
      pixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID_ANNIVERSARY_ULUWATU || '1035484145914151',
      accessToken: process.env.META_ACCESS_TOKEN_ANNIVERSARY_ULUWATU || 'EAANDHKnVCjkBSYuAMjZB7EuU74wc0r5YrDZAlmrtkgxZByC8MDfivPsKzG4NcW7Du42Lmu38z6MPvi84mxWX2X3mcPGkMVqru5smb8hDwp3sKVIQbZAj1WzT7sG2MAhV5rsCBSxicf48IA9oll2Ct0TSqz3HK46oZB1xZBcEnmLNQ2pDHN1vRQsLHSznN6SAZDZD',
    };
  }
  if (origin === 'gilit') {
    return {
      pixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID_LDGILIT,
      accessToken: process.env.META_ACCESS_TOKEN_LDGILIT,
    };
  }
  if (origin === 'coday') {
    return {
      pixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID_CODAY,
      accessToken: process.env.META_ACCESS_TOKEN_CODAY,
    };
  }
  if (origin === 'uluwatu') {
    return {
      pixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID_LDULUWATU,
      accessToken: process.env.META_ACCESS_TOKEN_LDULUWATU,
    };
  }
  if (origin === 'vice') {
    return {
      pixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID_VICE,
      accessToken: process.env.META_ACCESS_TOKEN_VICE,
    };
  }
  return {
    pixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID_LDCANGGU,
    accessToken: process.env.META_ACCESS_TOKEN_LDCANGGU,
  };
}

/**
 * Hash a string value with SHA256 (required by Meta for PII fields)
 * Do NOT hash: fbp, fbc, ip, user_agent
 */
export function hash(value: string | undefined | null): string | undefined {
  if (!value) return undefined;
  return crypto
    .createHash('sha256')
    .update(String(value).trim().toLowerCase())
    .digest('hex');
}

/**
 * Normalize phone to E.164 format before hashing
 * e.g. +62812345678 or 62812345678 or 08123456789
 */
export function normalizePhone(phone: string | undefined | null): string | undefined {
  if (!phone) return undefined;
  let p = String(phone).replace(/\D/g, '');
  if (p.startsWith('0')) p = '62' + p.slice(1); // Indonesian local format
  if (!p.startsWith('62')) p = '62' + p;
  return '+' + p;
}

export interface PurchaseEventParams {
  eventId: string;
  eventSourceUrl: string;
  clientIp?: string | null;
  clientUserAgent?: string | null;
  fbp?: string | null;
  fbc?: string | null;
  email?: string | null;
  phone?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  country?: string;
  value: string | number;
  orderId: string;
}

export interface ContactEventParams {
  eventId: string;
  eventSourceUrl: string;
  clientIp?: string | null;
  clientUserAgent?: string | null;
  fbp?: string | null;
  fbc?: string | null;
  email?: string | null;
  phone?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  country?: string;
}

export interface LeadEventParams {
  eventId: string;
  eventSourceUrl: string;
  clientIp?: string | null;
  clientUserAgent?: string | null;
  fbp?: string | null;
  fbc?: string | null;
  email?: string | null;
  phone?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  country?: string;
  contentName?: string;
}

/**
 * Build a Lead event payload (for Meta Ads Lead conversion tracking)
 */
export function buildLeadEvent({
  eventId,
  eventSourceUrl,
  clientIp,
  clientUserAgent,
  fbp,
  fbc,
  email,
  phone,
  firstName,
  lastName,
  country = 'id',
  contentName = '11 Years Lay Day Anniversary Guestlist',
}: LeadEventParams) {
  return {
    event_name: 'Lead',
    event_time: Math.floor(Date.now() / 1000),
    event_id: eventId,
    event_source_url: eventSourceUrl,
    action_source: 'website',

    user_data: {
      em: email ? [hash(email)] : undefined,
      ph: phone ? [hash(normalizePhone(phone))] : undefined,
      fn: firstName ? [hash(firstName)] : undefined,
      ln: lastName ? [hash(lastName)] : undefined,
      country: country ? [hash(country)] : undefined,

      client_ip_address: clientIp || undefined,
      client_user_agent: clientUserAgent || undefined,
      fbp: fbp || undefined,
      fbc: fbc || undefined,
    },

    custom_data: {
      content_name: contentName,
      currency: 'IDR',
    },
  };
}

/**
 * Build a Purchase event payload
 */
export function buildPurchaseEvent({
  eventId,
  eventSourceUrl,
  clientIp,
  clientUserAgent,
  fbp,
  fbc,
  email,
  phone,
  firstName,
  lastName,
  country = 'id', // Indonesia default
  value,
  orderId,
}: PurchaseEventParams) {
  return {
    event_name: 'Purchase',
    event_time: Math.floor(Date.now() / 1000),
    event_id: eventId,
    event_source_url: eventSourceUrl,
    action_source: 'website',

    user_data: {
      // PII — must be SHA256 hashed
      em: email ? [hash(email)] : undefined,
      ph: phone ? [hash(normalizePhone(phone))] : undefined,
      fn: firstName ? [hash(firstName)] : undefined,
      ln: lastName ? [hash(lastName)] : undefined,
      country: country ? [hash(country)] : undefined,

      // Do NOT hash these
      client_ip_address: clientIp || undefined,
      client_user_agent: clientUserAgent || undefined,
      fbp: fbp || undefined,
      fbc: fbc || undefined,
    },

    custom_data: {
      value: parseFloat(String(value)),
      currency: 'IDR',
      order_id: orderId,
      content_type: 'hotel',
    },
  };
}

/**
 * Build a Contact event payload
 */
export function buildContactEvent({
  eventId,
  eventSourceUrl,
  clientIp,
  clientUserAgent,
  fbp,
  fbc,
  email,
  phone,
  firstName,
  lastName,
  country = 'id',
}: ContactEventParams) {
  return {
    event_name: 'Contact',
    event_time: Math.floor(Date.now() / 1000),
    event_id: eventId,
    event_source_url: eventSourceUrl,
    action_source: 'website',

    user_data: {
      em: email ? [hash(email)] : undefined,
      ph: phone ? [hash(normalizePhone(phone))] : undefined,
      fn: firstName ? [hash(firstName)] : undefined,
      ln: lastName ? [hash(lastName)] : undefined,
      country: country ? [hash(country)] : undefined,

      client_ip_address: clientIp || undefined,
      client_user_agent: clientUserAgent || undefined,
      fbp: fbp || undefined,
      fbc: fbc || undefined,
    },
  };
}

/**
 * Send one or more events to Meta Conversions API
 * @param {Array} events - array of event objects
 * @param {string} origin - venue / campaign origin identifier
 * @param {string} testEventCode - optional, from Events Manager > Test Events
 */
export async function sendToMetaCAPI(events: any[], origin: string, testEventCode: string | null = null) {
  const configs = getCapiConfigs(origin);
  if (configs.length === 0) {
    console.log(`[Meta CAPI] Missing configuration for origin: ${origin}`);
    return;
  }

  const results = await Promise.allSettled(
    configs.map(async (config) => {
      const body: any = { data: events };
      if (testEventCode) body.test_event_code = testEventCode;

      const endpoint = `https://graph.facebook.com/${API_VERSION}/${config.pixelId}/events`;
      const response = await fetch(`${endpoint}?access_token=${config.accessToken}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const result = await response.json();
      if (!response.ok) {
        console.error(`[Meta CAPI] Error for pixel ${config.pixelId}:`, JSON.stringify(result));
        throw new Error(`Meta CAPI request failed for pixel ${config.pixelId}`);
      }

      console.log(`[Meta CAPI] Success for pixel ${config.pixelId}:`, JSON.stringify(result));
      return result;
    })
  );

  return results;
}

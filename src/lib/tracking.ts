/**
 * Minimal, vendor-agnostic event tracking for the presell.
 *
 * Every event goes to `window.dataLayer` (GTM-ready). When the visitor accepts measurement
 * cookies and the IDs are configured, the same events are forwarded to GA4 (gtag) and the
 * Meta Pixel (fbq). Events fired before consent are buffered and flushed once vendors load.
 */

type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: ((...args: unknown[]) => void) & { callMethod?: unknown; queue?: unknown[] };
  }
}

const ATTRIBUTION_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
  "gclid",
  "ttclid",
] as const;

const STORAGE_KEY = "af_presell_attr";
let vendorsReady = false;
const buffer: [string, Params][] = [];

function sendToVendors(event: string, params: Params) {
  window.gtag?.("event", event, params);
  window.fbq?.("trackCustom", event, params);
}

export function track(event: string, params: Params = {}) {
  if (typeof window === "undefined") return;
  const payload = { ...params, ...getAttribution() };
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...payload });
  if (vendorsReady) sendToVendors(event, payload);
  else buffer.push([event, payload]);
}

/** Called by the analytics loader once GA4 / Meta Pixel are initialised. */
export function markVendorsReady() {
  vendorsReady = true;
  while (buffer.length) {
    const [e, p] = buffer.shift()!;
    sendToVendors(e, p);
  }
}

export function hasVendors() {
  return vendorsReady;
}

/** Reads UTMs / click IDs from the URL (first touch in the session wins) and stores them. */
export function captureAttribution() {
  if (typeof window === "undefined") return {};
  const qs = new URLSearchParams(window.location.search);
  const fromUrl: Record<string, string> = {};
  ATTRIBUTION_KEYS.forEach((k) => {
    const v = qs.get(k);
    if (v) fromUrl[k] = v;
  });
  if (!document.referrer.includes(window.location.host) && document.referrer) {
    fromUrl.landing_referrer = document.referrer;
  }
  try {
    const stored = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "{}");
    const merged = Object.keys(fromUrl).some((k) => k.startsWith("utm_") || k.endsWith("clid"))
      ? fromUrl
      : { ...fromUrl, ...stored };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    return merged;
  } catch {
    return fromUrl;
  }
}

export function getAttribution(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

/** Destination URL carrying the ad attribution plus presell context (`ref`, `pv`). */
export function buildDestination(base: string, extra: Record<string, string>) {
  const url = new URL(base);
  const attr = getAttribution();
  ATTRIBUTION_KEYS.forEach((k) => {
    if (attr[k] && !url.searchParams.has(k)) url.searchParams.set(k, attr[k]);
  });
  Object.entries(extra).forEach(([k, v]) => url.searchParams.set(k, v));
  return url.toString();
}

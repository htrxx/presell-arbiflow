"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { captureAttribution, markVendorsReady, track } from "@/lib/tracking";

const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID;
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const CONSENT_KEY = "af_consent";

type Consent = "granted" | "denied" | null;

function readConsent(): Consent {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

/**
 * Captures attribution, fires the presell view and — only after the visitor accepts —
 * loads GA4 and the Meta Pixel. Without configured IDs nothing is loaded and no banner shows.
 */
export default function Analytics({ variant, angle }: { variant: string; angle: string }) {
  const hasIds = Boolean(GA4_ID || META_PIXEL_ID);
  const [consent, setConsent] = useState<Consent>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    captureAttribution();
    setConsent(readConsent());
    setReady(true);
    track("presell_view", { variant, headline_angle: angle });

    // Scroll depth: 50% and 90%, once each.
    const marks = new Set<number>();
    const onScroll = () => {
      const h = document.documentElement;
      const pct = ((h.scrollTop + window.innerHeight) / h.scrollHeight) * 100;
      [50, 90].forEach((m) => {
        if (pct >= m && !marks.has(m)) {
          marks.add(m);
          track("presell_scroll", { depth: m, variant });
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [variant, angle]);

  // The inline init scripts define gtag / fbq synchronously once injected; flush buffered events then.
  useEffect(() => {
    if (consent !== "granted" || !hasIds) return;
    let tries = 0;
    const t = setInterval(() => {
      const gaOk = !GA4_ID || typeof window.gtag === "function";
      const fbOk = !META_PIXEL_ID || typeof window.fbq === "function";
      if ((gaOk && fbOk) || ++tries > 40) {
        clearInterval(t);
        markVendorsReady();
      }
    }, 75);
    return () => clearInterval(t);
  }, [consent, hasIds]);

  function decide(v: Exclude<Consent, null>) {
    try {
      localStorage.setItem(CONSENT_KEY, v);
    } catch {}
    setConsent(v);
  }

  if (!hasIds) return null;

  return (
    <>
      {consent === "granted" && (
        <>
          {GA4_ID && (
            <>
              <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`} strategy="afterInteractive" />
              <Script id="ga4-init" strategy="afterInteractive">
                {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA4_ID}');`}
              </Script>
            </>
          )}
          {META_PIXEL_ID && (
            <Script id="meta-pixel" strategy="afterInteractive">
              {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META_PIXEL_ID}');fbq('track','PageView');fbq('track','ViewContent',{content_name:'presell'});`}
            </Script>
          )}
        </>
      )}

      {ready && consent === null && (
        <div
          role="region"
          aria-label="Preferências de cookies"
          className="fixed inset-x-3 bottom-24 z-[60] mx-auto flex max-w-xl flex-col gap-3 rounded-2xl border border-line bg-surface-2/95 p-4 text-sm text-muted shadow-2xl backdrop-blur sm:bottom-4 sm:flex-row sm:items-center"
        >
          <p className="flex-1">Usamos cookies de medição para entender quais anúncios trazem você até aqui.</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => decide("denied")}
              className="min-h-11 flex-1 rounded-xl border border-line px-4 text-text sm:flex-none"
            >
              Recusar
            </button>
            <button
              type="button"
              onClick={() => decide("granted")}
              className="min-h-11 flex-1 rounded-xl bg-surface px-4 font-medium text-text ring-1 ring-brand/50 sm:flex-none"
            >
              Aceitar
            </button>
          </div>
        </div>
      )}
    </>
  );
}

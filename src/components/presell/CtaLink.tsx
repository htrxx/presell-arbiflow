"use client";

import { ArrowRight } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { PRESELL_DESTINATION } from "@/lib/presell";
import { buildDestination, hasVendors, track } from "@/lib/tracking";

/**
 * Outbound link to the ArbiFlow site. Carries UTMs + presell context in the href (so
 * "open in new tab" keeps attribution) and gives the pixels a beat to send before leaving.
 */
export function CtaLink({
  position,
  variant,
  children,
  className = "",
  kind = "primary",
  path = "",
}: {
  position: string;
  variant: string;
  children: ReactNode;
  className?: string;
  kind?: "primary" | "link";
  path?: string;
}) {
  const base = new URL(path, PRESELL_DESTINATION).toString();
  const extra = { ref: "presell", pv: variant };
  const [href, setHref] = useState(() => {
    const u = new URL(base);
    Object.entries(extra).forEach(([k, v]) => u.searchParams.set(k, v));
    return u.toString();
  });

  useEffect(() => {
    setHref(buildDestination(base, extra));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base, variant]);

  function onClick(e: React.MouseEvent<HTMLAnchorElement>) {
    const event = kind === "primary" ? "presell_cta_click" : "presell_outbound_click";
    track(event, { position, variant, destination: href });
    const modified = e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0;
    if (!modified && hasVendors()) {
      e.preventDefault();
      setTimeout(() => (window.location.href = href), 180);
    }
  }

  if (kind === "link") {
    return (
      <a href={href} onClick={onClick} className={className}>
        {children}
      </a>
    );
  }

  return (
    <a
      href={href}
      onClick={onClick}
      className={`group inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-brand px-7 text-base font-semibold text-white shadow-[0_14px_44px_-10px_var(--color-brand)] transition-[background-color,transform] duration-200 hover:bg-brand-2 active:scale-[0.98] sm:w-auto ${className}`}
    >
      {children}
      <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden />
    </a>
  );
}

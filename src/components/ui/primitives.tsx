"use client";

import { animate, motion, useInView, useMotionValue, useTransform, type Variants } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, type ReactNode } from "react";

export const ease = [0.22, 1, 0.36, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.75, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({
  title,
  subtitle,
  align = "center",
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "center" | "left";
}) {
  const a = align === "center" ? "mx-auto text-center items-center" : "items-start";
  return (
    <motion.div
      className={`flex max-w-3xl flex-col gap-4 ${a}`}
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
    >
      <motion.h2
        variants={fadeUp}
        className="font-display text-3xl font-semibold leading-[1.08] tracking-tight text-balance sm:text-5xl"
      >
        {title}
      </motion.h2>
      {subtitle && (
        <motion.p variants={fadeUp} className="text-base leading-relaxed text-muted text-pretty sm:text-lg">
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}

/** Animated number that counts up once it scrolls into view. */
export function Counter({
  to,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 1.6,
  className,
}: {
  to: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const mv = useMotionValue(0);
  const text = useTransform(mv, (v) =>
    prefix +
    v.toLocaleString("pt-BR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) +
    suffix,
  );
  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, to, { duration, ease });
    return () => controls.stop();
  }, [inView, mv, to, duration]);
  return (
    <motion.span ref={ref} className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
      {text}
    </motion.span>
  );
}

export function BrowserFrame({
  src,
  alt,
  priority,
  className = "",
  url = "app.arbiflow.com.br",
  scrollable = false,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
  url?: string;
  /** On small screens, show the screenshot larger with horizontal scrolling so details stay readable. */
  scrollable?: boolean;
}) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-line bg-[#0b0d14] shadow-[0_40px_120px_-30px_rgba(31,107,255,0.45)] ${className}`}
    >
      <div className="flex items-center gap-3 border-b border-line-soft bg-[#0d1120] px-4 py-2.5">
        <div className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]/80" />
        </div>
        <div className="mx-auto hidden max-w-xs flex-1 items-center justify-center rounded-md border border-line-soft bg-ink/60 px-3 py-1 tabular-nums text-[11px] text-muted sm:flex">
          {url}
        </div>
        <div className="w-10" aria-hidden />
      </div>
      <div className={scrollable ? "overflow-x-auto overscroll-x-contain [scrollbar-width:thin] md:overflow-visible" : undefined}>
        <Image
          src={src}
          alt={alt}
          width={2000}
          height={940}
          priority={priority}
          sizes={scrollable ? "(max-width: 768px) 820px, 1100px" : "(max-width: 768px) 100vw, 1100px"}
          className={`block h-auto ${scrollable ? "w-[820px] max-w-none md:w-full md:max-w-full" : "w-full"}`}
        />
      </div>
    </div>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Image src="/logo.svg" alt="" width={32} height={32} className="h-8 w-8 rounded-[9px]" />
      <span className="font-display text-lg font-semibold tracking-tight">
        Arbi<span className="text-brand-2">Flow</span>
      </span>
    </span>
  );
}

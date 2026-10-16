"use client";

/**
 * Two-sided spatial showcase (adapted from the 21st.dev "spatial-product-showcase").
 * Differences from the original, so it can live inside a page section:
 *  - background and switcher are positioned inside the section, not `fixed` over the viewport;
 *  - each side renders a `visual` node instead of a remote image;
 *  - feature bars (0–100 metrics) became a list of items, so no invented numbers are shown;
 *  - the action slot is provided by the caller (e.g. a toggle or a CTA).
 */

import { AnimatePresence, motion, type Variants } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

// =========================================
// 1. DATA TYPES
// =========================================

export interface ShowcaseItem {
  icon: LucideIcon;
  title: string;
  text?: string;
}

export interface ShowcaseSide<Id extends string = string> {
  id: Id;
  label: string; // switcher label
  eyebrow: string;
  title: string;
  description: string;
  visual: ReactNode;
  status: string;
  colors: {
    gradient: string; // Tailwind gradient classes for the glow behind the visual
    glow: string; // Tailwind bg class for the status dot
    ring: string; // Tailwind border class for the rotating ring
    icon: string; // Tailwind text class for item icons
    radial: string; // CSS radial-gradient for the section background
  };
  items: ShowcaseItem[];
}

// =========================================
// 2. ANIMATION VARIANTS
// =========================================

const ANIMATIONS: { container: Variants; item: Variants; visual: (first: boolean) => Variants } = {
  container: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  },
  item: {
    hidden: { opacity: 0, y: 16, filter: "blur(8px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", stiffness: 110, damping: 20 } },
    exit: { opacity: 0, y: -8, filter: "blur(4px)" },
  },
  visual: (first) => ({
    initial: { opacity: 0, scale: 1.3, filter: "blur(12px)", rotate: first ? -20 : 20, x: first ? -60 : 60 },
    animate: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      rotate: 0,
      x: 0,
      transition: { type: "spring", stiffness: 240, damping: 22 },
    },
    exit: { opacity: 0, scale: 0.7, filter: "blur(16px)", transition: { duration: 0.22 } },
  }),
};

// =========================================
// 3. SUB-COMPONENTS
// =========================================

const BackgroundGradient = ({ radial }: { radial: string }) => (
  <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
    <motion.div
      animate={{ background: radial }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="absolute inset-0"
    />
  </div>
);

function SideVisual({ side, first }: { side: ShowcaseSide; first: boolean }) {
  return (
    <motion.div layout="position" className="relative shrink-0">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
        className={`absolute inset-[-12%] rounded-full border border-dashed border-white/10 ${side.colors.ring}`}
        aria-hidden
      />
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute inset-0 rounded-full bg-gradient-to-br ${side.colors.gradient} opacity-40 blur-2xl`}
        aria-hidden
      />

      <div className="relative flex h-64 w-64 items-center justify-center overflow-hidden rounded-full border border-white/5 bg-black/30 shadow-2xl backdrop-blur-sm sm:h-80 sm:w-80 lg:h-[380px] lg:w-[380px]">
        <motion.div
          animate={{ y: [-6, 6, -6] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="relative z-10 flex h-full w-full items-center justify-center"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={side.id}
              variants={ANIMATIONS.visual(first)}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex h-full w-full items-center justify-center p-4 sm:p-8"
            >
              {side.visual}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      <motion.div layout="position" className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
        <div className="flex items-center gap-2 rounded-full border border-white/5 bg-ink/85 px-4 py-2 text-[11px] uppercase tracking-widest text-muted backdrop-blur">
          <span className={`h-1.5 w-1.5 animate-pulse rounded-full ${side.colors.glow}`} />
          {side.status}
        </div>
      </motion.div>
    </motion.div>
  );
}

function SideDetails({ side, action }: { side: ShowcaseSide; action?: ReactNode }) {
  const compact = side.items.length > 6;
  return (
    <motion.div variants={ANIMATIONS.container} initial="hidden" animate="visible" exit="exit" className="flex flex-col">
      <motion.p variants={ANIMATIONS.item} className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-muted">
        {side.eyebrow}
      </motion.p>
      <motion.h3
        variants={ANIMATIONS.item}
        className="mb-3 bg-gradient-to-b from-white to-[#8a97b4] bg-clip-text font-display text-3xl font-semibold tracking-tight text-transparent text-balance sm:text-4xl"
      >
        {side.title}
      </motion.h3>
      <motion.p variants={ANIMATIONS.item} className="mb-6 max-w-lg leading-relaxed text-muted text-pretty">
        {side.description}
      </motion.p>

      <motion.ul
        variants={ANIMATIONS.item}
        className={`grid gap-x-5 rounded-2xl border border-white/5 bg-surface/50 p-5 backdrop-blur-sm ${
          compact ? "gap-y-3 sm:grid-cols-2" : "gap-y-4"
        }`}
      >
        {side.items.map((it) => (
          <li key={it.title} className="flex gap-3">
            <it.icon className={`mt-0.5 h-4 w-4 shrink-0 ${side.colors.icon}`} aria-hidden />
            <span className="text-sm leading-snug">
              <span className={it.text ? "font-semibold text-text" : "text-text/90"}>{it.title}</span>
              {it.text && <span className="mt-0.5 block text-muted">{it.text}</span>}
            </span>
          </li>
        ))}
      </motion.ul>

      {action && (
        <motion.div variants={ANIMATIONS.item} className="mt-6">
          {action}
        </motion.div>
      )}
    </motion.div>
  );
}

function Switcher<Id extends string>({
  sides,
  activeId,
  onToggle,
}: {
  sides: ShowcaseSide<Id>[];
  activeId: Id;
  onToggle: (id: Id) => void;
}) {
  return (
    <div className="flex justify-center">
      <div
        role="tablist"
        aria-label="Comparar"
        className="flex items-center gap-1 rounded-full border border-white/10 bg-surface/80 p-1.5 shadow-[0_20px_60px_rgba(0,0,0,0.6)] ring-1 ring-white/5 backdrop-blur-2xl"
      >
        {sides.map((s) => (
          <motion.button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={activeId === s.id}
            onClick={() => onToggle(s.id)}
            whileTap={{ scale: 0.96 }}
            className="relative flex h-12 min-w-28 items-center justify-center whitespace-nowrap rounded-full px-5 text-sm font-medium"
          >
            {activeId === s.id && (
              <motion.div
                layoutId="showcase-island"
                className="absolute inset-0 rounded-full bg-gradient-to-b from-white/12 to-white/5 shadow-inner"
                transition={{ type: "spring", stiffness: 220, damping: 22 }}
              />
            )}
            <span
              className={`relative z-10 transition-colors duration-300 ${
                activeId === s.id ? "text-white" : "text-muted hover:text-text"
              }`}
            >
              {s.label}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// =========================================
// 4. MAIN COMPONENT
// =========================================

export default function SpatialShowcase<Id extends string>({
  sides,
  activeId,
  onToggle,
  actions,
  className = "",
}: {
  sides: [ShowcaseSide<Id>, ShowcaseSide<Id>];
  activeId: Id;
  onToggle: (id: Id) => void;
  actions?: Partial<Record<Id, ReactNode>>;
  className?: string;
}) {
  const current = sides.find((s) => s.id === activeId) ?? sides[0];
  const first = current.id === sides[0].id;

  return (
    <div className={`relative isolate w-full overflow-hidden ${className}`}>
      <BackgroundGradient radial={current.colors.radial} />

      <Switcher sides={sides} activeId={activeId} onToggle={onToggle} />

      <motion.div
        layout
        transition={{ type: "spring", bounce: 0, duration: 0.9 }}
        className={`mx-auto mt-14 flex w-full max-w-6xl flex-col items-center justify-center gap-16 px-4 sm:px-6 lg:gap-20 ${
          first ? "lg:flex-row" : "lg:flex-row-reverse"
        }`}
      >
        <SideVisual side={current} first={first} />
        <motion.div layout="position" className="w-full max-w-xl">
          <AnimatePresence mode="wait">
            <SideDetails key={current.id} side={current} action={actions?.[current.id as Id]} />
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}

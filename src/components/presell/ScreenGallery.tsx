"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BarChart3, Boxes, LayoutDashboard, Truck } from "lucide-react";
import { useState } from "react";
import { BrowserFrame, ease } from "@/components/ui/primitives";
import { track } from "@/lib/tracking";

/* Real app screenshots at 2x (retina), served untouched (no resize or re-encode). */
const SCREENS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, w: 2880, h: 1926, caption: "Faturamento, lucro e estoque em uma tela." },
  { id: "vendas", label: "Vendas", icon: Truck, w: 2260, h: 1720, caption: "Lucro real e margem de cada venda." },
  { id: "estoque", label: "Estoque", icon: Boxes, w: 2260, h: 1320, caption: "Estoque, compras a caminho e custo médio." },
  { id: "relatorios", label: "Relatórios", icon: BarChart3, w: 2260, h: 1480, caption: "Lucro, margem e de onde vem o faturamento." },
] as const;

export default function ScreenGallery({ variant }: { variant: string }) {
  const [i, setI] = useState(0);
  const s = SCREENS[i];

  return (
    <div>
      <div
        role="tablist"
        aria-label="Telas reais do ArbiFlow"
        className="mx-auto flex max-w-full gap-1 overflow-x-auto rounded-2xl border border-line bg-surface/70 p-1.5 [scrollbar-width:none] sm:w-fit"
      >
        {SCREENS.map((sc, idx) => (
          <button
            key={sc.id}
            type="button"
            role="tab"
            aria-selected={i === idx}
            aria-controls="screen-panel"
            onClick={() => {
              setI(idx);
              track("presell_screen_view", { screen: sc.id, variant });
            }}
            className={`relative flex min-h-11 shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm transition-colors ${
              i === idx ? "text-text" : "text-muted hover:text-text"
            }`}
          >
            {i === idx && (
              <motion.span
                layoutId="screen-tab"
                className="absolute inset-0 rounded-xl border border-brand/40 bg-brand/15"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative flex items-center gap-2">
              <sc.icon className="h-4 w-4" aria-hidden />
              {sc.label}
            </span>
          </button>
        ))}
      </div>

      <div id="screen-panel" role="tabpanel" className="mt-6">
        <p className="text-center text-sm text-muted">{s.caption}</p>
        <AnimatePresence mode="wait">
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            transition={{ duration: 0.4, ease }}
            className="mx-auto mt-6 max-w-5xl"
          >
            <BrowserFrame
              src={`/screens/real-${s.id}.png`}
              alt={`Tela ${s.label} do ArbiFlow`}
              url={`arbiflow.com.br/${s.id}`}
              width={s.w}
              height={s.h}
              unoptimized
              scrollable
            />
          </motion.div>
        </AnimatePresence>
        <p className="mt-3 text-center text-xs text-muted md:hidden">Arraste para o lado para ver a tela inteira</p>
      </div>
    </div>
  );
}

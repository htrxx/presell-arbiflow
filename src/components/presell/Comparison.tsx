"use client";

import Image from "next/image";
import {
  AlarmClockOff,
  ArrowRight,
  Boxes,
  Calculator,
  ClipboardPaste,
  Clock,
  FileText,
  Keyboard,
  PackageX,
  ShieldCheck,
  ScanBarcode,
  Sparkles,
  TrendingDown,
  Volume2,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import SpatialShowcase, { type ShowcaseSide } from "@/components/ui/spatial-product-showcase";
import { track } from "@/lib/tracking";

type Side = "planilhas" | "arbiflow";

/* ---------- Visuals ---------- */

const CELLS = [
  ["Venda", "Taxa", "Frete", "Lucro"],
  ["363,00", "11,5%?", "", "#REF!"],
  ["189,90", "#N/D", "21,4", "=SOMA("],
  ["249,00", "12%", "???", "52,10"],
  ["", "", "", "#VALOR!"],
  ["97,50", "R$ 6,50?", "18,9", "-4,30"],
];

function SpreadsheetVisual() {
  return (
    <div className="w-full max-w-[230px] -rotate-6 overflow-hidden rounded-lg border border-white/10 bg-[#0d1410] text-[10px] shadow-2xl">
      <div className="flex items-center gap-1.5 border-b border-white/10 bg-[#14301f] px-2 py-1.5 text-[9px] text-emerald-200/80">
        <span className="h-2 w-2 rounded-sm bg-emerald-500/80" /> planilha_final_v3 (2).xlsx
      </div>
      <div className="grid grid-cols-4">
        {CELLS.flat().map((c, i) => {
          const header = i < 4;
          const error = c.startsWith("#") || c.includes("?") || c.startsWith("=") || c.startsWith("-");
          return (
            <span
              key={i}
              className={`h-6 truncate border-b border-r border-white/5 px-1 text-[9px] leading-6 sm:px-1.5 sm:text-[10px] tabular-nums ${
                header ? "bg-white/5 font-semibold text-text/80" : error ? "bg-danger/15 text-danger" : "text-text/60"
              }`}
            >
              {c}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function ArbiFlowVisual() {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <Image src="/logo.svg" alt="" width={120} height={120} className="h-24 w-24 rounded-[26px] shadow-2xl sm:h-28 sm:w-28" />
      <span className="absolute left-1 top-[22%] rounded-full border border-profit/30 bg-ink/90 px-2.5 py-1 text-[11px] tabular-nums text-profit sm:left-3">
        +R$ 71,82 lucro real
      </span>
      <span className="absolute right-0 top-[52%] flex items-center gap-1 rounded-full border border-warn/30 bg-ink/90 px-2.5 py-1 text-[11px] text-warn sm:right-2">
        <Clock className="h-3 w-3" aria-hidden /> Despachar hoje
      </span>
      <span className="absolute bottom-[16%] left-3 flex items-center gap-1 rounded-full border border-cyan/30 bg-ink/90 px-2.5 py-1 text-[11px] text-cyan sm:left-6">
        <ScanBarcode className="h-3 w-3" aria-hidden /> Pedido conferido
      </span>
    </div>
  );
}

/* ---------- Content ---------- */

const PLANILHAS: ShowcaseSide<Side> = {
  id: "planilhas",
  label: "Planilhas",
  eyebrow: "Hoje",
  title: "Margem vazando pelo ralo.",
  description:
    "Planilha não escala.",
  visual: <SpreadsheetVisual />,
  status: "Atualizado à mão",
  colors: {
    gradient: "from-red-600 to-amber-900",
    glow: "bg-danger",
    ring: "border-l-red-500/50",
    icon: "text-danger",
    radial: "radial-gradient(ellipse 40% 35% at 15% 55%, rgba(239, 68, 68, 0.10), transparent 100%)",
  },
  items: [
    { icon: Calculator, title: "Taxa e frete calculados no chute." },
    { icon: Boxes, title: "Furo de estoque entre anúncios." },
    { icon: PackageX, title: "Etiqueta trocada na expedição." },
    { icon: AlarmClockOff, title: "Coleta perdida, reputação no amarelo." },
    { icon: Keyboard, title: "Compra digitada item a item." },
    { icon: TrendingDown, title: "Fechamento que nunca bate." },
  ],
};

const ARBIFLOW: ShowcaseSide<Side> = {
  id: "arbiflow",
  label: "ArbiFlow",
  eyebrow: "Com o ArbiFlow",
  title: "Margem sob controle.",
  description:
    "Feito por seller, para seller.",
  visual: <ArbiFlowVisual />,
  status: "Sincronizado",
  colors: {
    gradient: "from-[#1f6bff] to-[#0b1f5c]",
    glow: "bg-cyan",
    ring: "border-r-cyan/50",
    icon: "text-cyan",
    radial: "radial-gradient(ellipse 40% 35% at 85% 55%, rgba(31, 107, 255, 0.14), transparent 100%)",
  },
  items: [
    {
      icon: Calculator,
      title: "Lucro real",
      text: "Centavo por centavo, em cada venda.",
    },
    {
      icon: Volume2,
      title: "Bip & Fala",
      text: "Bipou, a voz confere o pedido.",
    },
    {
      icon: ShieldCheck,
      title: "Zero-Stock Shield",
      text: "Acabou o estoque, anúncios irmãos pausados.",
    },
    {
      icon: Clock,
      title: "Cronômetro de corte",
      text: "Contagem regressiva até a coleta.",
    },
    {
      icon: ClipboardPaste,
      title: "Compras por IA",
      text: "Print do fornecedor vira estoque.",
    },
    {
      icon: FileText,
      title: "DRE do mês",
      text: "Lucro ou prejuízo em 1 clique.",
    },
  ],
};

export default function Comparison({
  variant,
  renderCta,
}: {
  variant: string;
  renderCta: (position: string) => ReactNode;
}) {
  const [side, setSide] = useState<Side>("planilhas");

  function toggle(next: Side) {
    if (next === side) return;
    setSide(next);
    track("presell_compare_toggle", { side: next, variant });
  }

  return (
    <SpatialShowcase
      sides={[PLANILHAS, ARBIFLOW]}
      activeId={side}
      onToggle={toggle}
      actions={{
        planilhas: (
          <button
            type="button"
            onClick={() => toggle("arbiflow")}
            className="group inline-flex min-h-12 items-center gap-2 rounded-xl border border-brand/50 bg-brand/10 px-5 text-sm font-semibold text-text transition-colors hover:bg-brand/20"
          >
            <Sparkles className="h-4 w-4 text-cyan" aria-hidden />
            Ver a solução
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </button>
        ),
        arbiflow: renderCta("compare"),
      }}
    />
  );
}

"use client";

import Image from "next/image";
import {
  AlarmClockOff,
  ArrowRight,
  Boxes,
  Calculator,
  ClipboardPaste,
  Clock,
  Copy,
  EyeOff,
  FileQuestion,
  FileText,
  Keyboard,
  Layers,
  PackageX,
  Receipt,
  ShieldCheck,
  ScanBarcode,
  Settings2,
  Sparkles,
  TrendingDown,
  Unlink,
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
  title: "Horas perdidas. Números que ninguém confia.",
  description:
    "Planilha e sistema genérico funcionam até a operação crescer. Depois, viram gargalo.",
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
    { icon: Calculator, title: "Taxa muda por faixa de preço: recálculo à mão." },
    { icon: Receipt, title: "Frete do Mercado Envios fora da conta." },
    { icon: EyeOff, title: "Imposto e embalagem esquecidos: lucro falso." },
    { icon: Layers, title: "Uma aba do Mercado Livre para cada conta." },
    { icon: Copy, title: "Pedido copiado à mão, cancelamento esquecido." },
    { icon: FileQuestion, title: "Fórmula quebrada e “final_v3”: qual vale?" },
    { icon: PackageX, title: "Etiqueta conferida no olho: pacote trocado." },
    { icon: AlarmClockOff, title: "Horário de corte perdido, reputação em risco." },
    { icon: Keyboard, title: "Compra do fornecedor digitada item a item." },
    { icon: Unlink, title: "Venda sem custo lançado: margem distorcida." },
    { icon: TrendingDown, title: "Fechamento do mês que nunca bate." },
    { icon: Boxes, title: "Anúncio irmão ativo: venda sem estoque e cancelamento." },
    { icon: Settings2, title: "Sistema genérico: menus demais, sem custo por lote." },
  ],
};

const ARBIFLOW: ShowcaseSide<Side> = {
  id: "arbiflow",
  label: "ArbiFlow",
  eyebrow: "Com o ArbiFlow",
  title: "Um painel que faz as contas por você.",
  description:
    "Vendas chegam sozinhas. Custos cruzados na hora. Expedição conferida por bipe.",
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
      text: "Comissão, tarifa, frete e imposto descontados em cada venda.",
    },
    {
      icon: Volume2,
      title: "Bip & Fala",
      text: "Bipou a etiqueta: ele confere o pedido e fala o item em voz alta.",
    },
    {
      icon: ShieldCheck,
      title: "Zero-Stock Shield",
      text: "Vendeu o último? Anúncios irmãos pausados na hora, em todas as contas.",
    },
    {
      icon: Clock,
      title: "Cronômetro de corte",
      text: "Contagem regressiva para despachar no prazo.",
    },
    {
      icon: ClipboardPaste,
      title: "Compras por IA",
      text: "Mande o print do fornecedor. A IA lança no estoque.",
    },
    {
      icon: FileText,
      title: "DRE do mês",
      text: "Lucro ou prejuízo do mês, em uma tela.",
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
            Ver como o ArbiFlow resolve
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </button>
        ),
        arbiflow: renderCta("compare"),
      }}
    />
  );
}

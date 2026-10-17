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
  RefreshCw,
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
  label: "Planilhas e sistemas",
  eyebrow: "Como costuma ser",
  title: "Horas de trabalho para um número que ninguém confia.",
  description:
    "Planilha funciona até a operação crescer. Sistema genérico resolve nota fiscal, mas não entende comissão por faixa, custo de lote nem a rotina de quem vende no Mercado Livre.",
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
    { icon: Calculator, title: "Comissão e tarifa fixa mudam por faixa de preço, e você recalcula à mão." },
    { icon: Receipt, title: "O frete real do Mercado Envios fica fora da conta e o lucro sai maior do que é." },
    { icon: EyeOff, title: "Impostos, embalagem e despesas somem da planilha: parece lucro, é prejuízo." },
    { icon: Layers, title: "Abrir o Mercado Livre conta por conta para ver pedidos e status." },
    { icon: Copy, title: "Copiar pedidos e cancelamentos à mão — e sempre escapa algum." },
    { icon: FileQuestion, title: "Fórmula quebrada, célula apagada, “final_v3”: qual versão está certa?" },
    { icon: PackageX, title: "Conferir etiqueta no olho: pacote trocado ou pedido cancelado indo para a coleta." },
    { icon: AlarmClockOff, title: "Perceber tarde que passou do horário de corte e arriscar a reputação." },
    { icon: Keyboard, title: "Digitar cada compra do fornecedor, item por item." },
    { icon: Unlink, title: "Venda que entra antes da compra ser lançada fica sem custo e distorce a margem." },
    { icon: TrendingDown, title: "Fechar o mês juntando extrato, planilha e relatório que não batem." },
    { icon: Boxes, title: "Estoque desatualizado: vender em uma conta o que já acabou na outra." },
    { icon: Settings2, title: "Sistemas genéricos cheios de menus, sem custo por lote nem arbitragem." },
  ],
};

const ARBIFLOW: ShowcaseSide<Side> = {
  id: "arbiflow",
  label: "ArbiFlow",
  eyebrow: "Com o ArbiFlow",
  title: "A operação inteira em um painel que faz as contas.",
  description:
    "Feito dentro de uma operação real de marketplace: as vendas chegam sozinhas, o custo é cruzado automaticamente e a expedição tem conferência por bipe.",
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
      title: "Lucro líquido real, com custos ocultos",
      text: "Comissão, tarifa fixa por faixa, frete do Mercado Envios, custo do produto e impostos descontados em cada venda.",
    },
    {
      icon: Volume2,
      title: "Bip & Fala na expedição",
      text: "Bipe a etiqueta pelo leitor ou pela câmera: o sistema confere o pedido, fala o nome do item e avisa se já foi enviado ou cancelado.",
    },
    {
      icon: RefreshCw,
      title: "Multicontas Mercado Livre sincronizadas",
      text: "Pedidos, pagamentos, cancelamentos e envios de todas as contas chegam sozinhos, em um só painel.",
    },
    {
      icon: Clock,
      title: "Cronômetro do horário de corte",
      text: "Cada pacote marcado como Atrasado, Despachar hoje (com contagem regressiva) ou Amanhã.",
    },
    {
      icon: ClipboardPaste,
      title: "Compras lançadas por IA",
      text: "Mande o print ou cole o texto do pedido do fornecedor: título, quantidade, preço e frete vão direto para o estoque.",
    },
    {
      icon: FileText,
      title: "DRE e fechamento do mês",
      text: "Faturamento, tarifas, fretes, custo das mercadorias e despesas até o lucro líquido, mês a mês.",
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

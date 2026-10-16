"use client";

import { motion } from "framer-motion";
import { Calculator } from "lucide-react";
import { useId, useRef, useState } from "react";
import { ease } from "@/components/ui/primitives";
import { track } from "@/lib/tracking";

/* Prefilled with the example sale used on the ArbiFlow site, so the result shows before any typing. */
const FIELDS = [
  { k: "sale", label: "Valor da venda", def: "363,00" },
  { k: "cost", label: "Custo do produto", def: "224,99" },
  { k: "fees", label: "Comissão e tarifas", def: "41,74" },
  { k: "ship", label: "Frete pago por você", def: "24,45" },
] as const;

type Key = (typeof FIELDS)[number]["k"];

/** Accepts "1.234,56", "1234,56" or "1234.56". */
function parseBRL(v: string) {
  const s = v.replace(/[^\d,.-]/g, "");
  const n = Number(s.includes(",") ? s.replace(/\./g, "").replace(",", ".") : s);
  return Number.isFinite(n) ? n : 0;
}

const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const pct = (n: number) => `${n.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`;

export function ProfitCalculator({ variant }: { variant: string }) {
  const uid = useId();
  const [vals, setVals] = useState<Record<Key, string>>(
    Object.fromEntries(FIELDS.map((f) => [f.k, f.def])) as Record<Key, string>,
  );
  const touched = useRef(false);

  const n = Object.fromEntries(FIELDS.map((f) => [f.k, parseBRL(vals[f.k])])) as Record<Key, number>;
  const profit = n.sale - n.cost - n.fees - n.ship;
  const margin = n.sale > 0 ? (profit / n.sale) * 100 : 0;
  const roi = n.cost > 0 ? (profit / n.cost) * 100 : 0;
  const loss = profit < 0;

  // Where each real of the sale goes, for the stacked bar.
  const total = Math.max(n.sale, n.cost + n.fees + n.ship, 1);
  const slices = [
    { w: n.cost, c: "bg-[#5b6b8f]", l: "Custo" },
    { w: n.fees, c: "bg-danger/80", l: "Taxas" },
    { w: n.ship, c: "bg-warn/80", l: "Frete" },
    { w: Math.max(profit, 0), c: "bg-profit", l: "Lucro" },
  ];

  function onChange(k: Key, v: string) {
    setVals((s) => ({ ...s, [k]: v }));
    if (!touched.current) {
      touched.current = true;
      track("presell_calc_interact", { variant });
    }
  }

  return (
    <div id="calculadora" className="card glow-border relative w-full max-w-md scroll-mt-6 p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan/30 bg-cyan/10">
          <Calculator className="h-4 w-4 text-cyan" aria-hidden />
        </span>
        <p className="font-display font-semibold">Teste com a sua última venda</p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {FIELDS.map((f) => (
          <label key={f.k} htmlFor={`${uid}-${f.k}`} className="flex flex-col gap-1">
            <span className="text-xs text-muted">{f.label}</span>
            <span className="flex min-h-11 items-center rounded-xl border border-line bg-ink/70 px-3 transition-colors focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/30">
              <span className="text-sm text-muted">R$</span>
              <input
                id={`${uid}-${f.k}`}
                inputMode="decimal"
                value={vals[f.k]}
                onChange={(e) => onChange(f.k, e.target.value)}
                onFocus={(e) => e.target.select()}
                className="w-full min-w-0 bg-transparent pl-1.5 text-[16px] tabular-nums text-text outline-none"
              />
            </span>
          </label>
        ))}
      </div>

      <div className="mt-5 flex h-2.5 overflow-hidden rounded-full bg-line-soft" aria-hidden>
        {slices.map((s) => (
          <motion.span
            key={s.l}
            className={s.c}
            animate={{ width: `${(s.w / total) * 100}%` }}
            transition={{ duration: 0.4, ease }}
          />
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted" aria-hidden>
        {slices.map((s) => (
          <span key={s.l} className="flex items-center gap-1">
            <span className={`h-2 w-2 rounded-full ${s.c}`} /> {s.l}
          </span>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3" aria-live="polite">
        <div className="rounded-xl border border-line-soft bg-ink/50 px-3 py-2.5">
          <p className="text-[11px] text-muted">O painel mostra</p>
          <p className="mt-0.5 font-display text-lg font-semibold tabular-nums">{brl(n.sale)}</p>
          <p className="text-[11px] text-muted">vendidos</p>
        </div>
        <div
          className={`rounded-xl border px-3 py-2.5 ${loss ? "border-danger/40 bg-danger/10" : "border-profit/30 bg-profit/10"}`}
        >
          <p className="text-[11px] text-muted">{loss ? "Na verdade, você perdeu" : "Sobrou de verdade"}</p>
          <p className={`mt-0.5 font-display text-lg font-semibold tabular-nums ${loss ? "text-danger" : "text-profit"}`}>
            {brl(Math.abs(profit))}
          </p>
          <p className="text-[11px] tabular-nums text-muted">
            margem {pct(margin)} · ROI {pct(roi)}
          </p>
        </div>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted">
        Valores de exemplo já preenchidos: troque pelos seus. O ArbiFlow faz essa conta sozinho, com as tarifas reais
        de cada pedido, <span className="text-text">em todas as suas vendas</span>.
      </p>
    </div>
  );
}

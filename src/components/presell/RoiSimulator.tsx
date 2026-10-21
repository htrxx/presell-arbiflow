"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { Clock, ShieldCheck, TrendingUp } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { track } from "@/lib/tracking";

/*
 * Same parameters as the official simulator on arbiflow.com.br/presell:
 *  - hours saved in shipping: 3.5 min per order;
 *  - losses avoided: R$ 4,20 per order + R$ 180 (up to 100 orders) or R$ 450 (above 100).
 */
const MIN = 20;
const MAX = 1500;
const hoursSaved = (n: number) => Math.round((n * 3.5) / 60);
const lossAvoided = (n: number) => Math.round(4.2 * n + (n > 100 ? 450 : 180));

function AnimatedNumber({ value, format }: { value: number; format: (n: number) => string }) {
  const spring = useSpring(value, { stiffness: 140, damping: 24 });
  const text = useTransform(spring, (v) => format(Math.round(v)));
  useEffect(() => spring.set(value), [spring, value]);
  return <motion.span style={{ fontVariantNumeric: "tabular-nums" }}>{text}</motion.span>;
}

const int = (n: number) => n.toLocaleString("pt-BR");

/** `compact` fits the hero column: smaller paddings and type, and a title row for context. */
export default function RoiSimulator({ variant, compact = false }: { variant: string; compact?: boolean }) {
  const id = useId();
  const [orders, setOrders] = useState(150);
  const tracked = useRef(false);
  const pct = ((orders - MIN) / (MAX - MIN)) * 100;

  function onChange(v: number) {
    setOrders(v);
    if (!tracked.current) {
      tracked.current = true;
      track("presell_simulator_interact", { variant });
    }
  }

  return (
    <div
      id="simulador"
      className={`card glow-border relative mx-auto w-full scroll-mt-6 ${compact ? "max-w-md p-5 sm:p-6" : "max-w-4xl p-5 sm:p-10"}`}
    >
      {compact && (
        <div className="mb-5 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan/30 bg-cyan/10">
            <TrendingUp className="h-4 w-4 text-cyan" aria-hidden />
          </span>
          <p className="font-display font-semibold">Quanto você recupera por mês?</p>
        </div>
      )}
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="font-semibold">
          Vendas por mês
        </label>
        <p className={`font-display font-semibold text-brand-2 ${compact ? "text-2xl" : "text-2xl sm:text-3xl"}`}>
          <AnimatedNumber value={orders} format={int} />
          {orders >= MAX ? "+" : ""} <span className="text-base font-medium sm:text-lg">pedidos</span>
        </p>
      </div>

      <input
        id={id}
        type="range"
        min={MIN}
        max={MAX}
        step={10}
        value={orders}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-valuetext={`${orders} pedidos por mês`}
        className="roi-range mt-6 h-11 w-full cursor-pointer"
        style={{ "--fill": `${pct}%` } as React.CSSProperties}
      />
      <div className="mt-1 flex justify-between text-[11px] tabular-nums text-muted">
        <span>20</span>
        <span>500</span>
        <span>1.500+</span>
      </div>

      <div
        className={`grid gap-3 border-t border-line-soft ${compact ? "mt-5 pt-5 sm:grid-cols-2" : "mt-8 pt-8 sm:grid-cols-2 sm:gap-4"}`}
      >
        <div className={`rounded-2xl border border-line-soft bg-ink/50 ${compact ? "p-3.5" : "p-5"}`}>
          <p className={`flex gap-2 text-muted ${compact ? "items-start text-xs" : "items-center text-sm"}`}>
            <Clock className="h-4 w-4 shrink-0 text-cyan" aria-hidden /> Horas poupadas na expedição
          </p>
          <p className={`mt-2 whitespace-nowrap font-display font-semibold ${compact ? "text-2xl" : "text-3xl sm:text-4xl"}`}>
            ~<AnimatedNumber value={hoursSaved(orders)} format={int} /> h<span className={`text-muted ${compact ? "text-sm" : "text-lg"}`}>/mês</span>
          </p>
          <p className="mt-1 text-xs text-muted">Com conferência por bipe e voz</p>
        </div>
        <div className={`rounded-2xl border border-brand/30 bg-brand/10 ${compact ? "p-3.5" : "p-5"}`}>
          <p className={`flex gap-2 text-brand-2 ${compact ? "items-start text-xs" : "items-center text-sm"}`}>
            <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden /> Prejuízos evitados
          </p>
          <p className={`mt-2 whitespace-nowrap font-display font-semibold text-brand-2 ${compact ? "text-2xl" : "text-3xl sm:text-4xl"}`}>
            R$ <AnimatedNumber value={lossAvoided(orders)} format={int} />
            <span className={`text-brand-2/70 ${compact ? "text-sm" : "text-lg"}`}>/mês</span>
          </p>
          <p className="mt-1 text-xs text-brand-2/80">Com Zero-Stock Shield e lucro real</p>
        </div>
      </div>
      <p className={`text-center text-[11px] text-muted/80 ${compact ? "mt-4" : "mt-5"}`}>
        Estimativa com os parâmetros oficiais do ArbiFlow.
      </p>
    </div>
  );
}

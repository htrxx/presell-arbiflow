"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { Clock, ShieldCheck } from "lucide-react";
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

export default function RoiSimulator({ variant }: { variant: string }) {
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
    <div className="card glow-border relative mx-auto w-full max-w-4xl p-5 sm:p-10">
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="font-semibold">
          Vendas por mês
        </label>
        <p className="font-display text-2xl font-semibold text-brand-2 sm:text-3xl">
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

      <div className="mt-8 grid gap-3 border-t border-line-soft pt-8 sm:grid-cols-2 sm:gap-4">
        <div className="rounded-2xl border border-line-soft bg-ink/50 p-5">
          <p className="flex items-center gap-2 text-sm text-muted">
            <Clock className="h-4 w-4 text-cyan" aria-hidden /> Horas poupadas na expedição
          </p>
          <p className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
            ~<AnimatedNumber value={hoursSaved(orders)} format={int} /> h<span className="text-lg text-muted">/mês</span>
          </p>
          <p className="mt-1 text-xs text-muted">Com conferência por bipe e voz</p>
        </div>
        <div className="rounded-2xl border border-brand/30 bg-brand/10 p-5">
          <p className="flex items-center gap-2 text-sm text-brand-2">
            <ShieldCheck className="h-4 w-4" aria-hidden /> Prejuízos evitados
          </p>
          <p className="mt-2 font-display text-3xl font-semibold text-brand-2 sm:text-4xl">
            R$ <AnimatedNumber value={lossAvoided(orders)} format={int} />
            <span className="text-lg text-brand-2/70">/mês</span>
          </p>
          <p className="mt-1 text-xs text-brand-2/80">Com Zero-Stock Shield e lucro real</p>
        </div>
      </div>
      <p className="mt-5 text-center text-[11px] text-muted/80">
        Estimativa com os parâmetros do simulador oficial do ArbiFlow. Resultados variam por operação.
      </p>
    </div>
  );
}

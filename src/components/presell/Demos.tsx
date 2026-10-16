"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Bell, Check, Pause, Play, ScanBarcode, Calculator, PackagePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { ease } from "@/components/ui/primitives";

/* Example values are the same ones shown in the demonstration on the ArbiFlow site. */
export const SALE = [
  { k: "Valor da venda", v: "R$ 363,00", c: "text-text" },
  { k: "Comissão e tarifas", v: "− R$ 41,74", c: "text-danger" },
  { k: "Frete pago por você", v: "− R$ 24,45", c: "text-danger" },
  { k: "Custo do produto (lote)", v: "− R$ 224,99", c: "text-danger" },
];

/** Hero visual: a sale being broken down into the real profit, line by line. */
export function CalcCard() {
  return (
    <div className="card glow-border relative w-full max-w-md p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Venda #2000015491499505</p>
        <span className="flex items-center gap-1.5 rounded-full border border-cyan/30 bg-cyan/10 px-2 py-0.5 text-[11px] text-cyan">
          <Calculator className="h-3 w-3" aria-hidden /> calculado
        </span>
      </div>
      <ul className="mt-4 flex flex-col tabular-nums text-sm">
        {SALE.map((l, i) => (
          <motion.li
            key={l.k}
            className="flex justify-between gap-3 border-b border-line-soft py-2.5 last:border-0"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease, delay: 0.5 + i * 0.28 }}
          >
            <span className="text-muted">{l.k}</span>
            <span className={`shrink-0 ${l.c}`}>{l.v}</span>
          </motion.li>
        ))}
      </ul>
      <motion.div
        className="mt-3 flex items-end justify-between rounded-xl border border-profit/30 bg-profit/10 px-4 py-3"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease, delay: 0.5 + SALE.length * 0.28 }}
      >
        <span className="text-sm font-semibold text-text">Lucro real</span>
        <span className="text-right tabular-nums">
          <span className="block font-display text-2xl font-semibold text-profit">+R$ 71,82</span>
          <span className="text-xs text-muted">ROI 31,9%</span>
        </span>
      </motion.div>
      <p className="mt-3 text-[11px] text-muted/80">Exemplo ilustrativo da demonstração do ArbiFlow.</p>
    </div>
  );
}

const PHASES = [
  { icon: ScanBarcode, label: "Escaneia" },
  { icon: PackagePlus, label: "Estoque" },
  { icon: Bell, label: "Vende" },
  { icon: Calculator, label: "Calcula" },
];

/** Section 5: the full flow, scan → stock → sale → real profit, on a phone-sized screen. */
export function FlowDemo() {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState(reduce ? 3 : 0);
  const [playing, setPlaying] = useState(!reduce);

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setPhase((p) => (p + 1) % PHASES.length), 2600);
    return () => clearInterval(t);
  }, [playing]);

  const bars = [3, 1, 2, 1, 3, 1, 1, 2, 3, 1, 2, 2, 1, 3, 1, 2, 1, 1, 3, 2, 1, 2, 3, 1, 1, 2];

  return (
    <div className="flex flex-col items-center gap-6">
      <ol className="flex w-full max-w-md items-start justify-between gap-1" aria-label="Etapas da demonstração">
        {PHASES.map((p, i) => (
          <li key={p.label} className="flex flex-1 flex-col items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                setPhase(i);
                setPlaying(false);
              }}
              aria-current={phase === i ? "step" : undefined}
              aria-label={`Ver etapa: ${p.label}`}
              className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-colors duration-300 ${
                phase >= i ? "border-brand/60 bg-brand/15 text-brand-2" : "border-line bg-surface text-muted"
              }`}
            >
              <p.icon className="h-5 w-5" aria-hidden />
            </button>
            <span className={`text-center text-[11px] ${phase === i ? "text-text" : "text-muted"}`}>{p.label}</span>
          </li>
        ))}
      </ol>

      <div className="relative w-full max-w-[320px] rounded-[36px] border border-line bg-gradient-to-b from-[#111a31] to-ink p-3 shadow-[0_40px_120px_-30px_rgba(31,107,255,0.5)]">
        <div className="mx-auto mb-3 h-1.5 w-20 rounded-full bg-line" aria-hidden />
        <div className="relative h-[340px] overflow-hidden rounded-[26px] border border-line-soft bg-ink/80 p-4" aria-live="polite">
          <AnimatePresence mode="wait">
            {phase === 0 && (
              <motion.div key="scan" {...fade} className="flex h-full flex-col justify-center gap-4">
                <p className="text-center text-xs text-muted">Aponte a câmera para o código de barras</p>
                <div className="relative overflow-hidden rounded-2xl border border-line-soft bg-surface p-5 [--scan-distance:68px]">
                  <div className="flex h-[72px] items-stretch justify-center gap-[3px]" aria-hidden>
                    {bars.map((w, i) => (
                      <span key={i} className="rounded-[1px] bg-text/85" style={{ width: w * 2 }} />
                    ))}
                  </div>
                  <p className="mt-2 text-center tabular-nums text-[11px] tracking-[0.3em] text-muted">7 891234 567895</p>
                  <span
                    className="animate-scan absolute inset-x-3 top-4 h-[2px] rounded-full bg-cyan shadow-[0_0_18px_4px_rgba(69,227,255,0.55)]"
                    aria-hidden
                  />
                </div>
                <p className="text-center text-sm text-text">Lendo código…</p>
              </motion.div>
            )}
            {phase === 1 && (
              <motion.div key="stock" {...fade} className="flex h-full flex-col justify-center gap-3">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-profit/15">
                  <Check className="h-6 w-6 text-profit" aria-hidden />
                </span>
                <p className="text-center font-display text-lg font-semibold">Lote adicionado</p>
                <dl className="flex flex-col gap-2 rounded-2xl border border-line-soft bg-surface p-3 text-sm">
                  {[
                    ["Produto", "Chaleira Arno Soleil 1,7l"],
                    ["Custo do lote", "R$ 224,99 / un."],
                    ["Quantidade", "+ 12 un."],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-3">
                      <dt className="text-muted">{k}</dt>
                      <dd className="text-right tabular-nums">{v}</dd>
                    </div>
                  ))}
                </dl>
                <p className="text-center text-xs text-muted">Sem digitar nada.</p>
              </motion.div>
            )}
            {phase === 2 && (
              <motion.div key="sale" {...fade} className="flex h-full flex-col pt-6">
                <p className="text-center tabular-nums text-3xl font-light text-text/90">21:38</p>
                <motion.div
                  initial={{ y: -16, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, ease, delay: 0.3 }}
                  className="mt-6 rounded-2xl border border-line-soft bg-surface-2/90 p-3"
                >
                  <div className="flex items-center justify-between text-[11px] text-muted">
                    <span className="font-semibold text-text">ArbiFlow</span>
                    agora
                  </div>
                  <p className="mt-1 text-[13px] font-semibold">Nova venda realizada</p>
                  <p className="text-xs text-muted">Chaleira Arno Linha Soleil 1,7l</p>
                  <p className="text-xs text-muted">
                    Valor: <span className="text-brand-2">R$ 363,00</span>
                  </p>
                </motion.div>
                <p className="mt-auto text-center text-xs text-muted">Notificação no Android ou iPhone</p>
              </motion.div>
            )}
            {phase === 3 && (
              <motion.div key="calc" {...fade} className="flex h-full flex-col justify-center">
                <p className="text-[11px] uppercase tracking-[0.16em] text-muted">Lucro desta venda</p>
                <ul className="mt-2 flex flex-col tabular-nums text-[13px]">
                  {SALE.map((l, i) => (
                    <motion.li
                      key={l.k}
                      className="flex justify-between gap-2 border-b border-line-soft py-2"
                      initial={reduce ? false : { opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.35, delay: 0.1 + i * 0.18 }}
                    >
                      <span className="truncate text-muted">{l.k}</span>
                      <span className={`shrink-0 ${l.c}`}>{l.v}</span>
                    </motion.li>
                  ))}
                </ul>
                <motion.div
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="mt-3 flex items-end justify-between rounded-xl border border-profit/30 bg-profit/10 px-3 py-2.5"
                >
                  <span className="text-sm font-semibold">Lucro real</span>
                  <span className="text-right tabular-nums">
                    <span className="block font-display text-xl font-semibold text-profit">+R$ 71,82</span>
                    <span className="text-[11px] text-muted">ROI 31,9%</span>
                  </span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setPlaying((p) => !p)}
        className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-line bg-surface/70 px-4 text-sm text-muted transition-colors hover:text-text"
      >
        {playing ? <Pause className="h-4 w-4" aria-hidden /> : <Play className="h-4 w-4" aria-hidden />}
        {playing ? "Pausar demonstração" : "Reproduzir demonstração"}
      </button>
      <p className="max-w-sm text-center text-xs text-muted/80">
        Demonstração ilustrativa do fluxo, com os valores de exemplo usados no site do ArbiFlow.
      </p>
    </div>
  );
}

const fade = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

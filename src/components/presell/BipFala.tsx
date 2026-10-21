"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertTriangle, Check, CheckCircle2, Play, Volume2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ease } from "@/components/ui/primitives";
import { track } from "@/lib/tracking";

/* Illustrative scans for the animation; the real app reads the order from the shipping label. */
const SCANS = [
  { ok: true, speech: "Chaleira Arno Soleil, uma unidade.", label: "Pedido conferido" },
  { ok: false, speech: "Atenção: este pedido já foi enviado.", label: "Já enviado" },
];

const CHECKS = [
  "Alerta se o pedido já foi enviado ou cancelado",
  "Status atualizado com 1 bipe",
];

function Waveform({ active }: { active: boolean }) {
  return (
    <span className="flex h-4 items-center gap-[3px]" aria-hidden>
      {[0.5, 1, 0.7, 0.9, 0.4].map((h, i) => (
        <motion.span
          key={i}
          className="w-[3px] rounded-full bg-current"
          animate={active ? { height: ["30%", `${h * 100}%`, "30%"] } : { height: "30%" }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.08 }}
        />
      ))}
    </span>
  );
}

export default function BipFala({ variant }: { variant: string }) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [canSpeak, setCanSpeak] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const scan = SCANS[i];

  useEffect(() => {
    setCanSpeak(typeof window !== "undefined" && "speechSynthesis" in window);
  }, []);

  useEffect(() => {
    if (reduce || speaking) return;
    const t = setInterval(() => setI((v) => (v + 1) % SCANS.length), 3200);
    return () => clearInterval(t);
  }, [reduce, speaking]);

  function speak() {
    track("presell_bipfala_listen", { variant });
    const synth = window.speechSynthesis;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(scan.speech);
    u.lang = "pt-BR";
    const voice = synth.getVoices().find((v) => v.lang.toLowerCase().startsWith("pt-br"));
    if (voice) u.voice = voice;
    u.onstart = () => setSpeaking(true);
    u.onend = u.onerror = () => setSpeaking(false);
    synth.speak(u);
  }

  return (
    <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
      {/* Tela real + animação do bipe */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease }}
        className="relative order-2 lg:order-1"
      >
        <div className="relative rounded-[22px] border border-line bg-[#0b0d14] p-2 shadow-[0_40px_120px_-30px_rgba(31,107,255,0.45)] sm:rounded-[28px] sm:p-2.5">
          <div className="relative overflow-hidden rounded-[16px] sm:rounded-[20px]">
            <Image
              src="/screens/app-conferencia.webp"
              alt="Tela de Conferência de Envios do ArbiFlow"
              width={1600}
              height={1000}
              sizes="(max-width: 1024px) 100vw, 620px"
              className="block h-auto w-full"
            />
            {/* linha de leitura do bipe */}
            <span
              className="animate-scan absolute inset-x-[28%] top-[34%] h-[2px] rounded-full bg-cyan shadow-[0_0_18px_4px_rgba(69,227,255,0.55)] [--scan-distance:60px] sm:[--scan-distance:110px]"
              aria-hidden
            />
          </div>
        </div>

        {/* aviso falado */}
        <div className="absolute inset-x-0 -bottom-6 flex justify-center px-4" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, transition: { duration: 0.18 } }}
              transition={{ duration: 0.4, ease }}
              className="flex max-w-full items-center gap-3 rounded-2xl border border-line bg-surface-2/95 px-4 py-3 shadow-2xl backdrop-blur"
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                  scan.ok ? "bg-profit/15 text-profit" : "bg-warn/15 text-warn"
                }`}
              >
                <Volume2 className="h-4 w-4" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block text-sm leading-snug text-text">“{scan.speech}”</span>
                <span className={`flex items-center gap-1.5 text-xs ${scan.ok ? "text-profit" : "text-warn"}`}>
                  {scan.ok ? <CheckCircle2 className="h-3.5 w-3.5" aria-hidden /> : <AlertTriangle className="h-3.5 w-3.5" aria-hidden />}
                  {scan.label}
                </span>
              </span>
              <span className={scan.ok ? "text-profit" : "text-warn"}>
                <Waveform active={!reduce} />
              </span>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Texto */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease, delay: 0.1 }}
        className="order-1 flex flex-col items-start lg:order-2"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-cyan/25 bg-cyan/10 px-3.5 py-1.5 text-sm font-medium text-cyan">
          <Volume2 className="h-4 w-4" aria-hidden /> Conferência auditada por IA
        </span>
        <h2 className="mt-5 font-display text-3xl font-semibold leading-[1.08] tracking-tight text-balance sm:text-5xl">
          Bip & Fala: <span className="text-gradient">expedição conferida por voz.</span>
        </h2>
        <p className="mt-4 max-w-lg leading-relaxed text-muted sm:text-lg">
          Bipou a etiqueta, a voz confirma o item.
        </p>
        <ul className="mt-6 flex flex-col gap-3">
          {CHECKS.map((c) => (
            <li key={c} className="flex items-start gap-3">
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-brand-2" aria-hidden />
              <span>{c}</span>
            </li>
          ))}
        </ul>
        {canSpeak && (
          <div className="mt-8 flex flex-col items-start gap-2">
            <button
              type="button"
              onClick={speak}
              className="inline-flex min-h-12 items-center gap-2.5 rounded-xl border border-cyan/40 bg-cyan/10 px-5 text-sm font-semibold text-text transition-colors hover:bg-cyan/20"
            >
              {speaking ? <Waveform active /> : <Play className="h-4 w-4 text-cyan" aria-hidden />}
              {speaking ? "Falando…" : "Ouvir um exemplo"}
            </button>
            <p className="text-xs text-muted">Prévia com a voz do navegador.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

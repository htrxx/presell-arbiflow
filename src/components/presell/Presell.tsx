"use client";

import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { Lock, Plus, ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BrowserFrame, Logo, Reveal, SectionHeading, ease } from "@/components/ui/primitives";
import { CTAS, HEADLINES, type CtaId, type HeadlineId } from "@/lib/presell";
import { track } from "@/lib/tracking";
import Analytics from "./Analytics";
import BipFala from "./BipFala";
import SpatialShowcaseSection from "./Comparison";
import { CtaLink } from "./CtaLink";
import { FlowDemo } from "./Demos";
import RoiSimulator from "./RoiSimulator";

const STEPS = [
  {
    t: "Conecte sua conta",
    d: "Vendas importadas sozinhas.",
  },
  {
    t: "Bipe o código de barras",
    d: "Produto no estoque com custo e lote.",
  },
  {
    t: "Veja o lucro real",
    d: "Margem e ROI em cada pedido.",
  },
];

const FAQ = [
  {
    q: "Preciso cadastrar produtos?",
    a: "Não. Conectou a conta, puxou tudo. Você só informa o custo.",
  },
  {
    q: "É seguro?",
    a: "API oficial do Mercado Livre. Sem acesso à sua senha.",
  },
  {
    q: "Quanto custa?",
    a: "A partir de R$ 79/mês no anual: menos de R$ 3 por dia.",
  },
  {
    q: "E se eu não gostar?",
    a: "7 dias de garantia. Não gostou, dinheiro de volta.",
  },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan">{children}</p>;
}

export default function Presell({ headline, cta, variant }: { headline: HeadlineId; cta: CtaId; variant: string }) {
  const h = HEADLINES[headline];
  const { text: ctaText, path: ctaPath } = CTAS[cta];
  const heroRef = useRef<HTMLElement>(null);
  const finalRef = useRef<HTMLElement>(null);
  const [showSticky, setShowSticky] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Sticky CTA on phones: visible after the hero, hidden while the final CTA is on screen.
  useEffect(() => {
    const vis = { hero: true, final: false };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.target === heroRef.current) vis.hero = e.isIntersecting;
        if (e.target === finalRef.current) vis.final = e.isIntersecting;
      });
      setShowSticky(!vis.hero && !vis.final);
    });
    if (heroRef.current) io.observe(heroRef.current);
    if (finalRef.current) io.observe(finalRef.current);
    return () => io.disconnect();
  }, []);

  const renderCta = (position: string, className?: string) => (
    <CtaLink position={position} variant={variant} path={ctaPath} className={className}>
      {ctaText}
    </CtaLink>
  );

  return (
    <MotionConfig reducedMotion="user">
      <Analytics variant={variant} angle={h.angle} />

      <header className="absolute inset-x-0 top-0 z-30">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Logo />
          <span className="flex items-center gap-1.5 text-xs text-muted">
            <Lock className="h-3.5 w-3.5" aria-hidden /> Para sellers do Mercado Livre
          </span>
        </div>
      </header>

      <main>
        {/* 1 — GANCHO + SIMULADOR (micro-compromisso: o visitante vê o retorno no próprio volume) */}
        <section ref={heroRef} className="relative overflow-hidden pb-16 pt-24 sm:pb-24 sm:pt-32">
          <div
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_70%_20%,rgba(31,107,255,0.22),transparent_70%),radial-gradient(40%_40%_at_10%_80%,rgba(69,227,255,0.08),transparent_70%)]"
            aria-hidden
          />
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.15fr_1fr]">
            <div className="flex flex-col items-start">
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
                <Eyebrow>Começando ou já escalando? Controle desde o 1º pedido.</Eyebrow>
              </motion.div>
              <motion.h1
                className="mt-4 font-display text-[2.35rem] font-semibold leading-[1.05] tracking-[-0.03em] text-balance sm:text-5xl xl:text-6xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease, delay: 0.06 }}
              >
                {h.title} <span className="text-gradient block">{h.highlight}</span>
              </motion.h1>
              <motion.p
                className="mt-5 max-w-xl text-base leading-relaxed text-muted text-pretty sm:text-lg"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease, delay: 0.14 }}
              >
                Scanner, IA e Zero-Stock Shield: <span className="text-text">estoque sem furo e margem real</span> em
                cada venda.
              </motion.p>
              <motion.div
                className="mt-8 flex w-full flex-col gap-3 sm:w-auto"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease, delay: 0.22 }}
              >
                {renderCta("hero")}
                <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-profit" aria-hidden /> API oficial do Mercado Livre
                  </span>
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-profit" aria-hidden /> 7 dias de garantia
                  </span>
                </p>
              </motion.div>
            </div>
            <motion.div
              className="flex justify-center lg:justify-end"
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, ease, delay: 0.2 }}
            >
              <RoiSimulator variant={variant} compact />
            </motion.div>
          </div>
        </section>

        {/* 2 — PROBLEMA × SOLUÇÃO: comparativo interativo planilhas/outros sistemas vs ArbiFlow */}
        <section className="relative py-20 sm:py-28">
          <div className="mx-auto mb-10 max-w-6xl px-4 sm:px-6">
            <SectionHeading
              title={
                <>
                  Planilha <span className="text-gradient">ou ArbiFlow?</span>
                </>
              }
            />
          </div>
          <SpatialShowcaseSection variant={variant} renderCta={renderCta} />
        </section>

        {/* 3 — SOLUÇÃO + DEMONSTRAÇÃO */}
        <section id="como-funciona" className="relative py-20 sm:py-28">
          <div
            className="pointer-events-none absolute inset-x-0 top-1/4 -z-10 mx-auto h-[420px] max-w-4xl rounded-full bg-brand/10 blur-[120px]"
            aria-hidden
          />
          <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2">
            <div className="flex flex-col gap-8">
              <SectionHeading
                align="left"
                title={
                  <>
                    3 passos. <span className="text-gradient">Zero planilha.</span>
                  </>
                }
              />
              <ol className="flex flex-col gap-5">
                {STEPS.map((s, i) => (
                  <motion.li
                    key={s.t}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.5, ease, delay: i * 0.08 }}
                    className="flex gap-4"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-brand/50 bg-brand/15 font-display text-sm font-semibold tabular-nums text-brand-2">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-semibold">{s.t}</h3>
                      <p className="mt-0.5 text-sm leading-relaxed text-muted">{s.d}</p>
                    </div>
                  </motion.li>
                ))}
              </ol>
            </div>
            <Reveal delay={0.1}>
              <FlowDemo />
            </Reveal>
          </div>
        </section>

        {/* 4 — PROVA: tela real de vendas com o lucro de cada pedido */}
        <section className="relative py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHeading
              title={
                <>
                  Não é promessa. <span className="text-gradient">É a tela real.</span>
                </>
              }
              subtitle="Margem e ROI em cada pedido."
            />
            <Reveal className="mt-12">
              <BrowserFrame
                src="/screens/app-vendas.webp"
                alt="Tela Vendas & Envios do ArbiFlow com lucro real, margem e ROI por pedido"
                url="arbiflow.com.br/vendas"
                width={1600}
                height={1000}
                scrollable
              />
              <p className="mt-3 text-center text-xs text-muted md:hidden">Arraste para o lado para ver a tela inteira</p>
            </Reveal>
          </div>
        </section>

        {/* 5 — BIP & FALA: tela real + bipe animado + prévia de voz */}
        <section id="bip-e-fala" className="relative py-20 sm:py-28">
          <BipFala variant={variant} />
        </section>

        {/* 6 — OBJEÇÕES */}
        <section className="relative py-20 sm:py-28">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <SectionHeading title="Antes de clicar" />
            <div className="mt-10 flex flex-col gap-3">
              {FAQ.map((f, i) => {
                const isOpen = openFaq === i;
                return (
                  <div
                    key={f.q}
                    className={`rounded-2xl border bg-surface/60 transition-colors ${isOpen ? "border-brand/40" : "border-line-soft"}`}
                  >
                    <h3>
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={`pfaq-${i}`}
                        onClick={() => {
                          setOpenFaq(isOpen ? null : i);
                          if (!isOpen) track("presell_faq_open", { question: f.q, variant });
                        }}
                        className="flex min-h-14 w-full items-center justify-between gap-4 px-5 py-4 text-left font-medium"
                      >
                        {f.q}
                        <motion.span animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.25 }} className="shrink-0">
                          <Plus className="h-5 w-5 text-muted" aria-hidden />
                        </motion.span>
                      </button>
                    </h3>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={`pfaq-${i}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0, transition: { duration: 0.2 } }}
                          transition={{ duration: 0.35, ease }}
                          className="overflow-hidden"
                        >
                          <p className="px-5 pb-5 leading-relaxed text-muted">{f.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 7 — CTA FINAL */}
        <section ref={finalRef} className="relative overflow-hidden px-4 py-24 sm:px-6 sm:py-32">
          <div
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(50%_60%_at_50%_100%,rgba(31,107,255,0.28),transparent_70%)]"
            aria-hidden
          />
          <Reveal className="mx-auto flex max-w-2xl flex-col items-center text-center">
            <Eyebrow>7 dias de garantia incondicional</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-5xl">
              Margem protegida por <span className="text-gradient">menos de R$ 3 por dia.</span>
            </h2>
            <p className="mt-5 max-w-xl text-muted text-pretty sm:text-lg">
              Teste 7 dias. Não gostou, dinheiro de volta.
            </p>
            {renderCta("final", "mt-9")}
            <p className="mt-4 text-xs text-muted">Site oficial do ArbiFlow.</p>
          </Reveal>
        </section>
      </main>

      <footer className="border-t border-line-soft pb-28 sm:pb-0">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>© {new Date().getFullYear()} ArbiFlow. Marcas de marketplaces pertencem aos seus respectivos donos.</span>
          <CtaLink position="footer" variant={variant} kind="link" className="underline underline-offset-4 hover:text-text">
            Site oficial
          </CtaLink>
        </div>
      </footer>

      {/* CTA fixo no celular */}
      <AnimatePresence>
        {showSticky && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ duration: 0.35, ease }}
            className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-ink/90 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl sm:hidden"
          >
            {renderCta("sticky")}
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}

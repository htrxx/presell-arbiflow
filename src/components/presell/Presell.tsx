"use client";

import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { Bell, FileText, Lock, Plus, Store } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BrowserFrame, Logo, Reveal, SectionHeading, ease } from "@/components/ui/primitives";
import { CTAS, HEADLINES, type CtaId, type HeadlineId } from "@/lib/presell";
import { track } from "@/lib/tracking";
import Analytics from "./Analytics";
import { ProfitCalculator } from "./Calculator";
import SpatialShowcaseSection from "./Comparison";
import { CtaLink } from "./CtaLink";
import { FlowDemo } from "./Demos";

const STEPS = [
  {
    t: "Conecte sua conta",
    d: "Produtos e vendas chegam automaticamente pela API oficial do marketplace.",
  },
  {
    t: "Escaneie o código de barras",
    d: "Pela câmera do celular, o produto entra no estoque com lote, custo e quantidade.",
  },
  {
    t: "Veja o lucro real",
    d: "Cada venda aparece com comissão, tarifa, frete e custo descontados, além de margem e ROI.",
  },
];

const EXTRAS = [
  { icon: Store, t: "Várias contas, um estoque só" },
  { icon: FileText, t: "DRE do mês pronto para imprimir" },
  { icon: Bell, t: "Cada venda notificada no celular" },
];

const FAQ = [
  {
    q: "Preciso cadastrar meus produtos manualmente?",
    a: "Não. Ao conectar sua conta, produtos e vendas são importados automaticamente do marketplace. Você só cadastra os custos, quando necessário, para o cálculo do lucro real.",
  },
  {
    q: "O cálculo usa as taxas reais de cada venda?",
    a: "Sim. Para cada venda, o ArbiFlow desconta a comissão e as tarifas do marketplace, o frete pago por você e o custo do produto que você cadastrou. Despesas operacionais e embalagens entram no fechamento mensal.",
  },
  {
    q: "Meus dados estão seguros?",
    a: "A conexão com o marketplace é feita pela API oficial, com uma autorização que você pode revogar a qualquer momento. O ArbiFlow não tem acesso à sua senha.",
  },
  {
    q: "Quanto custa?",
    a: "Há dois planos, Standard e Pro, com preço promocional de lançamento a partir de R$ 19,90/mês. Multicontas com estoque sincronizado está incluso em todos.",
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
            <Lock className="h-3.5 w-3.5" aria-hidden /> Para vendedores de marketplace
          </span>
        </div>
      </header>

      <main>
        {/* 1 — GANCHO + CALCULADORA (micro-compromisso: o visitante vê o problema nos próprios números) */}
        <section ref={heroRef} className="relative overflow-hidden pb-16 pt-24 sm:pb-24 sm:pt-32">
          <div
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_70%_20%,rgba(31,107,255,0.22),transparent_70%),radial-gradient(40%_40%_at_10%_80%,rgba(69,227,255,0.08),transparent_70%)]"
            aria-hidden
          />
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.15fr_1fr]">
            <div className="flex flex-col items-start">
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
                <p className="inline-flex items-center gap-2 rounded-full border border-cyan/25 bg-cyan/10 px-3.5 py-1.5 text-[13px] leading-snug text-cyan text-pretty">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-cyan" aria-hidden />
                  Vai estrear no marketplace ou já vende todos os dias? Tenha controle desde o primeiro pedido.
                </p>
              </motion.div>
              <motion.h1
                className="mt-4 font-display text-[2.35rem] font-semibold leading-[1.05] tracking-[-0.03em] text-balance sm:text-6xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease, delay: 0.06 }}
              >
                {h.title} <span className="text-gradient">{h.highlight}</span>
              </motion.h1>
              <motion.p
                className="mt-5 max-w-xl text-base leading-relaxed text-muted text-pretty sm:text-lg"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease, delay: 0.14 }}
              >
                O painel do marketplace mostra quanto você vendeu. O ArbiFlow desconta{" "}
                <span className="text-text">comissão, tarifa, frete e o custo do seu lote</span> em cada venda — e mostra
                quanto realmente sobrou.
              </motion.p>
              <motion.div
                className="mt-8 flex w-full flex-col gap-3 sm:w-auto"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease, delay: 0.22 }}
              >
                {renderCta("hero")}
                <a
                  href="#calculadora"
                  onClick={() => track("presell_anchor_click", { target: "calculadora", variant })}
                  className="text-sm text-muted underline decoration-line underline-offset-4 hover:text-text hover:decoration-cyan lg:hidden"
                >
                  Ou faça o teste com a sua última venda ↓
                </a>
              </motion.div>
            </div>
            <motion.div
              className="flex justify-center lg:justify-end"
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, ease, delay: 0.2 }}
            >
              <ProfitCalculator variant={variant} />
            </motion.div>
          </div>
        </section>

        {/* 2 — PROBLEMA × SOLUÇÃO: comparativo interativo planilhas/outros sistemas vs ArbiFlow */}
        <section className="relative py-20 sm:py-28">
          <div className="mx-auto mb-10 max-w-6xl px-4 sm:px-6">
            <SectionHeading
              title={
                <>
                  Planilha, sistema genérico <span className="text-gradient">ou ArbiFlow?</span>
                </>
              }
              subtitle="Veja onde o seu tempo vai embora hoje — e como fica quando o sistema faz as contas por você."
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
                    O ArbiFlow faz essa conta <span className="text-gradient">por você.</span>
                  </>
                }
                subtitle="Do código de barras ao lucro de cada venda, sem planilha no meio."
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

        {/* 4 — PROVA: tela real + o que mais vem junto */}
        <section className="relative py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHeading
              title={
                <>
                  Não é promessa. <span className="text-gradient">É a tela de vendas real.</span>
                </>
              }
              subtitle="Cada pedido com custo, margem e ROI ao lado, e o status de envio em 1 clique."
            />
            <Reveal className="mt-12">
              <BrowserFrame
                src="/screens/vendas.webp"
                alt="Tela Vendas & Envios do ArbiFlow com lucro, margem e ROI por pedido"
                url="app.arbiflow.com.br/vendas"
                scrollable
              />
              <p className="mt-3 text-center text-xs text-muted md:hidden">Arraste para o lado para ver a tela inteira</p>
            </Reveal>
            <ul className="mt-8 flex flex-wrap justify-center gap-2">
              {EXTRAS.map((e) => (
                <li
                  key={e.t}
                  className="flex items-center gap-2 rounded-full border border-line-soft bg-surface/60 px-4 py-2 text-sm"
                >
                  <e.icon className="h-4 w-4 text-brand-2" aria-hidden />
                  {e.t}
                </li>
              ))}
            </ul>
            <div className="mt-10 flex justify-center">
              {renderCta("proof")}
            </div>
          </div>
        </section>

        {/* 5 — OBJEÇÕES */}
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

        {/* 6 — CTA FINAL */}
        <section ref={finalRef} className="relative overflow-hidden px-4 py-24 sm:px-6 sm:py-32">
          <div
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(50%_60%_at_50%_100%,rgba(31,107,255,0.28),transparent_70%)]"
            aria-hidden
          />
          <Reveal className="mx-auto flex max-w-2xl flex-col items-center text-center">
            <Eyebrow>Preço de lançamento por tempo limitado</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-5xl">
              Você fez a conta de uma venda. <span className="text-gradient">Veja todas as outras.</span>
            </h2>
            <p className="mt-5 max-w-xl text-muted text-pretty sm:text-lg">
              Conheça as telas, compare os planos — a partir de R$ 19,90/mês no lançamento — e conecte sua conta para ver
              o lucro real das próximas vendas.
            </p>
            {renderCta("final", "mt-9")}
            <p className="mt-4 text-xs text-muted">Você será direcionado ao site oficial do ArbiFlow.</p>
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

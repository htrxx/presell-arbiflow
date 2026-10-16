"use client";

import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import {
  Boxes,
  ClipboardList,
  DollarSign,
  FileSpreadsheet,
  FileText,
  Layers,
  Lock,
  Plus,
  Receipt,
  ScanBarcode,
  Store,
  Truck,
  Plug,
  ChartNoAxesCombined,
  Quote,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BrowserFrame, Logo, Reveal, SectionHeading, ease } from "@/components/ui/primitives";
import { CTAS, HEADLINES, type CtaId, type HeadlineId } from "@/lib/presell";
import { track } from "@/lib/tracking";
import Analytics from "./Analytics";
import { CtaLink } from "./CtaLink";
import { CalcCard, FlowDemo } from "./Demos";

const PAINS = [
  { icon: Receipt, t: "Abrir venda por venda para achar a comissão e a tarifa cobradas." },
  { icon: Truck, t: "Somar o frete que saiu do seu bolso em cada envio." },
  { icon: ClipboardList, t: "Lembrar quanto pagou em cada lote — com frete, taxas e impostos." },
  { icon: FileSpreadsheet, t: "Atualizar a planilha de estoque toda vez que uma compra chega." },
  { icon: Layers, t: "Repetir tudo isso para cada conta de marketplace." },
];

const STEPS = [
  {
    icon: Plug,
    t: "Conecte sua conta",
    d: "Seus produtos e vendas são importados automaticamente pela API oficial do marketplace. Sem recadastrar anúncio.",
  },
  {
    icon: ScanBarcode,
    t: "Escaneie e registre o custo",
    d: "Aponte a câmera do celular para o código de barras: o produto entra no estoque com lote, custo e quantidade.",
  },
  {
    icon: ChartNoAxesCombined,
    t: "Veja o lucro real",
    d: "Cada venda aparece com comissão, tarifa, frete e custo do produto já descontados — além de margem e ROI.",
  },
];

const BENEFITS = [
  {
    icon: DollarSign,
    t: "Lucro real, venda por venda",
    d: "Não é estimativa: o cálculo cruza cada pedido com o custo do lote que você cadastrou.",
  },
  {
    icon: ScanBarcode,
    t: "Estoque sem digitação",
    d: "Entrada de mercadoria pelo scanner do celular. Disponível, a caminho e custo médio sempre atualizados.",
  },
  {
    icon: Store,
    t: "Várias contas, um estoque",
    d: "Vendeu em uma conta? A baixa acontece no estoque compartilhado e todas ficam sincronizadas.",
  },
  {
    icon: FileText,
    t: "Fechamento do mês pronto",
    d: "DRE com receita, custo das mercadorias, comissões, fretes e despesas até o lucro líquido.",
  },
];

const SCREENS = [
  { id: "vendas", label: "Vendas & Envios", text: "Cada pedido com custo, margem e ROI ao lado, e status de envio em 1 clique." },
  { id: "estoque", label: "Estoque", text: "Disponível, a caminho, custo médio e valor total por SKU, com alerta de estoque baixo." },
  { id: "fechamento", label: "Fechamento", text: "DRE mensal do faturamento bruto ao lucro líquido real, pronto para imprimir." },
];

const FAQ = [
  {
    q: "Como o ArbiFlow calcula o lucro real?",
    a: "Para cada venda, ele desconta a comissão e as tarifas do marketplace, o frete pago pelo vendedor e o custo do produto que você cadastrou. Despesas operacionais e embalagens entram no fechamento mensal.",
  },
  {
    q: "Preciso cadastrar meus produtos manualmente?",
    a: "Não. Ao conectar sua conta, produtos e vendas são importados automaticamente do marketplace. Você só cadastra os custos, quando necessário, para o cálculo do lucro real.",
  },
  {
    q: "Como funciona o scanner?",
    a: "Pelo celular: você aponta a câmera para o código de barras e o produto entra no estoque com lote, custo e quantidade, sem precisar digitar.",
  },
  {
    q: "Para quem o ArbiFlow foi feito?",
    a: "Para pequenos e médios vendedores de marketplace — inclusive quem trabalha com arbitragem ou importação e precisa saber o custo real de cada lote. Ele nasceu dentro de uma operação de arbitragem.",
  },
  {
    q: "Consigo usar com mais de uma conta?",
    a: "Sim, em qualquer plano. Você conecta várias contas, alterna entre elas em um clique e compartilha o mesmo estoque físico, com sincronização a cada venda.",
  },
  {
    q: "Meus dados estão seguros?",
    a: "A conexão com o marketplace é feita pela API oficial, com uma autorização que você pode revogar a qualquer momento. O ArbiFlow não tem acesso à sua senha.",
  },
  {
    q: "Quanto custa e como eu começo?",
    a: "Há dois planos, Standard e Pro, com preço promocional de lançamento a partir de R$ 19,90/mês. No site oficial você vê o que cada plano inclui, escolhe o seu e conclui o cadastro e o pagamento.",
  },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan">{children}</p>;
}

export default function Presell({ headline, cta, variant }: { headline: HeadlineId; cta: CtaId; variant: string }) {
  const h = HEADLINES[headline];
  const ctaText = CTAS[cta];
  const heroRef = useRef<HTMLElement>(null);
  const finalRef = useRef<HTMLElement>(null);
  const [showSticky, setShowSticky] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [screen, setScreen] = useState(0);

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
        {/* 1 — GANCHO */}
        <section ref={heroRef} className="relative overflow-hidden pb-16 pt-24 sm:pb-24 sm:pt-32">
          <div
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_70%_20%,rgba(31,107,255,0.22),transparent_70%),radial-gradient(40%_40%_at_10%_80%,rgba(69,227,255,0.08),transparent_70%)]"
            aria-hidden
          />
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.15fr_1fr]">
            <div className="flex flex-col items-start">
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
                <Eyebrow>Faturar não é lucrar</Eyebrow>
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
                <CtaLink position="hero" variant={variant}>
                  {ctaText}
                </CtaLink>
                <p className="text-sm text-muted">
                  Veja as telas reais e os planos no site oficial.{" "}
                  <a
                    href="#como-funciona"
                    onClick={() => track("presell_anchor_click", { target: "como-funciona", variant })}
                    className="text-text underline decoration-line underline-offset-4 hover:decoration-cyan"
                  >
                    Ou entenda como funciona ↓
                  </a>
                </p>
              </motion.div>
            </div>
            <motion.div
              className="flex justify-center lg:justify-end"
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, ease, delay: 0.2 }}
            >
              <CalcCard />
            </motion.div>
          </div>
        </section>

        {/* 2 — PROBLEMA */}
        <section className="relative py-20 sm:py-28">
          <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col gap-6">
              <SectionHeading
                align="left"
                title={
                  <>
                    Descobrir quanto sobrou <span className="text-gradient">não deveria dar tanto trabalho.</span>
                  </>
                }
                subtitle="Se hoje o seu lucro depende de uma planilha, provavelmente a sua rotina é parecida com esta:"
              />
              <Reveal delay={0.1}>
                <figure className="rounded-2xl border border-line-soft bg-surface/60 p-5">
                  <Quote className="h-5 w-5 text-cyan" aria-hidden />
                  <blockquote className="mt-2 font-display text-lg font-medium text-pretty">
                    “Vendíamos em marketplace e o painel dizia que estava tudo ótimo. A conta bancária discordava.”
                  </blockquote>
                  <figcaption className="mt-2 text-sm text-muted">Como o ArbiFlow começou, segundo a própria equipe</figcaption>
                </figure>
              </Reveal>
            </div>
            <ul className="flex flex-col gap-3 self-center">
              {PAINS.map((p, i) => (
                <motion.li
                  key={p.t}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, ease, delay: i * 0.07 }}
                  className="flex items-center gap-4 rounded-2xl border border-line-soft bg-surface/60 p-4"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-danger/30 bg-danger/10">
                    <p.icon className="h-5 w-5 text-danger" aria-hidden />
                  </span>
                  <span className="text-[15px] leading-snug">{p.t}</span>
                </motion.li>
              ))}
              <li className="px-1 pt-2 text-sm text-muted">
                Funciona — até a operação crescer. Aí a planilha vira o gargalo.
              </li>
            </ul>
          </div>
        </section>

        {/* 3 — SOLUÇÃO */}
        <section id="como-funciona" className="relative py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHeading
              title={
                <>
                  O ArbiFlow faz essa conta <span className="text-gradient">por você.</span>
                </>
              }
              subtitle="Uma plataforma que junta vendas, estoque físico, compras e finanças — e calcula o lucro real de cada pedido."
            />
            <ol className="mt-14 grid gap-4 md:grid-cols-3">
              {STEPS.map((s, i) => (
                <motion.li
                  key={s.t}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.6, ease, delay: i * 0.1 }}
                  className="card relative p-6"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-brand/30 bg-brand/10">
                      <s.icon className="h-5 w-5 text-brand-2" aria-hidden />
                    </span>
                    <span className="font-display text-4xl font-semibold tabular-nums text-line">0{i + 1}</span>
                  </div>
                  <h3 className="mt-5 font-display text-xl font-semibold">{s.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{s.d}</p>
                </motion.li>
              ))}
            </ol>
          </div>
        </section>

        {/* 5 — DEMONSTRAÇÃO (antes dos benefícios: mostrar antes de listar) */}
        <section className="relative py-20 sm:py-28">
          <div
            className="pointer-events-none absolute inset-x-0 top-1/4 -z-10 mx-auto h-[420px] max-w-4xl rounded-full bg-brand/10 blur-[120px]"
            aria-hidden
          />
          <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2">
            <div className="flex flex-col gap-6">
              <SectionHeading
                align="left"
                title={
                  <>
                    Do código de barras <span className="text-gradient">ao lucro no bolso.</span>
                  </>
                }
                subtitle="Veja o caminho de um produto dentro do ArbiFlow: ele entra pelo scanner, é vendido e o lucro aparece calculado — sem planilha no meio."
              />
              <Reveal delay={0.1} className="hidden lg:block">
                <CtaLink position="demo" variant={variant}>
                  {ctaText}
                </CtaLink>
              </Reveal>
            </div>
            <Reveal delay={0.1}>
              <FlowDemo />
            </Reveal>
          </div>
        </section>

        {/* 4 — BENEFÍCIOS */}
        <section className="relative py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <SectionHeading
              title={
                <>
                  Menos tempo calculando. <span className="text-gradient">Mais clareza para decidir.</span>
                </>
              }
            />
            <ul className="mt-14 grid gap-4 sm:grid-cols-2">
              {BENEFITS.map((b, i) => (
                <motion.li
                  key={b.t}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, ease, delay: i * 0.07 }}
                  className="flex gap-4 rounded-2xl border border-line-soft bg-surface/60 p-5"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-brand/30 bg-brand/10">
                    <b.icon className="h-5 w-5 text-brand-2" aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold">{b.t}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{b.d}</p>
                  </div>
                </motion.li>
              ))}
            </ul>

            {/* Telas reais */}
            <div className="mt-16">
              <div
                role="tablist"
                aria-label="Telas reais do ArbiFlow"
                className="mx-auto flex max-w-full gap-1 overflow-x-auto rounded-2xl border border-line bg-surface/70 p-1.5 [scrollbar-width:none] sm:w-fit"
              >
                {SCREENS.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    role="tab"
                    aria-selected={screen === i}
                    aria-controls="presell-screen"
                    onClick={() => {
                      setScreen(i);
                      track("presell_screen_view", { screen: s.id, variant });
                    }}
                    className={`relative flex min-h-11 shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm transition-colors ${
                      screen === i ? "text-text" : "text-muted hover:text-text"
                    }`}
                  >
                    {screen === i && (
                      <motion.span
                        layoutId="presell-tab"
                        className="absolute inset-0 rounded-xl border border-brand/40 bg-brand/15"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className="relative flex items-center gap-2">
                      {i === 0 ? <Truck className="h-4 w-4" /> : i === 1 ? <Boxes className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                      {s.label}
                    </span>
                  </button>
                ))}
              </div>
              <div id="presell-screen" role="tabpanel" className="mt-6">
                <p className="mx-auto max-w-xl text-center text-sm text-muted">{SCREENS[screen].text}</p>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={SCREENS[screen].id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, transition: { duration: 0.15 } }}
                    transition={{ duration: 0.4, ease }}
                    className="mt-6"
                  >
                    <BrowserFrame
                      src={`/screens/${SCREENS[screen].id}.webp`}
                      alt={`Tela ${SCREENS[screen].label} do ArbiFlow`}
                      url={`app.arbiflow.com.br/${SCREENS[screen].id}`}
                      scrollable
                    />
                  </motion.div>
                </AnimatePresence>
                <p className="mt-3 text-center text-xs text-muted md:hidden">Telas reais da plataforma · arraste para o lado</p>
              </div>
            </div>
          </div>
        </section>

        {/* 6 — OBJEÇÕES */}
        <section className="relative py-20 sm:py-28">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <SectionHeading title="Antes de clicar, você deve estar se perguntando…" />
            <div className="mt-12 flex flex-col gap-3">
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
            <Eyebrow>Preço de lançamento por tempo limitado</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-5xl">
              Descubra quanto a sua operação <span className="text-gradient">realmente lucra.</span>
            </h2>
            <p className="mt-5 max-w-xl text-muted text-pretty sm:text-lg">
              No site oficial você vê todas as telas, compara os planos — a partir de R$ 19,90/mês no lançamento — e
              escolhe o seu. Conecte a conta, cadastre seus custos e veja o lucro real das próximas vendas.
            </p>
            <CtaLink position="final" variant={variant} className="mt-9">
              {ctaText}
            </CtaLink>
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
            <CtaLink position="sticky" variant={variant}>
              {ctaText}
            </CtaLink>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}

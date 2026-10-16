/**
 * Presell copy variants and destination.
 *
 * A/B tests are driven by query params on the ad URL:
 *  - ?h=a|b|c  → headline variant (a: curiosity, b: problem, c: benefit). Default: b.
 *  - ?c=1|2    → CTA variant. Default: 1.
 * The chosen variant is sent with every tracking event and forwarded to the destination as `pv`.
 */

export const PRESELL_DESTINATION =
  process.env.NEXT_PUBLIC_PRESELL_DESTINATION || "https://arbiflow-site.vercel.app/";

export const HEADLINES = {
  a: {
    angle: "curiosidade",
    title: "O painel do marketplace mostra quanto você vendeu.",
    highlight: "Não quanto sobrou.",
  },
  b: {
    angle: "problema",
    title: "Você ainda calcula o lucro de cada venda",
    highlight: "na planilha?",
  },
  c: {
    angle: "benefício",
    title: "Veja o lucro real de cada venda",
    highlight: "depois de taxas, frete e custo.",
  },
} as const;

export const CTAS = {
  "1": "Conhecer o ArbiFlow",
  "2": "Ver planos de lançamento",
} as const;

export type HeadlineId = keyof typeof HEADLINES;
export type CtaId = keyof typeof CTAS;

export function resolveVariant(h?: string, c?: string) {
  const headline: HeadlineId = h && h in HEADLINES ? (h as HeadlineId) : "b";
  const cta: CtaId = c && c in CTAS ? (c as CtaId) : "1";
  return { headline, cta, id: `${headline}${cta}` };
}

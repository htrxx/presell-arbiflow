/**
 * Presell copy variants and destination.
 *
 * A/B tests are driven by query params on the ad URL:
 *  - ?h=a|b|c  → headline variant (a: curiosity, b: problem, c: benefit). Default: b.
 *  - ?c=1|2    → CTA variant. Default: 1.
 * The chosen variant is sent with every tracking event and forwarded to the destination as `pv`.
 */

export const PRESELL_DESTINATION =
  process.env.NEXT_PUBLIC_PRESELL_DESTINATION || "https://arbiflow.com.br/presell";

export const HEADLINES = {
  a: {
    angle: "curiosidade",
    title: "O painel do marketplace mostra quanto você vendeu.",
    highlight: "Não quanto sobrou.",
  },
  b: {
    angle: "problema",
    title: "Cansado de planilhas e sistemas confusos?",
    highlight: "A solução está aqui.",
  },
  c: {
    angle: "benefício",
    title: "Veja o lucro real de cada venda",
    highlight: "depois de taxas, frete e custo.",
  },
} as const;

/* Message match: the "plans" CTA lands directly on the pricing section of the main site. */
export const CTAS = {
  "1": { text: "Conhecer o ArbiFlow", path: "" },
  "2": { text: "Ver planos", path: "#planos" },
} as const;

export type HeadlineId = keyof typeof HEADLINES;
export type CtaId = keyof typeof CTAS;

export function resolveVariant(h?: string, c?: string) {
  const headline: HeadlineId = h && h in HEADLINES ? (h as HeadlineId) : "b";
  const cta: CtaId = c && c in CTAS ? (c as CtaId) : "1";
  return { headline, cta, id: `${headline}${cta}` };
}

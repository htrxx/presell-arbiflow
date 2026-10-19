# Presell ArbiFlow

Página de presell da ArbiFlow para campanhas de tráfego pago (Meta Ads, Instagram, TikTok).
Conduz o visitante por gancho → problema → solução → demonstração → benefícios → dúvidas → CTA,
e envia para o site oficial com as UTMs preservadas.

## Rodar localmente

```bash
npm install
npm run dev
```

Abra http://localhost:3000.

## Variáveis de ambiente

Copie `.env.example` para `.env.local`:

| Variável | Uso |
|---|---|
| `NEXT_PUBLIC_PRESELL_DESTINATION` | Destino dos botões (padrão: `https://arbiflow.com.br/presell`) |
| `NEXT_PUBLIC_GA4_ID` | Google Analytics 4 (opcional) |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta Pixel (opcional) |

GA4 e Pixel só carregam depois que o visitante aceita os cookies de medição. Sem IDs, nenhum script
externo é carregado e o aviso de cookies não aparece.

## Testes A/B

Controlados pela URL do anúncio:

| Parâmetro | Variante |
|---|---|
| `?h=a` | Título com foco em curiosidade |
| `?h=b` (padrão) | Título com foco no problema |
| `?h=c` | Título com foco no benefício |
| `?c=1` (padrão) / `?c=2` | CTA "Conhecer o ArbiFlow" / "Ver planos" (leva a `#planos`) |

A variante vai em todos os eventos e é repassada ao destino como `pv`.

## Eventos (`dataLayer`, GA4 e Pixel)

`presell_view`, `presell_cta_click` (com `position`), `presell_outbound_click`, `presell_scroll` (50/90%),
`presell_faq_open`, `presell_anchor_click`, `presell_compare_toggle`,
`presell_simulator_interact`, `presell_bipfala_listen`.

UTMs, `fbclid`, `gclid` e `ttclid` são guardados na sessão e anexados ao link de destino,
junto com `ref=presell`.

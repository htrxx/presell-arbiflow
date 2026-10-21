import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000",
  ),
  title: "Quanto sobrou de cada venda? — ArbiFlow",
  description:
    "O ArbiFlow desconta comissão, tarifa, frete e o custo do seu lote em cada venda do marketplace e mostra o lucro real.",
  // Paid-traffic page: keep it out of search results so it doesn't compete with the main site.
  robots: { index: false, follow: true },
  openGraph: {
    title: "Faturar não é lucrar — ArbiFlow",
    description: "Veja o lucro real de cada venda depois de taxas, frete e custo do produto.",
    images: ["/screens/real-dashboard.png"],
    locale: "pt_BR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#05070d",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}

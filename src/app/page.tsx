import Presell from "@/components/presell/Presell";
import { resolveVariant } from "@/lib/presell";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ h?: string; c?: string }>;
}) {
  const { h, c } = await searchParams;
  const v = resolveVariant(h, c);
  return <Presell headline={v.headline} cta={v.cta} variant={v.id} />;
}

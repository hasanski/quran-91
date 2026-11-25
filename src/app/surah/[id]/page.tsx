import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { surahs } from "@/data/surahs";
import { getSurahDetails, getSurahMeta } from "@/lib/quran-api";
import SurahView from "@/components/surah/surah-view";

type Props = { params: Promise<{ id: string }> };

// Prerender all 114 surahs at build time; any other id is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return surahs.map((s) => ({ id: String(s.id) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const meta = getSurahMeta(Number(id));
  if (!meta) return {};

  const title = `سورة ${meta.name} - القرآن الكريم`;
  const description = `اقرأ واستمع إلى سورة ${meta.name}، سورة ${meta.type} وعدد آياتها ${meta.verses} آية، مع الترجمة والتلاوة بأصوات كبار القراء.`;

  return {
    title,
    description,
    alternates: { canonical: `/surah/${meta.id}` },
    openGraph: { title, description, type: "article", locale: "ar_AR", url: `/surah/${meta.id}` },
  };
}

export default async function SurahPage({ params }: Props) {
  const { id } = await params;
  const surah = await getSurahDetails(Number(id));
  if (!surah) notFound();

  return <SurahView surah={surah} />;
}

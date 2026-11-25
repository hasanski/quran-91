import { surahs, type Surah } from "@/data/surahs";

export type SurahDetails = {
  id: number;
  name: string;
  type: Surah["type"];
  versesCount: number;
  verses: string[];
  versesTranslations?: {
    ru: string[];
  };
};

type ApiVerse = {
  text_uthmani: string;
  translations?: { text: string }[];
};

// Kuliev Russian translation on Quran.com is ID 45
const RU_TRANSLATION_ID = 45;

export function getSurahMeta(id: number): Surah | undefined {
  return surahs.find((s) => s.id === id);
}

/**
 * Fetches verses + Russian translation on the server.
 * The Quran text never changes, so the response is cached indefinitely
 * and pages are fully prerendered at build time.
 */
export async function getSurahDetails(id: number): Promise<SurahDetails | null> {
  const meta = getSurahMeta(id);
  if (!meta) return null;

  const url =
    `https://api.quran.com/api/v4/verses/by_chapter/${id}` +
    `?language=ru&words=false&translations=${RU_TRANSLATION_ID}&fields=text_uthmani&per_page=300`;

  const res = await fetch(url, { cache: "force-cache" });
  if (!res.ok) {
    throw new Error(`Quran API ${res.status} for surah ${id}`);
  }

  const data: { verses: ApiVerse[] } = await res.json();

  return {
    id: meta.id,
    name: meta.name,
    type: meta.type,
    versesCount: meta.verses,
    verses: data.verses.map((v) => v.text_uthmani),
    versesTranslations: {
      ru: data.verses.map((v) => v.translations?.[0]?.text ?? ""),
    },
  };
}

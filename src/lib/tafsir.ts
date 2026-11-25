import type { Locale } from "@/context/language-context";

// Quran.com tafsir resource IDs
const TAFSIR_IDS: Record<Locale, number> = {
  ar: 16, // التفسير الميسر
  ru: 170, // Тафсир ас-Саади
};

const cache = new Map<string, Promise<string>>();

/** Converts the API's HTML into plain paragraphs (no HTML is ever injected). */
function htmlToText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|h\d|li)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function getVerseTafsir(surahId: number, verse: number, locale: Locale): Promise<string> {
  const key = `${locale}:${surahId}:${verse}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const url = `https://api.quran.com/api/v4/tafsirs/${TAFSIR_IDS[locale]}/by_ayah/${surahId}:${verse}`;
  const request = fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error(`Tafsir ${res.status}`);
      return res.json();
    })
    .then((data: { tafsir?: { text?: string } }) => htmlToText(data.tafsir?.text ?? ""));

  // Don't keep failed requests in the cache, so "retry" actually retries
  request.catch(() => cache.delete(key));
  cache.set(key, request);
  return request;
}

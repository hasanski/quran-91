"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/context/language-context";
import { getVerseTafsir } from "@/lib/tafsir";

type Result = { key: string; status: "ready" | "error"; text: string };

export default function TafsirPanel({ surahId, verseNumber }: { surahId: number; verseNumber: number }) {
  const { t, locale } = useLanguage();
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<Result | null>(null);

  // Anything not matching the current request key is treated as "loading"
  const key = `${locale}:${surahId}:${verseNumber}:${attempt}`;
  const status = result?.key === key ? result.status : "loading";

  useEffect(() => {
    let active = true;
    getVerseTafsir(surahId, verseNumber, locale)
      .then((text) => active && setResult({ key, status: "ready", text }))
      .catch(() => active && setResult({ key, status: "error", text: "" }));
    return () => {
      active = false;
    };
  }, [key, surahId, verseNumber, locale]);

  return (
    <div className="mt-4 rounded-2xl border border-gold/20 bg-gold/5 p-4 text-start" dir={locale === "ar" ? "rtl" : "ltr"}>
      <p className="mb-2 text-xs font-semibold text-gold">{t("tafsirSource")}</p>

      {status === "loading" && (
        <div className="space-y-2 animate-pulse" aria-label={t("tafsirLoading")}>
          <div className="h-4 w-full rounded bg-muted" />
          <div className="h-4 w-5/6 rounded bg-muted" />
          <div className="h-4 w-2/3 rounded bg-muted" />
        </div>
      )}

      {status === "error" && (
        <button
          onClick={() => setAttempt((n) => n + 1)}
          className="text-sm text-destructive underline underline-offset-4 cursor-pointer"
        >
          {t("tafsirError")}
        </button>
      )}

      {status === "ready" && (
        <p className="whitespace-pre-line text-base leading-8 text-foreground/90">{result?.text}</p>
      )}
    </div>
  );
}

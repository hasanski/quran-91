"use client";

import Link from "next/link";
import { useReading } from "@/context/reading-context";
import { useLanguage } from "@/context/language-context";

export default function ResumeReading() {
  const { lastPosition } = useReading();
  const { t, translateSurahName, locale } = useLanguage();

  if (!lastPosition) return null;

  const timeAgo = getTimeAgo(lastPosition.timestamp, t);
  const localizedSurahName = translateSurahName(lastPosition.surahId, lastPosition.surahName);

  return (
    <section className="mx-auto max-w-7xl px-6 pb-8">
      <div className="overflow-hidden rounded-[32px] border border-border bg-gradient-to-br from-primary/10 to-emerald-500/10 p-6 shadow-sm backdrop-blur-sm md:p-8">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-2xl">
              📖
            </div>

            <div>
              <p className="mb-1 text-sm font-medium text-muted-foreground">
                {t("resumeReading")}
              </p>

              <h2 className="text-xl font-bold text-foreground md:text-2xl">
                {t("resumeReadingDetails", { name: localizedSurahName, number: lastPosition.verseNumber })}
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                {t("lastRead")}: {timeAgo}
              </p>
            </div>
          </div>

          <Link
            href={`/surah/${lastPosition.surahId}#verse-${lastPosition.verseNumber}`}
            className="group flex shrink-0 items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            <span>{t("resumeReadingButton")}</span>

            <svg
              className={`h-5 w-5 transition-transform ${locale === "ar" ? "group-hover:-translate-x-1" : "group-hover:translate-x-1"}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={locale === "ar" ? "M10 19l-7-7m0 0l7-7m-7 7h18" : "M14 5l7 7m0 0l-7 7m7-7H3"}
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

function getTimeAgo(timestamp: number, t: any): string {
  const now = Date.now();
  const diffInSeconds = Math.floor((now - timestamp) / 1000);

  if (diffInSeconds < 60) {
    return t("secondsAgo");
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return diffInMinutes === 1 ? t("oneMinuteAgo") : t("minutesAgo", { count: diffInMinutes });
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return diffInHours === 1 ? t("oneHourAgo") : t("hoursAgo", { count: diffInHours });
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return diffInDays === 1 ? t("oneDayAgo") : t("daysAgo", { count: diffInDays });
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  return diffInWeeks === 1 ? t("oneWeekAgo") : t("weeksAgo", { count: diffInWeeks });
}

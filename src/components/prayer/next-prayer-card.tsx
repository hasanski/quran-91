"use client";

import Link from "next/link";
import { Clock, MapPin, Play, Square } from "lucide-react";
import { usePrayer } from "@/context/prayer-context";
import { useLanguage } from "@/context/language-context";
import { ADHAN_PRAYERS, formatCountdown, formatTime } from "@/lib/prayer-times";

/** Compact "next prayer" card for the home page. */
export default function NextPrayerCard() {
  const { mounted, now, location, isMyLocation, today, next, isAdhanPlaying, playAdhan, stopAdhan } = usePrayer();
  const { t, locale } = useLanguage();

  if (!mounted) {
    return (
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="h-48 animate-pulse rounded-[32px] border border-border bg-card" />
      </section>
    );
  }

  const placeName = isMyLocation
    ? t("myLocation")
    : locale === "ar"
    ? location.city?.nameAr
    : location.city?.nameRu;

  return (
    <section className="mx-auto max-w-7xl px-6 pb-16">
      <div className="overflow-hidden rounded-[32px] border border-gold/20 bg-gradient-to-br from-primary/10 via-card to-gold/10 p-6 shadow-sm md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="mb-1 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin size={14} /> {placeName}
            </p>
            <p className="text-sm font-medium text-gold">{t("nextPrayer")}</p>
            <h2 className="mt-1 text-4xl font-bold">
              {t(next.key)}{" "}
              <span className="text-primary tabular-nums">{formatTime(next.time, location.tz, locale)}</span>
            </h2>
            <p className="mt-2 flex items-center gap-2 text-muted-foreground">
              <Clock size={16} />
              {t("timeRemaining")}{" "}
              <span className="font-mono text-lg tabular-nums text-foreground" dir="ltr">
                {formatCountdown(next.time.getTime() - now.getTime())}
              </span>
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={isAdhanPlaying ? stopAdhan : playAdhan}
              className="flex items-center gap-2 rounded-2xl border border-gold/30 bg-gold/10 px-5 py-3 font-medium text-gold transition hover:bg-gold/20 cursor-pointer"
            >
              {isAdhanPlaying ? <Square size={16} /> : <Play size={16} />}
              {isAdhanPlaying ? t("stopAdhan") : t("playAdhan")}
            </button>
            <Link
              href="/prayer-times"
              className="rounded-2xl bg-primary px-5 py-3 font-medium text-primary-foreground transition hover:opacity-90"
            >
              {t("viewAllTimes")}
            </Link>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-5 gap-2">
          {ADHAN_PRAYERS.map((key) => (
            <div
              key={key}
              className={`rounded-2xl border p-3 text-center transition ${
                key === next.key ? "border-primary bg-primary/10" : "border-border bg-card/60"
              }`}
            >
              <p className={`text-xs md:text-sm ${key === next.key ? "text-primary font-semibold" : "text-muted-foreground"}`}>
                {t(key)}
              </p>
              <p className="mt-1 text-sm font-bold tabular-nums md:text-base">{formatTime(today[key], location.tz, locale)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

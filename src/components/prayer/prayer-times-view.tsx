"use client";

import { Clock, LocateFixed, MapPin, Play, Square, Sunrise } from "lucide-react";
import { usePrayer } from "@/context/prayer-context";
import { useLanguage } from "@/context/language-context";
import {
  CITIES,
  METHODS,
  PRAYER_KEYS,
  formatCountdown,
  formatDates,
  formatTime,
  type MadhabId,
  type MethodId,
} from "@/lib/prayer-times";

const selectClass =
  "w-full cursor-pointer rounded-2xl border border-border bg-input px-4 py-3 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/20";

export default function PrayerTimesView() {
  const p = usePrayer();
  const { t, locale } = useLanguage();

  if (!p.mounted) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-16">
        <div className="mb-8 h-40 animate-pulse rounded-[32px] border border-border bg-card" />
        <div className="h-96 animate-pulse rounded-[32px] border border-border bg-card" />
      </main>
    );
  }

  const { gregorian, hijri } = formatDates(p.now, p.location.tz, locale);
  const placeName = p.isMyLocation
    ? t("myLocation")
    : locale === "ar"
    ? p.location.city?.nameAr
    : p.location.city?.nameRu;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto max-w-5xl px-6 py-16">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold md:text-5xl">{t("prayerTimes")}</h1>
          <p className="mt-3 text-muted-foreground">{gregorian}</p>
          {hijri && <p className="mt-1 font-medium text-gold">{hijri}</p>}
          <p className="mt-2 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <MapPin size={14} /> {placeName}
          </p>
        </header>

        {/* Next prayer */}
        <div className="mb-8 rounded-[32px] border border-gold/20 bg-gradient-to-br from-primary/10 via-card to-gold/10 p-8 text-center shadow-sm">
          <p className="text-sm font-medium text-gold">{t("nextPrayer")}</p>
          <h2 className="mt-2 text-5xl font-bold">{t(p.next.key)}</h2>
          <p className="mt-2 text-3xl font-bold tabular-nums text-primary">
            {formatTime(p.next.time, p.location.tz, locale)}
          </p>
          <p className="mt-4 flex items-center justify-center gap-2 text-muted-foreground">
            <Clock size={16} /> {t("timeRemaining")}
            <span className="font-mono text-2xl tabular-nums text-foreground" dir="ltr">
              {formatCountdown(p.next.time.getTime() - p.now.getTime())}
            </span>
          </p>

          <button
            onClick={p.isAdhanPlaying ? p.stopAdhan : p.playAdhan}
            className="mx-auto mt-6 flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 font-medium text-primary-foreground transition hover:opacity-90 cursor-pointer"
          >
            {p.isAdhanPlaying ? <Square size={18} /> : <Play size={18} />}
            {p.isAdhanPlaying ? t("stopAdhan") : t("playAdhan")}
          </button>
          <p className="mt-3 text-xs text-muted-foreground">{t("adhanBy")}</p>
        </div>

        {/* Today's times */}
        <ul className="mb-10 overflow-hidden rounded-[28px] border border-border bg-card shadow-sm">
          {PRAYER_KEYS.map((key) => {
            const isNext = key === p.next.key;
            const isPast = p.today[key] <= p.now && !isNext;
            return (
              <li
                key={key}
                className={`flex items-center justify-between border-b border-border px-6 py-4 last:border-b-0 transition ${
                  isNext ? "bg-primary/10" : ""
                }`}
              >
                <span className={`flex items-center gap-3 text-lg ${isNext ? "font-bold text-primary" : isPast ? "text-muted-foreground" : ""}`}>
                  {key === "sunrise" && <Sunrise size={18} className="text-gold" />}
                  {t(key)}
                </span>
                <span className={`text-xl font-bold tabular-nums ${isNext ? "text-primary" : isPast ? "text-muted-foreground" : ""}`}>
                  {formatTime(p.today[key], p.location.tz, locale)}
                </span>
              </li>
            );
          })}
        </ul>

        {/* Settings */}
        <section className="rounded-[28px] border border-border bg-card p-6 shadow-sm md:p-8">
          <h2 className="mb-6 text-2xl font-bold">{t("prayerSettings")}</h2>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="prayer-city" className="mb-2 block text-sm font-medium text-muted-foreground">
                {t("prayerCity")}
              </label>
              <select
                id="prayer-city"
                className={selectClass}
                value={p.isMyLocation ? "__me" : p.location.city?.id}
                onChange={(e) => e.target.value !== "__me" && p.setCity(e.target.value)}
              >
                {p.isMyLocation && <option value="__me">{t("myLocation")}</option>}
                {CITIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {locale === "ar" ? c.nameAr : c.nameRu}
                  </option>
                ))}
              </select>
              <button
                onClick={p.requestMyLocation}
                disabled={p.locating}
                className="mt-3 flex items-center gap-2 text-sm text-primary transition hover:underline disabled:opacity-50 cursor-pointer"
              >
                <LocateFixed size={16} className={p.locating ? "animate-spin" : ""} />
                {t("useMyLocation")}
              </button>
              {p.locationError && <p className="mt-2 text-sm text-destructive">{t("locationError")}</p>}
            </div>

            <div>
              <label htmlFor="prayer-method" className="mb-2 block text-sm font-medium text-muted-foreground">
                {t("calcMethod")}
              </label>
              <select
                id="prayer-method"
                className={selectClass}
                value={p.method}
                onChange={(e) => p.setMethod(e.target.value as MethodId)}
              >
                {(Object.keys(METHODS) as MethodId[]).map((id) => (
                  <option key={id} value={id}>
                    {METHODS[id][locale]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="prayer-madhab" className="mb-2 block text-sm font-medium text-muted-foreground">
                {t("asrMadhab")}
              </label>
              <select
                id="prayer-madhab"
                className={selectClass}
                value={p.madhab}
                onChange={(e) => p.setMadhab(e.target.value as MadhabId)}
              >
                <option value="shafi">{t("madhabShafi")}</option>
                <option value="hanafi">{t("madhabHanafi")}</option>
              </select>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-border bg-input p-4">
              <input
                id="adhan-auto"
                type="checkbox"
                checked={p.autoAdhan}
                onChange={(e) => p.setAutoAdhan(e.target.checked)}
                className="mt-1 h-5 w-5 cursor-pointer accent-[var(--primary)]"
              />
              <label htmlFor="adhan-auto" className="cursor-pointer">
                <span className="block font-medium">{t("autoAdhan")}</span>
                <span className="mt-1 block text-sm text-muted-foreground">{t("autoAdhanHint")}</span>
              </label>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

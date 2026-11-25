"use client";

import { BellRing, Play, Square, X } from "lucide-react";
import { usePrayer } from "@/context/prayer-context";
import { useLanguage } from "@/context/language-context";

/** Banner shown site-wide when a prayer time begins while the site is open. */
export default function AdhanAlert() {
  const { alertPrayer, dismissAlert, isAdhanPlaying, playAdhan, stopAdhan } = usePrayer();
  const { t } = useLanguage();

  if (!alertPrayer && !isAdhanPlaying) return null;

  return (
    <div className="fixed inset-x-4 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-[60] mx-auto max-w-md md:bottom-4" role="status" aria-live="polite">
      <div className="flex items-center gap-3 rounded-3xl border border-gold/30 bg-card/95 p-4 shadow-xl backdrop-blur-md">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gold/15 text-gold">
          <BellRing size={22} className={isAdhanPlaying ? "animate-pulse" : ""} />
        </span>

        <div className="min-w-0 flex-1">
          <p className="font-bold text-foreground">
            {alertPrayer ? t("prayerTimeNow", { prayer: t(alertPrayer) }) : t("playAdhan")}
          </p>
          <p className="truncate text-xs text-muted-foreground">{t("adhanBy")}</p>
        </div>

        <button
          onClick={isAdhanPlaying ? stopAdhan : playAdhan}
          className="rounded-full bg-primary p-3 text-primary-foreground transition hover:opacity-90 cursor-pointer"
          aria-label={isAdhanPlaying ? t("stopAdhan") : t("playAdhan")}
        >
          {isAdhanPlaying ? <Square size={16} /> : <Play size={16} />}
        </button>

        <button
          onClick={() => {
            stopAdhan();
            dismissAlert();
          }}
          className="rounded-full p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground cursor-pointer"
          aria-label={t("close")}
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}

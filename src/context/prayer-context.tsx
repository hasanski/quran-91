"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useHydrated, useStoredValue } from "@/hooks/use-stored-value";
import { useAudio } from "@/context/audio-context";
import {
  computeDayTimes,
  dayKey,
  findNextPrayer,
  isMethodId,
  prayerJustStarted,
  resolveLocation,
  type DayTimes,
  type MadhabId,
  type MethodId,
  type NextPrayer,
  type PrayerKey,
  type PrayerLocation,
  type ResolvedLocation,
} from "@/lib/prayer-times";

export const ADHAN_SRC = "/audio/adhan.mp4";

type PrayerContextType = {
  mounted: boolean;
  now: Date;
  location: ResolvedLocation;
  isMyLocation: boolean;
  setCity: (id: string) => void;
  requestMyLocation: () => void;
  locating: boolean;
  locationError: boolean;
  method: MethodId;
  setMethod: (m: MethodId) => void;
  madhab: MadhabId;
  setMadhab: (m: MadhabId) => void;
  autoAdhan: boolean;
  setAutoAdhan: (on: boolean) => void;
  today: DayTimes;
  next: NextPrayer;
  isAdhanPlaying: boolean;
  playAdhan: () => void;
  stopAdhan: () => void;
  alertPrayer: PrayerKey | null;
  dismissAlert: () => void;
};

const PrayerContext = createContext<PrayerContextType | null>(null);

export function usePrayer() {
  const ctx = useContext(PrayerContext);
  if (!ctx) throw new Error("usePrayer must be used within a PrayerProvider");
  return ctx;
}

function parseLocation(raw: string | null): PrayerLocation | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PrayerLocation;
  } catch {
    return null;
  }
}

export function PrayerProvider({ children }: { children: React.ReactNode }) {
  const mounted = useHydrated();
  const { pause: pauseQuran } = useAudio();

  const [rawLocation, setRawLocation] = useStoredValue("prayerLocation");
  const [rawMethod, setRawMethod] = useStoredValue("prayerMethod");
  const [rawMadhab, setRawMadhab] = useStoredValue("prayerMadhab");
  const [rawAuto, setRawAuto] = useStoredValue("adhanAuto");

  const savedLocation = useMemo(() => parseLocation(rawLocation), [rawLocation]);
  const browserTz = mounted ? Intl.DateTimeFormat().resolvedOptions().timeZone : undefined;
  const location = useMemo(() => resolveLocation(savedLocation, browserTz), [savedLocation, browserTz]);
  const method: MethodId = isMethodId(rawMethod) ? rawMethod : "mwl";
  const madhab: MadhabId = rawMadhab === "hanafi" ? "hanafi" : "shafi";
  const autoAdhan = rawAuto === "true";

  const [now, setNow] = useState(() => new Date());
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState(false);
  const [isAdhanPlaying, setIsAdhanPlaying] = useState(false);
  const [alertPrayer, setAlertPrayer] = useState<PrayerKey | null>(null);
  const adhanRef = useRef<HTMLAudioElement>(null);

  const day = dayKey(now, location.tz);
  const { today, tomorrow } = useMemo(
    () => ({
      today: computeDayTimes(now, location, method, madhab, 0),
      tomorrow: computeDayTimes(now, location, method, madhab, 1),
    }),
    // Recompute only when the local day or settings change, not every second
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [day, location, method, madhab]
  );
  const next = findNextPrayer(now, today, tomorrow);

  const playAdhan = useCallback(() => {
    const audio = adhanRef.current;
    if (!audio) return;
    pauseQuran();
    audio.currentTime = 0;
    audio.play().catch((err) => console.warn("Adhan playback blocked:", err));
  }, [pauseQuran]);

  const stopAdhan = useCallback(() => {
    const audio = adhanRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
  }, []);

  // Latest values for the clock callback (avoids restarting the interval)
  const latest = useRef({ today, location, autoAdhan, playAdhan });
  useEffect(() => {
    latest.current = { today, location, autoAdhan, playAdhan };
  });

  // 1-second clock; also fires the adhan when a prayer time begins
  const announced = useRef<string | null>(null);
  useEffect(() => {
    const id = window.setInterval(() => {
      const current = new Date();
      setNow(current);

      const { today: t, location: loc, autoAdhan: auto, playAdhan: play } = latest.current;
      const started = prayerJustStarted(current, t);
      if (!started) return;
      const key = `${dayKey(current, loc.tz)}:${started}`;
      if (announced.current === key) return;
      announced.current = key;
      setAlertPrayer(started);
      if (auto) play();
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const setCity = useCallback(
    (id: string) => {
      setLocationError(false);
      setRawLocation(JSON.stringify({ kind: "city", id } satisfies PrayerLocation));
    },
    [setRawLocation]
  );

  const requestMyLocation = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setLocationError(true);
      return;
    }
    setLocating(true);
    setLocationError(false);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc: PrayerLocation = {
          kind: "coords",
          lat: Number(pos.coords.latitude.toFixed(4)),
          lng: Number(pos.coords.longitude.toFixed(4)),
          tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
        };
        setRawLocation(JSON.stringify(loc));
        setLocating(false);
      },
      () => {
        setLocationError(true);
        setLocating(false);
      },
      { timeout: 15000, maximumAge: 24 * 60 * 60 * 1000 }
    );
  }, [setRawLocation]);

  const value: PrayerContextType = {
    mounted,
    now,
    location,
    isMyLocation: savedLocation?.kind === "coords",
    setCity,
    requestMyLocation,
    locating,
    locationError,
    method,
    setMethod: (m) => setRawMethod(m),
    madhab,
    setMadhab: (m) => setRawMadhab(m),
    autoAdhan,
    setAutoAdhan: (on) => setRawAuto(String(on)),
    today,
    next,
    isAdhanPlaying,
    playAdhan,
    stopAdhan,
    alertPrayer,
    dismissAlert: () => setAlertPrayer(null),
  };

  return (
    <PrayerContext.Provider value={value}>
      {children}
      <audio
        ref={adhanRef}
        src={ADHAN_SRC}
        preload="none"
        playsInline
        onPlay={() => setIsAdhanPlaying(true)}
        onPause={() => setIsAdhanPlaying(false)}
        onEnded={() => setIsAdhanPlaying(false)}
      />
    </PrayerContext.Provider>
  );
}

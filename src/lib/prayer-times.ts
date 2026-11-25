import {
  CalculationMethod,
  CalculationParameters,
  Coordinates,
  HighLatitudeRule,
  Madhab,
  PrayerTimes,
} from "adhan";
import type { Locale } from "@/context/language-context";

export type PrayerKey = "fajr" | "sunrise" | "dhuhr" | "asr" | "maghrib" | "isha";

export const PRAYER_KEYS: PrayerKey[] = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"];

/** Prayers that have an adhan (everything except sunrise). */
export const ADHAN_PRAYERS: PrayerKey[] = ["fajr", "dhuhr", "asr", "maghrib", "isha"];

export type City = {
  id: string;
  nameAr: string;
  nameRu: string;
  lat: number;
  lng: number;
  tz: string;
};

export const CITIES: City[] = [
  { id: "grozny", nameAr: "غروزني", nameRu: "Грозный", lat: 43.3178, lng: 45.6949, tz: "Europe/Moscow" },
  { id: "makhachkala", nameAr: "محج قلعة", nameRu: "Махачкала", lat: 42.9849, lng: 47.5047, tz: "Europe/Moscow" },
  { id: "nazran", nameAr: "نازران", nameRu: "Назрань", lat: 43.2257, lng: 44.7645, tz: "Europe/Moscow" },
  { id: "nalchik", nameAr: "نالتشيك", nameRu: "Нальчик", lat: 43.4853, lng: 43.6071, tz: "Europe/Moscow" },
  { id: "vladikavkaz", nameAr: "فلاديقوقاز", nameRu: "Владикавказ", lat: 43.0205, lng: 44.6819, tz: "Europe/Moscow" },
  { id: "cherkessk", nameAr: "تشيركيسك", nameRu: "Черкесск", lat: 44.2233, lng: 42.0578, tz: "Europe/Moscow" },
  { id: "maykop", nameAr: "مايكوب", nameRu: "Майкоп", lat: 44.6098, lng: 40.1006, tz: "Europe/Moscow" },
  { id: "moscow", nameAr: "موسكو", nameRu: "Москва", lat: 55.7558, lng: 37.6173, tz: "Europe/Moscow" },
  { id: "amman", nameAr: "عمّان", nameRu: "Амман", lat: 31.9539, lng: 35.9106, tz: "Asia/Amman" },
  { id: "zarqa", nameAr: "الزرقاء", nameRu: "Зарка", lat: 32.0728, lng: 36.088, tz: "Asia/Amman" },
  { id: "istanbul", nameAr: "إسطنبول", nameRu: "Стамбул", lat: 41.0082, lng: 28.9784, tz: "Europe/Istanbul" },
  { id: "baku", nameAr: "باكو", nameRu: "Баку", lat: 40.4093, lng: 49.8671, tz: "Asia/Baku" },
  { id: "makkah", nameAr: "مكة المكرمة", nameRu: "Мекка", lat: 21.4225, lng: 39.8262, tz: "Asia/Riyadh" },
  { id: "madinah", nameAr: "المدينة المنورة", nameRu: "Медина", lat: 24.4672, lng: 39.6111, tz: "Asia/Riyadh" },
];

export type PrayerLocation =
  | { kind: "city"; id: string }
  | { kind: "coords"; lat: number; lng: number; tz: string };

export type ResolvedLocation = { lat: number; lng: number; tz: string; city?: City };

export const METHODS = {
  mwl: { ar: "رابطة العالم الإسلامي", ru: "Всемирная исламская лига", make: CalculationMethod.MuslimWorldLeague },
  egyptian: { ar: "الهيئة المصرية العامة للمساحة", ru: "Египетское управление геодезии", make: CalculationMethod.Egyptian },
  karachi: { ar: "جامعة العلوم الإسلامية، كراتشي", ru: "Университет исламских наук, Карачи", make: CalculationMethod.Karachi },
  ummalqura: { ar: "أم القرى، مكة المكرمة", ru: "Умм аль-Кура, Мекка", make: CalculationMethod.UmmAlQura },
  turkey: { ar: "رئاسة الشؤون الدينية التركية", ru: "Диянет, Турция", make: CalculationMethod.Turkey },
  moonsighting: { ar: "لجنة رؤية الهلال", ru: "Комитет по наблюдению луны", make: CalculationMethod.MoonsightingCommittee },
} as const;

export type MethodId = keyof typeof METHODS;
export type MadhabId = "shafi" | "hanafi";

export function isMethodId(v: string | null): v is MethodId {
  return v !== null && v in METHODS;
}

export function resolveLocation(loc: PrayerLocation | null, fallbackTz?: string): ResolvedLocation {
  if (loc?.kind === "coords") return { lat: loc.lat, lng: loc.lng, tz: loc.tz };
  const city =
    (loc?.kind === "city" && CITIES.find((c) => c.id === loc.id)) ||
    // No choice yet: first city in the visitor's own time zone, else Grozny
    (fallbackTz && CITIES.find((c) => c.tz === fallbackTz)) ||
    CITIES[0];
  return { lat: city.lat, lng: city.lng, tz: city.tz, city };
}

/** Calendar date (y/m/d) of `date` as seen in time zone `tz`. */
function ymdInTz(date: Date, tz: string): [number, number, number] {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  return [get("year"), get("month"), get("day")];
}

export function dayKey(date: Date, tz: string): string {
  return ymdInTz(date, tz).join("-");
}

export type DayTimes = Record<PrayerKey, Date>;

/** Prayer times for the local day (in the location's time zone) that is `dayOffset` days from `now`. */
export function computeDayTimes(
  now: Date,
  loc: ResolvedLocation,
  method: MethodId,
  madhab: MadhabId,
  dayOffset = 0
): DayTimes {
  const [y, m, d] = ymdInTz(now, loc.tz);
  // adhan reads the calendar date from local Y/M/D fields only
  const date = new Date(y, m - 1, d + dayOffset);
  const coords = new Coordinates(loc.lat, loc.lng);
  const params: CalculationParameters = METHODS[method].make();
  params.madhab = madhab === "hanafi" ? Madhab.Hanafi : Madhab.Shafi;
  params.highLatitudeRule = HighLatitudeRule.recommended(coords);
  const pt = new PrayerTimes(coords, date, params);
  return {
    fajr: pt.fajr,
    sunrise: pt.sunrise,
    dhuhr: pt.dhuhr,
    asr: pt.asr,
    maghrib: pt.maghrib,
    isha: pt.isha,
  };
}

export type NextPrayer = { key: PrayerKey; time: Date };

export function findNextPrayer(now: Date, today: DayTimes, tomorrow: DayTimes): NextPrayer {
  for (const key of PRAYER_KEYS) {
    if (today[key] > now) return { key, time: today[key] };
  }
  return { key: "fajr", time: tomorrow.fajr };
}

/** The adhan prayer whose time began within the last `windowMs`, if any. */
export function prayerJustStarted(now: Date, today: DayTimes, windowMs = 60_000): PrayerKey | null {
  for (const key of ADHAN_PRAYERS) {
    const diff = now.getTime() - today[key].getTime();
    if (diff >= 0 && diff < windowMs) return key;
  }
  return null;
}

const intlLocale = (locale: Locale) => (locale === "ar" ? "ar-u-nu-latn" : "ru-RU");

export function formatTime(date: Date, tz: string, locale: Locale): string {
  return new Intl.DateTimeFormat(intlLocale(locale), {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

export function formatCountdown(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

export function formatDates(date: Date, tz: string, locale: Locale): { gregorian: string; hijri: string } {
  const base = locale === "ar" ? "ar" : "ru-RU";
  const gregorian = new Intl.DateTimeFormat(`${base}-u-nu-latn`, {
    timeZone: tz,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
  let hijri = "";
  try {
    hijri = new Intl.DateTimeFormat(`${base}-u-ca-islamic-umalqura-nu-latn`, {
      timeZone: tz,
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  } catch {}
  return { gregorian, hijri };
}

"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Locale = "ar" | "ru";

const translations = {
  ar: {
    home: "الرئيسية",
    surahs: "السور",
    search: "البحث",
    startReading: "ابدأ القراءة",
    modernPlatform: "منصة قرآن حديثة",
    readHolyQuran: "اقرأ القرآن الكريم",
    modernExperience: "بتجربة حديثة ومريحة",
    heroDesc: "واجهة أنيقة لقراءة القرآن، البحث السريع، والتنقل بين السور بسهولة وراحة.",
    browseSurahs: "تصفح السور",
    quickSearch: "بحث سريع",
    surahsCount: "عدد السور",
    versesCountLabel: "عدد الآيات",
    fastLabel: "سريع ⚡",
    fastDesc: "تجربة أداء عالية",
    resumeReading: "استكمل القراءة",
    resumeReadingDetails: "سورة {name} - الآية {number}",
    resumeReadingButton: "متابعة القراءة",
    featuredSurahs: "سور مميزة",
    featuredDesc: "ابدأ بقراءة أشهر السور",
    viewAllSurahs: "عرض جميع السور",
    lastRead: "آخر قراءة",
    secondsAgo: "منذ لحظات",
    minutesAgo: "منذ {count} دقائق",
    oneMinuteAgo: "منذ دقيقة",
    hoursAgo: "منذ {count} ساعات",
    oneHourAgo: "منذ ساعة",
    daysAgo: "منذ {count} أيام",
    oneDayAgo: "منذ يوم",
    weeksAgo: "منذ {count} أسابيع",
    oneWeekAgo: "منذ أسبوع",
    surahNumber: "سورة رقم {id}",
    versesCountText: "{count} آيات",
    readSurah: "قراءة السورة",
    surahDesc: "قراءة مريحة وحديثة للسورة مع تصميم أنيق يركز على النص القرآني.",
    readingTools: "أدوات القراءة",
    readingToolsDesc: "تحكم في طريقة عرض السورة بسهولة",
    stop: "إيقاف",
    listen: "استماع",
    share: "مشاركة",
    clearPosition: "مسح الموضع",
    linkCopied: "تم نسخ رابط الصفحة",
    positionCleared: "تم مسح موضع القراءة المحفوظ",
    listenToVerse: "استماع لهذه الآية",
    copy: "نسخ",
    copied: "تم النسخ",
    surahNotFound: "السورة غير موجودة",
    surahNotFoundDesc: "لم نجد بيانات لهذه السورة حاليًا.",
    surahList: "قائمة السور",
    searchSurahDesc: "ابحث عن السورة التي تريدها واقرأها بتجربة حديثة ومريحة.",
    searchPlaceholder: "ابحث باسم السورة...",
    searchResults: "عدد النتائج: {count}",
    noResults: "لا توجد نتائج",
    noResultsDesc: "جرّب كتابة اسم سورة بشكل مختلف.",
    searchSurah: "ابحث عن سورة",
    searchMainDesc: "اكتب اسم السورة، رقمها، أو نوعها للوصول السريع.",
    searchPlaceholderMain: "مثال: البقرة أو 2 أو مكية",
    searchDirectly: "اكتب للبحث بشكل مباشر",
    searchNotFoundDesc: "حاول البحث باسم آخر أو رقم سورة مختلف.",
    footerDesc: "تجربة حديثة ومريحة لقراءة القرآن الكريم بتصميم نظيف وسريع.",
    links: "روابط",
    ourGoal: "الهدف",
    goalDesc: "تقديم تجربة قراءة هادئة ومريحة للقرآن الكريم بتصميم عصري.",
    listenQuran: "الاستماع للقرآن",
    verseNumberLabel: "الآية {num}",
    playbackError: "حدث خطأ أثناء تشغيل الصوت",
    meccan: "مكية",
    medinan: "مدنية",
    arabic: "العربية",
    russian: "Русский",
    reciter: "القارئ",
    selectReciter: "اختر القارئ"
  },
  ru: {
    home: "Главная",
    surahs: "Суры",
    search: "Поиск",
    startReading: "Начать чтение",
    modernPlatform: "Современная платформа Корана",
    readHolyQuran: "Читайте Священный Коран",
    modernExperience: "с современным интерфейсом",
    heroDesc: "Элегантный интерфейс для чтения Корана, быстрого поиска и удобной навигации между сурами.",
    browseSurahs: "Просмотр сур",
    quickSearch: "Быстрый поиск",
    surahsCount: "Количество сур",
    versesCountLabel: "Количество аятов",
    fastLabel: "Быстро ⚡",
    fastDesc: "Высокая производительность",
    resumeReading: "Продолжить чтение",
    resumeReadingDetails: "Сура {name} - Аят {number}",
    resumeReadingButton: "Продолжить чтение",
    featuredSurahs: "Популярные суры",
    featuredDesc: "Начните с чтения самых популярных сур",
    viewAllSurahs: "Показать все суры",
    lastRead: "Последнее чтение",
    secondsAgo: "несколько секунд назад",
    minutesAgo: "{count} мин. назад",
    oneMinuteAgo: "минуту назад",
    hoursAgo: "{count} ч. назад",
    oneHourAgo: "час назад",
    daysAgo: "{count} дн. назад",
    oneDayAgo: "день назад",
    weeksAgo: "{count} нед. назад",
    oneWeekAgo: "неделю назад",
    surahNumber: "Сура №{id}",
    versesCountText: "Аятов: {count}",
    readSurah: "Читать суру",
    surahDesc: "Удобное и современное чтение суры с элегантным дизайном, ориентированным на текст Корана.",
    readingTools: "Инструменты чтения",
    readingToolsDesc: "Управляйте отображением суры с легкостью",
    stop: "Стоп",
    listen: "Слушать",
    share: "Поделиться",
    clearPosition: "Сбросить позицию",
    linkCopied: "Ссылка на страницу скопирована",
    positionCleared: "Сохраненная позиция чтения очищена",
    listenToVerse: "Слушать этот аят",
    copy: "Копировать",
    copied: "Скопировано",
    surahNotFound: "Сура не найдена",
    surahNotFoundDesc: "Мы не смогли найти данные для этой суры.",
    surahList: "Список сур",
    searchSurahDesc: "Найдите нужную суру и читайте ее с современным и удобным интерфейсом.",
    searchPlaceholder: "Поиск по названию суры...",
    searchResults: "Количество результатов: {count}",
    noResults: "Нет результатов",
    noResultsDesc: "Попробуйте ввести название суры по-другому.",
    searchSurah: "Найти суру",
    searchMainDesc: "Введите название, номер или тип суры для быстрого доступа.",
    searchPlaceholderMain: "Пример: Аль-Бакара, 2 или Мекканская",
    searchDirectly: "Печатайте для мгновенного поиска",
    searchNotFoundDesc: "Попробуйте ввести другое имя или номер суры.",
    footerDesc: "Современный и удобный интерфейс для чтения Священного Корана с чистым и быстрым дизайном.",
    links: "Ссылки",
    ourGoal: "Цель",
    goalDesc: "Предоставление спокойного и комфортного чтения Священного Корана в современном оформлении.",
    listenQuran: "Прослушивание Корана",
    verseNumberLabel: "Аят {num}",
    playbackError: "Произошла ошибка при воспроизведении аудио",
    meccan: "Мекканская",
    medinan: "Мединская",
    arabic: "العربية",
    russian: "Русский",
    reciter: "Чтец",
    selectReciter: "Выбрать чтеца"
  }
};

type TranslationKey = keyof typeof translations.ar;

const surahNamesRu: Record<number, string> = {
  1: "Аль-Фатиха",
  2: "Аль-Бакара",
  3: "Аль-Имран",
  4: "Ан-Ниса",
  5: "Аль-Маида",
  6: "Аль-Анам",
  7: "Аль-Араф",
  8: "Аль-Анфаль",
  9: "Ат-Тауба",
  10: "Йонус"
};

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey, replacements?: Record<string, string | number>) => string;
  translateSurahName: (id: number, nameAr: string) => string;
  translateSurahType: (typeAr: "مكية" | "مدنية") => string;
  mounted: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("ar");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLocale = localStorage.getItem("locale") as Locale | null;
    const initialLocale = savedLocale || "ar";
    setLocaleState(initialLocale);
    
    document.documentElement.lang = initialLocale;
    document.documentElement.dir = initialLocale === "ar" ? "rtl" : "ltr";
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("locale", newLocale);
    document.documentElement.lang = newLocale;
    document.documentElement.dir = newLocale === "ar" ? "rtl" : "ltr";
  };

  const t = (key: TranslationKey, replacements?: Record<string, string | number>) => {
    let text = translations[locale]?.[key] || translations["ar"][key] || "";
    if (replacements) {
      Object.entries(replacements).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, v.toString());
      });
    }
    return text;
  };

  const translateSurahName = (id: number, nameAr: string) => {
    return locale === "ru" && surahNamesRu[id] ? surahNamesRu[id] : nameAr;
  };

  const translateSurahType = (typeAr: "مكية" | "مدنية") => {
    if (locale === "ru") {
      return typeAr === "مكية" ? "Мекканская" : "Мединская";
    }
    return typeAr;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, translateSurahName, translateSurahType, mounted }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

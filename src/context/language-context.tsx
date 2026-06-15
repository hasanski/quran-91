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
    selectReciter: "اختر القارئ",
    mushafMode: "وضع المصحف",
    verseMode: "تجزئة الآيات",
    mushafModeDesc: "عرض نص السورة بشكل متصل ومستمر كصفحات المصحف الشريف",
    hoverToSeeTranslation: "مرر الفأرة فوق الآية لعرض الترجمة أو اضغط لتشغيل الصوت",
    bismillah: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"
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
    selectReciter: "Выбрать чтеца",
    mushafMode: "Режим Мусхафа",
    verseMode: "Поаятный режим",
    mushafModeDesc: "Отображение суры в виде сплошного текста, как в книге Корана",
    hoverToSeeTranslation: "Наведите на аят для перевода или нажмите для аудио",
    bismillah: "Во имя Аллаха, Милостивого, Милосердного"
  }
};

type TranslationKey = keyof typeof translations.ar;

const surahNamesRu: Record<number, string> = {
  1: "Аль-Фатиха",
  2: "Аль-Бакара",
  3: "Аль ‘Имран",
  4: "Ан-Ниса",
  5: "Аль-Маида",
  6: "Аль-Ан‘ам",
  7: "Аль-А‘раф",
  8: "Аль-Анфаль",
  9: "Ат-Тауба",
  10: "Юнус",
  11: "Худ",
  12: "Юсуф",
  13: "Ар-Ра‘д",
  14: "Ибрахим",
  15: "Аль-Хиджр",
  16: "Ан-Нахль",
  17: "Аль-Исра",
  18: "Аль-Кахф",
  19: "Марьям",
  20: "Та Ха",
  21: "Аль-Анбия",
  22: "Аль-Хадж",
  23: "Аль-Муминун",
  24: "Ан-Нур",
  25: "Аль-Фуркан",
  26: "Аш-Шу‘ара",
  27: "Ан-Намль",
  28: "Аль-Касас",
  29: "Аль-‘Анкабут",
  30: "Ар-Рум",
  31: "Лукман",
  32: "Ас-Саджда",
  33: "Аль-Ахзаб",
  34: "Саба",
  35: "Фатир",
  36: "Йа Син",
  37: "Ас-Саффат",
  38: "Сад",
  39: "Аз-Зумар",
  40: "Гафир",
  41: "Фуссилят",
  42: "Аш-Шура",
  43: "Аз-Зухруф",
  44: "Ад-Духан",
  45: "Аль-Джасия",
  46: "Аль-Ахкаф",
  47: "Мухаммад",
  48: "Аль-Фатх",
  49: "Аль-Худжурат",
  50: "Каф",
  51: "Аз-Зарийат",
  52: "Ат-Тур",
  53: "Ан-Наджм",
  54: "Аль-Камар",
  55: "Ар-Рахман",
  56: "Аль-Ваки‘а",
  57: "Аль-Хадид",
  58: "Аль-Муджадаля",
  59: "Аль-Хашр",
  60: "Аль-Мумтахана",
  61: "Ас-Сафф",
  62: "Аль-Джуму‘а",
  63: "Аль-Мунафикун",
  64: "Ат-Тагабун",
  65: "Ат-Таляк",
  66: "Ат-Тахрим",
  67: "Аль-Мульк",
  68: "Аль-Калям",
  69: "Аль-Хакка",
  70: "Аль-Ма‘аридж",
  71: "Нух",
  72: "Аль-Джинн",
  73: "Аль-Муззаммиль",
  74: "Аль-Муддассир",
  75: "Аль-Кийама",
  76: "Аль-Инсан",
  77: "Аль-Мурсалят",
  78: "Ан-Наба",
  79: "Ан-Нази‘ат",
  80: "‘Абаса",
  81: "Ат-Таквир",
  82: "Аль-Инфитар",
  83: "Аль-Мутаффифин",
  84: "Аль-Иншикак",
  85: "Аль-Бурудж",
  86: "Ат-Тарик",
  87: "Аль-А‘ля",
  88: "Аль-Гашия",
  89: "Аль-Фаджр",
  90: "Аль-Баляд",
  91: "Аш-Шамс",
  92: "Аль-Ляйль",
  93: "Ад-Духа",
  94: "Аш-Шарх",
  95: "Ат-Тин",
  96: "Аль-‘Аляк",
  97: "Аль-Кадр",
  98: "Аль-Баййина",
  99: "Аз-Зальзаля",
  100: "Аль-‘Адийат",
  101: "Аль-Кариа",
  102: "Ат-Такасур",
  103: "Аль-‘Аср",
  104: "Аль-Хумаза",
  105: "Аль-Филь",
  106: "Курайш",
  107: "Аль-Ма‘ун",
  108: "Аль-Каусар",
  109: "Аль-Кафирун",
  110: "Ан-Наср",
  111: "Аль-Масад",
  112: "Аль-Ихляс",
  113: "Аль-Фаляк",
  114: "Ан-Нас"
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

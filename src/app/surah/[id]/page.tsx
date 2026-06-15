"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import VerseCard from "@/components/surah/verse-card";
import ReadingToolbar from "@/components/surah/reading-toolbar";
import AudioPlayer from "@/components/audio/audio-player";
import { useParams } from "next/navigation";
import { surahs } from "@/data/surahs";
import { useReading } from "@/context/reading-context";
import { useLanguage } from "@/context/language-context";
import { useAudio } from "@/context/audio-context";

const fontSizes = ["text-2xl md:text-3xl", "text-3xl md:text-4xl", "text-4xl md:text-5xl"];

type SurahDetails = {
    id: number;
    name: string;
    type: "مكية" | "مدنية";
    versesCount: number;
    verses: string[];
    versesTranslations?: {
        ru: string[];
    };
};

export default function SurahDetailsPage() {
    const params = useParams<{ id: string }>();
    const [fontIndex, setFontIndex] = useState(0);
    const { savePosition } = useReading();
    const { t, translateSurahName, translateSurahType, locale } = useLanguage();
    const { state: audioState, playVerse } = useAudio();
    
    const [surah, setSurah] = useState<SurahDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isMushafMode, setIsMushafMode] = useState(false);
    const [hoveredVerse, setHoveredVerse] = useState<number | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem("isMushafMode");
        if (saved !== null) {
            setIsMushafMode(saved === "true");
        }
    }, []);

    const handleToggleMushafMode = () => {
        setIsMushafMode((prev) => {
            const next = !prev;
            localStorage.setItem("isMushafMode", String(next));
            return next;
        });
    };

    const surahId = parseInt(params.id);
    const meta = useMemo(() => surahs.find(s => s.id === surahId), [surahId]);

    useEffect(() => {
        if (!meta) {
            setError(locale === "ar" ? "السورة غير موجودة" : "Сура не найдена");
            setLoading(false);
            return;
        }

        let isMounted = true;
        setLoading(true);
        setError(null);

        // Fetching verses and translations from the Quran.com API (Kuliev translation is ID 45)
        fetch(`https://api.quran.com/api/v4/verses/by_chapter/${surahId}?language=ru&words=false&translations=45&fields=text_uthmani&per_page=300`)
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch surah data");
                return res.json();
            })
            .then((data) => {
                if (!isMounted) return;

                const verses = data.verses.map((v: any) => v.text_uthmani);
                const ruTranslations = data.verses.map((v: any) => v.translations?.[0]?.text || "");

                setSurah({
                    id: meta.id,
                    name: meta.name,
                    type: meta.type,
                    versesCount: meta.verses,
                    verses,
                    versesTranslations: {
                        ru: ruTranslations
                    }
                });
                setLoading(false);
            })
            .catch((err) => {
                if (!isMounted) return;
                console.error(err);
                setError(
                    locale === "ar"
                        ? "حدث خطأ أثناء تحميل السورة. يرجى التحقق من اتصالك بالإنترنت والمحاولة مجدداً."
                        : "Произошла ошибка при загрузке суры. Пожалуйста, проверьте интернет-соединение и попробуйте снова."
                );
                setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [surahId, meta, locale]);

    useEffect(() => {
        if (!surah) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const verseNumber = parseInt(entry.target.id.replace("verse-", ""));
                        savePosition(surah.id, surah.name, verseNumber);
                    }
                });
            },
            { threshold: 0.5 }
        );

        const verseElements = document.querySelectorAll('[id^="verse-"]');
        verseElements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, [surah, savePosition]);

    useEffect(() => {
        if (surah) {
            const localizedName = translateSurahName(surah.id, surah.name);
            const titlePrefix = locale === "ar" ? `سورة ${surah.name}` : `Сура ${localizedName}`;
            document.title = `${titlePrefix} - القرآن الكريم`;
        } else {
            document.title = "القرآن الكريم";
        }
        return () => {
            document.title = "القرآن الكريم";
        };
    }, [surah, locale, translateSurahName]);

    useEffect(() => {
        const hash = window.location.hash;
        if (hash) {
            const verseId = hash.replace("#", "");
            const element = document.getElementById(verseId);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: "smooth", block: "center" });
                    element.classList.add("ring-2", "ring-primary", "ring-offset-2", "ring-offset-background", "rounded-[28px]");
                    setTimeout(() => {
                        element.classList.remove("ring-2", "ring-primary", "ring-offset-2", "ring-offset-background", "rounded-[28px]");
                    }, 3000);
                }, 500);
            }
        }
    }, []);

    // Auto-scroll to active verse in Mushaf Mode
    useEffect(() => {
        if (isMushafMode && audioState.isPlaying && audioState.currentVerse) {
            const activeElement = document.getElementById(`verse-${audioState.currentVerse}`);
            if (activeElement) {
                activeElement.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }
    }, [isMushafMode, audioState.isPlaying, audioState.currentVerse]);

    function handleIncreaseFont() {
        setFontIndex((prev) => Math.min(prev + 1, fontSizes.length - 1));
    }

    function handleDecreaseFont() {
        setFontIndex((prev) => Math.max(prev - 1, 0));
    }

    if (loading) {
        return (
            <main className="min-h-screen bg-background text-foreground">
                <section className="mx-auto max-w-5xl px-6 py-16">
                    {/* Header Skeleton */}
                    <div className="mb-10 rounded-[32px] border border-border bg-card/50 p-8 backdrop-blur-sm animate-pulse">
                        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                            <div className="space-y-3">
                                <div className="h-7 w-28 rounded-full bg-muted" />
                                <div className="h-10 w-48 rounded-lg bg-muted" />
                            </div>
                            <div className="flex gap-3">
                                <div className="h-9 w-20 rounded-full bg-muted" />
                                <div className="h-9 w-20 rounded-full bg-muted" />
                            </div>
                        </div>
                        <div className="h-6 w-3/4 rounded-lg bg-muted mt-6" />
                    </div>

                    {/* Toolbar Skeleton */}
                    <div className="mb-8 flex h-14 w-full rounded-[20px] bg-card/50 border border-border animate-pulse" />

                    {/* Verses Skeleton */}
                    <div className="space-y-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="rounded-[28px] border border-border bg-card p-6 shadow-sm animate-pulse">
                                <div className="mb-4 flex items-center justify-between">
                                    <div className="h-10 w-10 rounded-2xl bg-muted" />
                                    <div className="flex gap-2">
                                        <div className="h-8 w-12 rounded-xl bg-muted" />
                                        <div className="h-8 w-16 rounded-xl bg-muted" />
                                    </div>
                                </div>
                                <div className="h-10 w-3/4 rounded-lg bg-muted mb-4 ml-auto" />
                                <div className="h-6 w-2/3 rounded-lg bg-muted mt-4" />
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        );
    }

    if (error || !surah) {
        return (
            <main className="min-h-screen bg-background px-6 py-20 text-foreground">
                <div className="mx-auto max-w-3xl text-center">
                    <h1 className="mb-4 text-4xl font-bold text-destructive">
                        {locale === "ar" ? "حدث خطأ" : "Ошибка"}
                    </h1>
                    <p className="text-muted-foreground mb-8">
                        {error || t("surahNotFoundDesc")}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="rounded-2xl bg-primary px-6 py-3 font-medium text-primary-foreground hover:opacity-90 transition cursor-pointer"
                    >
                        {locale === "ar" ? "إعادة المحاولة" : "Повторить попытку"}
                    </button>
                </div>
            </main>
        );
    }

    const localizedSurahName = translateSurahName(surah.id, surah.name);

    return (
        <main className="min-h-screen bg-background text-foreground">
            <section className="mx-auto max-w-5xl px-6 py-16">
                <div className="mb-10 rounded-[32px] border border-border bg-card/50 p-8 backdrop-blur-sm">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <span className="mb-3 inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-sm text-primary">
                                {t("surahNumber", { id: surah.id })}
                            </span>

                            <h1 className="mt-2 text-4xl font-bold md:text-5xl">
                                {locale === "ar" ? `سورة ${surah.name}` : `Сура ${localizedSurahName}`}
                            </h1>
                        </div>

                        <div className="flex gap-3">
                            <span className="rounded-full border border-border bg-muted px-4 py-2 text-sm text-muted-foreground">
                                {translateSurahType(surah.type)}
                            </span>
                            <span className="rounded-full border border-border bg-muted px-4 py-2 text-sm text-muted-foreground">
                                {t("versesCountText", { count: surah.versesCount })}
                            </span>
                        </div>
                    </div>

                    <p className="text-lg leading-8 text-muted-foreground">
                        {t("surahDesc")}
                    </p>
                </div>

                <ReadingToolbar
                    onIncreaseFont={handleIncreaseFont}
                    onDecreaseFont={handleDecreaseFont}
                    surahId={surah.id}
                    versesCount={surah.versesCount}
                    isMushafMode={isMushafMode}
                    onToggleMushafMode={handleToggleMushafMode}
                />

                <AudioPlayer />

                {isMushafMode ? (
                    <div className="relative rounded-[32px] border-4 border-amber-600/30 bg-[#FAF6EE] dark:bg-[#151D2A] p-8 md:p-12 shadow-inner text-justify transition-all duration-300">
                        {/* Decorative corner borders */}
                        <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-amber-600/40 rounded-tl-md" />
                        <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-amber-600/40 rounded-tr-md" />
                        <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-amber-600/40 rounded-bl-md" />
                        <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-amber-600/40 rounded-br-md" />

                        {/* Bismillah Calligraphy (except for Surah 9 (Al-Tawbah) and Surah 1 (Al-Fatihah, which already contains Bismillah in verse 1)) */}
                        {surah.id !== 9 && surah.id !== 1 && (
                            <div className="quran-text mb-10 text-center font-serif text-3xl md:text-4xl text-amber-900/95 dark:text-amber-500/95 border-b border-amber-600/10 pb-6 select-none">
                                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                            </div>
                        )}

                        {/* Continuous verses */}
                        <div className="quran-text text-right tracking-wide leading-[2.6] text-amber-950 dark:text-amber-100/90" dir="rtl">
                            {surah.verses.map((verse, index) => {
                                const verseNumber = index + 1;
                                const isPlaying = audioState.currentVerse === verseNumber && audioState.surahId === surah.id && audioState.isPlaying;
                                const isHovered = hoveredVerse === verseNumber;

                                return (
                                    <span
                                        key={index}
                                        id={`verse-${verseNumber}`}
                                        onClick={() => playVerse(verseNumber, surah.id, surah.versesCount)}
                                        onMouseEnter={() => setHoveredVerse(verseNumber)}
                                        onMouseLeave={() => setHoveredVerse(null)}
                                        className={`inline cursor-pointer px-1 py-0.5 rounded transition-all duration-200 ${fontSizes[fontIndex]} ${
                                            isPlaying
                                                ? "bg-primary/20 text-primary font-semibold shadow-sm border-b-2 border-primary"
                                                : isHovered
                                                ? "bg-primary/10 text-primary"
                                                : "hover:bg-primary/5 hover:text-primary"
                                        }`}
                                    >
                                        {verse}
                                        {/* Custom Ayah Separator SVG */}
                                        <span className="inline-flex relative mx-2 text-primary font-bold text-xs align-middle select-none w-8 h-8 items-center justify-center">
                                            <svg className="w-8 h-8 text-amber-600/40 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="1.5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                            </svg>
                                            <span className="absolute inset-0 flex items-center justify-center text-[10px] text-amber-900 dark:text-amber-100 font-bold">
                                                {verseNumber}
                                            </span>
                                        </span>
                                    </span>
                                );
                            })}
                        </div>

                        {/* Floating translation footer for clean UX */}
                        <div className="mt-8 border-t border-amber-600/10 pt-6">
                            <div className="rounded-2xl bg-amber-600/5 dark:bg-amber-600/10 p-4 border border-amber-600/10">
                                <p className="text-xs font-semibold text-amber-700 dark:text-amber-500 mb-1">
                                    {t("hoverToSeeTranslation")}
                                </p>
                                <p className="text-sm md:text-base text-muted-foreground italic leading-relaxed min-h-[3rem]">
                                    {hoveredVerse !== null
                                        ? `[${hoveredVerse}]: ${surah.versesTranslations?.ru?.[hoveredVerse - 1] || "..."}`
                                        : audioState.isPlaying && audioState.currentVerse
                                        ? `[${audioState.currentVerse}]: ${surah.versesTranslations?.ru?.[audioState.currentVerse - 1] || "..."}`
                                        : "..."}
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {surah.verses.map((verse, index) => (
                            <VerseCard
                                key={index}
                                id={`verse-${index + 1}`}
                                verseNumber={index + 1}
                                verseText={verse}
                                verseTranslation={surah.versesTranslations?.ru?.[index]}
                                fontSizeClass={fontSizes[fontIndex]}
                                surahId={surah.id}
                                versesCount={surah.versesCount}
                            />
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}
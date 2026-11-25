"use client";

import { useState, useEffect } from "react";
import VerseCard from "@/components/surah/verse-card";
import ReadingToolbar from "@/components/surah/reading-toolbar";
import AudioPlayer from "@/components/audio/audio-player";
import { useReading } from "@/context/reading-context";
import { useLanguage } from "@/context/language-context";
import { useAudio } from "@/context/audio-context";
import type { SurahDetails } from "@/lib/quran-api";

const fontSizes = ["text-2xl md:text-3xl", "text-3xl md:text-4xl", "text-4xl md:text-5xl"];

export default function SurahView({ surah }: { surah: SurahDetails }) {
    const [fontIndex, setFontIndex] = useState(0);
    const { savePosition } = useReading();
    const { t, translateSurahName, translateSurahType, locale } = useLanguage();
    const { state: audioState, playVerse } = useAudio();

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
                    <div className="relative rounded-[32px] border-4 border-gold/30 bg-mushaf p-8 md:p-12 shadow-inner text-justify transition-all duration-300">
                        {/* Decorative corner borders */}
                        <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-gold/40 rounded-tl-md" />
                        <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-gold/40 rounded-tr-md" />
                        <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-gold/40 rounded-bl-md" />
                        <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-gold/40 rounded-br-md" />

                        {/* Bismillah Calligraphy (except for Surah 9 (Al-Tawbah) and Surah 1 (Al-Fatihah, which already contains Bismillah in verse 1)) */}
                        {surah.id !== 9 && surah.id !== 1 && (
                            <div className="quran-text mb-10 text-center font-serif text-3xl md:text-4xl text-mushaf-heading border-b border-gold/15 pb-6 select-none">
                                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                            </div>
                        )}

                        {/* Continuous verses */}
                        <div className="quran-text text-right tracking-wide leading-[2.6] text-mushaf-ink" dir="rtl">
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
                                            <svg className="w-8 h-8 text-gold/60 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="1.5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                            </svg>
                                            <span className="absolute inset-0 flex items-center justify-center text-[10px] text-mushaf-ink font-bold">
                                                {verseNumber}
                                            </span>
                                        </span>
                                    </span>
                                );
                            })}
                        </div>

                        {/* Floating translation footer for clean UX */}
                        <div className="mt-8 border-t border-gold/15 pt-6">
                            <div className="rounded-2xl bg-gold/5 p-4 border border-gold/15">
                                <p className="text-xs font-semibold text-mushaf-heading mb-1">
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
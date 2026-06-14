"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import VerseCard from "@/components/surah/verse-card";
import ReadingToolbar from "@/components/surah/reading-toolbar";
import AudioPlayer from "@/components/audio/audio-player";
import { useParams } from "next/navigation";
import { surahDetails } from "@/data/surah-details";
import { useReading } from "@/context/reading-context";
import { useLanguage } from "@/context/language-context";


const fontSizes = ["text-2xl md:text-3xl", "text-3xl md:text-4xl", "text-4xl md:text-5xl"];

export default function SurahDetailsPage() {
    const params = useParams<{ id: string }>();
    const [fontIndex, setFontIndex] = useState(0);
    const { savePosition } = useReading();
    const { t, translateSurahName, translateSurahType, locale } = useLanguage();
    const savedVerseRef = useRef<HTMLDivElement>(null);

    const surah = useMemo(() => surahDetails[params.id], [params.id]);

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

    function handleIncreaseFont() {
        setFontIndex((prev) => Math.min(prev + 1, fontSizes.length - 1));
    }

    function handleDecreaseFont() {
        setFontIndex((prev) => Math.max(prev - 1, 0));
    }

    if (!surah) {
        return (
            <main className="min-h-screen bg-background px-6 py-20 text-foreground">
                <div className="mx-auto max-w-3xl text-center">
                    <h1 className="mb-4 text-4xl font-bold">{t("surahNotFound")}</h1>
                    <p className="text-muted-foreground">
                        {t("surahNotFoundDesc")}
                    </p>
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
                />

                <AudioPlayer />

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
            </section>
        </main>
    );
}
"use client";

import { useState, useEffect, useRef } from "react";
import { useAudio } from "@/context/audio-context";
import { useLanguage } from "@/context/language-context";
import { Volume2, Share2 } from "lucide-react";
import ShareModal from "@/components/surah/share-modal";

type VerseCardProps = {
    id?: string;
    verseNumber: number;
    verseText: string;
    verseTranslation?: string;
    fontSizeClass: string;
    surahId?: number;
    versesCount?: number;
};

export default function VerseCard({
    id,
    verseNumber,
    verseText,
    verseTranslation,
    fontSizeClass,
    surahId,
    versesCount,
}: VerseCardProps) {
    const [copied, setCopied] = useState(false);
    const [isShareOpen, setIsShareOpen] = useState(false);
    const { state, playVerse } = useAudio();
    const { t, locale } = useLanguage();
    const verseRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (state.currentVerse === verseNumber && state.isPlaying && verseRef.current) {
            verseRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }, [state.currentVerse, state.isPlaying, verseNumber]);

    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(verseText);
            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch (error) {
            console.error("Copy failed:", error);
        }
    }

    return (
        <article
            ref={verseRef}
            id={id}
            className={`rounded-[28px] border bg-card p-6 shadow-sm transition ${
                state.currentVerse === verseNumber && state.isPlaying
                    ? "border-primary ring-2 ring-primary/20 ring-offset-2 ring-offset-background"
                    : "border-border hover:border-primary/30 hover:shadow-md"
            }`}
        >

            <div className="mb-4 flex items-center justify-between">

                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-sm font-bold text-primary">
                    {verseNumber}
                </span>

                <div className="flex gap-2">
                    {surahId && (
                        <button
                            onClick={() => playVerse(verseNumber, surahId, versesCount)}
                            className={`rounded-xl border px-3 py-1 text-sm transition ${
                                state.currentVerse === verseNumber && state.isPlaying
                                    ? "border-primary bg-primary/20 text-primary"
                                    : "border-border bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                            }`}
                            title={t("listenToVerse")}
                        >
                            <Volume2 size={16} />
                        </button>
                    )}
                    
                    <button
                        onClick={handleCopy}
                        className="rounded-xl border border-border bg-muted px-3 py-1 text-sm text-muted-foreground transition hover:bg-primary/10 hover:text-primary cursor-pointer"
                    >
                        {copied ? t("copied") : t("copy")}
                    </button>

                    {surahId && (
                        <button
                            onClick={() => setIsShareOpen(true)}
                            className="rounded-xl border border-border bg-muted px-3 py-1 text-sm text-muted-foreground transition hover:bg-primary/10 hover:text-primary cursor-pointer"
                            title={t("share")}
                        >
                            <Share2 size={16} />
                        </button>
                    )}
                </div>
            </div>

            <p
                className={`quran-text text-right leading-[2.4] text-foreground ${fontSizeClass}`}
                dir="rtl"
            >
                {verseText}
            </p>

            {locale === "ru" && verseTranslation && (
                <div className="mt-4 border-t border-border/50 pt-4 text-start">
                    <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                        {verseTranslation}
                    </p>
                </div>
            )}

            {surahId && (
                <ShareModal
                    isOpen={isShareOpen}
                    onClose={() => setIsShareOpen(false)}
                    verseNumber={verseNumber}
                    verseText={verseText}
                    verseTranslation={verseTranslation}
                    surahId={surahId}
                />
            )}
        </article>
    );
}
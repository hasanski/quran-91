"use client";

import { useState } from "react";

type VerseCardProps = {
    verseNumber: number;
    verseText: string;
    fontSizeClass: string;
};

export default function VerseCard({
    verseNumber,
    verseText,
    fontSizeClass,
}: VerseCardProps) {
    const [copied, setCopied] = useState(false);

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
        <article className="rounded-[28px] border border-border bg-card p-6 shadow-sm transition hover:border-primary/30 hover:shadow-md">

            <div className="mb-4 flex items-center justify-between">

                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-sm font-bold text-primary">
                    {verseNumber}
                </span>

                <button
                    onClick={handleCopy}
                    className="rounded-xl border border-border bg-muted px-3 py-1 text-sm text-muted-foreground transition hover:bg-primary/10 hover:text-primary"
                >
                    {copied ? "تم النسخ" : "نسخ"}
                </button>
            </div>

            <p
                className={`text-right leading-[2.4] text-foreground ${fontSizeClass}`}
            >
                {verseText}
            </p>
        </article>
    );
}
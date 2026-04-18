"use client";

import { useMemo, useState } from "react";
import VerseCard from "@/components/surah/verse-card";
import ReadingToolbar from "@/components/surah/reading-toolbar";
import { useParams } from "next/navigation";
import { surahDetails } from "@/data/surah-details";


const fontSizes = ["text-2xl md:text-3xl", "text-3xl md:text-4xl", "text-4xl md:text-5xl"];

export default function SurahDetailsPage() {
    const params = useParams<{ id: string }>();
    const [fontIndex, setFontIndex] = useState(0);

    const surah = useMemo(() => surahDetails[params.id], [params.id]);
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
                    <h1 className="mb-4 text-4xl font-bold">السورة غير موجودة</h1>
                    <p className="text-muted-foreground">
                        لم نجد بيانات لهذه السورة حاليًا.
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-background text-foreground">
            <section className="mx-auto max-w-5xl px-6 py-16">
                <div className="mb-10 rounded-[32px] border border-border bg-card/50 p-8 backdrop-blur-sm">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <span className="mb-3 inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-sm text-primary">
                                سورة رقم {surah.id}
                            </span>

                            <h1 className="mt-2 text-4xl font-bold md:text-5xl">
                                سورة {surah.name}
                            </h1>
                        </div>

                        <div className="flex gap-3">
                            <span className="rounded-full border border-border bg-muted px-4 py-2 text-sm text-muted-foreground">
                                {surah.type}
                            </span>
                            <span className="rounded-full border border-border bg-muted px-4 py-2 text-sm text-muted-foreground">
                                {surah.versesCount} آيات
                            </span>
                        </div>
                    </div>

                    <p className="text-lg leading-8 text-muted-foreground">
                        قراءة مريحة وحديثة للسورة مع تصميم أنيق يركز على النص القرآني.
                    </p>
                </div>

                <ReadingToolbar
                    onIncreaseFont={handleIncreaseFont}
                    onDecreaseFont={handleDecreaseFont}
                />

                <div className="space-y-6">
                    {surah.verses.map((verse, index) => (
                        <VerseCard
                            key={index}
                            verseNumber={index + 1}
                            verseText={verse}
                            fontSizeClass={fontSizes[fontIndex]}
                        />
                    ))}
                </div>
            </section>
        </main>
    );
}
"use client";

import { useMemo, useState } from "react";
import { surahs } from "@/data/surahs";
import SurahCard from "@/components/surah/surah-card";
import { useLanguage } from "@/context/language-context";

export default function SurahsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const { t, translateSurahName } = useLanguage();

    const filteredSurahs = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        if (!term) return surahs;

        return surahs.filter((surah) => {
            const nameAr = surah.name;
            const nameRu = translateSurahName(surah.id, surah.name).toLowerCase();
            return nameAr.includes(term) || nameRu.includes(term);
        });
    }, [searchTerm, translateSurahName]);

    return (
        <main className="min-h-screen bg-background text-foreground">
            <section className="mx-auto max-w-7xl px-6 py-16">
                <div className="mb-10 text-center">
                    <span className="mb-4 inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-sm text-primary">
                        {t("surahList")}
                    </span>

                    <h1 className="mb-4 text-4xl font-bold md:text-5xl">
                        {t("browseSurahs")}
                    </h1>

                    <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                        {t("searchSurahDesc")}
                    </p>
                </div>

                <div className="mx-auto mb-10 max-w-2xl">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        placeholder={t("searchPlaceholder")}
                        className="w-full rounded-3xl border border-border bg-input px-5 py-4 text-start text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary/30 focus:bg-input/80"
                    />
                </div>

                <div className="mb-8 text-sm text-muted-foreground">
                    {t("searchResults", { count: filteredSurahs.length })}
                </div>

                {filteredSurahs.length === 0 ? (
                    <div className="rounded-[28px] border border-border bg-card p-10 text-center">
                        <h2 className="mb-2 text-2xl font-bold text-foreground">
                            {t("noResults")}
                        </h2>
                        <p className="text-muted-foreground">
                            {t("noResultsDesc")}
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredSurahs.map((surah) => (
                            <SurahCard key={surah.id} surah={surah} />
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}
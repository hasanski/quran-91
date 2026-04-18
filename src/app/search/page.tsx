"use client";

import { useMemo, useState } from "react";
import { surahs } from "@/data/surahs";
import SurahCard from "@/components/surah/surah-card";

export default function SearchPage() {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredSurahs = useMemo(() => {
        const term = searchTerm.trim();

        if (!term) {
            return surahs;
        }

        return surahs.filter((surah) => {
            return (
                surah.name.includes(term) ||
                surah.type.includes(term) ||
                surah.id.toString().includes(term)
            );
        });
    }, [searchTerm]);

    return (
        <main className="min-h-screen bg-background text-foreground">
            <section className="mx-auto max-w-7xl px-6 py-16">
                <div className="mb-10 text-center">
                    <span className="mb-4 inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-sm text-primary">
                        البحث
                    </span>

                    <h1 className="mb-4 text-4xl font-bold md:text-5xl">
                        ابحث عن سورة
                    </h1>

                    <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                        اكتب اسم السورة، رقمها، أو نوعها للوصول السريع.
                    </p>
                </div>

                <div className="mx-auto mb-8 max-w-3xl">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        placeholder="مثال: البقرة أو 2 أو مكية"
                        className="w-full rounded-[28px] border border-border bg-input px-6 py-5 text-right text-lg text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary/30 focus:bg-input/80"
                    />
                </div>

                <div className="mb-8 flex items-center justify-between gap-4 text-sm text-muted-foreground">
                    <span>عدد النتائج: {filteredSurahs.length}</span>
                    <span>اكتب للبحث بشكل مباشر</span>
                </div>

                {filteredSurahs.length === 0 ? (
                    <div className="rounded-[32px] border border-border bg-card p-10 text-center backdrop-blur-sm">
                        <h2 className="mb-3 text-2xl font-bold text-foreground">
                            لا توجد نتائج
                        </h2>
                        <p className="text-muted-foreground">
                            حاول البحث باسم آخر أو رقم سورة مختلف.
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
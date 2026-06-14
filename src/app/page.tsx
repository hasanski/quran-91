"use client";

import Link from "next/link";
import { surahs } from "@/data/surahs";
import SurahCard from "@/components/surah/surah-card";
import ResumeReading from "@/components/reading/resume-reading";
import { useLanguage } from "@/context/language-context";

export default function HomePage() {
  const { t } = useLanguage();
  const featuredSurahs = surahs.slice(0, 4);

  return (
    <main className="bg-background text-foreground">

      {/* 🔥 Hero */}
      <section className="mx-auto max-w-7xl px-6 py-24 text-center">
        <span className="mb-4 inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
          {t("modernPlatform")}
        </span>

        <h1 className="mb-6 text-4xl font-bold leading-tight md:text-6xl">
          {t("readHolyQuran")}
          <span className="block bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">
            {t("modernExperience")}
          </span>
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-lg leading-8 text-muted-foreground">
          {t("heroDesc")}
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/surahs"
            className="rounded-2xl bg-primary px-8 py-3 text-lg font-medium text-primary-foreground transition hover:opacity-90"
          >
            {t("browseSurahs")}
          </Link>

          <Link
            href="/search"
            className="rounded-2xl border border-border bg-card px-8 py-3 text-lg font-medium text-foreground shadow-sm transition hover:bg-muted hover:text-foreground"
          >
            {t("quickSearch")}
          </Link>
        </div>
      </section>

      {/* 📊 Stats */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">

          <div className="rounded-3xl border border-border bg-card p-6 text-center shadow-sm">
            <h3 className="text-3xl font-bold text-primary">114</h3>
            <p className="mt-2 text-muted-foreground">{t("surahsCount")}</p>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 text-center shadow-sm">
            <h3 className="text-3xl font-bold text-primary">6000+</h3>
            <p className="mt-2 text-muted-foreground">{t("versesCountLabel")}</p>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 text-center shadow-sm">
            <h3 className="text-3xl font-bold text-primary">{t("fastLabel")}</h3>
            <p className="mt-2 text-muted-foreground">{t("fastDesc")}</p>
          </div>

        </div>
      </section>

      {/* 💾 استكمال القراءة */}
      <ResumeReading />

      {/* 🌿 Featured Surahs */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold">{t("featuredSurahs")}</h2>
          <p className="mt-2 text-muted-foreground">
            {t("featuredDesc")}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredSurahs.map((surah) => (
            <SurahCard key={surah.id} surah={surah} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/surahs"
            className="inline-block rounded-2xl bg-primary px-8 py-3 text-lg font-medium text-primary-foreground transition hover:opacity-90"
          >
            {t("viewAllSurahs")}
          </Link>
        </div>
      </section>

    </main>
  );
}
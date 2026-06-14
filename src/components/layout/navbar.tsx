"use client";

import Link from "next/link";
import ThemeToggle from "@/components/ui/theme-toggle";
import LanguageToggle from "@/components/ui/language-toggle";
import { useLanguage } from "@/context/language-context";

export default function Navbar() {
    const { t } = useLanguage();

    return (
        <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

                <Link href="/" className="text-xl font-bold text-foreground">
                    Quran Modern
                </Link>

                <nav className="hidden items-center gap-8 md:flex">
                    <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition">
                        {t("home")}
                    </Link>

                    <Link href="/surahs" className="text-sm text-muted-foreground hover:text-foreground transition">
                        {t("surahs")}
                    </Link>

                    <Link href="/search" className="text-sm text-muted-foreground hover:text-foreground transition">
                        {t("search")}
                    </Link>
                </nav>

                <div className="flex items-center gap-3">
                    <LanguageToggle />
                    <ThemeToggle />
                    <Link
                        href="/surahs"
                        className="rounded-2xl bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90 transition"
                    >
                        {t("startReading")}
                    </Link>
                </div>
            </div>
        </header>
    );
}
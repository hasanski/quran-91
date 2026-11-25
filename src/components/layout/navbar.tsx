"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Clock, Home, Menu, Search, X } from "lucide-react";
import ThemeToggle from "@/components/ui/theme-toggle";
import LanguageToggle from "@/components/ui/language-toggle";
import { useLanguage } from "@/context/language-context";

const LINKS = [
    { href: "/", icon: Home, label: "home" },
    { href: "/surahs", icon: BookOpen, label: "surahs" },
    { href: "/prayer-times", icon: Clock, label: "prayerTimes" },
    { href: "/search", icon: Search, label: "search" },
] as const;

export default function Navbar() {
    const { t } = useLanguage();
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    const isActive = (href: string) =>
        href === "/" ? pathname === "/" : pathname.startsWith(href) || (href === "/surahs" && pathname.startsWith("/surah/"));

    // Close on Escape and lock page scroll while the drawer is open
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
        document.addEventListener("keydown", onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = prev;
        };
    }, [open]);

    return (
        <>
        <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setOpen(true)}
                        className="rounded-xl p-2 text-foreground transition hover:bg-muted md:hidden cursor-pointer"
                        aria-label="القائمة"
                        aria-expanded={open}
                        aria-controls="mobile-drawer"
                    >
                        <Menu size={22} />
                    </button>

                    <Link href="/" className="text-xl font-extrabold bg-gradient-to-r from-primary to-gold bg-clip-text text-transparent">
                        القرآن الكريم
                    </Link>
                </div>

                <nav className="hidden items-center gap-8 md:flex">
                    {LINKS.map(({ href, label }) => (
                        <Link
                            key={href}
                            href={href}
                            className={`text-sm transition ${isActive(href) ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"}`}
                        >
                            {t(label)}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-3">
                    <LanguageToggle />
                    <ThemeToggle />
                    <Link
                        href="/surahs"
                        className="hidden rounded-2xl bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90 transition sm:inline-block"
                    >
                        {t("startReading")}
                    </Link>
                </div>
            </div>
        </header>

            {/* Mobile side drawer (outside header: backdrop-blur would trap position:fixed) */}
            <div className={`fixed inset-0 z-[70] md:hidden ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
                <div
                    className={`absolute inset-0 bg-black/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
                    onClick={() => setOpen(false)}
                />
                <aside
                    id="mobile-drawer"
                    className={`absolute inset-y-0 start-0 flex h-dvh w-72 max-w-[80vw] flex-col gap-2 border-e border-border bg-background p-4 shadow-2xl transition-transform duration-300 ${
                        open ? "translate-x-0" : "ltr:-translate-x-full rtl:translate-x-full"
                    }`}
                    style={{ paddingTop: "calc(1rem + env(safe-area-inset-top))" }}
                >
                    <div className="mb-4 flex items-center justify-between">
                        <span className="text-lg font-extrabold bg-gradient-to-r from-primary to-gold bg-clip-text text-transparent">
                            القرآن الكريم
                        </span>
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="rounded-xl p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground cursor-pointer"
                            aria-label={t("close")}
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {LINKS.map(({ href, icon: Icon, label }) => {
                        const active = isActive(href);
                        return (
                            <Link
                                key={href}
                                href={href}
                                onClick={() => setOpen(false)}
                                tabIndex={open ? 0 : -1}
                                aria-current={active ? "page" : undefined}
                                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-base transition ${
                                    active ? "bg-primary/10 text-primary font-semibold" : "text-foreground hover:bg-muted"
                                }`}
                            >
                                <Icon size={20} />
                                {t(label)}
                            </Link>
                        );
                    })}
                </aside>
            </div>
        </>
    );
}

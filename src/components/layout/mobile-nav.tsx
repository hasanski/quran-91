"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Clock, Home, Search } from "lucide-react";
import { useLanguage } from "@/context/language-context";

const ITEMS = [
  { href: "/", icon: Home, label: "home" },
  { href: "/surahs", icon: BookOpen, label: "surahs" },
  { href: "/prayer-times", icon: Clock, label: "prayerShort" },
  { href: "/search", icon: Search, label: "search" },
] as const;

/** Bottom tab bar, shown on phones only (the top nav links are hidden below md). */
export default function MobileNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`) || (href === "/surahs" && pathname.startsWith("/surah/"));

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/90 backdrop-blur-xl md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label={t("home")}
    >
      <ul className="mx-auto grid max-w-md grid-cols-4">
        {ITEMS.map(({ href, icon: Icon, label }) => {
          const active = isActive(href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center gap-1 py-2.5 text-xs transition ${
                  active ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className={`flex h-8 w-12 items-center justify-center rounded-full transition ${active ? "bg-primary/10" : ""}`}>
                  <Icon size={20} />
                </span>
                {t(label)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

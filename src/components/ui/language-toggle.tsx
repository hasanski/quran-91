"use client";

import { useLanguage } from "@/context/language-context";
import { Languages } from "lucide-react";

export default function LanguageToggle() {
  const { locale, setLocale, mounted } = useLanguage();

  if (!mounted) {
    return <div className="h-12 w-16 animate-pulse rounded-2xl bg-muted" />;
  }

  const nextLocale = locale === "ar" ? "ru" : "ar";
  const label = locale === "ar" ? "RU" : "AR";

  return (
    <button
      onClick={() => setLocale(nextLocale)}
      className="relative flex h-12 items-center gap-2 rounded-2xl border border-border bg-card px-3.5 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/30 hover:bg-muted/10 cursor-pointer"
      title={locale === "ar" ? "Переключить на русский" : "التحويل للعربية"}
      aria-label="تبديل اللغة / Сменить язык"
    >
      <Languages size={18} className="text-muted-foreground" />
      <span className="text-xs font-bold text-foreground select-none">{label}</span>
    </button>
  );
}

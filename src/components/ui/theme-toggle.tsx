"use client";

import { Sun, Moon, BookOpen } from "lucide-react";
import { useTheme, type Theme } from "@/context/theme-context";

const THEME_UI: Record<Theme, { icon: typeof Sun; iconClass: string; glow: string; label: string }> = {
  light: { icon: Sun, iconClass: "text-amber-500", glow: "from-amber-500/5 to-orange-500/5", label: "الوضع الفاتح" },
  dark: { icon: Moon, iconClass: "text-indigo-400", glow: "from-indigo-500/5 to-purple-500/5", label: "الوضع الداكن" },
  sepia: { icon: BookOpen, iconClass: "text-gold", glow: "from-gold/10 to-amber-700/5", label: "الوضع الورقي" },
};

export default function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return <div className="h-12 w-12 animate-pulse rounded-2xl bg-muted" />;
  }

  const { icon: Icon, iconClass, glow, label } = THEME_UI[theme];

  return (
    <button
      onClick={toggleTheme}
      className="relative h-12 w-12 overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/30"
      aria-label={`تبديل الوضع (الحالي: ${label})`}
      title={label}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <Icon className={`h-6 w-6 transition-transform duration-300 hover:scale-110 ${iconClass}`} />
      </div>
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${glow}`} />
    </button>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { useAudio } from "@/context/audio-context";
import { useLanguage } from "@/context/language-context";
import { Mic, ChevronDown, Check } from "lucide-react";

export default function ReciterSelector() {
    const { reciters, currentReciter, setReciter } = useAudio();
    const { locale, t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const currentName = locale === "ar" ? currentReciter.nameAr : currentReciter.nameRu;

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex h-11 items-center gap-2 rounded-2xl border border-border bg-card px-4 py-2 text-sm font-medium text-foreground shadow-sm transition hover:bg-muted/10 hover:border-primary/30 cursor-pointer"
            >
                <Mic size={16} className="text-primary shrink-0" />
                <span className="max-w-[130px] truncate md:max-w-none select-none">{currentName}</span>
                <ChevronDown size={14} className={`text-muted-foreground shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
                <div 
                    className="absolute z-50 mt-2 w-64 rounded-2xl border border-border bg-card/95 p-1.5 shadow-xl backdrop-blur-xl transition-all duration-200 focus:outline-none origin-top"
                    style={{
                        left: locale === "ar" ? "auto" : "0",
                        right: locale === "ar" ? "0" : "auto",
                    }}
                >
                    <div className="px-3 py-2 text-xs font-semibold text-muted-foreground border-b border-border/50 mb-1 select-none">
                        {t("selectReciter")}
                    </div>
                    <ul className="space-y-0.5 max-h-60 overflow-y-auto">
                        {reciters.map((reciter) => {
                            const name = locale === "ar" ? reciter.nameAr : reciter.nameRu;
                            const isSelected = reciter.id === currentReciter.id;
                            return (
                                <li key={reciter.id}>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setReciter(reciter.id);
                                            setIsOpen(false);
                                        }}
                                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition cursor-pointer ${
                                            isSelected 
                                                ? "bg-primary/10 text-primary font-medium" 
                                                : "text-foreground hover:bg-muted/30"
                                        }`}
                                    >
                                        <span className="truncate">
                                            {name}
                                        </span>
                                        {isSelected && <Check size={16} className="text-primary shrink-0 ms-2" />}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
}

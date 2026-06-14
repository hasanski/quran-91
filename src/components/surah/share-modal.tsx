"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Download, Share2, X, Check } from "lucide-react";
import { useLanguage } from "@/context/language-context";

type ThemeId = "emerald" | "sand" | "midnight" | "minimalist";

interface ThemePreset {
    id: ThemeId;
    nameAr: string;
    nameRu: string;
    bgClass: string;
    textClass: string;
    accentClass: string;
    borderClass: string;
}

const THEMES: ThemePreset[] = [
    {
        id: "emerald",
        nameAr: "الواحة الزمردية",
        nameRu: "Изумрудный",
        bgClass: "bg-gradient-to-br from-[#064e3b] via-[#022c22] to-[#0f172a]",
        textClass: "text-[#f0fdf4]",
        accentClass: "text-[#34d399]/70",
        borderClass: "border-[#059669]/20",
    },
    {
        id: "sand",
        nameAr: "الرمال الدافئة",
        nameRu: "Песочный",
        bgClass: "bg-gradient-to-br from-[#fafaf9] to-[#f5f5f4]",
        textClass: "text-[#44403c]",
        accentClass: "text-[#d97706]/70",
        borderClass: "border-[#e7e5e4]",
    },
    {
        id: "midnight",
        nameAr: "الليل الهادئ",
        nameRu: "Полуночный",
        bgClass: "bg-gradient-to-br from-[#0f172a] via-[#090d16] to-[#020617]",
        textClass: "text-[#f1f5f9]",
        accentClass: "text-[#38bdf8]/70",
        borderClass: "border-[#1e293b]",
    },
    {
        id: "minimalist",
        nameAr: "بسيط مريح",
        nameRu: "Минимализм",
        bgClass: "bg-[#ffffff] dark:bg-[#1e293b]",
        textClass: "text-foreground",
        accentClass: "text-primary/70",
        borderClass: "border-border",
    },
];

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    verseNumber: number;
    verseText: string;
    verseTranslation?: string;
    surahId: number;
}

export default function ShareModal({
    isOpen,
    onClose,
    verseNumber,
    verseText,
    verseTranslation,
    surahId,
}: ShareModalProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const { t, translateSurahName, locale } = useLanguage();
    const [selectedThemeId, setSelectedThemeId] = useState<ThemeId>("emerald");
    const [showTranslation, setShowTranslation] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);

    if (!isOpen) return null;

    const currentTheme = THEMES.find((th) => th.id === selectedThemeId) || THEMES[0];

    // Find the Surah name from the metadata or last reading
    const surahName = translateSurahName(surahId, "");

    const handleDownload = async () => {
        if (!cardRef.current) return;
        setIsGenerating(true);
        try {
            // Apply scale logic for sharper output (using pixelRatio)
            const dataUrl = await toPng(cardRef.current, {
                quality: 0.98,
                pixelRatio: 3, // Multiplies canvas size by 3 for crisp high-resolution images
                style: {
                    borderRadius: "0", // Remove border radius for clean layout boundaries if needed, or keep
                }
            });
            const link = document.createElement("a");
            link.download = `Ayah-${surahId}-${verseNumber}.png`;
            link.href = dataUrl;
            link.click();
        } catch (error) {
            console.error("Error generating image:", error);
            alert(locale === "ar" ? "فشل إنشاء الصورة" : "Не удалось создать изображение");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleShare = async () => {
        if (!cardRef.current) return;
        setIsGenerating(true);
        try {
            const dataUrl = await toPng(cardRef.current, {
                quality: 0.95,
                pixelRatio: 2,
            });

            // Convert Base64 dataUrl to file
            const blob = await (await fetch(dataUrl)).blob();
            const file = new File([blob], `Ayah-${surahId}-${verseNumber}.png`, { type: "image/png" });

            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: locale === "ar" ? "آية من القرآن الكريم" : "Аят из Священного Корана",
                    text: locale === "ar" ? `سورة ${surahName} آية ${verseNumber}` : `Сура ${surahName} аят ${verseNumber}`,
                });
            } else {
                // Fallback to clipboard/download
                const link = document.createElement("a");
                link.download = `Ayah-${surahId}-${verseNumber}.png`;
                link.href = dataUrl;
                link.click();
            }
        } catch (error) {
            console.error("Error sharing:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
            <div className="relative flex w-full max-w-4xl flex-col rounded-[32px] border border-border bg-card p-6 shadow-2xl md:p-8">
                
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 rounded-full border border-border bg-muted p-2 text-muted-foreground transition hover:bg-primary/10 hover:text-primary cursor-pointer"
                >
                    <X size={20} />
                </button>

                <h3 className="mb-6 text-2xl font-bold text-foreground text-center">
                    {locale === "ar" ? "مشاركة الآية كصورة" : "Поделиться аятом как картинкой"}
                </h3>

                <div className="grid gap-8 lg:grid-cols-2">
                    
                    {/* Left: Live Preview (1:1 Aspect Ratio Box) */}
                    <div className="flex flex-col items-center justify-center">
                        <div
                            ref={cardRef}
                            id="share-card-element"
                            className={`relative flex aspect-square w-full max-w-[380px] flex-col justify-between rounded-[24px] p-8 shadow-lg overflow-hidden ${currentTheme.bgClass} ${currentTheme.textClass}`}
                        >
                            
                            {/* Decorative Symbol in the Center Background */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
                                <span className="text-[180px] font-bold">﷽</span>
                            </div>

                            {/* Verse Text Area */}
                            <div className="my-auto flex flex-col justify-center space-y-4 pt-4">
                                <p
                                    className="text-center text-xl font-medium leading-[2.1] md:text-2xl"
                                    dir="rtl"
                                >
                                    {verseText}
                                </p>
                                
                                {showTranslation && locale === "ru" && verseTranslation && (
                                    <p className="border-t border-white/10 dark:border-white/5 pt-3 text-center text-sm leading-relaxed opacity-90 font-light">
                                        {verseTranslation}
                                    </p>
                                )}
                            </div>

                            {/* Card Footer Details */}
                            <div className="flex items-center justify-between border-t border-white/10 pt-4">
                                <span className={`text-xs opacity-75 ${currentTheme.accentClass}`}>
                                    {locale === "ar" ? `الآية ${verseNumber}` : `Аят ${verseNumber}`}
                                </span>
                                <span className="text-sm font-semibold">
                                    {locale === "ar" ? `سورة ${surahName}` : `Сура ${surahName}`}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Customization Controls */}
                    <div className="flex flex-col justify-between space-y-6">
                        
                        <div className="space-y-6">
                            {/* Theme Selector */}
                            <div>
                                <label className="mb-3 block text-sm font-medium text-muted-foreground">
                                    {locale === "ar" ? "اختر المظهر" : "Выберите стиль"}
                                </label>
                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                    {THEMES.map((theme) => (
                                        <button
                                            key={theme.id}
                                            onClick={() => setSelectedThemeId(theme.id)}
                                            className={`flex flex-col items-center justify-center rounded-2xl border p-3 transition cursor-pointer ${
                                                selectedThemeId === theme.id
                                                    ? "border-primary bg-primary/10 text-primary font-semibold"
                                                    : "border-border bg-muted/30 text-muted-foreground hover:bg-muted"
                                            }`}
                                        >
                                            <div className={`mb-2 h-6 w-6 rounded-full shadow-inner ${theme.bgClass}`} />
                                            <span className="text-xs">
                                                {locale === "ar" ? theme.nameAr : theme.nameRu}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Options Toggles */}
                            {locale === "ru" && verseTranslation && (
                                <div className="rounded-2xl border border-border bg-muted/20 p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-semibold">
                                                Показывать перевод
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Включить перевод аята на русский язык
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setShowTranslation(!showTranslation)}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition cursor-pointer ${
                                                showTranslation ? "bg-primary" : "bg-muted-foreground/30"
                                            }`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                                                    showTranslation ? "translate-x-6" : "translate-x-1"
                                                }`}
                                            />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3 sm:flex-row pt-4 border-t border-border">
                            <button
                                onClick={handleDownload}
                                disabled={isGenerating}
                                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-primary py-4 px-6 text-sm font-bold text-primary-foreground transition hover:opacity-90 disabled:opacity-50 cursor-pointer"
                            >
                                <Download size={18} />
                                <span>
                                    {isGenerating
                                        ? (locale === "ar" ? "جاري الإنشاء..." : "Создание...")
                                        : (locale === "ar" ? "تحميل الصورة" : "Скачать картинку")}
                                </span>
                            </button>

                            <button
                                onClick={handleShare}
                                disabled={isGenerating}
                                className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-border bg-muted py-4 px-6 text-sm font-bold text-foreground shadow-sm transition hover:bg-muted/80 disabled:opacity-50 cursor-pointer"
                            >
                                <Share2 size={18} />
                                <span>
                                    {locale === "ar" ? "مشاركة" : "Поделиться"}
                                </span>
                            </button>
                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
}

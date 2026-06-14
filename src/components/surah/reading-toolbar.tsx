"use client";

import { useAudio } from "@/context/audio-context";
import { Play, Volume2, VolumeX } from "lucide-react";

type ReadingToolbarProps = {
    onIncreaseFont: () => void;
    onDecreaseFont: () => void;
    surahId: number;
    versesCount: number;
};

export default function ReadingToolbar({
    onIncreaseFont,
    onDecreaseFont,
    surahId,
    versesCount,
}: ReadingToolbarProps) {
    const { state, playSurah, pause, resume } = useAudio();

    async function handleShare() {
        try {
            await navigator.clipboard.writeText(window.location.href);
            alert("تم نسخ رابط الصفحة");
        } catch (error) {
            console.error("Share failed:", error);
        }
    }

    function handleClearPosition() {
        localStorage.removeItem("readingPosition");
        alert("تم مسح موضع القراءة المحفوظ");
    }

    return (
        <div className="sticky top-24 z-40 mb-8 rounded-[24px] border border-primary/10 bg-card/90 p-4 shadow-sm backdrop-blur-xl">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold text-foreground">
                        أدوات القراءة
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        تحكم في طريقة عرض السورة بسهولة
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={onIncreaseFont}
                        className="rounded-2xl border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary/20"
                    >
                        A+
                    </button>

                    <button
                        onClick={onDecreaseFont}
                        className="rounded-2xl border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary/20"
                    >
                        A-
                    </button>

                    <button
                        onClick={() => {
                            if (state.isPlaying && state.surahId === surahId) {
                                pause();
                            } else if (state.surahId === surahId && state.currentVerse) {
                                resume();
                            } else {
                                playSurah(surahId, 1, versesCount);
                            }
                        }}
                        className="rounded-2xl border border-primary bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
                    >
                        {state.isPlaying && state.surahId === surahId ? (
                            <span className="flex items-center gap-2">
                                <VolumeX size={16} />
                                إيقاف
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <Play size={16} />
                                استماع
                            </span>
                        )}
                    </button>

                    <button
                        onClick={handleShare}
                        className="rounded-2xl border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary/20"
                    >
                        مشاركة
                    </button>

                    <button
                        onClick={handleClearPosition}
                        className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive transition hover:bg-destructive/20"
                        title="مسح موضع القراءة المحفوظ"
                    >
                        مسح الموضع
                    </button>
                </div>
            </div>
        </div>
    );
}
"use client";

import { useAudio, REPEAT_OPTIONS } from "@/context/audio-context";
import { useLanguage } from "@/context/language-context";
import ReciterSelector from "@/components/audio/reciter-selector";
import { Play, Pause, SkipForward, SkipBack, Repeat } from "lucide-react";
import { useEffect, useRef } from "react";

export default function AudioPlayer() {
    const { state, pause, resume, nextVerse, previousVerse, seek, repeatCount, setRepeatCount } = useAudio();
    const { t } = useLanguage();
    const sliderRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (sliderRef.current) {
            sliderRef.current.value = state.progress.toString();
        }
    }, [state.progress]);

    function formatTime(seconds: number): string {
        if (isNaN(seconds)) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    }

    function handleSeek(e: React.ChangeEvent<HTMLInputElement>) {
        const value = parseFloat(e.target.value);
        seek(value);
    }

    if (state.currentVerse === null || state.surahId === null) {
        return null;
    }

    return (
        <div className="mb-6 rounded-[24px] border border-primary/10 bg-gradient-to-br from-primary/5 to-primary/10 p-6 shadow-lg">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h3 className="text-lg font-bold text-foreground">
                        {t("listenQuran")}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        {t("verseNumberLabel", { num: state.currentVerse })}
                        {repeatCount !== 1 && (
                            <span className="ms-2 rounded-full bg-gold/15 px-2 py-0.5 text-xs font-medium text-gold">
                                {t("repeatProgress", {
                                    current: state.repeatPlayed,
                                    total: repeatCount === 0 ? "∞" : repeatCount,
                                })}
                            </span>
                        )}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <ReciterSelector />

                    <label
                        className={`flex items-center gap-2 rounded-full border px-3 py-2 text-sm transition ${
                            repeatCount !== 1
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border bg-background text-muted-foreground"
                        }`}
                        title={t("repeat")}
                    >
                        <Repeat size={16} aria-hidden />
                        <span className="sr-only">{t("repeat")}</span>
                        <select
                            value={repeatCount}
                            onChange={(e) => setRepeatCount(Number(e.target.value))}
                            className="cursor-pointer bg-transparent outline-none"
                        >
                            {REPEAT_OPTIONS.map((n) => (
                                <option key={n} value={n} className="bg-card text-foreground">
                                    {n === 1 ? t("repeatOff") : n === 0 ? t("repeatInfinite") : t("repeatTimes", { count: n })}
                                </option>
                            ))}
                        </select>
                    </label>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={previousVerse}
                            disabled={state.currentVerse <= 1}
                            className="rounded-full border border-border bg-background p-3 text-foreground transition hover:bg-primary/10 hover:text-primary disabled:opacity-30"
                        >
                            <SkipBack size={20} />
                        </button>

                        <button
                            onClick={state.isPlaying ? pause : resume}
                            className="rounded-full border border-primary bg-primary p-4 text-primary-foreground transition hover:opacity-90"
                        >
                            {state.isPlaying ? <Pause size={24} /> : <Play size={24} />}
                        </button>

                        <button
                            onClick={nextVerse}
                            className="rounded-full border border-border bg-background p-3 text-foreground transition hover:bg-primary/10 hover:text-primary"
                        >
                            <SkipForward size={20} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-border">
                    <div
                        className="absolute left-0 top-0 h-full bg-primary transition-all duration-100 ease-linear"
                        style={{
                            width: state.duration > 0 ? `${(state.progress / state.duration) * 100}%` : "0%",
                        }}
                    />
                </div>

                <input
                    ref={sliderRef}
                    type="range"
                    min="0"
                    max={state.duration || 0}
                    step="0.1"
                    value={state.progress}
                    onChange={handleSeek}
                    className="absolute w-full opacity-0"
                    style={{ height: "40px", top: "-10px" }}
                />

                <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{formatTime(state.progress)}</span>
                    <span>{formatTime(state.duration)}</span>
                </div>
            </div>
        </div>
    );
}

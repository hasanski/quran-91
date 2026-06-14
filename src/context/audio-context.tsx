"use client";

import { createContext, useContext, useState, useRef, useEffect, useCallback } from "react";
import { useLanguage } from "@/context/language-context";

type AudioState = {
    isPlaying: boolean;
    currentVerse: number | null;
    surahId: number | null;
    progress: number;
    duration: number;
    maxVerses: number;
};

type AudioContextType = {
    state: AudioState;
    playSurah: (surahId: number, startVerse?: number, maxVerses?: number) => void;
    pause: () => void;
    resume: () => void;
    playVerse: (verseNumber: number, surahId?: number, maxVerses?: number) => void;
    nextVerse: () => void;
    previousVerse: () => void;
    seek: (time: number) => void;
};

const AudioContext = createContext<AudioContextType | null>(null);

export function useAudio() {
    const context = useContext(AudioContext);
    if (!context) {
        throw new Error("useAudio must be used within an AudioProvider");
    }
    return context;
}

const RECITERS: Record<number, string> = {
    1: "https://everyayah.com/data/Alafasy_128kbps/",
    2: "https://everyayah.com/data/Alafasy_128kbps/",
};

export function AudioProvider({ children }: { children: React.ReactNode }) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const { t } = useLanguage();
    const [state, setState] = useState<AudioState>({
        isPlaying: false,
        currentVerse: null,
        surahId: null,
        progress: 0,
        duration: 0,
        maxVerses: 0,
    });

    const getVerseAudioUrl = useCallback((surahId: number, verseNumber: number) => {
        const reciterUrl = RECITERS[surahId] || "https://everyayah.com/data/Alafasy_128kbps/";
        const formattedSurah = surahId.toString().padStart(3, "0");
        const formattedVerse = verseNumber.toString().padStart(3, "0");
        return `${reciterUrl}${formattedSurah}${formattedVerse}.mp3`;
    }, []);

    const loadVerse = useCallback((surahId: number, verseNumber: number) => {
        if (!audioRef.current) return;

        const url = getVerseAudioUrl(surahId, verseNumber);
        audioRef.current.src = url;
        audioRef.current.load();
    }, [getVerseAudioUrl]);

    const playVerse = useCallback(async (verseNumber: number, surahIdOverride?: number, maxVerses?: number) => {
        const surahId = surahIdOverride || state.surahId;
        if (!surahId) return;

        const url = getVerseAudioUrl(surahId, verseNumber);
        console.log("Playing verse:", verseNumber, "surahId:", surahId, "URL:", url);

        loadVerse(surahId, verseNumber);

        if (audioRef.current) {
            try {
                await new Promise((resolve) => {
                    audioRef.current!.oncanplay = resolve;
                    setTimeout(resolve, 1000);
                });
                await audioRef.current.play();
                setState((prev) => ({
                    ...prev,
                    currentVerse: verseNumber,
                    isPlaying: true,
                    surahId,
                    maxVerses: maxVerses || prev.maxVerses,
                }));
            } catch (error) {
                console.error("Playback failed:", error);
                alert(t("playbackError"));
            }
        }
    }, [state.surahId, loadVerse, getVerseAudioUrl]);

    const playSurah = useCallback(async (surahId: number, startVerse = 1, maxVerses = 1000) => {
        const url = getVerseAudioUrl(surahId, startVerse);
        console.log("Playing surah:", surahId, "verse:", startVerse, "URL:", url);

        loadVerse(surahId, startVerse);

        if (audioRef.current) {
            try {
                await new Promise((resolve) => {
                    audioRef.current!.oncanplay = resolve;
                    setTimeout(resolve, 1000);
                });
                await audioRef.current.play();
                setState((prev) => ({
                    ...prev,
                    surahId,
                    currentVerse: startVerse,
                    isPlaying: true,
                    progress: 0,
                    maxVerses,
                }));
            } catch (error) {
                console.error("Playback failed:", error);
                alert(t("playbackError"));
            }
        }
    }, [getVerseAudioUrl, loadVerse]);

    const pause = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            setState((prev) => ({ ...prev, isPlaying: false }));
        }
    }, []);

    const resume = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.play();
            setState((prev) => ({ ...prev, isPlaying: true }));
        }
    }, []);

    const nextVerse = useCallback(() => {
        if (state.currentVerse && state.surahId && state.currentVerse < state.maxVerses) {
            playVerse(state.currentVerse + 1, state.surahId);
        } else if (state.currentVerse && state.currentVerse >= state.maxVerses) {
            pause();
        }
    }, [state.currentVerse, state.surahId, state.maxVerses, playVerse, pause]);

    const previousVerse = useCallback(() => {
        if (state.currentVerse && state.surahId && state.currentVerse > 1) {
            playVerse(state.currentVerse - 1, state.surahId);
        }
    }, [state.currentVerse, state.surahId, playVerse]);

    const seek = useCallback((time: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime = time;
        }
    }, []);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleTimeUpdate = () => {
            setState((prev) => ({
                ...prev,
                progress: audio.currentTime,
                duration: audio.duration || 0,
            }));
        };

        const handleEnded = () => {
            nextVerse();
        };

        const handlePlay = () => {
            setState((prev) => ({ ...prev, isPlaying: true }));
        };

        const handlePause = () => {
            setState((prev) => ({ ...prev, isPlaying: false }));
        };

        audio.addEventListener("timeupdate", handleTimeUpdate);
        audio.addEventListener("ended", handleEnded);
        audio.addEventListener("play", handlePlay);
        audio.addEventListener("pause", handlePause);

        return () => {
            audio.removeEventListener("timeupdate", handleTimeUpdate);
            audio.removeEventListener("ended", handleEnded);
            audio.removeEventListener("play", handlePlay);
            audio.removeEventListener("pause", handlePause);
        };
    }, [nextVerse]);

    const value = {
        state,
        playSurah,
        pause,
        resume,
        playVerse,
        nextVerse,
        previousVerse,
        seek,
    };

    return (
        <AudioContext.Provider value={value}>
            {children}
            <audio ref={audioRef} />
        </AudioContext.Provider>
    );
}

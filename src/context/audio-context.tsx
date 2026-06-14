"use client";

import { createContext, useContext, useState, useRef, useEffect, useCallback } from "react";
import { useLanguage } from "@/context/language-context";

export type Reciter = {
    id: string;
    nameAr: string;
    nameRu: string;
    url: string;
};

export const RECITERS: Reciter[] = [
    {
        id: "alafasy",
        nameAr: "مشاري راشد العفاسي",
        nameRu: "Мишари Рашид аль-Афаси",
        url: "https://everyayah.com/data/Alafasy_128kbps/",
    },
    {
        id: "husary",
        nameAr: "محمود خليل الحصري",
        nameRu: "Махмуд Халиль аль-Хусари",
        url: "https://everyayah.com/data/Husary_128kbps/",
    },
    {
        id: "abdul_basit",
        nameAr: "عبد الباسط عبد الصمد (مجود)",
        nameRu: "Абдул Басит Абдус Самад (Муджаввад)",
        url: "https://everyayah.com/data/Abdul_Basit_Mujawwad_128kbps/",
    },
    {
        id: "minshawy",
        nameAr: "محمد صديق المنشاوي",
        nameRu: "Мухаммад Сиддик аль-Миншави",
        url: "https://everyayah.com/data/Minshawy_Murattal_128kbps/",
    },
    {
        id: "muaiqly",
        nameAr: "ماهر المعيقلي",
        nameRu: "Махер аль-Муайкли",
        url: "https://everyayah.com/data/MaherAlMuaiqly128kbps/",
    },
];

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
    reciters: Reciter[];
    currentReciter: Reciter;
    setReciter: (reciterId: string) => void;
};

const AudioContext = createContext<AudioContextType | null>(null);

export function useAudio() {
    const context = useContext(AudioContext);
    if (!context) {
        throw new Error("useAudio must be used within an AudioProvider");
    }
    return context;
}

export function AudioProvider({ children }: { children: React.ReactNode }) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const { t } = useLanguage();
    const [currentReciterId, setCurrentReciterId] = useState<string>("alafasy");
    const [state, setState] = useState<AudioState>({
        isPlaying: false,
        currentVerse: null,
        surahId: null,
        progress: 0,
        duration: 0,
        maxVerses: 0,
    });

    useEffect(() => {
        const savedReciter = localStorage.getItem("currentReciterId");
        if (savedReciter && RECITERS.some(r => r.id === savedReciter)) {
            setCurrentReciterId(savedReciter);
        }
    }, []);

    const setReciter = useCallback((reciterId: string) => {
        if (RECITERS.some(r => r.id === reciterId)) {
            setCurrentReciterId(reciterId);
            localStorage.setItem("currentReciterId", reciterId);
        }
    }, []);

    const getVerseAudioUrl = useCallback((surahId: number, verseNumber: number, reciterId: string) => {
        const reciter = RECITERS.find(r => r.id === reciterId) || RECITERS[0];
        const formattedSurah = surahId.toString().padStart(3, "0");
        const formattedVerse = verseNumber.toString().padStart(3, "0");
        return `${reciter.url}${formattedSurah}${formattedVerse}.mp3`;
    }, []);

    const loadVerse = useCallback((surahId: number, verseNumber: number, reciterId: string) => {
        if (!audioRef.current) return;

        const url = getVerseAudioUrl(surahId, verseNumber, reciterId);
        audioRef.current.src = url;
        audioRef.current.load();
    }, [getVerseAudioUrl]);

    const playVerse = useCallback(async (verseNumber: number, surahIdOverride?: number, maxVerses?: number) => {
        const surahId = surahIdOverride || state.surahId;
        if (!surahId) return;

        const url = getVerseAudioUrl(surahId, verseNumber, currentReciterId);
        console.log("Playing verse:", verseNumber, "surahId:", surahId, "URL:", url);

        loadVerse(surahId, verseNumber, currentReciterId);

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
    }, [state.surahId, loadVerse, getVerseAudioUrl, currentReciterId, t]);

    const playSurah = useCallback(async (surahId: number, startVerse = 1, maxVerses = 1000) => {
        const url = getVerseAudioUrl(surahId, startVerse, currentReciterId);
        console.log("Playing surah:", surahId, "verse:", startVerse, "URL:", url);

        loadVerse(surahId, startVerse, currentReciterId);

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
    }, [getVerseAudioUrl, loadVerse, currentReciterId, t]);

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

    // Hot-swapping effect when reciter changes during active session:
    useEffect(() => {
        if (state.currentVerse !== null && state.surahId !== null && audioRef.current) {
            const wasPlaying = state.isPlaying;
            const url = getVerseAudioUrl(state.surahId, state.currentVerse, currentReciterId);
            
            audioRef.current.src = url;
            audioRef.current.load();
            if (wasPlaying) {
                audioRef.current.play().catch(err => console.error("Playback failed after hot swap:", err));
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentReciterId]);

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

    const currentReciter = RECITERS.find(r => r.id === currentReciterId) || RECITERS[0];

    const value = {
        state,
        playSurah,
        pause,
        resume,
        playVerse,
        nextVerse,
        previousVerse,
        seek,
        reciters: RECITERS,
        currentReciter,
        setReciter,
    };

    return (
        <AudioContext.Provider value={value}>
            {children}
            <audio ref={audioRef} />
        </AudioContext.Provider>
    );
}

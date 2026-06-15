"use client";

import { createContext, useContext, useState, useRef, useEffect, useCallback } from "react";
import { useLanguage } from "@/context/language-context";
import { surahs } from "@/data/surahs";

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

// Wake Lock helper: keeps the device awake while audio is playing
async function requestWakeLock(): Promise<WakeLockSentinel | null> {
    try {
        if ("wakeLock" in navigator) {
            const sentinel = await navigator.wakeLock.request("screen");
            console.log("Wake Lock acquired for background playback");
            return sentinel;
        }
    } catch (err) {
        console.warn("Wake Lock request failed:", err);
    }
    return null;
}

async function releaseWakeLock(sentinel: WakeLockSentinel | null) {
    if (sentinel) {
        try {
            await sentinel.release();
            console.log("Wake Lock released");
        } catch (err) {
            console.warn("Wake Lock release failed:", err);
        }
    }
}

export function AudioProvider({ children }: { children: React.ReactNode }) {
    // Double-buffering: two audio elements to eliminate gap between verses
    const audioRef = useRef<HTMLAudioElement>(null);
    const nextAudioRef = useRef<HTMLAudioElement>(null);
    const wakeLockRef = useRef<WakeLockSentinel | null>(null);
    // Track which audio element is currently active (for double-buffering swap)
    const activeAudioRef = useRef<"primary" | "next">("primary");
    const { t, locale, translateSurahName } = useLanguage();
    const [currentReciterId, setCurrentReciterId] = useState<string>("alafasy");
    const [state, setState] = useState<AudioState>({
        isPlaying: false,
        currentVerse: null,
        surahId: null,
        progress: 0,
        duration: 0,
        maxVerses: 0,
    });

    // Helper to get whichever audio element is currently active
    const getActiveAudio = useCallback((): HTMLAudioElement | null => {
        if (activeAudioRef.current === "primary") return audioRef.current;
        return nextAudioRef.current;
    }, []);

    const getInactiveAudio = useCallback((): HTMLAudioElement | null => {
        if (activeAudioRef.current === "primary") return nextAudioRef.current;
        return audioRef.current;
    }, []);

    const swapActiveAudio = useCallback(() => {
        activeAudioRef.current = activeAudioRef.current === "primary" ? "next" : "primary";
    }, []);

    useEffect(() => {
        const savedReciter = localStorage.getItem("currentReciterId");
        if (savedReciter && RECITERS.some(r => r.id === savedReciter)) {
            setCurrentReciterId(savedReciter);
        }
    }, []);

    // Manage Wake Lock based on playback state
    useEffect(() => {
        if (state.isPlaying) {
            requestWakeLock().then(sentinel => {
                wakeLockRef.current = sentinel;
            });
        } else {
            releaseWakeLock(wakeLockRef.current);
            wakeLockRef.current = null;
        }

        return () => {
            releaseWakeLock(wakeLockRef.current);
            wakeLockRef.current = null;
        };
    }, [state.isPlaying]);

    // Re-acquire Wake Lock when page becomes visible again (e.g. user unlocks phone)
    useEffect(() => {
        const handleVisibilityChange = async () => {
            if (document.visibilityState === "visible" && state.isPlaying) {
                // Re-acquire wake lock since it gets released when page is hidden
                const sentinel = await requestWakeLock();
                wakeLockRef.current = sentinel;
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [state.isPlaying]);

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

    // Preload the next verse into the inactive audio element
    const preloadNextVerse = useCallback((surahId: number, currentVerse: number, maxVerses: number, reciterId: string) => {
        const nextVerseNum = currentVerse + 1;
        if (nextVerseNum > maxVerses) return;

        const inactiveAudio = getInactiveAudio();
        if (!inactiveAudio) return;

        const url = getVerseAudioUrl(surahId, nextVerseNum, reciterId);
        inactiveAudio.src = url;
        inactiveAudio.load();
        console.log("Preloaded next verse:", nextVerseNum, "URL:", url);
    }, [getInactiveAudio, getVerseAudioUrl]);

    const playVerse = useCallback(async (verseNumber: number, surahIdOverride?: number, maxVerses?: number) => {
        const surahId = surahIdOverride || state.surahId;
        if (!surahId) return;

        const activeAudio = getActiveAudio();
        if (!activeAudio) return;

        const url = getVerseAudioUrl(surahId, verseNumber, currentReciterId);
        console.log("Playing verse:", verseNumber, "surahId:", surahId, "URL:", url);

        activeAudio.src = url;
        activeAudio.load();

        try {
            await activeAudio.play();
            const newMaxVerses = maxVerses || state.maxVerses;
            setState((prev) => ({
                ...prev,
                currentVerse: verseNumber,
                isPlaying: true,
                surahId,
                maxVerses: newMaxVerses,
            }));
            // Preload the next verse while this one plays
            preloadNextVerse(surahId, verseNumber, newMaxVerses, currentReciterId);
        } catch (error) {
            console.error("Playback failed:", error);
            alert(t("playbackError"));
        }
    }, [state.surahId, state.maxVerses, getActiveAudio, getVerseAudioUrl, currentReciterId, t, preloadNextVerse]);

    // Play next verse using the pre-loaded inactive audio element (instant swap, no gap)
    const playNextVerseFromBuffer = useCallback(async (surahId: number, nextVerseNum: number, maxVerses: number) => {
        const inactiveAudio = getInactiveAudio();
        if (!inactiveAudio) return;

        // The inactive audio should already have the next verse preloaded
        try {
            await inactiveAudio.play();
            // Swap: the inactive becomes active
            swapActiveAudio();
            setState((prev) => ({
                ...prev,
                currentVerse: nextVerseNum,
                isPlaying: true,
                surahId,
                maxVerses,
            }));
            // Now preload the NEXT next verse into the (now inactive) other element
            preloadNextVerse(surahId, nextVerseNum, maxVerses, currentReciterId);
        } catch (error) {
            console.error("Buffered playback failed, falling back:", error);
            // Fallback: play normally using the active audio element
            const activeAudio = getActiveAudio();
            if (activeAudio) {
                const url = getVerseAudioUrl(surahId, nextVerseNum, currentReciterId);
                activeAudio.src = url;
                activeAudio.load();
                try {
                    await activeAudio.play();
                    setState((prev) => ({
                        ...prev,
                        currentVerse: nextVerseNum,
                        isPlaying: true,
                        surahId,
                        maxVerses,
                    }));
                    preloadNextVerse(surahId, nextVerseNum, maxVerses, currentReciterId);
                } catch (fallbackError) {
                    console.error("Fallback playback also failed:", fallbackError);
                }
            }
        }
    }, [getInactiveAudio, getActiveAudio, swapActiveAudio, getVerseAudioUrl, currentReciterId, preloadNextVerse]);

    const playSurah = useCallback(async (surahId: number, startVerse = 1, maxVerses = 1000) => {
        const activeAudio = getActiveAudio();
        if (!activeAudio) return;

        const url = getVerseAudioUrl(surahId, startVerse, currentReciterId);
        console.log("Playing surah:", surahId, "verse:", startVerse, "URL:", url);

        activeAudio.src = url;
        activeAudio.load();

        try {
            await activeAudio.play();
            setState((prev) => ({
                ...prev,
                surahId,
                currentVerse: startVerse,
                isPlaying: true,
                progress: 0,
                maxVerses,
            }));
            // Preload the next verse
            preloadNextVerse(surahId, startVerse, maxVerses, currentReciterId);
        } catch (error) {
            console.error("Playback failed:", error);
            alert(t("playbackError"));
        }
    }, [getActiveAudio, getVerseAudioUrl, currentReciterId, t, preloadNextVerse]);

    const pause = useCallback(() => {
        const activeAudio = getActiveAudio();
        if (activeAudio) {
            activeAudio.pause();
            setState((prev) => ({ ...prev, isPlaying: false }));
        }
    }, [getActiveAudio]);

    const resume = useCallback(() => {
        const activeAudio = getActiveAudio();
        if (activeAudio) {
            activeAudio.play();
            setState((prev) => ({ ...prev, isPlaying: true }));
        }
    }, [getActiveAudio]);

    const nextVerse = useCallback(() => {
        if (state.currentVerse && state.surahId && state.currentVerse < state.maxVerses) {
            // Use buffered playback for seamless transition (critical for background on Android)
            playNextVerseFromBuffer(state.surahId, state.currentVerse + 1, state.maxVerses);
        } else if (state.currentVerse && state.currentVerse >= state.maxVerses) {
            pause();
        }
    }, [state.currentVerse, state.surahId, state.maxVerses, playNextVerseFromBuffer, pause]);

    const previousVerse = useCallback(() => {
        if (state.currentVerse && state.surahId && state.currentVerse > 1) {
            playVerse(state.currentVerse - 1, state.surahId);
        }
    }, [state.currentVerse, state.surahId, playVerse]);

    const seek = useCallback((time: number) => {
        const activeAudio = getActiveAudio();
        if (activeAudio) {
            activeAudio.currentTime = time;
        }
    }, [getActiveAudio]);

    // Hot-swapping effect when reciter changes during active session:
    useEffect(() => {
        if (state.currentVerse !== null && state.surahId !== null) {
            const activeAudio = getActiveAudio();
            if (!activeAudio) return;

            const wasPlaying = state.isPlaying;
            const url = getVerseAudioUrl(state.surahId, state.currentVerse, currentReciterId);
            
            activeAudio.src = url;
            activeAudio.load();
            if (wasPlaying) {
                activeAudio.play().catch(err => console.error("Playback failed after hot swap:", err));
            }
            // Re-preload next verse with new reciter
            if (state.currentVerse < state.maxVerses) {
                preloadNextVerse(state.surahId, state.currentVerse, state.maxVerses, currentReciterId);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentReciterId]);

    // Attach event listeners to BOTH audio elements
    useEffect(() => {
        const primaryAudio = audioRef.current;
        const secondaryAudio = nextAudioRef.current;
        if (!primaryAudio || !secondaryAudio) return;

        const createHandlers = (audio: HTMLAudioElement) => {
            const handleTimeUpdate = () => {
                // Only update progress if this is the active audio
                const activeAudio = getActiveAudio();
                if (audio !== activeAudio) return;
                setState((prev) => ({
                    ...prev,
                    progress: audio.currentTime,
                    duration: audio.duration || 0,
                }));
            };

            const handleEnded = () => {
                // Only handle ended if this is the active audio
                const activeAudio = getActiveAudio();
                if (audio !== activeAudio) return;
                nextVerse();
            };

            const handlePlay = () => {
                const activeAudio = getActiveAudio();
                if (audio !== activeAudio) return;
                setState((prev) => ({ ...prev, isPlaying: true }));
            };

            const handlePause = () => {
                const activeAudio = getActiveAudio();
                if (audio !== activeAudio) return;
                setState((prev) => ({ ...prev, isPlaying: false }));
            };

            return { handleTimeUpdate, handleEnded, handlePlay, handlePause };
        };

        const primaryHandlers = createHandlers(primaryAudio);
        const secondaryHandlers = createHandlers(secondaryAudio);

        primaryAudio.addEventListener("timeupdate", primaryHandlers.handleTimeUpdate);
        primaryAudio.addEventListener("ended", primaryHandlers.handleEnded);
        primaryAudio.addEventListener("play", primaryHandlers.handlePlay);
        primaryAudio.addEventListener("pause", primaryHandlers.handlePause);

        secondaryAudio.addEventListener("timeupdate", secondaryHandlers.handleTimeUpdate);
        secondaryAudio.addEventListener("ended", secondaryHandlers.handleEnded);
        secondaryAudio.addEventListener("play", secondaryHandlers.handlePlay);
        secondaryAudio.addEventListener("pause", secondaryHandlers.handlePause);

        return () => {
            primaryAudio.removeEventListener("timeupdate", primaryHandlers.handleTimeUpdate);
            primaryAudio.removeEventListener("ended", primaryHandlers.handleEnded);
            primaryAudio.removeEventListener("play", primaryHandlers.handlePlay);
            primaryAudio.removeEventListener("pause", primaryHandlers.handlePause);

            secondaryAudio.removeEventListener("timeupdate", secondaryHandlers.handleTimeUpdate);
            secondaryAudio.removeEventListener("ended", secondaryHandlers.handleEnded);
            secondaryAudio.removeEventListener("play", secondaryHandlers.handlePlay);
            secondaryAudio.removeEventListener("pause", secondaryHandlers.handlePause);
        };
    }, [nextVerse, getActiveAudio]);

    // Register Media Session action handlers
    useEffect(() => {
        if (!("mediaSession" in navigator)) return;

        try {
            navigator.mediaSession.setActionHandler("play", () => {
                resume();
            });
            navigator.mediaSession.setActionHandler("pause", () => {
                pause();
            });
            navigator.mediaSession.setActionHandler("nexttrack", () => {
                nextVerse();
            });
            navigator.mediaSession.setActionHandler("previoustrack", () => {
                previousVerse();
            });
            // seekbackward/seekforward help keep media session active on some devices
            navigator.mediaSession.setActionHandler("seekbackward", (details) => {
                const activeAudio = getActiveAudio();
                if (activeAudio) {
                    const skipTime = details.seekOffset || 10;
                    activeAudio.currentTime = Math.max(activeAudio.currentTime - skipTime, 0);
                }
            });
            navigator.mediaSession.setActionHandler("seekforward", (details) => {
                const activeAudio = getActiveAudio();
                if (activeAudio) {
                    const skipTime = details.seekOffset || 10;
                    activeAudio.currentTime = Math.min(
                        activeAudio.currentTime + skipTime,
                        activeAudio.duration || 0
                    );
                }
            });
        } catch (error) {
            console.error("Failed to register mediaSession handlers:", error);
        }

        return () => {
            try {
                navigator.mediaSession.setActionHandler("play", null);
                navigator.mediaSession.setActionHandler("pause", null);
                navigator.mediaSession.setActionHandler("nexttrack", null);
                navigator.mediaSession.setActionHandler("previoustrack", null);
                navigator.mediaSession.setActionHandler("seekbackward", null);
                navigator.mediaSession.setActionHandler("seekforward", null);
            } catch (e) {}
        };
    }, [resume, pause, nextVerse, previousVerse, getActiveAudio]);

    // Sync playback state with Media Session
    useEffect(() => {
        if (!("mediaSession" in navigator)) return;
        try {
            navigator.mediaSession.playbackState = state.isPlaying ? "playing" : "paused";
        } catch (e) {}
    }, [state.isPlaying]);

    // Update Media Session Metadata with position state for lock screen controls
    useEffect(() => {
        if (!("mediaSession" in navigator) || !state.surahId || !state.currentVerse) return;

        const currentReciter = RECITERS.find(r => r.id === currentReciterId) || RECITERS[0];
        const surahData = surahs.find(s => s.id === state.surahId);
        const surahName = surahData ? surahData.name : "";
        const localizedSurahName = translateSurahName(state.surahId, surahName);

        try {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: locale === "ar" 
                    ? `الآية ${state.currentVerse} - سورة ${surahName}` 
                    : `Сура ${localizedSurahName} - Аят ${state.currentVerse}`,
                artist: locale === "ar" ? currentReciter.nameAr : currentReciter.nameRu,
                album: locale === "ar" ? "القرآن الكريم" : "Священный Коран",
                artwork: [
                    { src: "/icon.png", sizes: "512x512", type: "image/png" }
                ]
            });
        } catch (error) {
            console.error("Failed to set mediaSession metadata:", error);
        }
    }, [state.surahId, state.currentVerse, currentReciterId, locale, translateSurahName]);

    // Update Media Session position state for progress on lock screen
    useEffect(() => {
        if (!("mediaSession" in navigator) || !state.duration) return;
        try {
            if ("setPositionState" in navigator.mediaSession) {
                const activeAudio = getActiveAudio();
                navigator.mediaSession.setPositionState({
                    duration: state.duration,
                    playbackRate: activeAudio?.playbackRate || 1,
                    position: Math.min(state.progress, state.duration),
                });
            }
        } catch (e) {}
    }, [state.progress, state.duration, getActiveAudio]);

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
            {/* Double-buffered audio: primary plays current verse, next preloads upcoming verse */}
            {/* preload="auto" ensures full buffering; playsInline needed for iOS/Android */}
            <audio ref={audioRef} preload="auto" playsInline />
            <audio ref={nextAudioRef} preload="auto" playsInline />
        </AudioContext.Provider>
    );
}

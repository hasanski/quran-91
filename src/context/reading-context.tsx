"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import { useStoredValue } from "@/hooks/use-stored-value";

interface ReadingPosition {
  surahId: number;
  surahName: string;
  verseNumber: number;
  timestamp: number;
}

interface ReadingContextType {
  lastPosition: ReadingPosition | null;
  savePosition: (surahId: number, surahName: string, verseNumber: number) => void;
  clearPosition: () => void;
}

const ReadingContext = createContext<ReadingContextType | undefined>(undefined);

export function ReadingProvider({ children }: { children: React.ReactNode }) {
  const [raw, setRaw] = useStoredValue("readingPosition");

  const lastPosition = useMemo<ReadingPosition | null>(() => {
    if (!raw) return null;
    try {
      return JSON.parse(raw) as ReadingPosition;
    } catch (error) {
      console.error("Failed to parse reading position:", error);
      return null;
    }
  }, [raw]);

  const savePosition = useCallback(
    (surahId: number, surahName: string, verseNumber: number) => {
      const position: ReadingPosition = { surahId, surahName, verseNumber, timestamp: Date.now() };
      setRaw(JSON.stringify(position));
    },
    [setRaw]
  );

  const clearPosition = useCallback(() => setRaw(null), [setRaw]);

  return (
    <ReadingContext.Provider value={{ lastPosition, savePosition, clearPosition }}>
      {children}
    </ReadingContext.Provider>
  );
}

export function useReading() {
  const context = useContext(ReadingContext);
  if (context === undefined) {
    throw new Error("useReading must be used within a ReadingProvider");
  }
  return context;
}

"use client";

import { createContext, useContext, useEffect, useState } from "react";

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
  const [lastPosition, setLastPosition] = useState<ReadingPosition | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const savedPosition = localStorage.getItem("readingPosition");
    if (savedPosition) {
      try {
        const parsed = JSON.parse(savedPosition);
        setLastPosition(parsed);
      } catch (error) {
        console.error("Failed to parse reading position:", error);
      }
    }
  }, []);

  const savePosition = (surahId: number, surahName: string, verseNumber: number) => {
    const position: ReadingPosition = {
      surahId,
      surahName,
      verseNumber,
      timestamp: Date.now(),
    };

    setLastPosition(position);
    localStorage.setItem("readingPosition", JSON.stringify(position));
  };

  const clearPosition = () => {
    setLastPosition(null);
    localStorage.removeItem("readingPosition");
  };

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

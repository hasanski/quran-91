"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Hydration-safe access to localStorage.
 *
 * The server render and the hydration pass see `null` (no stored value);
 * React then re-renders with the real value right after hydration. Values
 * stay in sync across components and across browser tabs.
 */

const CHANGE_EVENT = "stored-value-change";

// Fallback when localStorage is unavailable (private mode, blocked storage)
const memory = new Map<string, string>();

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return memory.get(key) ?? null;
  }
}

function write(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    if (value === null) memory.delete(key);
    else memory.set(key, value);
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

export function useStoredValue(key: string): [string | null, (value: string | null) => void] {
  const value = useSyncExternalStore(
    subscribe,
    () => read(key),
    () => null
  );
  const setValue = useCallback((next: string | null) => write(key, next), [key]);
  return [value, setValue];
}

const noopSubscribe = () => () => {};

/** false during SSR and hydration, true afterwards. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );
}

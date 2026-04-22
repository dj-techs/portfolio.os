"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type OS = "macos" | "arch";

type OsState = {
  lastOS: OS | null;
  soundOn: boolean;
  setLastOS: (os: OS) => void;
  setSoundOn: (on: boolean) => void;
};

/**
 * SSR-safe zustand slice for top-level OS preferences.
 * `persist` reads localStorage lazily on the client; pair with useHydrated() in components.
 */
export const useOsStore = create<OsState>()(
  persist(
    (set) => ({
      lastOS: null,
      soundOn: false,
      setLastOS: (os) => set({ lastOS: os }),
      setSoundOn: (on) => set({ soundOn: on }),
    }),
    {
      name: "os-portfolio:os",
      storage: createJSONStorage(() => localStorage),
      // Only persist a minimal subset
      partialize: (s) => ({ lastOS: s.lastOS, soundOn: s.soundOn }),
    }
  )
);

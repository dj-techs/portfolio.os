"use client";

import { create } from "zustand";

export type AppId =
  | "finder"
  | "preview"
  | "aboutme"
  | "skills"
  | "experience"
  | "messages"
  | "settings"
  | "safari";

export type WindowState = {
  id: string;
  app: AppId;
  title: string;
  /** Optional props passed through to the app component */
  props?: Record<string, unknown>;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  minimized: boolean;
  maximized: boolean;
  /** Remember pre-maximize rect to restore on un-maximize */
  restore?: { x: number; y: number; w: number; h: number };
};

type LaunchArgs = {
  id?: string; // optional — omit to always open new
  app: AppId;
  title: string;
  props?: Record<string, unknown>;
  w?: number;
  h?: number;
  x?: number;
  y?: number;
};

type WindowsState = {
  windows: WindowState[];
  focusedId: string | null;
  nextZ: number;
  launch: (args: LaunchArgs) => string;
  close: (id: string) => void;
  focus: (id: string) => void;
  minimize: (id: string) => void;
  restore: (id: string) => void;
  toggleMaximize: (id: string, viewport: { w: number; h: number }) => void;
  move: (id: string, x: number, y: number) => void;
  resize: (id: string, w: number, h: number, x?: number, y?: number) => void;
  closeAll: () => void;
};

let idCounter = 0;
const mkId = (app: AppId) => `${app}-${++idCounter}-${Math.random().toString(36).slice(2, 6)}`;

export const useWindowsStore = create<WindowsState>((set, get) => ({
  windows: [],
  focusedId: null,
  nextZ: 10,

  launch: ({ id, app, title, props, w = 720, h = 480, x, y }) => {
    const state = get();
    // If id provided and already exists, focus + un-minimize instead of re-opening
    if (id) {
      const existing = state.windows.find((w) => w.id === id);
      if (existing) {
        get().focus(id);
        if (existing.minimized) get().restore(id);
        return id;
      }
    }
    const newId = id ?? mkId(app);
    const z = state.nextZ + 1;
    // Offset each new window slightly so they don't stack perfectly
    const offset = state.windows.length * 24;
    const nx = x ?? 80 + offset;
    const ny = y ?? 60 + offset;
    set({
      windows: [
        ...state.windows,
        {
          id: newId,
          app,
          title,
          props,
          x: nx,
          y: ny,
          w,
          h,
          z,
          minimized: false,
          maximized: false,
        },
      ],
      focusedId: newId,
      nextZ: z,
    });
    return newId;
  },

  close: (id) =>
    set((s) => ({
      windows: s.windows.filter((w) => w.id !== id),
      focusedId: s.focusedId === id ? null : s.focusedId,
    })),

  focus: (id) =>
    set((s) => {
      const z = s.nextZ + 1;
      return {
        windows: s.windows.map((w) => (w.id === id ? { ...w, z } : w)),
        focusedId: id,
        nextZ: z,
      };
    }),

  minimize: (id) =>
    set((s) => ({
      windows: s.windows.map((w) => (w.id === id ? { ...w, minimized: true } : w)),
      focusedId: s.focusedId === id ? null : s.focusedId,
    })),

  restore: (id) =>
    set((s) => {
      const z = s.nextZ + 1;
      return {
        windows: s.windows.map((w) => (w.id === id ? { ...w, minimized: false, z } : w)),
        focusedId: id,
        nextZ: z,
      };
    }),

  toggleMaximize: (id, viewport) =>
    set((s) => ({
      windows: s.windows.map((w) => {
        if (w.id !== id) return w;
        if (w.maximized && w.restore) {
          return { ...w, maximized: false, ...w.restore, restore: undefined };
        }
        return {
          ...w,
          maximized: true,
          restore: { x: w.x, y: w.y, w: w.w, h: w.h },
          x: 0,
          y: 28, // below menu bar
          w: viewport.w,
          h: viewport.h - 28,
        };
      }),
    })),

  move: (id, x, y) =>
    set((s) => ({
      windows: s.windows.map((w) => (w.id === id ? { ...w, x, y } : w)),
    })),

  resize: (id, w, h, x, y) =>
    set((s) => ({
      windows: s.windows.map((win) =>
        win.id === id
          ? { ...win, w, h, x: x ?? win.x, y: y ?? win.y }
          : win
      ),
    })),

  closeAll: () => set({ windows: [], focusedId: null }),
}));

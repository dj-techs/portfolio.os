"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMacUI } from "./uiStore";
import { useWindowsStore } from "@/store/windows";

export default function MissionControl() {
  const { missionOpen, closeMission } = useMacUI();
  const { windows, focus } = useWindowsStore();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") useMacUI.getState().closeMission();
      if (e.key === "F3") {
        e.preventDefault();
        if (missionOpen) useMacUI.getState().closeMission();
        else useMacUI.getState().openMission();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [missionOpen]);

  return (
    <AnimatePresence>
      {missionOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[85] flex items-center justify-center bg-black/70 p-12 backdrop-blur-md"
          onClick={closeMission}
        >
          {windows.length === 0 ? (
            <div className="text-sm text-white/60">No open windows</div>
          ) : (
            <div
              className="grid max-w-6xl grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-6"
              onClick={(e) => e.stopPropagation()}
            >
              {windows
                .filter((w) => !w.minimized)
                .map((w) => (
                  <button
                    key={w.id}
                    onClick={() => {
                      focus(w.id);
                      closeMission();
                    }}
                    className="group flex flex-col items-center gap-2"
                  >
                    <div className="aspect-video w-full overflow-hidden rounded-lg border border-white/10 bg-neutral-900 shadow-xl transition group-hover:scale-[1.03] group-hover:ring-2 group-hover:ring-white/40">
                      <div className="h-5 bg-white/10" />
                      <div className="p-3 text-[10px] text-white/40">{w.title}</div>
                    </div>
                    <div className="text-xs text-white/90">{w.title}</div>
                  </button>
                ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

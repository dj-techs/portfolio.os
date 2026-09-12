"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMacUI } from "./uiStore";
import { profile } from "@/content/profile";
import { Calendar, Mail, Briefcase } from "lucide-react";

export default function NotificationCenter() {
  const { notifCenterOpen, closeNotifCenter } = useMacUI();
  const now = new Date();
  const dow = now.toLocaleDateString(undefined, { weekday: "long" });
  const day = now.toLocaleDateString(undefined, { month: "long", day: "numeric" });

  return (
    <AnimatePresence>
      {notifCenterOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeNotifCenter}
            className="fixed inset-0 z-[80]"
          />
          <motion.aside
            initial={{ x: 360, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 360, opacity: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            className="fixed top-9 right-2 z-[81] flex w-80 flex-col gap-3 rounded-2xl border border-white/10 bg-[color:var(--surface-hi)]/95 p-3 shadow-2xl backdrop-blur-2xl"
          >
            <Widget>
              <div className="flex items-center gap-2 text-xs text-white/70">
                <Calendar className="h-3.5 w-3.5" />
                <span>{dow}</span>
              </div>
              <div className="mt-1 text-2xl font-bold text-white">{day}</div>
              <div className="mt-1 text-[11px] text-white/50">No events today</div>
            </Widget>

            <Widget>
              <div className="mb-2 flex items-center gap-2 text-xs text-white/70">
                <Briefcase className="h-3.5 w-3.5" />
                <span>Hire Me</span>
              </div>
              <p className="text-xs text-white/80">
                Open to Director-level AI roles. Founder · Responsible AI · RLHF.
              </p>
              <a
                href={`mailto:${profile.email}?subject=Let's%20talk`}
                className="mt-3 inline-flex items-center gap-1 rounded-full bg-[color:var(--accent)] px-3 py-1 text-[11px] font-medium text-white"
              >
                <Mail className="h-3.5 w-3.5" /> Email me
              </a>
            </Widget>

            <Widget>
              <div className="mb-1 text-xs font-semibold text-white">Tips</div>
              <ul className="space-y-1 text-[11px] text-white/70">
                <li>⌘K · Spotlight search</li>
                <li>F3 · Mission Control</li>
                <li>Drag any window · Snap on edge</li>
              </ul>
            </Widget>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Widget({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">{children}</div>
  );
}

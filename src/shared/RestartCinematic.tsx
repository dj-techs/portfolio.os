"use client";

import { motion } from "framer-motion";
import { AppleLogo } from "@/shared/AppleLogo";

type Props = {
  from: "macos" | "arch";
  to: "macos" | "arch";
};

/**
 * Full-screen restart animation shown when switching OSes.
 * - macOS → arch: fade to black → "Shutting down..." → reveal GRUB-ish line → navigate
 * - arch → macOS: systemd halt lines reversed → black → Apple logo → navigate
 *
 * The component only renders the animation; the caller is responsible for
 * unmounting it after navigating to the new route (so the arriving OS's own
 * boot sequence can play).
 */
export default function RestartCinematic({ from, to }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black text-white"
    >
      {from === "macos" ? <MacLeaving toArch={to === "arch"} /> : <ArchLeaving toMac={to === "macos"} />}
    </motion.div>
  );
}

function MacLeaving({ toArch }: { toArch: boolean }) {
  return (
    <div className="flex flex-col items-center gap-6">
      <motion.div
        initial={{ scale: 1, opacity: 1 }}
        animate={{ scale: 0.9, opacity: 0.6 }}
        transition={{ duration: 1.4 }}
      >
        <AppleLogo className="h-16 w-16" />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="font-mono text-xs text-white/70"
      >
        {toArch ? "Booting Arch Linux…" : "Restarting…"}
      </motion.div>
      <div className="h-[2px] w-48 overflow-hidden rounded-full bg-white/10">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
          className="h-full bg-white/80"
        />
      </div>
    </div>
  );
}

function ArchLeaving({ toMac }: { toMac: boolean }) {
  const lines = [
    "[  OK  ] Stopped NetworkManager.service.",
    "[  OK  ] Stopped dbus.service.",
    "[  OK  ] Unmounted /home.",
    "[  OK  ] Reached target Shutdown.",
    "[  OK  ] System halt.",
  ];
  return (
    <div className="w-full max-w-xl font-mono text-[12px] leading-5 text-[color:var(--term-green)]">
      {lines.map((line, i) => (
        <motion.div
          key={line}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 + i * 0.18 }}
        >
          {line}
        </motion.div>
      ))}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="mt-4 text-white/70"
      >
        {toMac ? "→ Booting macOS" : "→ Restarting"}
      </motion.div>
    </div>
  );
}

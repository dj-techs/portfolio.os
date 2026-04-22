"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { GrubScreen, SystemdScroll, TtyLogin, type BootStage } from "./BootStages";
import Terminal from "./Terminal";
import RestartCinematic from "@/shared/RestartCinematic";
import MobileFallback from "@/shared/MobileFallback";
import { useOsStore } from "@/store/os";

type RestartTarget = "boot" | "macos" | null;

export default function ArchShell() {
  const [stage, setStage] = useState<BootStage>("grub");
  const [restartTo, setRestartTo] = useState<RestartTarget>(null);
  const router = useRouter();
  const setLastOS = useOsStore((s) => s.setLastOS);

  useEffect(() => {
    setLastOS("arch");
  }, [setLastOS]);

  // During the cinematic, hold 2s then navigate to the chosen destination.
  useEffect(() => {
    if (!restartTo) return;
    const dest = restartTo === "macos" ? "/macos" : "/";
    const t = setTimeout(() => router.push(dest), 2000);
    return () => clearTimeout(t);
  }, [restartTo, router]);

  const restarting = restartTo !== null;
  // Direction flag so the cinematic can show the right "arriving OS" hint.
  const cinematicTo: "macos" | "arch" = restartTo === "macos" ? "macos" : "arch";

  return (
    <div className="theme-arch relative h-dvh overflow-hidden bg-[color:var(--bg)] text-[color:var(--fg)]">
      <AnimatePresence>
        {stage === "grub" && (
          <GrubScreen key="grub" onDone={() => setStage("systemd")} />
        )}
        {stage === "systemd" && (
          <SystemdScroll key="systemd" onDone={() => setStage("login")} />
        )}
        {stage === "login" && (
          <TtyLogin key="login" onDone={() => setStage("ready")} />
        )}
      </AnimatePresence>

      {stage === "ready" && !restarting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex h-full flex-col"
        >
          <TopBar />
          <div className="min-h-0 flex-1">
            <Terminal
              autoRun="os --help"
              onReboot={() => setRestartTo("boot")}
              onSwitchOS={(t) => setRestartTo(t)}
            />
          </div>
        </motion.div>
      )}

      {restarting && <RestartCinematic from="arch" to={cinematicTo} />}
      <MobileFallback />
    </div>
  );
}

function TopBar() {
  // Thin status line that participates in layout (not fixed-overlay).
  return (
    <div className="flex h-6 shrink-0 items-center justify-between border-b border-[color:var(--border)] bg-black/40 px-3 font-mono text-[11px] text-white/50">
      <span>tty1 · guest@archlinux</span>
      <span>
        <kbd>Ctrl</kbd>+<kbd>L</kbd> clear · <kbd>Ctrl</kbd>+<kbd>R</kbd> search · type{" "}
        <span className="text-[color:var(--accent)]">reboot</span> to leave
      </span>
    </div>
  );
}

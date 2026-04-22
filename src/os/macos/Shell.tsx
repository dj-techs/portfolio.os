"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import BootSequence from "./BootSequence";
import MenuBar from "./MenuBar";
import Dock from "./Dock";
import Desktop from "./Desktop";
import AppHost from "./AppHost";
import Spotlight from "./Spotlight";
import MissionControl from "./MissionControl";
import Launchpad from "./Launchpad";
import NotificationCenter from "./NotificationCenter";
import RestartCinematic from "@/shared/RestartCinematic";
import MobileFallback from "@/shared/MobileFallback";
import { useMacUI } from "./uiStore";
import { useWindowsStore } from "@/store/windows";
import { useOsStore } from "@/store/os";

export default function MacOsShell() {
  const [booted, setBooted] = useState(false);
  const { restarting } = useMacUI();
  const router = useRouter();
  const setLastOS = useOsStore((s) => s.setLastOS);
  const closeAll = useWindowsStore((s) => s.closeAll);

  // Mark this OS as last-used as soon as we land
  useEffect(() => {
    setLastOS("macos");
  }, [setLastOS]);

  // When restart is triggered, close all windows + navigate after cinematic
  useEffect(() => {
    if (!restarting) return;
    closeAll();
    const t = setTimeout(() => router.push("/arch"), 1800);
    return () => clearTimeout(t);
  }, [restarting, router, closeAll]);

  // Global keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && (e.key === "k" || e.code === "Space")) {
        e.preventDefault();
        useMacUI.getState().openSpotlight();
      }
      if (e.key === "F4") {
        e.preventDefault();
        useMacUI.getState().openLaunchpad();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="theme-macos relative h-dvh overflow-hidden">
      {/* Wallpaper */}
      <div className="absolute inset-0" style={{ background: "var(--bg)" }} />

      <AnimatePresence>
        {!booted && <BootSequence key="boot" onDone={() => setBooted(true)} />}
      </AnimatePresence>

      {booted && (
        <>
          <MenuBar />
          <Desktop />
          <AppHost />
          <Dock />
          <Spotlight />
          <MissionControl />
          <Launchpad />
          <NotificationCenter />
        </>
      )}

      {restarting && <RestartCinematic from="macos" to="arch" />}
      <MobileFallback />
    </div>
  );
}

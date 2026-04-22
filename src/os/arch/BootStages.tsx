"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export type BootStage = "grub" | "systemd" | "login" | "ready";

const systemdLines = [
  "[  OK  ] Started udev Kernel Device Manager.",
  "[  OK  ] Reached target System Initialization.",
  "[  OK  ] Started dbus.service.",
  "[  OK  ] Started NetworkManager.service.",
  "[  OK  ] Reached target Network.",
  "[  OK  ] Started OpenSSH Daemon.",
  "[  OK  ] Reached target Multi-User System.",
  "[  OK  ] Started Login Service.",
  "[  OK  ] Reached target Graphical Interface.",
];

export function GrubScreen({ onDone }: { onDone: () => void }) {
  const [selected, setSelected] = useState(0);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const t = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (countdown <= 0) onDone();
  }, [countdown, onDone]);

  const options = [
    "Arch Linux",
    "Arch Linux, with Linux linux-lts (fallback initramfs)",
    "Advanced options for Arch Linux",
  ];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") setSelected((s) => Math.max(0, s - 1));
      if (e.key === "ArrowDown")
        setSelected((s) => Math.min(options.length - 1, s + 1));
      if (e.key === "Enter") onDone();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onDone, options.length]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black text-[#d9d9d9]">
      <div className="w-full max-w-2xl border border-white/40 font-mono text-sm">
        <div className="border-b border-white/40 px-4 py-2 text-center">
          GNU GRUB  version 2.12
        </div>
        <div className="p-4">
          {options.map((o, i) => (
            <div
              key={o}
              className={
                i === selected ? "bg-white text-black" : "text-[#d9d9d9]"
              }
            >
              &nbsp;{o}&nbsp;
            </div>
          ))}
        </div>
        <div className="border-t border-white/40 p-3 text-xs">
          Use the ↑ and ↓ keys to select which entry is highlighted.
          <br />
          Press Enter to boot the selected OS.
          <br />
          <br />
          The highlighted entry will be executed automatically in {countdown}s.
        </div>
      </div>
    </div>
  );
}

export function SystemdScroll({ onDone }: { onDone: () => void }) {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    if (visible >= systemdLines.length) {
      const t = setTimeout(onDone, 400);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setVisible(visible + 1), 120);
    return () => clearTimeout(t);
  }, [visible, onDone]);

  // Allow skip
  useEffect(() => {
    const onKey = () => setVisible(systemdLines.length);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black p-6 font-mono text-[12px] leading-5 text-[color:var(--term-green)]">
      <div className="mb-2 text-white/70">
        Arch Linux 6.10.0-arch1-1 (tty1)
      </div>
      {systemdLines.slice(0, visible).map((l) => (
        <motion.div
          key={l}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <span className="text-white/80">[  </span>
          <span className="text-[color:var(--term-green)]">OK</span>
          <span className="text-white/80">  ] </span>
          {l.replace(/^\[\s+OK\s+\] /, "")}
        </motion.div>
      ))}
      <div className="mt-3 text-[10px] text-white/40">
        (press any key to skip)
      </div>
    </div>
  );
}

export function TtyLogin({ onDone }: { onDone: () => void }) {
  const [typed, setTyped] = useState("");
  const [phase, setPhase] = useState<"username" | "password" | "done">("username");

  useEffect(() => {
    if (phase !== "username") return;
    const target = "guest";
    if (typed.length >= target.length) {
      const t = setTimeout(() => setPhase("password"), 400);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setTyped(target.slice(0, typed.length + 1)), 120);
    return () => clearTimeout(t);
  }, [typed, phase]);

  useEffect(() => {
    if (phase !== "password") return;
    const t = setTimeout(() => setPhase("done"), 900);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase === "done") {
      const t = setTimeout(onDone, 400);
      return () => clearTimeout(t);
    }
  }, [phase, onDone]);

  return (
    <div className="fixed inset-0 z-[100] bg-black p-6 font-mono text-sm text-[color:var(--fg)]">
      <div>Arch Linux 6.10.0-arch1-1 (tty1)</div>
      <div className="mt-6">
        arch login: <span className="text-white">{typed}</span>
        {phase === "username" && <BlinkCursor />}
      </div>
      {phase !== "username" && (
        <div>
          Password: <span className="text-white/60">•••••••</span>
          {phase === "password" && <BlinkCursor />}
        </div>
      )}
      {phase === "done" && (
        <div className="mt-2 text-white/60">
          Last login: {new Date().toUTCString()} from 127.0.0.1
        </div>
      )}
    </div>
  );
}

function BlinkCursor() {
  return (
    <span className="ml-0.5 inline-block h-4 w-2 animate-pulse bg-white/80 align-middle" />
  );
}

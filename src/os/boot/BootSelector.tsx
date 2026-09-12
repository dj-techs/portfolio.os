"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TerminalSquare, ExternalLink, HelpCircle } from "lucide-react";
import { AppleLogo } from "@/shared/AppleLogo";
import { useOsStore, type OS } from "@/store/os";
import { useHydrated } from "@/shared/useHydrated";

export default function BootSelector() {
  const hydrated = useHydrated();
  const lastOS = useOsStore((s) => s.lastOS);
  const setLastOS = useOsStore((s) => s.setLastOS);

  const [focused, setFocused] = useState<OS>("macos");
  const [showHelp, setShowHelp] = useState(false);
  const [phase, setPhase] = useState<"power" | "ready">("power");

  // Seed focus from last chosen OS once persisted state hydrates.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (hydrated && lastOS) setFocused(lastOS);
  }, [hydrated, lastOS]);

  // Power-on fade → ready state.
  useEffect(() => {
    const t = setTimeout(() => setPhase("ready"), 420);
    return () => clearTimeout(t);
  }, []);

  // Keyboard nav.
  const linkRefs = {
    macos: useRef<HTMLAnchorElement>(null),
    arch: useRef<HTMLAnchorElement>(null),
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (showHelp && e.key === "Escape") {
        setShowHelp(false);
        return;
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        setFocused("macos");
      } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        setFocused("arch");
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        linkRefs[focused].current?.click();
      } else if (e.key === "?" || (e.shiftKey && e.key === "/")) {
        setShowHelp((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // linkRefs is an object with stable refs created once; safe to omit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focused, showHelp]);

  const handleBoot = (os: OS) => setLastOS(os);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: phase === "ready" ? 1 : 0.2 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-4xl px-6"
    >
      {/* Subtle CRT-ish scanline vignette */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      <header className="mb-12 text-center">
        <motion.h1
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-semibold tracking-tight"
        >
          Choose your OS
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.35 }}
          className="mt-2 text-sm text-neutral-400"
        >
          <kbd className="kbd">←</kbd> / <kbd className="kbd">→</kbd> to move ·{" "}
          <kbd className="kbd">Enter</kbd> to boot ·{" "}
          <kbd className="kbd">?</kbd> for help
        </motion.p>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <OsCard
          href="/macos"
          label="macOS"
          subtitle="Desktop · Dock · Finder"
          description="The full Mac experience — windows, menu bar, Spotlight, and Preview.app for the résumé."
          icon={<AppleLogo className="h-16 w-16" />}
          accent="from-pink-500/40 via-purple-500/30 to-blue-500/40"
          focused={focused === "macos"}
          isLast={hydrated && lastOS === "macos"}
          onFocus={() => setFocused("macos")}
          onBoot={() => handleBoot("macos")}
          forwardedRef={linkRefs.macos}
        />
        <OsCard
          href="/arch"
          label="Arch Linux"
          subtitle="Terminal · bash · neofetch"
          description="BTW, I use Arch. Boot into a terminal and type `os --help` to get started."
          icon={<TerminalSquare className="h-16 w-16" strokeWidth={1.25} />}
          accent="from-cyan-500/40 via-sky-500/30 to-indigo-600/40"
          focused={focused === "arch"}
          isLast={hydrated && lastOS === "arch"}
          onFocus={() => setFocused("arch")}
          onBoot={() => handleBoot("arch")}
          // eslint-disable-next-line react-hooks/refs
          forwardedRef={linkRefs.arch}
        />
      </div>

      <footer className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-neutral-500">
        <Link href="/plain" className="hover:text-neutral-200 underline-offset-4 hover:underline">
          Skip · plain resume
        </Link>
        <a
          href="https://github.com/dj-techs"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 hover:text-neutral-200"
        >
          <ExternalLink className="h-3.5 w-3.5" /> GitHub
        </a>
        <button
          onClick={() => setShowHelp(true)}
          className="inline-flex items-center gap-1.5 hover:text-neutral-200"
        >
          <HelpCircle className="h-3.5 w-3.5" /> What is this?
        </button>
      </footer>

      <AnimatePresence>
        {showHelp && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="what-is-this-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowHelp(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.96, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-lg rounded-2xl border border-white/10 bg-neutral-950/95 p-8 text-sm leading-relaxed text-neutral-300 shadow-2xl"
            >
              <h2 id="what-is-this-title" className="mb-3 text-lg font-semibold text-white">
                What is this?
              </h2>
              <p className="mb-3">
                This is the portfolio of <strong>D. James Fusilier</strong> — AI product leader and
                founder of AlamoIQ and WeghachiAI, building responsible, multi-agent AI for regulated
                industries.
              </p>
              <p className="mb-3">
                Instead of a scrolling résumé, pick an OS and explore. Both shells share the same content
                — projects, résumé, skills — just presented in two very different ways.
              </p>
              <p className="mb-5 text-neutral-500">
                Prefer something plainer? There&apos;s a{" "}
                <Link href="/plain" className="underline">
                  classic résumé view
                </Link>{" "}
                that works great for recruiters and screen readers.
              </p>
              <button
                onClick={() => setShowHelp(false)}
                className="rounded-full bg-white px-4 py-1.5 text-xs font-medium text-black"
              >
                Got it
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        :global(.kbd) {
          display: inline-block;
          padding: 1px 6px;
          border-radius: 4px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: rgba(255, 255, 255, 0.05);
          font-family: var(--font-mono);
          font-size: 11px;
          color: rgba(255, 255, 255, 0.85);
        }
      `}</style>
    </motion.div>
  );
}

function OsCard({
  href,
  label,
  subtitle,
  description,
  icon,
  accent,
  focused,
  isLast,
  onFocus,
  onBoot,
  forwardedRef,
}: {
  href: string;
  label: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  accent: string;
  focused: boolean;
  isLast: boolean;
  onFocus: () => void;
  onBoot: () => void;
  forwardedRef: React.RefObject<HTMLAnchorElement | null>;
}) {
  return (
    <Link
      ref={forwardedRef}
      href={href}
      onMouseEnter={onFocus}
      onFocus={onFocus}
      onClick={onBoot}
      className={[
        "group relative flex flex-col items-center gap-5 overflow-hidden rounded-2xl border p-10 text-center transition-all",
        "bg-neutral-900/50 hover:bg-neutral-900/80 backdrop-blur",
        focused
          ? "border-white/30 ring-2 ring-white/20 scale-[1.02]"
          : "border-white/10",
      ].join(" ")}
    >
      <div
        aria-hidden
        className={[
          "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-60 transition-opacity",
          accent,
          focused ? "opacity-100" : "opacity-30 group-hover:opacity-60",
        ].join(" ")}
      />
      <div className="relative text-white">{icon}</div>
      <div className="relative">
        <div className="text-xl font-semibold tracking-tight">{label}</div>
        <div className="text-xs text-neutral-400">{subtitle}</div>
        <p className="mt-3 max-w-xs text-xs text-neutral-500">{description}</p>
      </div>
      {isLast && (
        <span className="absolute top-3 right-3 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white/80">
          last used
        </span>
      )}
    </Link>
  );
}

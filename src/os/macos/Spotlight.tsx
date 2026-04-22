"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search, FileText, Folder, User, Sparkles, Briefcase, Settings, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMacUI } from "./uiStore";
import { useWindowsStore } from "@/store/windows";
import { projects } from "@/content/projects";
import { cn } from "@/lib/cn";

type Hit = {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  onOpen: () => void;
};

function useCatalog(close: () => void): Hit[] {
  const { launch } = useWindowsStore();
  return useMemo(() => {
    const hits: Hit[] = [
      {
        id: "app-finder",
        title: "Finder",
        subtitle: "Application",
        icon: <Folder className="h-4 w-4 text-sky-400" />,
        onOpen: () => {
          launch({
            id: "finder-singleton",
            app: "finder",
            title: "Finder — Projects",
            w: 760,
            h: 480,
          });
          close();
        },
      },
      {
        id: "app-preview",
        title: "Preview — Resume.pdf",
        subtitle: "Application · PDF",
        icon: <FileText className="h-4 w-4 text-red-400" />,
        onOpen: () => {
          launch({
            id: "preview-resume",
            app: "preview",
            title: "Preview — Resume.pdf",
            w: 720,
            h: 600,
            props: { src: "/Resume.pdf" },
          });
          close();
        },
      },
      {
        id: "app-aboutme",
        title: "About Me",
        subtitle: "Application",
        icon: <User className="h-4 w-4 text-pink-400" />,
        onOpen: () => {
          launch({ id: "aboutme-singleton", app: "aboutme", title: "About Me", w: 520, h: 560 });
          close();
        },
      },
      {
        id: "app-skills",
        title: "Skills",
        subtitle: "Application",
        icon: <Sparkles className="h-4 w-4 text-amber-400" />,
        onOpen: () => {
          launch({ id: "skills-singleton", app: "skills", title: "Skills", w: 640, h: 480 });
          close();
        },
      },
      {
        id: "app-experience",
        title: "Experience",
        subtitle: "Application",
        icon: <Briefcase className="h-4 w-4 text-emerald-400" />,
        onOpen: () => {
          launch({ id: "experience-singleton", app: "experience", title: "Experience", w: 720, h: 560 });
          close();
        },
      },
      {
        id: "app-messages",
        title: "Messages",
        subtitle: "Application · AI assistant (coming soon)",
        icon: <MessageCircle className="h-4 w-4 text-green-400" />,
        onOpen: () => {
          launch({ id: "messages-singleton", app: "messages", title: "Messages", w: 600, h: 480 });
          close();
        },
      },
      {
        id: "app-settings",
        title: "System Settings",
        subtitle: "Application",
        icon: <Settings className="h-4 w-4 text-neutral-400" />,
        onOpen: () => {
          launch({ id: "settings-singleton", app: "settings", title: "System Settings", w: 680, h: 500 });
          close();
        },
      },
      ...projects.map<Hit>((p) => ({
        id: `project-${p.slug}`,
        title: p.title,
        subtitle: `${p.company} · ${p.year} · Project`,
        icon: <FileText className="h-4 w-4 text-violet-400" />,
        onOpen: () => {
          launch({
            app: "preview",
            title: `Preview — ${p.title}`,
            w: 640,
            h: 520,
            props: { kind: "project", slug: p.slug },
          });
          close();
        },
      })),
    ];
    return hits;
  }, [launch, close]);
}

export default function Spotlight() {
  const { spotlightOpen, closeSpotlight } = useMacUI();
  const [query, setQuery] = useState("");
  const [idx, setIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const catalog = useCatalog(closeSpotlight);
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return catalog.slice(0, 6);
    return catalog
      .filter(
        (h) =>
          h.title.toLowerCase().includes(q) || h.subtitle.toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [catalog, query]);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (spotlightOpen) {
      setQuery("");
      setIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [spotlightOpen]);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIdx(0);
  }, [query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === " ")) {
        e.preventDefault();
        useMacUI.getState().openSpotlight();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") closeSpotlight();
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIdx((i) => Math.min(results.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIdx((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      results[idx]?.onOpen();
    }
  };

  return (
    <AnimatePresence>
      {spotlightOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-start justify-center bg-black/30 pt-32 backdrop-blur-sm"
          onClick={closeSpotlight}
        >
          <motion.div
            initial={{ scale: 0.96, y: -8 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: -8 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl rounded-2xl border border-white/10 bg-[color:var(--surface-hi)]/95 shadow-2xl backdrop-blur-2xl"
          >
            <div className="flex items-center gap-3 px-4 py-3">
              <Search className="h-5 w-5 text-white/60" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKey}
                placeholder="Spotlight Search"
                className="flex-1 bg-transparent text-lg text-white placeholder:text-white/40 focus:outline-none"
                aria-label="Spotlight Search"
              />
            </div>
            {results.length > 0 && (
              <ul className="border-t border-white/5 py-2 text-sm">
                {results.map((r, i) => (
                  <li key={r.id}>
                    <button
                      onMouseEnter={() => setIdx(i)}
                      onClick={r.onOpen}
                      className={cn(
                        "flex w-full items-center gap-3 px-4 py-1.5 text-left",
                        i === idx ? "bg-[color:var(--accent)] text-white" : "text-white/80"
                      )}
                    >
                      <span className="shrink-0">{r.icon}</span>
                      <span className="flex-1 truncate">{r.title}</span>
                      <span className="truncate text-[10px] text-white/50">
                        {r.subtitle}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

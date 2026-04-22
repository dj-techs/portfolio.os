"use client";

import { useState } from "react";
import {
  Folder,
  FileText,
  User,
  Sparkles,
  Briefcase,
  MessageCircle,
  Settings,
  Globe,
  Trash2,
} from "lucide-react";
import { useWindowsStore, type AppId } from "@/store/windows";
import { useMacUI } from "./uiStore";

type DockItem = {
  id: AppId | "trash" | "launchpad";
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  /** Visual tint for the square tile */
  tint?: string;
};

export default function Dock() {
  const { launch, windows } = useWindowsStore();
  const { openLaunchpad } = useMacUI();
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const hasOpen = (app: AppId) =>
    windows.some((w) => w.app === app && !w.minimized);

  const items: DockItem[] = [
    {
      id: "finder",
      label: "Finder",
      icon: <Folder className="h-8 w-8" />,
      tint: "from-sky-400 to-blue-600",
      onClick: () =>
        launch({
          id: "finder-singleton",
          app: "finder",
          title: "Finder — Projects",
          w: 760,
          h: 480,
        }),
    },
    {
      id: "launchpad",
      label: "Launchpad",
      icon: <Sparkles className="h-8 w-8" />,
      tint: "from-slate-300 to-slate-500",
      onClick: openLaunchpad,
    },
    {
      id: "preview",
      label: "Preview",
      icon: <FileText className="h-8 w-8" />,
      tint: "from-indigo-400 to-violet-600",
      onClick: () =>
        launch({
          id: "preview-resume",
          app: "preview",
          title: "Preview — Resume.pdf",
          w: 720,
          h: 600,
          props: { src: "/Resume.pdf" },
        }),
    },
    {
      id: "aboutme",
      label: "About Me",
      icon: <User className="h-8 w-8" />,
      tint: "from-pink-400 to-rose-600",
      onClick: () =>
        launch({
          id: "aboutme-singleton",
          app: "aboutme",
          title: "About Me",
          w: 520,
          h: 560,
        }),
    },
    {
      id: "skills",
      label: "Skills",
      icon: <Sparkles className="h-8 w-8" />,
      tint: "from-amber-400 to-orange-600",
      onClick: () =>
        launch({
          id: "skills-singleton",
          app: "skills",
          title: "Skills",
          w: 640,
          h: 480,
        }),
    },
    {
      id: "experience",
      label: "Experience",
      icon: <Briefcase className="h-8 w-8" />,
      tint: "from-teal-400 to-emerald-600",
      onClick: () =>
        launch({
          id: "experience-singleton",
          app: "experience",
          title: "Experience",
          w: 720,
          h: 560,
        }),
    },
    {
      id: "messages",
      label: "Messages",
      icon: <MessageCircle className="h-8 w-8" />,
      tint: "from-lime-400 to-green-600",
      onClick: () =>
        launch({
          id: "messages-singleton",
          app: "messages",
          title: "Messages",
          w: 600,
          h: 480,
        }),
    },
    {
      id: "safari",
      label: "Safari (GitHub)",
      icon: <Globe className="h-8 w-8" />,
      tint: "from-cyan-300 to-sky-500",
      onClick: () => {
        window.open("https://github.com/dj-techs", "_blank", "noopener,noreferrer");
      },
    },
    {
      id: "settings",
      label: "System Settings",
      icon: <Settings className="h-8 w-8" />,
      tint: "from-neutral-300 to-neutral-600",
      onClick: () =>
        launch({
          id: "settings-singleton",
          app: "settings",
          title: "System Settings",
          w: 680,
          h: 500,
        }),
    },
    {
      id: "trash",
      label: "Trash",
      icon: <Trash2 className="h-8 w-8" />,
      tint: "from-neutral-500 to-neutral-700",
      onClick: () => {},
    },
  ];

  return (
    <div className="fixed inset-x-0 bottom-2 z-[55] flex justify-center">
      <div
        onMouseLeave={() => setHoverIdx(null)}
        className="flex items-end gap-1.5 rounded-2xl border border-white/10 bg-white/10 px-3 py-1.5 shadow-2xl backdrop-blur-2xl"
      >
        {items.map((it, i) => {
          const dist = hoverIdx == null ? null : Math.abs(i - hoverIdx);
          const scale =
            dist == null ? 1 : dist === 0 ? 1.35 : dist === 1 ? 1.15 : 1;
          const running =
            (it.id === "finder" || it.id === "preview" || it.id === "aboutme"
              ? hasOpen(it.id as AppId)
              : it.id === "skills" ||
                  it.id === "experience" ||
                  it.id === "messages" ||
                  it.id === "settings"
                ? hasOpen(it.id as AppId)
                : false);

          return (
            <div
              key={`${it.id}-${i}`}
              onMouseEnter={() => setHoverIdx(i)}
              className="group relative flex flex-col items-center"
            >
              {/* Tooltip */}
              {hoverIdx === i && (
                <div className="pointer-events-none absolute -top-7 whitespace-nowrap rounded bg-black/70 px-2 py-0.5 text-[10px] text-white">
                  {it.label}
                </div>
              )}
              <button
                onClick={it.onClick}
                aria-label={it.label}
                style={{
                  transform: `scale(${scale})`,
                  transition: "transform 120ms ease",
                }}
                className={[
                  "grid h-12 w-12 place-items-center rounded-xl border border-white/10 bg-gradient-to-br text-white shadow-md",
                  it.tint ?? "from-neutral-400 to-neutral-600",
                ].join(" ")}
              >
                {it.icon}
              </button>
              {/* Running indicator dot */}
              <div
                className={[
                  "mt-0.5 h-1 w-1 rounded-full transition-opacity",
                  running ? "bg-white opacity-80" : "opacity-0",
                ].join(" ")}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

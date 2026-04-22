"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Folder,
  FileText,
  User,
  Sparkles,
  Briefcase,
  MessageCircle,
  Settings,
} from "lucide-react";
import { useMacUI } from "./uiStore";
import { useWindowsStore, type AppId } from "@/store/windows";

type App = {
  id: AppId;
  label: string;
  icon: React.ReactNode;
  tint: string;
  launch: () => void;
};

export default function Launchpad() {
  const { launchpadOpen, closeLaunchpad } = useMacUI();
  const { launch } = useWindowsStore();

  const apps: App[] = [
    {
      id: "finder",
      label: "Finder",
      icon: <Folder className="h-10 w-10" />,
      tint: "from-sky-400 to-blue-600",
      launch: () =>
        launch({ id: "finder-singleton", app: "finder", title: "Finder — Projects", w: 760, h: 480 }),
    },
    {
      id: "preview",
      label: "Preview",
      icon: <FileText className="h-10 w-10" />,
      tint: "from-indigo-400 to-violet-600",
      launch: () =>
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
      icon: <User className="h-10 w-10" />,
      tint: "from-pink-400 to-rose-600",
      launch: () => launch({ id: "aboutme-singleton", app: "aboutme", title: "About Me", w: 520, h: 560 }),
    },
    {
      id: "skills",
      label: "Skills",
      icon: <Sparkles className="h-10 w-10" />,
      tint: "from-amber-400 to-orange-600",
      launch: () => launch({ id: "skills-singleton", app: "skills", title: "Skills", w: 640, h: 480 }),
    },
    {
      id: "experience",
      label: "Experience",
      icon: <Briefcase className="h-10 w-10" />,
      tint: "from-teal-400 to-emerald-600",
      launch: () => launch({ id: "experience-singleton", app: "experience", title: "Experience", w: 720, h: 560 }),
    },
    {
      id: "messages",
      label: "Messages",
      icon: <MessageCircle className="h-10 w-10" />,
      tint: "from-lime-400 to-green-600",
      launch: () => launch({ id: "messages-singleton", app: "messages", title: "Messages", w: 600, h: 480 }),
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings className="h-10 w-10" />,
      tint: "from-neutral-300 to-neutral-600",
      launch: () =>
        launch({ id: "settings-singleton", app: "settings", title: "System Settings", w: 680, h: 500 }),
    },
  ];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") useMacUI.getState().closeLaunchpad();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <AnimatePresence>
      {launchpadOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[85] flex items-center justify-center bg-black/60 p-12 backdrop-blur-2xl"
          onClick={closeLaunchpad}
        >
          <div
            className="grid max-w-5xl grid-cols-4 gap-10 sm:grid-cols-6 md:grid-cols-7"
            onClick={(e) => e.stopPropagation()}
          >
            {apps.map((a) => (
              <button
                key={a.id}
                onClick={() => {
                  a.launch();
                  closeLaunchpad();
                }}
                className="group flex flex-col items-center gap-2 text-white"
              >
                <div
                  className={`grid h-20 w-20 place-items-center rounded-2xl border border-white/20 bg-gradient-to-br ${a.tint} shadow-lg transition group-hover:scale-110`}
                >
                  {a.icon}
                </div>
                <div className="text-xs">{a.label}</div>
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

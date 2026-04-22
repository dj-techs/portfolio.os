"use client";

import { FileText, Folder } from "lucide-react";
import { useWindowsStore } from "@/store/windows";

type DesktopIcon = {
  label: string;
  icon: React.ReactNode;
  onOpen: () => void;
};

export default function Desktop() {
  const { launch } = useWindowsStore();

  const icons: DesktopIcon[] = [
    {
      label: "Resume.pdf",
      icon: <FileText className="h-10 w-10" />,
      onOpen: () =>
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
      label: "Projects",
      icon: <Folder className="h-10 w-10" />,
      onOpen: () =>
        launch({
          id: "finder-singleton",
          app: "finder",
          title: "Finder — Projects",
          w: 760,
          h: 480,
          props: { startPath: "/Projects" },
        }),
    },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 p-6 pt-12">
      <ul className="pointer-events-auto flex flex-col gap-4">
        {icons.map((it) => (
          <li key={it.label}>
            <button
              onDoubleClick={it.onOpen}
              onClick={(e) => {
                // single-click just focuses visually; double opens
                const target = e.currentTarget;
                target.focus();
              }}
              className="group flex w-24 flex-col items-center gap-1 rounded p-2 text-white focus:bg-white/20"
            >
              <div className="rounded bg-white/10 p-2 backdrop-blur group-hover:bg-white/20">
                {it.icon}
              </div>
              <div className="rounded px-1.5 text-center text-xs leading-tight shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                {it.label}
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

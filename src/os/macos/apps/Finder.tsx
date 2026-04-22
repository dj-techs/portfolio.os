"use client";

import { useState } from "react";
import { Folder, FileText, ChevronRight, User } from "lucide-react";
import { useWindowsStore } from "@/store/windows";
import { projects } from "@/content/projects";
import { cn } from "@/lib/cn";

type Props = {
  startPath?: string;
};

type TreeNode = {
  name: string;
  kind: "folder" | "pdf" | "md" | "app";
  children?: TreeNode[];
  action?: () => void;
};

const tree: TreeNode[] = [
  { name: "About Me.md", kind: "md" },
  { name: "Resume.pdf", kind: "pdf" },
  {
    name: "Projects",
    kind: "folder",
    children: projects.map((p) => ({
      name: `${p.slug}.md`,
      kind: "md" as const,
    })),
  },
  {
    name: "Skills",
    kind: "folder",
    children: [{ name: "skills.md", kind: "md" }],
  },
  {
    name: "Experience",
    kind: "folder",
    children: [{ name: "career.md", kind: "md" }],
  },
];

export default function Finder({ startPath = "/" }: Props) {
  const [path, setPath] = useState<string[]>(
    startPath === "/" ? [] : startPath.split("/").filter(Boolean)
  );
  const [selected, setSelected] = useState<string | null>(null);
  const { launch } = useWindowsStore();

  const current = resolve(tree, path);

  const sidebar = [
    { label: "Projects", path: ["Projects"] },
    { label: "Skills", path: ["Skills"] },
    { label: "Experience", path: ["Experience"] },
    { label: "Home", path: [] as string[] },
  ];

  return (
    <div className="flex h-full text-sm text-white/90">
      {/* Sidebar */}
      <aside className="w-44 shrink-0 border-r border-white/5 bg-white/5 p-2 text-xs">
        <div className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-wider text-white/50">
          Favorites
        </div>
        {sidebar.map((s) => (
          <button
            key={s.label}
            onClick={() => setPath(s.path)}
            className={cn(
              "flex w-full items-center gap-2 rounded px-2 py-1 text-left hover:bg-white/10",
              path.join("/") === s.path.join("/") && "bg-white/10"
            )}
          >
            <Folder className="h-3.5 w-3.5 text-sky-400" />
            {s.label}
          </button>
        ))}
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-1 border-b border-white/5 px-3 py-1.5 text-xs text-white/60">
          <button
            onClick={() => setPath([])}
            className="hover:text-white"
          >
            /
          </button>
          {path.map((seg, i) => (
            <span key={i} className="flex items-center gap-1">
              <ChevronRight className="h-3 w-3" />
              <button
                onClick={() => setPath(path.slice(0, i + 1))}
                className="hover:text-white"
              >
                {seg}
              </button>
            </span>
          ))}
        </div>

        <ul className="grid flex-1 auto-rows-min grid-cols-[repeat(auto-fill,minmax(96px,1fr))] content-start gap-3 overflow-auto p-4">
          {current.map((node) => (
            <li key={node.name}>
              <button
                onDoubleClick={() => handleOpen(node)}
                onClick={() => setSelected(node.name)}
                className={cn(
                  "flex w-full flex-col items-center gap-1 rounded p-2",
                  selected === node.name ? "bg-[color:var(--accent)]/30" : "hover:bg-white/5"
                )}
              >
                <div className="grid h-14 w-14 place-items-center">
                  {node.kind === "folder" ? (
                    <Folder className="h-10 w-10 text-sky-400" />
                  ) : node.kind === "pdf" ? (
                    <div className="relative">
                      <FileText className="h-10 w-10 text-red-400" />
                      <span className="absolute -bottom-1 -right-1 rounded bg-red-500 px-1 text-[8px] font-bold text-white">
                        PDF
                      </span>
                    </div>
                  ) : node.kind === "app" ? (
                    <User className="h-10 w-10 text-pink-400" />
                  ) : (
                    <FileText className="h-10 w-10 text-neutral-300" />
                  )}
                </div>
                <span className="text-center text-[11px] leading-tight break-all">
                  {node.name}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  function handleOpen(node: TreeNode) {
    if (node.kind === "folder") {
      setPath([...path, node.name]);
    } else if (node.kind === "pdf" || node.name === "Resume.pdf") {
      launch({
        id: "preview-resume",
        app: "preview",
        title: "Preview — Resume.pdf",
        w: 720,
        h: 600,
        props: { src: "/Resume.pdf" },
      });
    } else if (node.name.endsWith(".md")) {
      // Project docs open in a Preview-like text reader
      if (path[0] === "Projects") {
        const slug = node.name.replace(/\.md$/, "");
        const p = projects.find((x) => x.slug === slug);
        if (p) {
          launch({
            app: "preview",
            title: `Preview — ${p.title}`,
            w: 640,
            h: 520,
            props: { kind: "project", slug },
          });
        }
      } else if (node.name === "skills.md") {
        launch({
          id: "skills-singleton",
          app: "skills",
          title: "Skills",
          w: 640,
          h: 480,
        });
      } else if (node.name === "career.md") {
        launch({
          id: "experience-singleton",
          app: "experience",
          title: "Experience",
          w: 720,
          h: 560,
        });
      } else if (node.name === "About Me.md") {
        launch({
          id: "aboutme-singleton",
          app: "aboutme",
          title: "About Me",
          w: 520,
          h: 560,
        });
      }
    }
  }
}

function resolve(nodes: TreeNode[], path: string[]): TreeNode[] {
  if (path.length === 0) return nodes;
  const [head, ...rest] = path;
  const match = nodes.find((n) => n.name === head);
  if (!match || !match.children) return [];
  return resolve(match.children, rest);
}

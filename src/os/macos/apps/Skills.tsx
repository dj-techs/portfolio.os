"use client";

import { useState } from "react";
import { skills } from "@/content/skills";
import { cn } from "@/lib/cn";

export default function Skills() {
  const [active, setActive] = useState<string>(skills[0].category);
  const current = skills.find((s) => s.category === active)!;

  return (
    <div className="flex h-full bg-neutral-950 text-white">
      <aside className="w-44 shrink-0 border-r border-white/5 bg-white/5 p-2">
        {skills.map((g) => (
          <button
            key={g.category}
            onClick={() => setActive(g.category)}
            className={cn(
              "flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-xs hover:bg-white/10",
              active === g.category && "bg-[color:var(--accent)]/80 text-white"
            )}
          >
            <span className="truncate">{g.category}</span>
            <span className="text-[10px] text-white/60">{g.items.length}</span>
          </button>
        ))}
      </aside>
      <main className="flex-1 overflow-auto p-6">
        <h1 className="mb-4 text-lg font-semibold">{current.category}</h1>
        <ul className="flex flex-wrap gap-2">
          {current.items.map((item) => (
            <li
              key={item}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs"
            >
              {item}
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

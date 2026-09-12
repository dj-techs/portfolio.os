"use client";

import { useState } from "react";
import { experience, formatDates } from "@/content/experience";
import { cn } from "@/lib/cn";

export default function Experience() {
  const [openIdx, setOpenIdx] = useState<number>(0);

  return (
    <div className="h-full overflow-auto bg-neutral-950 px-6 py-5 text-white">
      <h1 className="mb-1 text-lg font-semibold">Experience</h1>
      <p className="mb-6 text-xs text-white/50">
        Click a role to expand
      </p>

      <ol className="relative space-y-3 border-l border-white/10 pl-5">
        {experience.map((role, i) => {
          const open = openIdx === i;
          return (
            <li key={role.company + role.title} className="relative">
              <span className="absolute -left-[7px] top-3 h-2.5 w-2.5 rounded-full bg-[color:var(--accent)] ring-4 ring-neutral-950" />
              <button
                onClick={() => setOpenIdx(open ? -1 : i)}
                className={cn(
                  "w-full rounded-lg border border-white/10 bg-white/5 p-3 text-left transition",
                  open && "bg-white/10"
                )}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <div className="text-sm font-semibold">{role.title}</div>
                    <div className="text-[11px] text-white/60">{role.company}</div>
                  </div>
                  <div className="text-[11px] text-white/50">
                    {formatDates(role)}
                    {role.location ? (
                      <span className="ml-2 text-white/30">· {role.location}</span>
                    ) : null}
                  </div>
                </div>
                {open && (
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-[12px] text-white/80">
                    {role.bullets.map((b, k) => (
                      <li key={k}>{b}</li>
                    ))}
                  </ul>
                )}
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

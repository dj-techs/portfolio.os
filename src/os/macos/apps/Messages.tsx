"use client";

import { useState } from "react";
import { profile } from "@/content/profile";

export default function Messages() {
  const [draft, setDraft] = useState("");

  return (
    <div className="flex h-full bg-neutral-950 text-white">
      {/* Contact list */}
      <aside className="w-52 shrink-0 border-r border-white/5 bg-white/5 p-2">
        <div className="rounded-lg bg-[color:var(--accent)]/40 p-2 ring-1 ring-[color:var(--accent)]/60">
          <div className="text-xs font-semibold">Claude</div>
          <div className="truncate text-[10px] text-white/70">
            Portfolio assistant · offline
          </div>
        </div>
      </aside>

      {/* Thread */}
      <div className="flex flex-1 flex-col">
        <header className="border-b border-white/5 p-3 text-center text-xs">
          <div className="font-semibold">Claude</div>
          <div className="text-[10px] text-white/50">AI portfolio assistant</div>
        </header>
        <div className="flex flex-1 flex-col gap-3 overflow-auto p-4 text-sm">
          <SystemBubble>
            <strong className="text-white">Coming soon.</strong> The AI portfolio
            assistant is under construction. While it&apos;s offline, you can still
            explore <em>Preview → Resume.pdf</em>, <em>Experience</em>, and{" "}
            <em>Skills</em>.
          </SystemBubble>
          <SystemBubble>
            Want a heads-up when it goes live?{" "}
            <a
              className="text-[color:var(--accent)] hover:underline"
              href={`mailto:${profile.email}?subject=Notify%20me%20%E2%80%94%20AI%20portfolio%20assistant`}
            >
              Email me
            </a>
            .
          </SystemBubble>
        </div>
        <form
          className="flex items-center gap-2 border-t border-white/5 p-3"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Chat is offline — check back soon"
            disabled
            className="flex-1 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/60 placeholder:text-white/30 disabled:cursor-not-allowed"
            aria-label="Message composer"
          />
          <button
            type="submit"
            disabled
            className="rounded-full bg-[color:var(--accent)]/40 px-3 py-1.5 text-[11px] text-white/50"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

function SystemBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-[85%] rounded-2xl bg-white/10 px-4 py-2.5 text-center text-xs text-white/80">
      {children}
    </div>
  );
}

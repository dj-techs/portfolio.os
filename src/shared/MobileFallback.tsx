"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * On narrow viewports (<=640px), the dragging/terminal UX is bad.
 * Show an overlay that invites the user to the plain résumé or continue anyway.
 */
export default function MobileFallback() {
  const [narrow, setNarrow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const check = () =>
      setNarrow(
        typeof window !== "undefined" &&
          (window.matchMedia("(max-width: 640px)").matches ||
            window.matchMedia("(hover: none) and (pointer: coarse)").matches &&
              window.innerWidth < 820)
      );
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!narrow || dismissed) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 p-6 backdrop-blur">
      <div className="max-w-sm rounded-2xl border border-white/10 bg-neutral-900 p-6 text-center text-sm text-white">
        <h2 className="mb-2 text-base font-semibold">Best on desktop</h2>
        <p className="mb-5 text-white/70">
          This portfolio is a full OS — windows, dock, terminal. On a small screen
          the plain résumé is a better read.
        </p>
        <div className="flex flex-col gap-2">
          <Link
            href="/plain"
            className="rounded-full bg-white px-4 py-2 text-xs font-medium text-black"
          >
            Open the plain résumé
          </Link>
          <button
            onClick={() => setDismissed(true)}
            className="rounded-full border border-white/20 px-4 py-2 text-xs"
          >
            Continue anyway
          </button>
        </div>
      </div>
    </div>
  );
}

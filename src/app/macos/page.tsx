import type { Metadata } from "next";
import MacOsShell from "@/os/macos/Shell";

export const metadata: Metadata = {
  title: "macOS",
  description:
    "Explore D. James Fusilier's portfolio in a macOS desktop — Finder, Dock, Preview, and more.",
};

export default function MacOsPage() {
  return (
    <main className="theme-macos relative min-h-dvh overflow-hidden">
      <MacOsShell />
    </main>
  );
}

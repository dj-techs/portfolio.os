import type { Metadata } from "next";
import ArchShell from "@/os/arch/Shell";

export const metadata: Metadata = {
  title: "Arch Linux",
  description:
    "Explore D. James Fusilier's portfolio through an Arch Linux terminal. Try `os --help`.",
};

export default function ArchPage() {
  return (
    <main className="theme-arch relative min-h-dvh overflow-hidden bg-[var(--bg)] text-[var(--fg)]">
      <ArchShell />
    </main>
  );
}

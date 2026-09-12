import type { Metadata } from "next";
import ArchShell from "@/os/arch/Shell";

export const metadata: Metadata = {
  title: "Arch Linux",
  description:
    "Explore the portfolio of D. James Fusilier (Douglas Fusilier) through an Arch Linux terminal. Try `os --help`.",
};

export default function ArchPage() {
  return (
    <main className="theme-arch relative min-h-dvh overflow-hidden bg-[var(--bg)] text-[var(--fg)]">
      <ArchShell />
    </main>
  );
}

import type { Metadata } from "next";
import BootSelector from "@/os/boot/BootSelector";

export const metadata: Metadata = {
  title: "Boot · Choose your OS",
  description:
    "Portfolio of D. James Fusilier (Douglas Fusilier), AI product leader and founder of AlamoIQ and WeghachiAI. Pick macOS or Arch Linux to explore.",
};

export default function BootPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-black text-white">
      <BootSelector />
    </main>
  );
}

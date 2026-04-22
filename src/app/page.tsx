import type { Metadata } from "next";
import BootSelector from "@/os/boot/BootSelector";

export const metadata: Metadata = {
  title: "Boot · Choose your OS",
  description:
    "Pick macOS or Arch Linux to enter D. James Fusilier's portfolio.",
};

export default function BootPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-black text-white">
      <BootSelector />
    </main>
  );
}

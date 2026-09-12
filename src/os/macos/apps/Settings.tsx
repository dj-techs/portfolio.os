"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMacUI } from "../uiStore";
import { Monitor, HardDrive, Power, Volume2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { useOsStore } from "@/store/os";

type Props = {
  pane?: string;
};

type PaneId = "startupDisk" | "about" | "sound" | "display";

export default function Settings({ pane }: Props) {
  const [active, setActive] = useState<PaneId>(
    (pane as PaneId) || "startupDisk"
  );

  return (
    <div className="flex h-full bg-neutral-950 text-white">
      <aside className="w-52 shrink-0 border-r border-white/5 bg-white/5 p-2 text-xs">
        <NavItem
          active={active === "startupDisk"}
          onClick={() => setActive("startupDisk")}
          icon={<HardDrive className="h-4 w-4" />}
        >
          Startup Disk
        </NavItem>
        <NavItem
          active={active === "display"}
          onClick={() => setActive("display")}
          icon={<Monitor className="h-4 w-4" />}
        >
          Display
        </NavItem>
        <NavItem
          active={active === "sound"}
          onClick={() => setActive("sound")}
          icon={<Volume2 className="h-4 w-4" />}
        >
          Sound
        </NavItem>
        <NavItem
          active={active === "about"}
          onClick={() => setActive("about")}
          icon={<Power className="h-4 w-4" />}
        >
          About
        </NavItem>
      </aside>
      <main className="flex-1 overflow-auto p-6">
        {active === "startupDisk" && <StartupDisk />}
        {active === "display" && (
          <PaneBody title="Display" body="Brightness: Auto · Night Shift: On" />
        )}
        {active === "sound" && <SoundPane />}
        {active === "about" && (
          <PaneBody
            title="About This Mac"
            body="JamesOS · Founder Edition · AlamoIQ + WeghachiAI"
          />
        )}
      </main>
    </div>
  );
}

function NavItem({
  children,
  icon,
  active,
  onClick,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2 rounded px-2 py-1.5 text-left hover:bg-white/10",
        active && "bg-[color:var(--accent)]/80"
      )}
    >
      <span className="text-white/70">{icon}</span>
      {children}
    </button>
  );
}

function StartupDisk() {
  const router = useRouter();
  const { triggerRestart } = useMacUI();
  const setLastOS = useOsStore((s) => s.setLastOS);
  const [selected, setSelected] = useState<"macos" | "arch">("macos");

  const confirmSwitch = () => {
    if (selected === "macos") return; // already here
    setLastOS("arch");
    triggerRestart();
    // Restart animation handles the navigation after its timeout
    setTimeout(() => router.push("/arch"), 1800);
  };

  return (
    <div className="max-w-lg">
      <h1 className="mb-2 text-lg font-semibold">Startup Disk</h1>
      <p className="mb-5 text-xs text-white/60">
        Select the OS to boot from. Switching will close all open windows and
        play the restart animation.
      </p>

      <div className="grid grid-cols-2 gap-3">
        <OsChoice
          selected={selected === "macos"}
          title="macOS"
          subtitle="You are here"
          onClick={() => setSelected("macos")}
        />
        <OsChoice
          selected={selected === "arch"}
          title="Arch Linux"
          subtitle="Terminal shell"
          onClick={() => setSelected("arch")}
        />
      </div>

      <button
        onClick={confirmSwitch}
        disabled={selected === "macos"}
        className={cn(
          "mt-6 rounded-full px-4 py-1.5 text-xs font-medium",
          selected === "macos"
            ? "bg-white/10 text-white/40"
            : "bg-[color:var(--accent)] text-white hover:brightness-110"
        )}
      >
        Restart into {selected === "macos" ? "macOS" : "Arch Linux"}…
      </button>
    </div>
  );
}

function OsChoice({
  selected,
  title,
  subtitle,
  onClick,
}: {
  selected: boolean;
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-xl border p-4 text-left",
        selected
          ? "border-[color:var(--accent)] bg-[color:var(--accent)]/20"
          : "border-white/10 bg-white/5"
      )}
    >
      <div className="text-sm font-semibold">{title}</div>
      <div className="text-[11px] text-white/50">{subtitle}</div>
    </button>
  );
}

function SoundPane() {
  const soundOn = useOsStore((s) => s.soundOn);
  const setSoundOn = useOsStore((s) => s.setSoundOn);
  return (
    <div className="max-w-md text-sm">
      <h1 className="mb-4 text-lg font-semibold">Sound</h1>
      <label className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3">
        <span>Startup chime & UI sounds</span>
        <input
          type="checkbox"
          checked={soundOn}
          onChange={(e) => setSoundOn(e.target.checked)}
          className="h-4 w-4"
        />
      </label>
      <p className="mt-3 text-xs text-white/40">
        Sound is off by default — we respect your autoplay settings.
      </p>
    </div>
  );
}

function PaneBody({ title, body }: { title: string; body: string }) {
  return (
    <div className="text-sm">
      <h1 className="mb-2 text-lg font-semibold">{title}</h1>
      <p className="text-white/70">{body}</p>
    </div>
  );
}

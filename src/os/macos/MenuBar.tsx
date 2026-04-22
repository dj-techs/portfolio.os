"use client";

import { useEffect, useState } from "react";
import {
  Wifi,
  Battery,
  Search,
  Bell,
  Command,
} from "lucide-react";
import { AppleLogo } from "@/shared/AppleLogo";
import { useWindowsStore, type AppId } from "@/store/windows";
import { useMacUI } from "./uiStore";

const APPS: { id: AppId; label: string }[] = [
  { id: "finder", label: "Finder" },
  { id: "preview", label: "Preview" },
  { id: "aboutme", label: "About Me" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "messages", label: "Messages" },
  { id: "settings", label: "System Settings" },
];

export default function MenuBar() {
  const [clock, setClock] = useState(formatClock());
  const [showApple, setShowApple] = useState(false);
  const [showActive, setShowActive] = useState(false);
  const focusedId = useWindowsStore((s) => s.focusedId);
  const focused = useWindowsStore((s) =>
    s.windows.find((w) => w.id === s.focusedId)
  );
  const { openSpotlight, openMission, openNotifCenter, triggerRestart } =
    useMacUI();

  useEffect(() => {
    const t = setInterval(() => setClock(formatClock()), 1000 * 30);
    return () => clearInterval(t);
  }, []);

  const activeApp = focused
    ? APPS.find((a) => a.id === focused.app)?.label ?? "App"
    : "Finder";

  return (
    <div
      role="menubar"
      className="fixed inset-x-0 top-0 z-[60] flex h-[28px] items-center justify-between border-b border-white/5 bg-black/20 px-3 text-xs text-white backdrop-blur-2xl select-none"
      style={{ height: "var(--menubar-h)" }}
    >
      {/* Left: Apple menu + app menus */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            className="flex items-center rounded px-1 hover:bg-white/10"
            onClick={() => {
              setShowApple((v) => !v);
              setShowActive(false);
            }}
            aria-haspopup="menu"
          >
            <AppleLogo className="h-3.5 w-3.5" />
          </button>
          {showApple && (
            <Dropdown onClose={() => setShowApple(false)}>
              <DdItem label="About This Mac" onClick={() => openAbout()} />
              <DdDivider />
              <DdItem label="System Settings…" onClick={() => openSettings()} />
              <DdItem
                label="App Store…"
                disabled
                aside="not installed"
              />
              <DdDivider />
              <DdItem label="Sleep" disabled />
              <DdItem label="Restart…" onClick={() => triggerRestart()} />
              <DdItem label="Shut Down…" onClick={() => triggerRestart()} />
              <DdDivider />
              <DdItem label={`Switch OS…`} onClick={() => openSettings("startupDisk")} />
            </Dropdown>
          )}
        </div>
        <div className="relative">
          <button
            className="font-semibold rounded px-1 hover:bg-white/10"
            onClick={() => {
              setShowActive((v) => !v);
              setShowApple(false);
            }}
          >
            {activeApp}
          </button>
          {showActive && (
            <Dropdown onClose={() => setShowActive(false)}>
              <DdItem label={`About ${activeApp}`} disabled />
              <DdDivider />
              <DdItem
                label="Close Window"
                shortcut="⌘W"
                onClick={() => {
                  if (focusedId) useWindowsStore.getState().close(focusedId);
                }}
                disabled={!focusedId}
              />
              <DdItem
                label="Minimize"
                shortcut="⌘M"
                onClick={() => {
                  if (focusedId) useWindowsStore.getState().minimize(focusedId);
                }}
                disabled={!focusedId}
              />
            </Dropdown>
          )}
        </div>
        <span className="rounded px-1 hover:bg-white/10 cursor-default">File</span>
        <span className="rounded px-1 hover:bg-white/10 cursor-default">Edit</span>
        <span className="rounded px-1 hover:bg-white/10 cursor-default">View</span>
        <span className="rounded px-1 hover:bg-white/10 cursor-default">Window</span>
        <span className="rounded px-1 hover:bg-white/10 cursor-default">Help</span>
      </div>

      {/* Right: status cluster */}
      <div className="flex items-center gap-3 text-white/85">
        <Battery className="h-3.5 w-3.5" />
        <span className="text-[10px]">87%</span>
        <Wifi className="h-3.5 w-3.5" />
        <button
          className="flex items-center gap-1 rounded px-1 hover:bg-white/10"
          onClick={openSpotlight}
          aria-label="Spotlight"
        >
          <Search className="h-3.5 w-3.5" />
        </button>
        <button
          className="rounded px-1 hover:bg-white/10"
          onClick={openMission}
          aria-label="Mission Control"
          title="Mission Control · F3"
        >
          <Command className="h-3.5 w-3.5" />
        </button>
        <button
          className="rounded px-1 hover:bg-white/10"
          onClick={openNotifCenter}
          aria-label="Notification Center"
        >
          <Bell className="h-3.5 w-3.5" />
        </button>
        <span className="text-xs tabular-nums">{clock}</span>
      </div>
    </div>
  );

  function openAbout() {
    setShowApple(false);
    useWindowsStore.getState().launch({
      id: "aboutme-singleton",
      app: "aboutme",
      title: "About Me",
      w: 520,
      h: 560,
    });
  }

  function openSettings(pane?: string) {
    setShowApple(false);
    useWindowsStore.getState().launch({
      id: "settings-singleton",
      app: "settings",
      title: "System Settings",
      w: 680,
      h: 500,
      props: { pane },
    });
  }
}

function formatClock() {
  const d = new Date();
  const dow = d.toLocaleDateString(undefined, { weekday: "short" });
  const date = d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  const time = d.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
  return `${dow} ${date}  ${time}`;
}

function Dropdown({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (!t.closest("[data-dropdown]")) onClose();
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [onClose]);
  return (
    <div
      data-dropdown
      className="absolute left-0 top-[28px] min-w-[220px] rounded-lg border border-white/10 bg-[color:var(--surface-hi)]/95 py-1 text-xs shadow-2xl backdrop-blur-2xl"
    >
      {children}
    </div>
  );
}

function DdItem({
  label,
  shortcut,
  disabled,
  aside,
  onClick,
}: {
  label: string;
  shortcut?: string;
  disabled?: boolean;
  aside?: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={[
        "flex w-full items-center justify-between px-3 py-1.5 text-left",
        disabled ? "text-white/30" : "text-white/90 hover:bg-[color:var(--accent)]",
      ].join(" ")}
    >
      <span>{label}</span>
      {aside ? <span className="text-[10px] text-white/40">{aside}</span> : null}
      {shortcut ? <span className="text-[10px] text-white/50">{shortcut}</span> : null}
    </button>
  );
}

function DdDivider() {
  return <div className="mx-2 my-1 h-px bg-white/10" />;
}

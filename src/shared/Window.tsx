"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useWindowsStore, type WindowState } from "@/store/windows";
import { cn } from "@/lib/cn";

type Variant = "macos" | "arch";

type Props = {
  win: WindowState;
  variant?: Variant;
  children: React.ReactNode;
  /** Optional custom title-bar area (default: traffic lights + title) */
  toolbar?: React.ReactNode;
  minW?: number;
  minH?: number;
};

const MIN_W_DEFAULT = 360;
const MIN_H_DEFAULT = 220;

const SNAP_THRESHOLD = 24;

/**
 * Shared window chrome. macOS gets traffic lights + genie-minimize fx;
 * arch variant gets a square-cornered neon terminal frame (used for PDF/preview in Arch).
 */
export function Window({
  win,
  variant = "macos",
  children,
  toolbar,
  minW = MIN_W_DEFAULT,
  minH = MIN_H_DEFAULT,
}: Props) {
  const {
    focus,
    close,
    minimize,
    toggleMaximize,
    move,
    resize,
  } = useWindowsStore();

  const ref = useRef<HTMLDivElement>(null);
  const dragStart = useRef<{ x: number; y: number; px: number; py: number } | null>(
    null
  );
  const resizeStart = useRef<{
    x: number;
    y: number;
    w: number;
    h: number;
    px: number;
    py: number;
    edge: string;
  } | null>(null);

  const [snapHint, setSnapHint] = useState<"left" | "right" | "full" | null>(null);

  const onTitleMouseDown = (e: React.MouseEvent) => {
    if (win.maximized) return;
    dragStart.current = { x: win.x, y: win.y, px: e.clientX, py: e.clientY };
    focus(win.id);
    const onMove = (me: MouseEvent) => {
      if (!dragStart.current) return;
      const nx = dragStart.current.x + (me.clientX - dragStart.current.px);
      const ny = Math.max(
        28, // clamp below menu bar
        dragStart.current.y + (me.clientY - dragStart.current.py)
      );
      move(win.id, nx, ny);

      // Snap hints while near the edge
      const vw = window.innerWidth;
      if (me.clientX < SNAP_THRESHOLD) setSnapHint("left");
      else if (me.clientX > vw - SNAP_THRESHOLD) setSnapHint("right");
      else if (me.clientY < SNAP_THRESHOLD + 28) setSnapHint("full");
      else setSnapHint(null);
    };
    const onUp = () => {
      // Apply snap
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      if (snapHint === "left") {
        resize(win.id, vw / 2, vh - 28, 0, 28);
      } else if (snapHint === "right") {
        resize(win.id, vw / 2, vh - 28, vw / 2, 28);
      } else if (snapHint === "full") {
        toggleMaximize(win.id, { w: vw, h: vh });
      }
      dragStart.current = null;
      setSnapHint(null);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const onResizeStart = (edge: string) => (e: React.MouseEvent) => {
    if (win.maximized) return;
    e.stopPropagation();
    // eslint-disable-next-line react-hooks/refs
    resizeStart.current = {
      x: win.x,
      y: win.y,
      w: win.w,
      h: win.h,
      px: e.clientX,
      py: e.clientY,
      edge,
    };
    focus(win.id);
    const onMove = (me: MouseEvent) => {
      if (!resizeStart.current) return;
      const dx = me.clientX - resizeStart.current.px;
      const dy = me.clientY - resizeStart.current.py;
      let { x, y, w, h } = resizeStart.current;
      const ed = resizeStart.current.edge;
      if (ed.includes("e")) w = Math.max(minW, resizeStart.current.w + dx);
      if (ed.includes("s")) h = Math.max(minH, resizeStart.current.h + dy);
      if (ed.includes("w")) {
        w = Math.max(minW, resizeStart.current.w - dx);
        x = resizeStart.current.x + (resizeStart.current.w - w);
      }
      if (ed.includes("n")) {
        h = Math.max(minH, resizeStart.current.h - dy);
        y = resizeStart.current.y + (resizeStart.current.h - h);
      }
      resize(win.id, w, h, x, y);
    };
    const onUp = () => {
      resizeStart.current = null;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const onClose = useCallback(() => close(win.id), [close, win.id]);
  const onMinimize = useCallback(() => minimize(win.id), [minimize, win.id]);
  const onMax = useCallback(
    () => toggleMaximize(win.id, { w: window.innerWidth, h: window.innerHeight }),
    [toggleMaximize, win.id]
  );

  // Focus + keyboard shortcut passthrough
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (useWindowsStore.getState().focusedId !== win.id) return;
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key === "w") {
        e.preventDefault();
        onClose();
      } else if (mod && e.key === "m") {
        e.preventDefault();
        onMinimize();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [win.id, onClose, onMinimize]);

  return (
    <motion.div
      ref={ref}
      role="dialog"
      aria-label={win.title}
      initial={{ opacity: 0, scale: 0.96, y: 12 }}
      animate={{
        opacity: win.minimized ? 0 : 1,
        scale: win.minimized ? 0.2 : 1,
        y: win.minimized ? window.innerHeight - 100 : 0,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      onMouseDown={() => focus(win.id)}
      style={{
        left: win.x,
        top: win.y,
        width: win.w,
        height: win.h,
        zIndex: win.z,
        pointerEvents: win.minimized ? "none" : "auto",
      }}
      className={cn(
        "absolute flex flex-col overflow-hidden",
        variant === "macos"
          ? "rounded-xl border border-white/10 bg-[color:var(--surface)] shadow-[var(--shadow-win)] backdrop-blur-2xl"
          : "rounded border border-[color:var(--border)] bg-[color:var(--surface)] shadow-2xl"
      )}
    >
      {/* Title bar */}
      <div
        onMouseDown={onTitleMouseDown}
        onDoubleClick={onMax}
        className={cn(
          "flex h-9 shrink-0 items-center gap-3 px-3 select-none",
          variant === "macos"
            ? "bg-gradient-to-b from-white/[0.08] to-transparent"
            : "bg-[color:var(--surface-hi)] text-[color:var(--accent)] font-mono text-xs"
        )}
      >
        {variant === "macos" ? (
          <TrafficLights onClose={onClose} onMin={onMinimize} onMax={onMax} />
        ) : (
          <div className="h-2 w-2 rounded-full bg-[color:var(--accent)]" />
        )}
        <div
          className={cn(
            "flex-1 truncate text-center text-xs",
            variant === "macos" ? "text-white/80" : "text-[color:var(--fg)]/80"
          )}
        >
          {win.title}
        </div>
        {/* Keep title-bar balanced visually */}
        <div className="w-[54px]" />
      </div>

      {/* Optional toolbar slot */}
      {toolbar ? (
        <div className="shrink-0 border-b border-white/5 bg-[color:var(--surface-hi)]/40">
          {toolbar}
        </div>
      ) : null}

      {/* Content */}
      <div className="relative flex-1 overflow-auto">{children}</div>

      {/* Resize handles (not when maximized) */}
      {!win.maximized && (
        <>
          <div
            onMouseDown={onResizeStart("n")}
            className="absolute inset-x-0 top-0 h-1 cursor-ns-resize"
          />
          <div
            onMouseDown={onResizeStart("s")}
            className="absolute inset-x-0 bottom-0 h-1 cursor-ns-resize"
          />
          <div
            onMouseDown={onResizeStart("w")}
            className="absolute inset-y-0 left-0 w-1 cursor-ew-resize"
          />
          <div
            onMouseDown={onResizeStart("e")}
            className="absolute inset-y-0 right-0 w-1 cursor-ew-resize"
          />
          <div
            onMouseDown={onResizeStart("nw")}
            className="absolute top-0 left-0 h-2 w-2 cursor-nwse-resize"
          />
          <div
            onMouseDown={onResizeStart("ne")}
            className="absolute top-0 right-0 h-2 w-2 cursor-nesw-resize"
          />
          <div
            onMouseDown={onResizeStart("sw")}
            className="absolute bottom-0 left-0 h-2 w-2 cursor-nesw-resize"
          />
          <div
            onMouseDown={onResizeStart("se")}
            className="absolute bottom-0 right-0 h-2 w-2 cursor-nwse-resize"
          />
        </>
      )}

      {/* Snap hint overlay (visual guide while dragging) */}
      {snapHint && (
        <div
          aria-hidden
          className="pointer-events-none fixed z-[9999] rounded border border-white/30 bg-white/10 backdrop-blur"
          style={
            snapHint === "left"
              ? { left: 0, top: 28, width: "50vw", height: "calc(100vh - 28px)" }
              : snapHint === "right"
                ? {
                    left: "50vw",
                    top: 28,
                    width: "50vw",
                    height: "calc(100vh - 28px)",
                  }
                : { left: 0, top: 28, width: "100vw", height: "calc(100vh - 28px)" }
          }
        />
      )}
    </motion.div>
  );
}

function TrafficLights({
  onClose,
  onMin,
  onMax,
}: {
  onClose: () => void;
  onMin: () => void;
  onMax: () => void;
}) {
  return (
    <div className="group/tl flex items-center gap-2">
      <button
        onClick={onClose}
        aria-label="Close"
        className="flex h-3 w-3 items-center justify-center rounded-full bg-[color:var(--traffic-red)]"
      >
        <span className="hidden text-[8px] font-bold leading-none text-black/70 group-hover/tl:block">
          ×
        </span>
      </button>
      <button
        onClick={onMin}
        aria-label="Minimize"
        className="flex h-3 w-3 items-center justify-center rounded-full bg-[color:var(--traffic-yellow)]"
      >
        <span className="hidden text-[8px] font-bold leading-none text-black/70 group-hover/tl:block">
          −
        </span>
      </button>
      <button
        onClick={onMax}
        aria-label="Maximize"
        className="flex h-3 w-3 items-center justify-center rounded-full bg-[color:var(--traffic-green)]"
      >
        <span className="hidden text-[8px] font-bold leading-none text-black/70 group-hover/tl:block">
          +
        </span>
      </button>
    </div>
  );
}

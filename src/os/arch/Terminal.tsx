"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  allCommandNames,
  didYouMean,
  lookupCmd,
  parseLine,
  type CmdResult,
  type RenderNode,
} from "./commands";
import { useOsStore } from "@/store/os";

type Entry =
  | { kind: "prompt"; cmd: string; cwd: string }
  | { kind: "out"; nodes: RenderNode[] };

const PS1 = (cwd: string) =>
  `[guest@archlinux ${cwd === "~" ? "~" : cwd}]$`;

export default function Terminal({
  autoRun,
  onReboot,
  onSwitchOS,
}: {
  autoRun?: string;
  onReboot?: () => void;
  onSwitchOS?: (target: "macos") => void;
}) {
  const setLastOS = useOsStore((s) => s.setLastOS);

  const [cwd] = useState<string>("~");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState<number | null>(null);
  const [reverseSearch, setReverseSearch] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const autoRanRef = useRef(false);

  // Auto-focus the input on any click in the terminal area
  useEffect(() => {
    const onClick = () => inputRef.current?.focus();
    const el = bottomRef.current?.parentElement;
    el?.addEventListener("click", onClick);
    return () => el?.removeEventListener("click", onClick);
  }, []);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [entries]);

  const run = useCallback(
    async (raw: string) => {
      const trimmed = raw.trim();
      // Always record the prompt line, even for blank input
      setEntries((e) => [...e, { kind: "prompt", cmd: raw, cwd }]);
      if (!trimmed) return;

      const [name, ...args] = trimmed.split(/\s+/);
      const newHist = [...history, trimmed];
      setHistory(newHist);
      setHistIdx(null);

      const cmd = lookupCmd(name);
      if (!cmd) {
        const mean = didYouMean(name);
        setEntries((e) => [
          ...e,
          {
            kind: "out",
            nodes: [
              `bash: ${name}: command not found`,
              ...(mean ? [`Did you mean \`${mean}\`?`] : []),
            ],
          },
        ]);
        return;
      }

      const result = (await cmd.run(args, { cwd, history: newHist })) as CmdResult;

      if (result.clear) {
        setEntries([]);
        if (result.output.length) {
          setEntries((e) => [...e, { kind: "out", nodes: result.output }]);
        }
      } else if (result.output.length) {
        setEntries((e) => [...e, { kind: "out", nodes: result.output }]);
      }

      if (result.switchOS === "macos") {
        setLastOS("macos");
        onSwitchOS?.("macos");
      }
      if (result.reboot) {
        onReboot?.();
      }
    },
    [cwd, history, onReboot, onSwitchOS, setLastOS]
  );

  // Auto-run the initial command (e.g. `os --help`)
  useEffect(() => {
    if (autoRun && !autoRanRef.current) {
      autoRanRef.current = true;
      run(autoRun);
    }
  }, [autoRun, run]);

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Ctrl+L — clear
    if (e.ctrlKey && (e.key === "l" || e.key === "L")) {
      e.preventDefault();
      setEntries([]);
      return;
    }
    // Ctrl+C — abort
    if (e.ctrlKey && (e.key === "c" || e.key === "C")) {
      e.preventDefault();
      setEntries((prev) => [
        ...prev,
        { kind: "prompt", cmd: input + "^C", cwd },
      ]);
      setInput("");
      setReverseSearch(null);
      return;
    }
    // Ctrl+R — reverse-i-search
    if (e.ctrlKey && (e.key === "r" || e.key === "R")) {
      e.preventDefault();
      setReverseSearch("");
      return;
    }
    if (reverseSearch !== null) {
      if (e.key === "Escape") {
        setReverseSearch(null);
        return;
      }
      if (e.key === "Enter") {
        const match = [...history].reverse().find((h) => h.includes(reverseSearch));
        if (match) {
          setInput(match);
        }
        setReverseSearch(null);
        return;
      }
      if (e.key === "Backspace") {
        setReverseSearch(reverseSearch.slice(0, -1));
        return;
      }
      if (e.key.length === 1) {
        setReverseSearch(reverseSearch + e.key);
        return;
      }
    }
    if (e.key === "Enter") {
      e.preventDefault();
      run(input);
      setInput("");
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const next = histIdx === null ? history.length - 1 : Math.max(0, histIdx - 1);
      setHistIdx(next);
      setInput(history[next] ?? "");
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIdx === null) return;
      const next = histIdx + 1;
      if (next >= history.length) {
        setHistIdx(null);
        setInput("");
      } else {
        setHistIdx(next);
        setInput(history[next]);
      }
      return;
    }
    if (e.key === "Tab") {
      e.preventDefault();
      const word = input.split(/\s+/).pop() ?? "";
      if (!word) return;
      const matches = allCommandNames().filter((n) => n.startsWith(word));
      if (matches.length === 1) {
        // Complete in place
        const prefix = input.slice(0, input.length - word.length);
        setInput(prefix + matches[0] + " ");
      } else if (matches.length > 1) {
        setEntries((en) => [
          ...en,
          { kind: "prompt", cmd: input, cwd },
          { kind: "out", nodes: [matches.join("   ")] },
        ]);
      }
    }
  };

  const reverseMatch =
    reverseSearch !== null
      ? [...history].reverse().find((h) => h.includes(reverseSearch)) ?? ""
      : "";

  return (
    <div className="h-full overflow-auto p-4 text-sm leading-6">
      {/* Scrollback */}
      <div className="font-mono">
        {entries.map((e, i) =>
          e.kind === "prompt" ? (
            <div key={i} className="flex flex-wrap whitespace-pre-wrap">
              <span className="text-[color:var(--accent)]">{PS1(e.cwd)}</span>
              <span className="ml-2 text-white">{e.cmd}</span>
            </div>
          ) : (
            <div key={i}>
              {e.nodes.map((n, j) => (
                <OutNode key={j} node={n} />
              ))}
            </div>
          )
        )}
      </div>

      {/* Live prompt */}
      <div className="mt-1 flex flex-wrap items-center font-mono">
        <span className="text-[color:var(--accent)]">{PS1(cwd)}</span>
        {reverseSearch !== null ? (
          <span className="ml-2 text-[color:var(--term-yellow)]">
            (reverse-i-search)`{reverseSearch}&apos;: {reverseMatch}
          </span>
        ) : (
          <input
            ref={inputRef}
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            className="ml-2 flex-1 bg-transparent text-white outline-none caret-[color:var(--accent)]"
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            aria-label="terminal input"
          />
        )}
      </div>
      <div ref={bottomRef} />
    </div>
  );
}

function OutNode({ node }: { node: RenderNode }) {
  if (typeof node === "string") {
    const { html } = parseLine(node);
    return <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: html || "&nbsp;" }} />;
  }
  if (node.kind === "link") {
    return (
      <a
        href={node.href}
        target={node.href.startsWith("mailto:") ? undefined : "_blank"}
        rel="noopener noreferrer"
        className="text-[color:var(--accent)] underline"
      >
        {node.label}
      </a>
    );
  }
  if (node.kind === "pager") {
    return (
      <div className="my-1 rounded border border-[color:var(--border)] bg-black/40 p-2">
        <div className="mb-1 text-[10px] uppercase tracking-wider text-white/40">
          {node.title} — press `q` to quit (decorative)
        </div>
        {node.lines.map((l, i) => {
          const { html } = parseLine(l);
          return (
            <div
              key={i}
              className="whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: html || "&nbsp;" }}
            />
          );
        })}
      </div>
    );
  }
  if (node.kind === "pdf") {
    return (
      <div className="my-2 rounded border border-[color:var(--accent)]/50 bg-black/60 p-3 text-xs text-white/70">
        [opened <strong className="text-white">{node.title}</strong> in{" "}
        <a href={node.src} className="text-[color:var(--accent)] underline" target="_blank" rel="noopener noreferrer">
          new tab
        </a>
        ]
      </div>
    );
  }
  if (node.kind === "raw") {
    return <div dangerouslySetInnerHTML={{ __html: node.html }} />;
  }
  if (node.kind === "group") {
    return (
      <>
        {node.nodes.map((n, i) => (
          <OutNode key={i} node={n} />
        ))}
      </>
    );
  }
  return null;
}

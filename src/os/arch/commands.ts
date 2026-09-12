"use client";

import { experience, formatDates } from "@/content/experience";
import { projects } from "@/content/projects";
import { skills } from "@/content/skills";
import { profile } from "@/content/profile";
import { education } from "@/content/education";

export type RenderNode =
  | string
  | { kind: "link"; href: string; label: string }
  | { kind: "pager"; title: string; lines: string[] }
  | { kind: "pdf"; src: string; title: string }
  | { kind: "raw"; html: string }
  | { kind: "group"; nodes: RenderNode[] };

export type CmdResult = {
  /** Lines/nodes to append to scrollback */
  output: RenderNode[];
  /** If true, clear the scrollback */
  clear?: boolean;
  /** If set, trigger shutdown/reboot */
  reboot?: boolean;
  /** If set, navigate via the switcher */
  switchOS?: "macos" | "arch";
};

export type CmdContext = {
  cwd: string; // simulated
  history: string[];
};

export type Cmd = {
  name: string;
  aliases?: string[];
  brief: string;
  run: (args: string[], ctx: CmdContext) => Promise<CmdResult> | CmdResult;
};

const GREEN = (s: string) => `__CSS__color:var(--term-green)__${s}__END__`;
const BLUE = (s: string) => `__CSS__color:var(--accent)__${s}__END__`;
const YELLOW = (s: string) => `__CSS__color:var(--term-yellow)__${s}__END__`;
const DIM = (s: string) => `__CSS__opacity:0.6__${s}__END__`;

// Parse a line that may have our pseudo-color markers. Used by the renderer.
export function parseLine(line: string): { html: string } {
  const re = /__CSS__([^_]+)__([\s\S]*?)__END__/g;
  let html = "";
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line))) {
    html += escapeHtml(line.slice(last, m.index));
    html += `<span style="${m[1]}">${escapeHtml(m[2])}</span>`;
    last = m.index + m[0].length;
  }
  html += escapeHtml(line.slice(last));
  return { html };
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br/>");
}

const ARCH_LOGO = [
  "                  -`",
  "                 .o+`",
  "                `ooo/",
  "               `+oooo:",
  "              `+oooooo:",
  "              -+oooooo+:",
  "            `/:-:++oooo+:",
  "           `/++++/+++++++:",
  "          `/++++++++++++++:",
  "         `/+++ooooooooooooo/`",
  "        ./ooosssso++osssssso+`",
  "       .oossssso-````/ossssss+`",
  "      -osssssso.      :ssssssso.",
  "     :osssssss/        osssso+++.",
  "    /ossssssss/        +ssssooo/-",
  "  `/ossssso+/:-        -:/+osssso+-",
  " `+sso+:-`                 `.-/+oso:",
  "`++:.                           `-/+/",
  ".`                                 `/",
];

function neofetch(): string[] {
  const info = [
    `${BLUE("guest")}@${BLUE("archlinux")}`,
    "------------------",
    `${YELLOW("OS")}: JamesOS (Arch Linux x86_64)`,
    `${YELLOW("Host")}: AI Product Leader · Founder`,
    `${YELLOW("Kernel")}: 6.10.0-arch1-1`,
    `${YELLOW("Uptime")}: since 2013`,
    `${YELLOW("Shell")}: bash 5.2.21`,
    `${YELLOW("Resolution")}: ${typeof window !== "undefined" ? `${window.innerWidth}x${window.innerHeight}` : "—"}`,
    `${YELLOW("DE")}: Terminal`,
    `${YELLOW("Theme")}: Arch Blue (#1793D1)`,
    `${YELLOW("CPU")}: Claude Sonnet 4.6`,
    `${YELLOW("Memory")}: loaded with multi-agent pipelines + RLHF`,
    `${YELLOW("Email")}: ${profile.email}`,
    `${YELLOW("GitHub")}: ${profile.githubs.join(" · ")}`,
  ];
  // Side-by-side logo + info
  const out: string[] = [];
  const maxRows = Math.max(ARCH_LOGO.length, info.length);
  for (let i = 0; i < maxRows; i++) {
    const logo = ARCH_LOGO[i] ?? "";
    const right = info[i] ?? "";
    out.push(
      `${BLUE(logo.padEnd(38, " "))}${right}`
    );
  }
  return out;
}

function experiencePlain(): string[] {
  const out: string[] = [];
  experience.forEach((role) => {
    out.push(
      `${YELLOW(role.title)} — ${BLUE(role.company)}   ${DIM(formatDates(role))}`
    );
    if (role.location) out.push(DIM(`  ${role.location}`));
    role.bullets.forEach((b) => out.push(`  • ${b}`));
    out.push("");
  });
  return out;
}

function projectsPlain(): string[] {
  const out: string[] = [];
  projects.forEach((p) => {
    out.push(`${YELLOW(p.title)} ${DIM(`(${p.company} · ${p.year})`)}`);
    out.push(`  ${p.summary}`);
    out.push(DIM(`  stack: ${p.stack.join(", ")}`));
    out.push(GREEN(`  outcome: ${p.outcome}`));
    out.push("");
  });
  return out;
}

function skillsTree(): string[] {
  const out: string[] = [GREEN("skills/")];
  skills.forEach((g, gi) => {
    const gpre = gi === skills.length - 1 ? "└──" : "├──";
    out.push(`${gpre} ${YELLOW(g.category)}`);
    g.items.forEach((it, ii) => {
      const pref = gi === skills.length - 1 ? "    " : "│   ";
      const bullet = ii === g.items.length - 1 ? "└──" : "├──";
      out.push(`${pref}${bullet} ${it}`);
    });
  });
  return out;
}

const COMMANDS: Cmd[] = [
  {
    name: "help",
    aliases: ["?", "--help"],
    brief: "Show this help",
    run: () => ({
      output: [
        YELLOW("JamesOS — a portfolio that boots in your terminal."),
        "",
        `${BLUE("USAGE")}:  <command> [args]`,
        "",
        BLUE("PORTFOLIO"),
        "  resume           View resume (in-terminal pager)",
        "  resume --pdf     Open the PDF in a floating window",
        "  projects         List case studies",
        "  projects <slug>  Read a single project",
        "  skills           List skills by category",
        "  skills --tree    Print a tree view",
        "  experience       Career timeline",
        "  about            One-paragraph bio",
        "  contact          Email + links",
        "",
        BLUE("AI"),
        "  chat | ai | claude   [coming soon] AI portfolio assistant",
        "",
        BLUE("SYSTEM"),
        "  os --help        This message",
        "  os switch macos  Restart into macOS",
        "  neofetch         System info + ASCII art",
        "  whoami / uname   Identity",
        "  clear            Clear the screen (or Ctrl+L)",
        "  history          Command history (or arrow keys)",
        "  reboot           Return to boot selector",
        "",
        DIM("Try also: sudo, sl, cowsay, pacman, date."),
      ],
    }),
  },
  {
    name: "os",
    brief: "OS operations",
    run: (args) => {
      if (!args.length || args[0] === "--help" || args[0] === "-h")
        return COMMANDS[0].run([], { cwd: "~", history: [] }) as CmdResult;
      if (args[0] === "switch" && args[1]) {
        const target = args[1].toLowerCase();
        if (target === "macos" || target === "mac") {
          return {
            output: [YELLOW("Switching to macOS…")],
            switchOS: "macos",
          };
        }
        if (target === "arch") {
          return { output: [DIM("already in Arch, bro.")] };
        }
        return {
          output: [`${YELLOW("os: unknown target:")} ${args[1]}`],
        };
      }
      return { output: [`${YELLOW("os:")} unknown subcommand. try ${BLUE("os --help")}`] };
    },
  },
  {
    name: "whoami",
    brief: "Print effective username",
    run: () => ({ output: ["guest"] }),
  },
  {
    name: "uname",
    brief: "Print system info",
    run: (args) => ({
      output: [
        args.includes("-a")
          ? "Linux archlinux 6.10.0-arch1-1 #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux"
          : "Linux",
      ],
    }),
  },
  {
    name: "pwd",
    brief: "Print working directory",
    run: (_a, ctx) => ({ output: [`/home/guest${ctx.cwd === "~" ? "" : ctx.cwd}`] }),
  },
  {
    name: "ls",
    brief: "List directory",
    run: () => ({
      output: [
        `${BLUE("about.md")}   ${BLUE("resume.txt")}   ${GREEN("projects/")}   ${GREEN("skills/")}   ${GREEN("experience/")}   ${BLUE("contact.vcf")}`,
      ],
    }),
  },
  {
    name: "cd",
    brief: "Change directory (decorative)",
    run: () => ({ output: [DIM("(decorative — use `ls` + `cat` instead)")] }),
  },
  {
    name: "cat",
    brief: "Concatenate and print files",
    run: (args) => {
      const f = args[0];
      if (!f) return { output: [`cat: missing file operand`] };
      if (f === "about.md") {
        return { output: [profile.bio] };
      }
      if (f === "resume.txt") {
        return { output: resumePager() };
      }
      if (f === "contact.vcf") {
        return {
          output: [
            `BEGIN:VCARD`,
            `VERSION:4.0`,
            `FN:${profile.name}`,
            `TITLE:${profile.title}`,
            `EMAIL:${profile.email}`,
            `TEL:${profile.phone}`,
            ...profile.githubs.map((u) => `URL:${u}`),
            `URL:${profile.linkedin}`,
            `END:VCARD`,
          ],
        };
      }
      return { output: [`cat: ${f}: No such file or directory`] };
    },
  },
  {
    name: "clear",
    brief: "Clear the terminal",
    run: () => ({ output: [], clear: true }),
  },
  {
    name: "echo",
    brief: "Echo arguments",
    run: (args) => ({ output: [args.join(" ")] }),
  },
  {
    name: "date",
    brief: "Print the current date",
    run: () => ({ output: [new Date().toString()] }),
  },
  {
    name: "history",
    brief: "Print command history",
    run: (_a, ctx) => ({
      output: ctx.history.map((h, i) => `  ${String(i + 1).padStart(3)}  ${h}`),
    }),
  },
  {
    name: "neofetch",
    brief: "System info with ASCII art",
    run: () => ({ output: neofetch() }),
  },
  {
    name: "resume",
    brief: "View resume",
    run: (args) => {
      if (args.includes("--pdf") || args.includes("-p")) {
        // Fires synchronously in response to the Enter keypress, so browser
        // popup blockers treat it as a user-initiated action.
        if (typeof window !== "undefined") {
          window.open("/Resume.pdf", "_blank", "noopener,noreferrer");
        }
        return {
          output: [
            GREEN("Resume.pdf opened in new tab."),
            DIM("(if blocked, click the link below)"),
            { kind: "link", href: "/Resume.pdf", label: "→ /Resume.pdf" } as RenderNode,
          ],
        };
      }
      return {
        output: [
          {
            kind: "pager",
            title: "resume.txt",
            lines: resumePager(),
          } as RenderNode,
        ],
      };
    },
  },
  {
    name: "projects",
    brief: "List / read case studies",
    run: (args) => {
      if (!args.length) return { output: projectsPlain() };
      const slug = args[0];
      const p = projects.find((x) => x.slug === slug);
      if (!p) {
        return {
          output: [
            `projects: no case study "${slug}"`,
            DIM(`try: ${projects.map((x) => x.slug).join(", ")}`),
          ],
        };
      }
      return {
        output: [
          YELLOW(p.title),
          DIM(`${p.company} · ${p.year}`),
          "",
          p.summary,
          "",
          BLUE("Problem"),
          "  " + p.problem,
          "",
          BLUE("Approach"),
          "  " + p.approach,
          "",
          BLUE("Stack"),
          "  " + p.stack.join(", "),
          "",
          BLUE("Outcome"),
          "  " + GREEN(p.outcome),
        ],
      };
    },
  },
  {
    name: "skills",
    brief: "List skills by category",
    run: (args) => {
      if (args.includes("--tree")) return { output: skillsTree() };
      if (args[0]?.startsWith("--category=")) {
        const c = args[0].slice("--category=".length).toLowerCase();
        const match = skills.find((g) => g.category.toLowerCase().includes(c));
        if (!match) return { output: [`no category matches "${c}"`] };
        return {
          output: [YELLOW(match.category), "  " + match.items.join(", ")],
        };
      }
      return {
        output: skills.flatMap((g) => [YELLOW(g.category), "  " + g.items.join(", "), ""]),
      };
    },
  },
  {
    name: "experience",
    brief: "Career timeline",
    run: () => ({ output: experiencePlain() }),
  },
  {
    name: "about",
    brief: "One-paragraph bio",
    run: () => ({ output: [profile.bio] }),
  },
  {
    name: "contact",
    aliases: ["mail"],
    brief: "Contact info (opens mailto)",
    run: () => ({
      output: [
        `${YELLOW(profile.name)}`,
        `  email: ${profile.email}`,
        `  phone: ${profile.phone}`,
        ...profile.githubs.map((u) => `  github: ${u}`),
        `  linkedin: ${profile.linkedin}`,
        DIM("(press Enter on your mail client link)"),
        { kind: "link", href: `mailto:${profile.email}`, label: "Open mail compose →" },
      ],
    }),
  },
  {
    name: "education",
    brief: "Schools + credentials",
    run: () => ({
      output: education.flatMap((e) => [YELLOW(e.school), "  " + e.degree, ""]),
    }),
  },
  {
    name: "chat",
    aliases: ["ai", "claude"],
    brief: "AI portfolio assistant (coming soon)",
    run: () => ({
      output: [
        "",
        BLUE("  ┌────────────────────────────────────────┐"),
        BLUE("  │") + "   AI portfolio assistant — " + YELLOW("coming soon") + "    " + BLUE("│"),
        BLUE("  └────────────────────────────────────────┘"),
        "",
        DIM("  For now, try:"),
        "    " + BLUE("resume") + "      · full résumé",
        "    " + BLUE("projects") + "    · case studies",
        "    " + BLUE("skills") + "      · stack & expertise",
        "",
        DIM("  Want a heads-up when it ships?"),
        { kind: "link", href: `mailto:${profile.email}?subject=Notify%20me%20%E2%80%94%20AI%20portfolio%20assistant`, label: "  Email me →" },
      ],
    }),
  },
  {
    name: "sudo",
    brief: "Elevate privileges",
    run: (args) => {
      if (args[0] === "rm" && args[1] === "-rf" && (args[2] === "/" || args[2] === "/*")) {
        return {
          output: [
            `[${YELLOW("WARN")}] You are about to delete the entire filesystem. Are you sure? (y/n) ${GREEN("n")}`,
            DIM("nope. good reflexes."),
          ],
        };
      }
      return {
        output: [
          `[${YELLOW("sudo")}] password for guest: `,
          DIM("…"),
          `${YELLOW("guest")} is not in the sudoers file. This incident will be reported.`,
        ],
      };
    },
  },
  {
    name: "sl",
    brief: "Steam locomotive",
    run: () => ({
      output: [
        "     ====        ________                ___________",
        " _D _|  |_______/        \\__I_I_____===__|_________|",
        `  |(_)---  |   H\\________/ |   |        =|___ ___|      _________________`,
        "  /     |  |   H  |  |     |   |         ||_| |_||     _|                \\_____A",
        "  |      |  |   H  |__--------------------| [___] |   =|                        |",
        "  | ________|___H__/__|_____/[][]~\\_______|       |   -|                        |",
      ],
    }),
  },
  {
    name: "cowsay",
    brief: "The cow says",
    run: (args) => {
      const msg = args.join(" ") || "BTW, I use Arch.";
      const bar = "-".repeat(msg.length + 2);
      return {
        output: [
          " " + bar,
          "< " + msg + " >",
          " " + bar,
          "        \\   ^__^",
          "         \\  (oo)\\_______",
          "            (__)\\       )\\/\\",
          "                ||----w |",
          "                ||     ||",
        ],
      };
    },
  },
  {
    name: "pacman",
    brief: "Package manager (joke)",
    run: (args) => {
      if (args[0] === "-S") {
        return {
          output: [
            `:: Synchronizing package databases...`,
            ` core is up to date`,
            ` extra is up to date`,
            ` community is up to date`,
            `:: Starting full system upgrade...`,
            ` resolving dependencies...`,
            ` looking for conflicting packages...`,
            GREEN(` happiness already installed.`),
          ],
        };
      }
      return { output: [DIM("pacman: try `-S happiness`")] };
    },
  },
  {
    name: "fortune",
    brief: "Random aphorism",
    run: () => {
      const lines = [
        "The best way to predict the future is to invent it.",
        "Programs must be written for people to read, and only incidentally for machines to execute.",
        "Any sufficiently advanced technology is indistinguishable from magic.",
        "Premature optimization is the root of all evil. — Knuth",
        "There are only two hard things: cache invalidation and naming things.",
      ];
      return { output: [lines[Math.floor(Math.random() * lines.length)]] };
    },
  },
  {
    name: "reboot",
    aliases: ["shutdown", "exit"],
    brief: "Return to boot selector",
    run: () => ({
      output: [YELLOW("Broadcast message from root"), DIM("The system is going down for reboot NOW!")],
      reboot: true,
    }),
  },
];

// Build a lookup including aliases
const CMD_INDEX = new Map<string, Cmd>();
COMMANDS.forEach((c) => {
  CMD_INDEX.set(c.name, c);
  c.aliases?.forEach((a) => CMD_INDEX.set(a, c));
});

export function allCommandNames(): string[] {
  return Array.from(CMD_INDEX.keys());
}

export function lookupCmd(name: string): Cmd | undefined {
  return CMD_INDEX.get(name);
}

// Levenshtein for "did you mean"
export function didYouMean(input: string): string | null {
  const names = Array.from(new Set(COMMANDS.map((c) => c.name)));
  let best = { name: "", d: Infinity };
  for (const n of names) {
    const d = levenshtein(input, n);
    if (d < best.d) best = { name: n, d };
  }
  return best.d <= Math.max(2, Math.floor(input.length / 3)) ? best.name : null;
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return dp[m][n];
}

function resumePager(): string[] {
  const lines: string[] = [];
  lines.push(YELLOW(profile.name));
  lines.push(DIM(profile.title));
  lines.push(DIM(`${profile.email} · ${profile.phone}`));
  lines.push(DIM([...profile.githubs, profile.linkedin].join(" · ")));
  lines.push("");
  lines.push(BLUE("SUMMARY"));
  lines.push("  " + profile.tagline);
  lines.push("");
  lines.push(BLUE("EXPERIENCE"));
  experience.forEach((role) => {
    lines.push(
      `  ${YELLOW(role.title)} — ${role.company}  ${DIM(formatDates(role))}`
    );
    role.bullets.forEach((b) => lines.push("    • " + b));
    lines.push("");
  });
  lines.push(BLUE("SKILLS"));
  skills.forEach((g) => {
    lines.push(`  ${YELLOW(g.category)}`);
    lines.push("    " + g.items.join(", "));
  });
  lines.push("");
  lines.push(BLUE("EDUCATION"));
  education.forEach((e) => {
    lines.push(`  ${YELLOW(e.school)}`);
    lines.push(`    ${e.degree}`);
  });
  return lines;
}

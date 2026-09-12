# OS-Style Portfolio — Plan & Task List

**Owner:** D. James Fusilier — AI Product Leader & Founder (AlamoIQ, WeghachiAI)
**Contact:** djamesfusilier@gmail.com · (713) 805-9804 · github.com/dj-techs
**Goal:** Single-page OS-style portfolio with **macOS** and **Arch Linux** personas, boot-time OS selector, and an in-session OS switcher with a restart cinematic.

---

## 1. Experience Principles

1. **Two fully-themed OSes, one content layer.** Projects, resume, skills, bio live in a single typed data module consumed by both shells — never duplicated.
2. **Feel authentic, not parodic.** Pixel-accurate chrome, correct typography, OS-correct keyboard shortcuts, native-feeling micro-interactions.
3. **Everything is interactive.** No dead chrome. If it looks like a menu, it opens. If it looks like a window, it drags, resizes, minifies, snaps.
4. **Performance-first.** Boot + first interaction under 2s on mid-tier laptop. Animations GPU-accelerated. No layout thrash.
5. **Accessible fallback.** Arrow-key + screen-reader nav; a "classic CV" route (`/plain`) so recruiters can skip the theatrics.
6. **Persistent state.** Chosen OS, theme, wallpaper, open window layout persisted to `localStorage`. Surprise-free returns.

---

## 2. Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | **Next.js 15 (App Router) + React 19 + TypeScript** | SSR/SSG for SEO + OG previews; RSC for the static CV route; good Vercel story |
| Rendering strategy | SSG for `/` (boot selector) and `/plain`; CSR for `/macos`, `/arch` (interactive shells rendered under `"use client"`) | SEO where it matters, interactivity where it's needed |
| Routing | Next App Router: `/`, `/macos`, `/arch`, `/plain` | Deep-linkable, crawlable |
| State | **Zustand** (with `persist` middleware, hydrated client-side) | Minimal, ideal for window manager; SSR-safe with lazy hydration |
| Animation | **Framer Motion** + CSS transitions | Boot, genie minimize, dock bounce, restart fade |
| Styling | **Tailwind CSS** + CSS variables for OS themes | Fast theming, token-driven |
| Windows | Custom WM on `@use-gesture/react` (drag/resize built in-house) | Full control over snap/z-index/minimize FX |
| PDF | **react-pdf** (pdf.js), dynamic-imported (SSR-disabled) | Resume viewer without bloating initial bundle |
| Terminal | Custom React terminal (controlled textarea + virtualized output buffer) | Lighter than xterm.js, more stylable |
| AI chatbot | **Coming Soon** placeholder only (no backend this iteration) | Ship faster; keep entry points so Phase 6 can land later |
| Fonts | `next/font` — Inter + SF Pro fallback (macOS), JetBrains Mono + Fira Code (Arch) | Native-feel, zero layout shift |
| Icons | Lucide + custom SVG set matching each OS | Consistency |
| SEO | `generateMetadata` per route, OG images via `opengraph-image.tsx`, sitemap.ts, robots.ts, JSON-LD `Person` schema on `/plain` | Real recruiter searchability |
| Hosting | Vercel (preview deployments per PR) | Native Next.js target |
| Analytics | Vercel Analytics + Speed Insights | Privacy-friendly, zero-config |

---

## 3. Information Architecture

Shared content module — each entry appears in both OSes, formatted by the shell. Lives outside `app/` so both Server and Client components can import it.

```
src/
  app/                      # Next.js App Router
    layout.tsx              # root HTML, theme CSS vars, next/font
    page.tsx                # SSG boot selector (/)
    macos/page.tsx          # "use client" shell entry
    arch/page.tsx           # "use client" shell entry
    plain/page.tsx          # RSC classic CV (for recruiters + crawlers)
    opengraph-image.tsx     # dynamic OG per route
    sitemap.ts
    robots.ts
  content/
    profile.ts        # name, tagline, contact, photo, socials
    experience.ts     # 6 roles (Invisible, Handshake AI, Outlier, Fishbowl, Reserv, TechnipFMC)
    skills.ts         # AI/ML · Frameworks · LLMs · Languages · Cloud · DBs · Tools
    projects.ts       # RLHF pipelines, Fishbowl chatbot (-30%), Reserv predictive maintenance (-15%), TechnipFMC NXOpen/TeamCenter automation
    education.ts      # UHD BAAS, Lone Star AAS, Handshake AI Fellowship
    about.md          # long-form bio
  os/
    macos/            # shell, dock, menubar, apps
    arch/             # shell, terminal, commands
  shared/             # WindowManager, primitives, sound, shortcuts
  store/              # zustand slices
  lib/                # utils, types
public/
  Resume.pdf          # served statically
```

**App/command parity matrix:**

| Content | macOS app | Arch command |
|---|---|---|
| About me | About This Mac / About Me.app | `whoami`, `neofetch`, `cat about.md` |
| Resume | Preview.app opens `Resume.pdf` | `resume`, `cat resume.txt`, `open resume` |
| Projects | Finder → Projects folder | `projects`, `ls ~/projects`, `cat projects/<slug>.md` |
| Skills | Skills.app (grid) | `skills`, `skills --category=llms` |
| Experience | Contacts-like timeline app | `experience`, `history` |
| Contact | Mail.app compose | `contact`, `mail` (opens mailto) |
| Links | Safari shortcuts | `open github`, `open linkedin` |
| AI Chat | Messages.app (with Claude) | `ai`, `chat`, `claude` |
| OS Switcher | System Settings → Startup Disk | `os switch macos`, `reboot --os=macos` |
| Restart | Apple menu → Restart | `reboot`, `shutdown -r now` |

---

## 4. Phase Plan & Task List

Each phase ends in a **demoable slice**. Don't start phase N+1 until N looks right.

### ▸ Phase 0 — Foundation (0.5 day)
- [ ] `npx create-next-app@latest os-portfolio --typescript --tailwind --app --eslint --src-dir --import-alias "@/*"`
- [ ] Install: framer-motion, zustand, react-pdf, @use-gesture/react, lucide-react, clsx, tailwind-merge
- [ ] Configure `next/font` (Inter + JetBrains Mono) in root layout
- [ ] Tailwind CSS-variable theme tokens (`--bg`, `--accent`, `--font-sans`, `--font-mono`) + per-OS class-scoped overrides
- [ ] Folder layout exactly as in §3
- [ ] Route shells: `app/page.tsx` (SSG), `app/macos/page.tsx` + `app/arch/page.tsx` (client), `app/plain/page.tsx` (RSC)
- [ ] `next.config.js`: strict mode, image optimization config
- [ ] Prettier + ESLint (Next's config) + Husky pre-commit + lint-staged
- [ ] Connect repo to Vercel; preview URLs per PR
- [ ] `README.md` stub; keep this `PLAN.md` at root
- [ ] Verify SSR-safe Zustand pattern (no window refs at module level; persist only after hydration)

### ▸ Phase 1 — Boot & OS Selector (1 day)
- [ ] **Power-on splash** (shared): black screen, subtle vignette, 400 ms fade-in
- [ ] **OS chooser screen**: two large cards — Apple logo (frosted glass) + Arch logo (terminal glyph). Arrow-key + click nav. "Press Enter to boot" hint.
- [ ] Persist selection → `store.boot.lastOS`; skip chooser next visit unless `?chooser=1`
- [ ] Chooser also exposes: accessibility mode link, GitHub link, "what is this?" popover
- [ ] Unit test: keyboard nav, persistence, deep-linking `/#/boot`

### ▸ Phase 2 — Window Manager & Shared Primitives (2 days)
- [ ] `useWindowStore` (zustand): `{ id, app, title, position, size, z, minimized, maximized, fullscreen }`
- [ ] `<Window>` component: drag (title bar), resize (8 handles), snap-to-edge, z-raise on focus
- [ ] Minimize animation hook — parameterized so macOS uses "genie" and Arch uses a blink-out
- [ ] Keyboard shortcuts registry (Cmd+W/Q/M, Cmd+Tab, Cmd+Space, arrow snaps on Arch)
- [ ] Right-click context-menu primitive
- [ ] Toast/notification primitive (Arch uses `dunst`-style bottom-right, macOS uses top-right pill)
- [ ] Sound service with a global mute toggle — startup chime, key clicks, error beep (all opt-in, default off)

### ▸ Phase 3 — macOS Shell (3 days)
- [ ] **Boot sequence:** black → Apple logo → progress bar (1.2 s) → chime (if sound on) → login wallpaper flash → desktop fade
- [ ] **Desktop:** Monterey/Sonoma-style gradient wallpaper (selectable from 4 presets); desktop icons for `Resume.pdf`, `Projects` folder, `README.md` stickie
- [ ] **Menu bar:** Apple menu (About, System Settings, Restart, Shut Down, Switch OS…), active-app menus, right-side status: Battery (fake %), Wi-Fi, Spotlight icon, Control Center, Clock (live, click to toggle date view), User
- [ ] **Dock:** Finder, Safari, Mail, Messages, Preview, Terminal, System Settings, Trash. Magnification on hover, bounce on launch, running-indicator dot
- [ ] **Traffic lights:** red close, yellow genie-minimize, green fullscreen; option-hover shows −/+/⤢ glyphs
- [ ] **Finder:** sidebar (Favorites: Projects, Skills, Experience; Locations: Macintosh HD), column/list/icon view toggle, breadcrumb, Quick Look on spacebar
- [ ] **Preview.app:** react-pdf integration — opens Resume.pdf with sidebar thumbnails + zoom
- [ ] **Spotlight (Cmd+Space):** fuzzy search over apps + content; Enter opens best match
- [ ] **Mission Control (F3 / swipe-up):** expose all windows in a grid, click to focus
- [ ] **Launchpad (F4):** full-screen app grid with pagination
- [ ] **Notification Center:** slide-in from right with recruiter-friendly widgets (Calendar, Weather-fake, "Hire me" CTA)
- [ ] **Skills.app:** native-feeling SwiftUI-vibe list with category segmented control
- [ ] **Experience.app:** vertical timeline card view, each role expandable
- [ ] **Messages.app (AI chat placeholder):** bubble UI, "Claude" as contact, "Coming soon" system message and disabled composer (backend wiring deferred — see Phase 6)
- [ ] **System Settings → Startup Disk:** the OS switcher lives here; pick Arch → triggers restart cinematic
- [ ] **Restart flow:** "Are you sure…" modal → fade desktop to black → Apple logo + spinner → route-change to `/#/arch` → Arch boot

### ▸ Phase 4 — Arch Linux Shell (2.5 days)
- [ ] **GRUB-style bootloader:** "Arch Linux" / "Arch Linux (fallback)" / "Advanced options" — 3-second auto-select
- [ ] **systemd boot log:** green `[  OK  ]` lines scrolling (accurate service names: systemd-udevd, NetworkManager, dbus, sddm) — skippable with any keypress
- [ ] **TTY login:** `arch login:` → typing animation auto-types `guest`, then `Password:` stars briefly, then shell prompt
- [ ] **Prompt:** `[guest@archlinux ~]$ ` in JetBrains Mono; blinking block cursor
- [ ] **Auto-run `os --help`** on first boot — lists commands with colored output (lolcat-style rainbow optional)
- [ ] **Command parser:** tokenize → dispatch → streamed output. Support: `help`, `os`, `ls`, `cd`, `pwd`, `cat`, `clear`, `whoami`, `uname -a`, `neofetch`, `skills`, `resume`, `projects`, `experience`, `contact`, `history`, `echo`, `date`, `reboot`, `shutdown`, `exit`, `sudo` (joke: "guest is not in the sudoers file. This incident will be reported.")
- [ ] **Unknown command:** `bash: <cmd>: command not found` + "Did you mean `X`?" using Levenshtein
- [ ] **Tab completion + command history** (up/down), Ctrl+L clear, Ctrl+C abort, Ctrl+R reverse-search
- [ ] **`neofetch`:** ASCII Arch logo on left, system info on right — branded as the portfolio (`OS: JamesOS x86_64`, `Host: AI/ML Engineer`, `Shell: bash 5.2`, `CPU: Claude Sonnet 4.6`, `Experience: 7yrs/∞`)
- [ ] **`resume`:** opens an in-terminal pager (`less`-style with `q` to quit) showing formatted resume; `resume --pdf` pops a floating PDF window reusing Phase 2 Window
- [ ] **`projects`:** renders a TUI list (arrow keys to navigate, Enter to read)
- [ ] **`skills --tree`:** prints a `tree`-style hierarchy
- [ ] **`chat` / `ai` / `claude`:** prints a "coming soon" banner (backend arrives in Phase 6.5; see Phase 6)
- [ ] **Easter eggs:** `sudo rm -rf /` (joke animation), `sl` (ASCII train), `cowsay`, `fortune`, `pacman -S happiness`
- [ ] **OS switcher command:** `os switch macos` or top-bar icon → same restart cinematic, reversed
- [ ] **Restart flow:** `reboot` → screen clears → "Shutting down…" → systemd stop log reversed → black → route to `/#/boot`

### ▸ Phase 5 — OS Switcher App (0.5 day)
- [ ] Dedicated component reused in both shells (macOS: sheet in System Settings; Arch: `os` command)
- [ ] Shows both OSes with live preview thumbnails and "current" badge
- [ ] Confirmation: "Restart into Arch Linux now?" with warning "Unsaved windows will be closed"
- [ ] Triggers shared `<RestartCinematic>`: fade to black → spinner of departing OS → logo of arriving OS → boot into it
- [ ] Persist choice so a direct reload lands in the chosen OS

### ▸ Phase 6 — AI Chatbot "Coming Soon" (0.25 day)
Ship placeholder surfaces only — no backend this iteration. Design so Phase 6.5 can drop in an Edge route later without UI churn.

- [ ] **macOS Messages.app:** full chat UI rendered with "Claude is offline — coming soon" system bubble; composer disabled with tooltip "AI chat launches Q3"
- [ ] **Arch `chat` / `ai` / `claude` commands:** print a styled banner — `[coming soon] AI portfolio assistant is under construction. Try `resume` or `projects` for now.` then exit cleanly
- [ ] Both entry points carry a "Notify me" mailto link pre-filled to djamesfusilier@gmail.com so interested visitors can opt in
- [ ] Leave a `src/lib/chat.ts` stub with typed `askClaude()` signature returning the canned response — swap implementation in Phase 6.5
- [ ] Document the Phase 6.5 wiring plan (Anthropic SDK on Vercel Edge, prompt-cached resume context, rate limit) in a `FUTURE.md` so it's not lost

### ▸ Phase 7 — Content Population + SEO (1.5 days)
- [ ] Fill `src/content/*` from resume. **Positioning: AI product leader & founder** (see §7).
  - Roles: Invisible Technologies (ML Specialist, Dec 2025–), Handshake AI Fellow (Nov 2025–), Outlier Senior GenAI (May 2024–Dec 2025), Fishbowl Software (Oct 2022–Apr 2024), Reserv (May–Dec 2021), TechnipFMC (Apr 2013–Mar 2018)
  - Highlight KPIs: −30% customer response time, −15% equipment failures
  - Skills taxonomy exactly as listed (AI/ML, Frameworks, LLMs, Languages, Cloud, DBs, Tools, Methodologies)
  - Projects as case studies with problem/approach/stack/outcome
- [ ] Embed the actual `Resume.pdf` at `public/Resume.pdf` for Preview.app + `resume --pdf`
- [ ] Favicon set (dual-state: macOS finder icon on `/macos`, Arch logo on `/arch`, neutral on `/`)
- [ ] **SEO (Next.js-native):**
  - [ ] `generateMetadata()` per route with distinct titles/descriptions ("D. James Fusilier — Senior AI/ML Engineer", OS-specific subtitles)
  - [ ] `app/opengraph-image.tsx` — dynamic OG images (macOS desktop screenshot style + Arch terminal screenshot style + hero card for `/plain`)
  - [ ] `app/sitemap.ts` listing `/`, `/macos`, `/arch`, `/plain`
  - [ ] `app/robots.ts` allowing all, pointing at sitemap
  - [ ] JSON-LD `Person` + `WebSite` schema injected in `/plain` layout
  - [ ] Canonical URLs per route
  - [ ] `/plain` is the SEO workhorse: server-rendered, keyword-rich, every role + skill in plain HTML, resume download link, prominent `mailto:` — this is what Google actually indexes
  - [ ] Add site URL to resume header + LinkedIn + GitHub profile

### ▸ Phase 8 — Polish (1 day)
- [ ] Reduced-motion honor: `prefers-reduced-motion` → skip boot, no genie
- [ ] Mobile strategy: below 768 px, force a simplified "mobile home screen" view (iOS-style grid for macOS, single-column terminal for Arch) — no attempt at window-dragging on touch
- [ ] Keyboard-only flow tested end-to-end
- [ ] Lighthouse: perf ≥ 95, a11y ≥ 95
- [ ] 404 page in-theme (Arch: `404: file not found`, macOS: Finder "The operation can't be completed")
- [ ] Copy pass; remove placeholder text
- [ ] Cross-browser: Chrome, Safari, Firefox, Edge

### ▸ Phase 9 — Launch (0.5 day)
- [ ] Custom domain
- [ ] Share on LinkedIn with a 30-sec screen recording of the OS-switch cinematic
- [ ] Add the site to the resume header
- [ ] Submit to: r/webdev "showoff", Hacker News "Show HN", One Page Love

---

## 5. Stretch Ideas (do not block launch)

- **Terminal inside macOS Terminal.app** runs the *same* Arch command parser — full inception
- **Drag-and-drop between OSes** (drag a file from Finder, switch OS mid-drag, drop into a terminal as a file argument)
- **Shared clipboard** across OSes
- **Live code editor (VS Code in a window) with a working Monaco + a few playground files from projects**
- **"Install" PWA** so it runs as a desktop app — doubly meta
- **Konami code** in either OS unlocks a third OS: Windows XP joke mode
- **Visitor counter** styled as a macOS widget / Arch conky

---

## 6. Risk & Mitigation

| Risk | Mitigation |
|---|---|
| Window-manager scope creep | Freeze WM API after Phase 2; no new primitives without a demo |
| macOS pixel-perfection rabbit hole | Budget 3 days, ship "close enough," iterate post-launch |
| Terminal parser edge cases | Ship a known command list; catch-all returns `command not found` |
| Mobile desktop emulation is bad | Detect & serve simplified view rather than broken one |
| SSR/hydration mismatch from Zustand `persist` | Gate store reads behind a `useHydrated()` hook; render a skeleton on the server |
| Framer Motion + React 19 RSC friction | Keep all animated surfaces in `"use client"` trees; no motion in RSC |

---

## 7. Locked Decisions

- **Framework:** Next.js 15 (App Router) + React 19 + TypeScript. SSG for `/` and `/plain`, client shells for `/macos` and `/arch`. SSR-friendly for SEO and rich OG previews.
- **AI chat:** "Coming soon" placeholders only this iteration. Real Anthropic integration is scoped but deferred — tracked as Phase 6.5 in `FUTURE.md`.
- **Positioning (updated Sept 2026):** AI product leader and technology founder (AlamoIQ, WeghachiAI), per the current resume. Don't reintroduce "Senior AI/ML Engineer" or a years-of-experience count.

## 8. Immediate Next Actions (today)

1. Green-light Phase 0 and I'll scaffold the Next.js project + first commit.
2. Pick the on-brand color palette for each shell (macOS: Sonoma gradient? custom? / Arch: stock Arch blue + dunst notifications).
3. Share the preferred headshot / avatar (or confirm "no photo — initials only").

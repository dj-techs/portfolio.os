# os-portfolio

An OS-style portfolio for **D. James Fusilier** — AI product leader and founder of AlamoIQ and WeghachiAI, building responsible, multi-agent AI for regulated industries.

Pick your OS at `/` and boot into a fully-themed shell:

- `/macos` — desktop, Dock, Finder, Preview.app, menu bar, genie-minimize
- `/arch` — GRUB-style boot, systemd log, bash-like terminal, `neofetch`, easter eggs
- `/plain` — plain-HTML resume (the SEO workhorse and a11y-first escape hatch)

Mid-session switch between OSes triggers a cinematic restart animation.

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Zustand · Framer Motion · react-pdf · next/font.

See [PLAN.md](./PLAN.md) for the full phase plan and [FUTURE.md](./FUTURE.md) for deferred work.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint
```

## Deploy

Push to `main` → Vercel preview per PR, production on merge.

# FUTURE.md — deferred work

Parked scope that isn't blocking launch. Keep this short; each entry is one unit of work.

## Phase 6.5 — AI portfolio assistant (real backend)

**Trigger to start:** Launch traffic warrants it, OR a recruiter asks for it.

**Tasks:**
- [ ] Create Vercel Edge route `app/api/chat/route.ts` — POST, streams Anthropic Messages API (Claude Sonnet 4.6 or latest).
- [ ] Enable **prompt caching** on the system prompt. System prompt is resume + projects + skills inlined once; cache it so per-query cost stays flat.
- [ ] System prompt outline:
  > You are D. James Fusilier's portfolio assistant. Answer questions about his experience, projects, skills, and availability. Be concise — 2–4 sentences unless asked for depth. Never invent projects. If asked something outside the resume scope, suggest emailing djamesfusilier@gmail.com.
- [ ] Rate-limit by IP via Upstash Redis (e.g. 10 msgs / hour / IP).
- [ ] Swap `src/lib/chat.ts` `askClaude()` to call the Edge route and stream. Keep the `ChatReply` signature stable.
- [ ] Remove "coming soon" banners from:
  - macOS Messages.app UI
  - Arch `chat` / `ai` / `claude` commands
- [ ] Fallback: if the Edge route errors or rate-limits, render the existing canned reply — don't break the UI.
- [ ] Add usage analytics (count of chats, not contents).

**Env vars needed:**
- `ANTHROPIC_API_KEY`
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`

## Stretch ideas (from PLAN.md §5)

- Drag-and-drop between OSes (pick up a file in Finder, switch OS mid-drag, drop into terminal as `$1`)
- Shared clipboard across OSes
- VS Code-in-a-window with live Monaco editor + playground files from real projects
- PWA install ("install this OS as an app" — doubly meta)
- Konami code unlocks Windows XP joke mode
- Visitor counter styled as a macOS widget and an Arch conky

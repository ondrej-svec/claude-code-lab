---
title: "feat: power up the samples — The Guide"
type: plan
date: 2026-04-27
status: complete
brainstorm: docs/brainstorms/2026-04-27-power-up-the-samples-brainstorm.md
confidence: medium
follow_up: docs/plans/2026-04-27-feat-guide-chapter-thread-plan.md
---

> **Shipped on PR #10.** All five phases landed in one merge. Strategic review verdict: APPROVE. The chapter-thread expansion (chapters 4–9) is captured in the follow_up plan stub and remains blocked on the lab-improvements plan's chapter-rewrite ban. Runtime verification of the .NET sample requires `brew install --cask dotnet-sdk` post-merge — flagged in commit and PR.


# feat: power up the samples — The Guide

Replace both bone-stock CRUD samples with **The Guide** — a Hitchhiker's-styled personal knowledge base. Theatrical CRT boot on first run, calm Rosé Pine reading view forever after. Same `/api/entries` API on both stacks; python-react owns the visual frontend wow, .NET owns the terminal ANSI boot wow. Bilingual EN/CS seeded entries. No AI, no API keys at seed.

## Problem Statement

`samples/python-react/` and `samples/dotnet-core/` are bone-stock CRUD: in-memory list of three hardcoded strings, inline-styled white-page frontend on the React side, no frontend at all on the .NET side. They appear in only two chapters (`first-task`, `teach-claude-your-project`) and have zero thematic connection to the cc-lab universe.

The samples need to do **both** of these — they currently do neither:

1. **Wow on minute one** — first run produces "oh, this is *cool*" not "tutorial repo #347."
2. **Sustain the whole lab** — every chapter from `before-we-start` to `next-steps` has natural, motivated work to do on this sample.

Per the brainstorm decision, the answer is **The Guide** — see `docs/brainstorms/2026-04-27-power-up-the-samples-brainstorm.md` for the full reframing and rejected alternatives.

## Target End State

When this plan is done:

- A fresh participant runs `cd samples/python-react/frontend && pnpm install && pnpm dev`. They see a calm Rosé Pine reading app with seeded Guide entries — preceded the first time by a brief, dismissible CRT-style boot moment with a typed "DON'T PANIC" reveal. They can browse, create, delete, search, and tag entries. The locale toggle (Babel Fish icon) flips between EN and CS seeded content.
- A fresh participant runs `cd samples/dotnet-core && dotnet run`. The first run greets them with a Rosé Pine ANSI boot sequence (typed lines, "DON'T PANIC" banner, one styled entry box with a green "MOSTLY HARMLESS" badge), then starts the API at http://localhost:5100. Subsequent runs print one calm line: `Sub-Etha relay online · http://localhost:5100`.
- Both stacks expose the same `/api/entries` shape (GET, POST, PUT, DELETE, plus `/api/entries/{id}`). Both seed with the same six entries (three EN, three CS). Both pass `pnpm lint && pnpm test && pnpm test:e2e` and `pnpm build` at the cc-lab root.
- The two existing chapter references (`first-task.mdx`, `teach-claude-your-project.mdx` in EN and CS) are updated to use The Guide for their exercises — replacing the old "add a `GET /health` endpoint" task with "add a `DELETE /api/entries/{id}` endpoint and delete button" per the brainstorm chapter map.
- All affected `.ansi` capture fixtures (`scripts/capture/generate-fixtures.py` and the rendered files in `scripts/capture/sessions/`) are regenerated to match the new sample shape. CLI screenshots that reference the old samples are re-rendered.
- `docs/cc-lab-design-system.md` gains a small section codifying the one-time boot animation as a deliberate, scoped exception to the "no animated backgrounds" rule, with the rule for when this exception is permitted (one-shot, dismissible, remembered, narratively meaningful).
- The lab repo's `.claude/settings.json` allow list covers the commands participants will run (`dotnet run`, `dotnet build`, `dotnet test`, `python *`, `uvicorn *`, `pip *`).

## Scope and Non-Goals

**In scope:**
- Full rebuild of both samples per the brainstorm.
- Update the two existing chapter references (chapters 2 and 3, EN+CS) to use The Guide exercise.
- Regenerate all `.ansi` fixtures and CLI/web screenshots that reference the old samples.
- One small, scoped amendment to `docs/cc-lab-design-system.md` for the boot-animation exception.
- One small amendment to `.claude/settings.json` allow list.

**Explicitly out of scope (reasons in parens):**
- The brainstormed chapter thread for chapters 4–9 (planning, voice-and-interaction, iteration-and-control, behind-the-scenes, ecosystem, compound-engineering, next-steps). The 2026-04-24 lab improvements plan currently bans broad chapter rewrites. **The brainstormed exercises for those chapters are documented but deferred to a follow-up plan** — `docs/plans/YYYY-MM-DD-feat-guide-chapter-thread-plan.md`. This plan ensures the *samples have the surface area* to support those exercises later.
- Adding a database (SQLite or otherwise) at seed. Stays in-memory per brainstorm Q6.
- Auth, multi-user, accounts.
- AI features in the seed. No API keys required.
- A heavy CSS framework (Tailwind, MUI, Bootstrap, shadcn). Vanilla CSS with Rosé Pine vars only.
- Tests shipped at seed. Tests are written *during* the lab as exercises.
- Splitting samples into the `cc-lab-samples` repo. Deferred — they stay in `samples/` here.
- A web-fetch / Wikipedia MCP install (Open Question #1 from the brainstorm). Resolved by re-scoping the future `ecosystem` chapter exercise — see Decision Rationale.
- A third sample stack.

## Proposed Solution

### High-level architecture

Both samples implement the same domain — **Entries** in **The Guide** — exposing the same REST API. The python-react sample owns the visual frontend; the .NET sample owns the terminal-side wow.

**Domain model:**
```
Entry {
  id: int
  title: string
  body: string (markdown)
  badge: "mostly-harmless" | "mostly-dangerous" | "unknown"
  contributor: string
  created_at: ISO 8601 string
  tags: string[]
}
```

**API surface (identical on both stacks):**
- `GET /api/entries` — list all
- `GET /api/entries/{id}` — single entry
- `POST /api/entries` — create
- `PUT /api/entries/{id}` — update
- `DELETE /api/entries/{id}` — delete (added by participants in chapter 2 — *NOT shipped at seed*)

Wait — clarification: the seed ships with `GET`, `POST`, and `GET /api/entries/{id}` only. `PUT` and `DELETE` are shipped at seed too because chapter 2's exercise (per brainstorm Q4) is "add `DELETE`" — meaning the seed must NOT have `DELETE`, otherwise there's nothing to add. **Final seed surface: `GET /api/entries`, `GET /api/entries/{id}`, `POST /api/entries`. `PUT` and `DELETE` are participant exercises.**

**Seeded entries** (in-memory, same on both stacks):

| # | Locale | Title | Badge | Contributor |
|---|---|---|---|---|
| 1 | EN | "On the towel, and why you should always know where it is" | mostly-harmless | Ford Prefect |
| 2 | EN | "The Babel Fish" | mostly-harmless | The Guide |
| 3 | EN | "Vogon poetry" | mostly-dangerous | Slartibartfast |
| 4 | CS | "O ručníku, a proč byste měli vědět, kde ten váš je" | mostly-harmless | Ford Prefect |
| 5 | CS | "Babylonská rybka" | mostly-harmless | The Guide |
| 6 | CS | "Vogonská poezie" | mostly-dangerous | Slartibartfast |

(Final entry titles and bodies are written during Phase 1. Above is shape, not literal copy.)

### python-react sample (`samples/python-react/`)

**Backend (`backend/`):**
- FastAPI single-file `main.py` with the three endpoints above, in-memory `_entries` list seeded with the six entries.
- Pydantic models: `Entry` (response), `EntryInput` (request body).
- CORS middleware for `http://localhost:5173`.
- No new Python dependencies beyond `fastapi`, `uvicorn`, `pydantic` (already present).

**Frontend (`frontend/`):**
- Vite + React + TypeScript (existing stack — no new bundler).
- Add `next/font`-style font loading via `<link>` tags or fontsource for **Manrope**, **Space Grotesk**, **JetBrains Mono** (matching cc-lab site).
- Pure CSS variables in `src/styles.css` mirroring `app/globals.css` Rosé Pine Dawn / Moon tokens. Dark mode default, light mode opt-in via `prefers-color-scheme` (no theme toggle in the sample — keep it simple).
- Components:
  - `<App />` — root, manages locale + boot state.
  - `<Boot />` — CRT boot animation (CSS-only, ~2.5s, dismiss-on-keypress or auto-advance).
  - `<EntryList />` — calm reading list with badge chips, contributor, timestamp.
  - `<EntryCard />` — single-entry view (called from list when expanded).
  - `<NewEntryForm />` — create form, shown inline at top of list.
  - `<Search />` — client-side filter input.
  - `<TagFilter />` — chip row, filters list by selected tag.
  - `<LocaleToggle />` — Babel Fish icon, flips state between EN and CS (filters seeded entries by locale field internally OR refetches with `?locale=` — pick one in Phase 1).
- A tiny custom markdown renderer (~30 LOC) for bold, italic, code, links, lists. No `react-markdown` dependency — keeps the sample readable.
- localStorage key `cc-lab-guide:booted` to remember the boot was shown.
- No state management library — `useState` + `useEffect`.

**File layout:**
```
samples/python-react/
├── README.md
├── CLAUDE.md
├── .claudeignore
├── backend/
│   ├── main.py
│   └── requirements.txt
└── frontend/
    ├── index.html
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── styles.css
        ├── api.ts
        ├── markdown.ts
        ├── components/
        │   ├── Boot.tsx
        │   ├── EntryList.tsx
        │   ├── EntryCard.tsx
        │   ├── NewEntryForm.tsx
        │   ├── Search.tsx
        │   ├── TagFilter.tsx
        │   └── LocaleToggle.tsx
        └── data/
            └── seed-locale-strings.ts
```

### dotnet-core sample (`samples/dotnet-core/`)

**Code (`Program.cs`):**
- ASP.NET Core minimal API, same three endpoints.
- `Entry` record with the same shape (note: C# property names PascalCase, JSON serialization to camelCase via `JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase`).
- In-memory `EntryStore` seeded with the same six entries.
- Add `Spectre.Console` dependency for the boot sequence (decision below in Decision Rationale).
- Boot logic at startup: check for `.guide-booted` marker file in the working dir. If absent, run `BootSequence.Play()` (typed-out lines, Rosé Pine ANSI, one entry rendered as a styled `Spectre.Console.Panel`); then `File.WriteAllText(".guide-booted", DateTime.UtcNow.ToString("o"))`. If present, print one line: `Sub-Etha relay online · http://localhost:5100`.

**File layout:**
```
samples/dotnet-core/
├── README.md
├── CLAUDE.md
├── .claudeignore
├── .gitignore (add `.guide-booted` to ignore)
├── CCLab.Sample.csproj
├── appsettings.json
├── Program.cs
├── Models/
│   └── Entry.cs
├── Stores/
│   └── EntryStore.cs
└── Boot/
    └── BootSequence.cs
```

(`Program.cs` stays small — the model, store, and boot logic split into folders to keep `Program.cs` readable as the API definition.)

### Visual fixtures and chapter updates

- `scripts/capture/generate-fixtures.py` — rewrite the affected `.ansi` fixtures to use the new sample names, paths, and content. Re-run `generate-fixtures.py` and `capture-cli.sh`.
- `content/{en,cs}/first-task.mdx` and `content/{en,cs}/teach-claude-your-project.mdx` — update copy from `GET /health` exercise to `DELETE /api/entries/{id}` exercise. Both EN and CS must stay in sync.
- `docs/cc-lab-design-system.md` — add a short "Cinematic moments" subsection codifying when an animation is permitted: one-shot, dismissible, remembered, narratively meaningful.
- `.claude/settings.json` — extend `permissions.allow` with: `dotnet run`, `dotnet build`, `dotnet test`, `python3 *`, `uvicorn *`, `pip install *`.

## Subjective Contract

**Target outcome:** A participant on either stack runs the sample and feels they've opened something *crafted*, not a tutorial template. The python-react boot moment makes them smile or screenshot it. The .NET terminal boot makes them lean in. The calm post-boot state feels like an app they'd keep open. Both feel unmistakably part of the cc-lab universe.

**Anti-goals:**
- Not a gag. Not a Hitchhiker's encyclopedia. Not novelty without utility.
- Not over-finished — every chapter (now and future) must have meaningful work to do.
- Not a framework demo. Not "look how clever the React state management is."
- Not a CRT boot that wears thin by run three.
- Not a terminal experience that feels like a cheap consolation prize for the .NET reader.

**References (positive models):**
- Reader, Are.na, the calmest personal-wiki apps — generous typography, restrained palette, long-readable content.
- The cc-lab site itself (`app/`) — same fonts, same palette, same posture.
- The cc-lab `freeze` outputs in `public/visuals/` — already-validated Rosé Pine ANSI rendering.
- Spectre.Console's own example panels for the .NET boot panel layout.

**Anti-references:**
- GitHub README "TODO list" demos.
- Bootstrap admin templates.
- Tutorial apps from any year ending in "tutorial."
- Joke-of-the-day apps (the personality must come from restraint and one-line copy, not gags).
- Heavy CSS frameworks, animated gradient backgrounds, decorative shadows beyond `--shadow-soft`.

**Tone / taste rules:**
- All in-app copy follows `docs/cc-lab-design-system.md` voice rules: quietly confident, peer-to-peer, no bullshit. No "let's", no "leverage", no "exciting/amazing", no decorative emoji.
- One line of copy per surface, not paragraphs. Entry titles can have personality; UI chrome cannot.
- The boot animation has zero text beyond what's typed: `> initializing sub-etha relay…`, `> infinite improbability drive: stable`, `DON'T PANIC`, `> the guide is now open`. Three or four short lines. No more.
- The terminal boot panel uses Rosé Pine palette mapping from `scripts/visuals/vhs.theme.json` (already canonical).

**Representative proof slice (Phase 1 gate):**
- `samples/python-react/` — calm reading view only (no boot yet), six seeded entries (3 EN, 3 CS), one entry rendered with full styling: title in Space Grotesk, body in Manrope, badge chip color-coded, contributor line, tag chips, timestamp. Locale toggle works. Backend serves the API. Playwright screenshot in dark mode at `public/screenshots/sample-guide-calm-view.png` (2× retina).
- This is the gate. Visual review by ondrej before Phase 2 (boot animation) starts.

**Rollout rule:** Land the python-react proof slice first. Validate the visual feels right. Only then expand to the boot animation, then to the .NET twin. Do not begin chapter MDX updates until the .NET twin is reviewed and merged. Do not regenerate ANSI fixtures until the .NET sample's new ANSI output is final.

**Rejection criteria (any one of these sends work back to planning):**
- A non-dev sees minute one and says "huh, okay" instead of "wait, that's cool."
- The post-boot calm view feels noisy, demo-style, or framework-shaped.
- The .NET terminal boot feels mechanical, padded, or overlong.
- Setup needs anything beyond `pnpm install && pnpm dev` or `dotnet run`.
- A reader needs more than 60 seconds to understand what the sample is.
- Either stack accidentally introduces a hard dependency on an external service or API key.
- The boot animation can't be skipped or doesn't remember it was skipped.

**Required preview artifacts (gate before code work proceeds in each phase):**

| Phase | Artifact | Tool | Path |
|---|---|---|---|
| 1 | Calm reading view, dark mode | Playwright | `public/screenshots/sample-guide-calm-view.png` |
| 1 | Calm reading view, light mode | Playwright | `public/screenshots/sample-guide-calm-view-dawn.png` |
| 2 | Boot animation, animated | Playwright video or VHS web cast | `public/visuals/sample-guide-boot.webm` |
| 2 | Single-entry view | Playwright | `public/screenshots/sample-guide-single-entry.png` |
| 3 | .NET boot, static still | `freeze` | `public/visuals/sample-dotnet-guide-boot.png` |
| 3 | .NET boot, animated cast | `vhs` | `public/visuals/sample-dotnet-guide-boot.webm` |

Reviewer for all preview artifacts: **ondrej**. Failure to pass review sends the work back to planning, not implementation.

## Implementation Tasks

### Phase 0 — Pre-work (resolve open questions, prep environment)

- [ ] **Decide and apply: Spectre.Console for .NET ANSI** — Use Spectre.Console (decision recorded in Decision Rationale below). No code work in this phase, just confirmation.
- [ ] **Resolve: web-fetch MCP for future chapter exercise** — Re-scope future `ecosystem` chapter exercise (chapter 7) to use `chrome-devtools-mcp` (already installed) for fetching a URL into a Guide entry, OR a small backend `POST /api/entries/from-url` endpoint added by participants that uses Python `urllib`. Decision: *defer to the chapter-thread plan*; the sample plan does NOT depend on a web-fetch MCP. Documented under Decision Rationale.
- [ ] **Update `.claude/settings.json`** — Extend `permissions.allow` with `dotnet run`, `dotnet build`, `dotnet test`, `python3 *`, `uvicorn *`, `pip install *`. Test by running `dotnet --version` and `python3 --version` after the change.
- [ ] **Update `docs/cc-lab-design-system.md`** — Add "Cinematic moments" subsection under the Aesthetic posture section, codifying the one-time boot animation as a permitted exception. The exception rule: *one-shot per install, dismissible at any keypress, remembered persistently, narratively meaningful, reduced-motion respecting*.
- [ ] **Write final seeded entry copy (EN + CS)** — Six entry bodies, one-paragraph each. Calm tone. Contributor names and badges per the table above. Saved as a draft in `docs/plans/2026-04-27-guide-seed-entries-draft.md` for review before Phase 1 lands them in code.

**Phase 0 exit criteria:** All four checkboxes above are done. The seeded-entries draft is reviewed by ondrej. Settings.json change is committed and tested.

### Phase 1 — python-react proof slice (calm view only)

- [ ] **Backend rewrite** — Replace `samples/python-react/backend/main.py` with the new Entry domain. Three endpoints: `GET /api/entries`, `GET /api/entries/{id}`, `POST /api/entries`. In-memory store seeded with the six entries from Phase 0 draft. Pydantic models: `Entry`, `EntryInput`. Locale field on `Entry`.
- [ ] **`samples/python-react/backend/requirements.txt`** — Confirm pinned versions of `fastapi`, `uvicorn`, `pydantic`. No new dependencies.
- [ ] **Frontend scaffolding** — Update `package.json` to add font loading dependencies if going via fontsource (`@fontsource/manrope`, `@fontsource/space-grotesk`, `@fontsource/jetbrains-mono`), OR use `<link>` tags in `index.html` to `fonts.googleapis.com` (decide during this phase — fontsource is preferred for offline reproducibility).
- [ ] **CSS layer** — Create `src/styles.css` with Rosé Pine Dawn/Moon CSS variables exactly mirroring `app/globals.css`. Dark mode default. `prefers-color-scheme: light` falls back to Dawn. No theme toggle UI in the sample.
- [ ] **Calm reading view components** — `<App />`, `<EntryList />`, `<EntryCard />`, `<NewEntryForm />`, `<Search />`, `<TagFilter />`, `<LocaleToggle />`. NO boot component yet (Phase 2). NO markdown renderer yet — render entry body as plain text in this phase. Goal: validate the visual before adding more.
- [ ] **Locale toggle behavior** — Babel Fish icon in the header. State stored in React state only (no localStorage in this phase). Filters the entry list to entries matching the selected locale.
- [ ] **API client** — `src/api.ts` with three functions: `listEntries()`, `getEntry(id)`, `createEntry(input)`. Plain `fetch`, no axios.
- [ ] **README + CLAUDE.md update** — Rewrite `samples/python-react/README.md` to describe The Guide, the boot moment, the lab integration. Rewrite `samples/python-react/CLAUDE.md` to teach Claude about the Entry domain, badge rules, voice constraints (no "let's", no "leverage"), and the no-AI / no-keys rule.
- [ ] **Manual verification** — Run `pnpm install && pnpm dev` in the frontend, `pip install -r requirements.txt && uvicorn main:app --reload` in the backend. Visit http://localhost:5173. Browse entries. Toggle locale. Create an entry. Confirm it persists for the session.
- [ ] **Capture preview artifacts** — Add two `Shot` entries to `scripts/capture/capture-web.ts`: `sample-guide-calm-view` (dark mode) and `sample-guide-calm-view-dawn` (light mode). Run `tsx scripts/capture/capture-web.ts`. Outputs to `public/screenshots/`.
- [ ] **Visual review gate** — ondrej reviews the two screenshots and the live frontend. **HARD GATE: Phase 2 does not start until this passes.**

**Phase 1 exit criteria:** Frontend renders the calm reading view with full styling. Backend serves the new API. Both screenshots in `public/screenshots/` and approved by ondrej. CLAUDE.md teaches the new domain. No regression to `pnpm lint && pnpm test && pnpm build` at the cc-lab repo root.

### Phase 2 — python-react full feature set + CRT boot

- [ ] **Markdown renderer** — Implement `src/markdown.ts` (~30 LOC, regex-based) supporting bold, italic, inline code, links, unordered lists, and paragraph breaks. NO third-party markdown library.
- [ ] **Wire markdown into `<EntryCard />`** — Replace plaintext body with markdown-rendered output.
- [ ] **`<Boot />` component** — CSS-only animation (~2.5s, but `prefers-reduced-motion` cuts to 0.4s). Phases: scan-line wash → typed text reveal → "DON'T PANIC" pulse → fade to entries page. Skip-on-keypress (any key). Sets `localStorage["cc-lab-guide:booted"] = "true"` on completion or skip.
- [ ] **Wire `<Boot />` into `<App />`** — On first mount, if `localStorage["cc-lab-guide:booted"]` is unset, render `<Boot />` over the app and hide entries until done. Otherwise skip directly to the calm view.
- [ ] **Search and tag filter functionality** — Wire `<Search />` to filter the entries list by case-insensitive title/body match. Wire `<TagFilter />` to filter by selected tag. Both client-side, no API change.
- [ ] **Persist locale preference** — Save selected locale to `localStorage["cc-lab-guide:locale"]` so it survives reload.
- [ ] **Reduced-motion verification** — Manually test with `prefers-reduced-motion: reduce` set in dev tools. Boot must complete in under 0.5s with no scan-line animation.
- [ ] **Capture preview artifacts** — `sample-guide-boot.webm` (Playwright video recording or VHS web cast of the first-run boot). `sample-guide-single-entry.png` (Playwright). `sample-guide-create-form.png` (Playwright).
- [ ] **Manual full-flow verification** — Clear localStorage, run `pnpm dev`. Watch boot. Browse entries. Search. Filter by tag. Create entry. Toggle locale. Reload — confirm boot doesn't replay.
- [ ] **Visual review gate** — ondrej reviews the boot recording and the new screenshots. **HARD GATE: Phase 3 does not start until this passes.**

**Phase 2 exit criteria:** Full feature set works in the browser. Boot is cinematic on first run, never on second. `prefers-reduced-motion` honored. All preview artifacts captured and approved.

### Phase 3 — .NET twin (API + terminal boot)

- [ ] **Add Spectre.Console dependency** — Update `samples/dotnet-core/CCLab.Sample.csproj` with `<PackageReference Include="Spectre.Console" Version="0.49.*" />` (latest stable as of plan date). Verify with `dotnet restore`.
- [ ] **Refactor domain into `Models/Entry.cs` and `Stores/EntryStore.cs`** — Match the Python sample's domain shape exactly (same field names in JSON, same six seeded entries, same locale field). Use `record` for `Entry`. JSON serialization config in `Program.cs` to use camelCase property names.
- [ ] **Rewrite `Program.cs` API endpoints** — Three endpoints matching Python sample: `GET /api/entries`, `GET /api/entries/{id}`, `POST /api/entries`. Use existing minimal API style.
- [ ] **`Boot/BootSequence.cs`** — Implement `BootSequence.Play()` using Spectre.Console: typed-out lines (use `AnsiConsole.MarkupLine` with delays via `Thread.Sleep` between lines, ~150ms per line), "DON'T PANIC" banner using `FigletText` or styled markup, one entry rendered as a `Panel` with a green `MOSTLY HARMLESS` badge. Total duration ~2.5s.
- [ ] **First-run logic in `Program.cs`** — Before `app.Run()`: check for `.guide-booted` file in `Directory.GetCurrentDirectory()`. If absent, call `BootSequence.Play()`, then write the marker. If present, print `Sub-Etha relay online · http://localhost:5100` once.
- [ ] **`.gitignore` update** — Add `.guide-booted` to `samples/dotnet-core/.gitignore`.
- [ ] **README + CLAUDE.md update** — Same shape as the python-react sample's READMEs, but .NET-flavored. CLAUDE.md teaches the Entry domain, badge rules, voice constraints, no-AI / no-keys rule, AND notes the Spectre.Console dependency rationale.
- [ ] **Manual verification** — Delete any existing `.guide-booted`. Run `dotnet run`. Watch the boot sequence. Confirm API serves at http://localhost:5100. Hit it with `curl http://localhost:5100/api/entries`. Run `dotnet run` again — confirm one-line output, no boot replay. Delete marker, run again — boot replays.
- [ ] **Capture static still** — Author a `.ansi` fixture at `scripts/capture/sessions/sample-dotnet-guide-boot.ansi` (hand-crafted to match the rendered output). Run `./scripts/capture/capture-cli.sh sample-dotnet-guide-boot`. Output: `public/visuals/sample-dotnet-guide-boot.png`.
- [ ] **Capture animated cast** — Author `scripts/visuals/sample-dotnet-guide-boot.tape` for VHS that runs `dotnet run` from a clean state. Output: `public/visuals/sample-dotnet-guide-boot.webm` + poster.
- [ ] **Visual review gate** — ondrej reviews the still and the cast. **HARD GATE: Phase 4 does not start until this passes.**

**Phase 3 exit criteria:** `.NET` sample serves API and renders the boot sequence on first run. Both `freeze` still and VHS cast captured and approved.

### Phase 4 — Update visual fixtures and existing chapter references

- [ ] **Update `scripts/capture/generate-fixtures.py`** — Replace references to old samples (`Onboarding checklist`, `weekly review`, the `GET /health` flow) with The Guide content (entry titles, the `DELETE /api/entries/{id}` flow). Both stream A (.NET) and stream B (Python). Re-derive every affected `.ansi` fixture.
- [ ] **Re-run `generate-fixtures.py` and `capture-cli.sh`** — Regenerate every `.ansi` and rendered terminal still that references the old samples (`ch2a-run.ansi`, `ch2a-diff.ansi`, `ch2-plan-output.ansi`, `ch2b-plan-output.ansi`, `ch2b-diff.ansi`, `ch2b-run.ansi`, `ch3-init-output.ansi`, plus their `.png`/`.svg` outputs).
- [ ] **Update `content/en/first-task.mdx`** — Replace the `GET /health` exercise (lines around 19 and 76) with the new `DELETE /api/entries/{id}` exercise. Two variant sections (.NET / python-react) with the same logical task.
- [ ] **Update `content/cs/first-task.mdx`** — Mirror the EN update in CS, same two variants. Voice and structure stay aligned with the EN version per design system rules.
- [ ] **Update `content/en/teach-claude-your-project.mdx`** — Replace the line ~131 sample reference with the new Guide sample wording. Make sure the chapter's discussion of CLAUDE.md still makes sense against the new sample CLAUDE.md (it does — the new CLAUDE.md is richer).
- [ ] **Update `content/cs/teach-claude-your-project.mdx`** — Mirror the EN update.
- [ ] **Lint / test / build verification** — Run `pnpm lint && pnpm test && pnpm test:e2e && pnpm build` from the repo root. All green.
- [ ] **Visual review gate** — ondrej reviews the updated chapter MDX renders (in dev) and the regenerated fixtures.

**Phase 4 exit criteria:** Both EN and CS variants of the two chapters reference the new Guide sample. All ANSI fixtures and terminal stills regenerated. Repo-root lint/test/build green.

### Phase 5 — Hand-off + follow-up plan stub

- [ ] **Write follow-up plan stub** — Create `docs/plans/YYYY-MM-DD-feat-guide-chapter-thread-plan.md` (with today's date) as a *stub* that lists the brainstormed exercises for chapters 4–9 (`voice-and-interaction`, `iteration-and-control`, `behind-the-scenes`, `ecosystem`, `compound-engineering`, `next-steps`) so the work isn't lost. Status: `proposed`. Confidence: `low` until the design system review and the lab improvements plan unblock chapter rewrites.
- [ ] **Update `docs/visuals.md`** — Add the new sample-guide visual entries with their per-chapter status (which assets ship now, which are deferred).
- [ ] **Run `/cc-lab-diagnose project`** — Smoke-test the diagnostic plugin against the rebuilt repo to make sure nothing broke.
- [ ] **Open PR** — One PR for all of Phase 0–4. Label: `samples`, `lab-content`, `visual`. Description references this plan and the brainstorm.

**Phase 5 exit criteria:** Follow-up plan stub exists. Diagnostic plugin runs clean. PR opened.

## Acceptance Criteria

1. `samples/python-react/` — `pnpm install && pnpm dev` (frontend) and `pip install -r requirements.txt && uvicorn main:app --reload` (backend) start cleanly with no warnings beyond expected dev-mode output.
2. First load of http://localhost:5173 in a fresh browser plays the CRT boot animation, then reveals the calm entries page.
3. Second load of http://localhost:5173 (with localStorage populated) skips straight to entries.
4. Locale toggle (Babel Fish icon) flips entry list between EN and CS seeded entries; preference persists across reloads.
5. `samples/dotnet-core/` — `dotnet run` from a fresh clone (no `.guide-booted` file) plays the ANSI boot sequence, prints one styled entry box, then starts the API at http://localhost:5100. Hitting `curl http://localhost:5100/api/entries` returns six seeded entries.
6. Second `dotnet run` (with marker present) prints exactly one line: `Sub-Etha relay online · http://localhost:5100`.
7. `curl http://localhost:8000/api/entries` and `curl http://localhost:5100/api/entries` return the same JSON shape (modulo serialization order).
8. Both samples' `CLAUDE.md` files teach the Entry domain, badge rules, voice constraints, and the no-AI / no-keys rule. A fresh `claude code` session in either sample directory has enough context to add a `DELETE` endpoint on prompt.
9. `pnpm lint && pnpm test && pnpm test:e2e && pnpm build` at the cc-lab repo root all pass.
10. Both `content/{en,cs}/first-task.mdx` and `content/{en,cs}/teach-claude-your-project.mdx` reference the new Guide sample with the new exercise. Chapter MDX renders without warnings.
11. `public/screenshots/sample-guide-calm-view.png`, `public/screenshots/sample-guide-calm-view-dawn.png`, `public/screenshots/sample-guide-single-entry.png`, `public/visuals/sample-guide-boot.webm`, `public/visuals/sample-dotnet-guide-boot.png`, and `public/visuals/sample-dotnet-guide-boot.webm` all exist and are reviewed.
12. `prefers-reduced-motion: reduce` reduces the React boot to under 0.5s with no scan-line animation. The .NET boot is unaffected (terminal motion is per-frame text printing, no animation to disable).
13. No new external service or API key is required to run either sample.
14. `docs/cc-lab-design-system.md` has the "Cinematic moments" exception subsection.
15. `.claude/settings.json` allow list covers all commands the new samples need.

## Decision Rationale

Decisions made *during planning* (beyond what the brainstorm fixed). Each decision lists the alternatives considered.

### D1: Spectre.Console for .NET ANSI — DECIDED

**Decision:** Use `Spectre.Console` (latest stable, currently 0.49.x) for the .NET boot sequence.

**Why:** No existing .NET ANSI precedent in the repo (research confirmed via grep). For *runtime* ANSI output, Spectre.Console is the idiomatic, well-maintained pick — it gives us `Panel`, `FigletText`, `MarkupLine`, and clean color theming with one dependency. Hand-rolling ANSI escape codes in C# would duplicate the logic from `scripts/capture/generate-fixtures.py` (which is *fixture* generation, not runtime app output) and add ~80 LOC of fragile string-formatting work to the sample. The goal is "looks crafted on minute one" — Spectre.Console is the lowest-effort path to a result that matches the brainstorm's wow bar.

**Alternatives rejected:**
- *Hand-rolled ANSI escape strings* — matches the existing fixture pattern but is fragile, more code, and the fixture pattern exists for a different purpose (offline rendering).
- *Pastel / Crayon / other smaller libraries* — less feature-complete (no `Panel` primitives, no `FigletText`), would still need supplementing. Spectre.Console wins on completeness.
- *No styled boot — just `Console.WriteLine`* — fails the brainstorm's wow bar.

**Risk:** Adds one dependency to a sample that prides itself on minimal `csproj`. **Mitigation:** the sample's CLAUDE.md explicitly explains the Spectre.Console rationale so it doesn't read as accidental dependency creep.

### D2: Re-scope the future ecosystem-chapter exercise away from Wikipedia MCP — DECIDED

**Decision:** The future `ecosystem` chapter exercise (chapter 7 in the brainstorm map) does NOT depend on a web-fetch / Wikipedia MCP install. The exercise is re-scoped (in the *follow-up* plan, not this one) to use either:
- `chrome-devtools-mcp` (already installed) to fetch a Wikipedia page in a browser context and extract content into a Guide entry, OR
- A small backend `POST /api/entries/from-url` endpoint that the participant adds, using Python `urllib` and a tiny HTML-to-markdown converter (zero new dependencies).

This plan does NOT make either choice; it *removes* the dependency on installing a new MCP. The choice is for the future chapter-thread plan.

**Why:** Open Question #1 from the brainstorm flagged that no web-fetch MCP exists in the project. Forcing a participant to install a new MCP adds setup friction that the brainstorm explicitly opposes ("zero API keys, no setup beyond `pnpm install && pnpm dev`"). Re-scoping keeps the brainstorm's spirit intact.

**Alternatives rejected:**
- *Add a web-fetch MCP to `enabledPlugins` in `.claude/settings.json`* — adds an opaque dependency the participant didn't choose. Rejected.
- *Document that the participant must install one* — feels like a setup-friction tax. Rejected.

### D3: API surface at seed includes `GET` and `POST` only — DECIDED

**Decision:** The seed ships `GET /api/entries`, `GET /api/entries/{id}`, `POST /api/entries`. `PUT /api/entries/{id}` and `DELETE /api/entries/{id}` are deliberately *absent* so chapter 2's exercise ("add `DELETE`") has something to add.

**Why:** Brainstorm Q4 mapped chapter 2 to "Add `DELETE` + delete button." If the seed already has `DELETE`, there's no exercise. This trades one moment of "why doesn't this work?" for the chapter exercise to land cleanly.

**Alternatives rejected:**
- *Ship full CRUD at seed; pick a different chapter 2 exercise* — possible, but the brainstorm's chapter map specifically chose `DELETE` because it's the canonical first-real-change exercise. Changing it cascades into other chapter mappings. Rejected.

**Risk:** Some participants might be confused that the delete button doesn't exist. **Mitigation:** the chapter MDX explicitly frames "add a delete button" as the exercise. The CLAUDE.md notes the missing endpoint as a known starting state.

### D4: The boot animation is a deliberate exception to the "no animated backgrounds" rule — DECIDED

**Decision:** Add a "Cinematic moments" subsection to `docs/cc-lab-design-system.md` codifying the boot animation as a permitted exception under specific constraints: *one-shot per install, dismissible at any keypress, remembered persistently, narratively meaningful, reduced-motion respecting*.

**Why:** The brainstorm wants a theatrical CRT boot. The design system says "calm, deliberate, not demo-style flourishy. No animated backgrounds." These are in real tension. Resolution: the design system rule applies to the *steady-state UI*, which the post-boot calm view honors. A one-shot opening moment that the user can skip and that the app remembers is a different category — like the title sequence of a film, not the wallpaper. Codifying this in the design system doc makes the precedent explicit so future contributors don't ship a dancing background banking on this exception.

**Alternatives rejected:**
- *Drop the boot animation entirely* — kills the brainstorm's wow factor. Rejected.
- *Tone the animation down to a single fade* — under-delivers on the "wait, that's cool" target. Rejected.
- *Add the animation without updating the design system doc* — leaves the precedent ambiguous; opens the door to scope creep. Rejected.

### D5: localStorage on web side, file marker on .NET side — DECIDED

**Decision:** The web frontend uses `localStorage["cc-lab-guide:booted"]`. The .NET sample uses a `.guide-booted` file in the working directory (gitignored).

**Why:** Idiomatic for each medium. Both share the same conceptual pattern (a persistent marker that gates the boot), which is itself a teachable parallel — the brainstorm noted this as a teaching opportunity for future chapters.

**Alternatives rejected:**
- *Cookie on the web side* — needs a backend round-trip, more friction. Rejected.
- *appsettings.json on .NET side* — gets committed to git. Wrong. Rejected.

### D6: One-shot bilingual content (different EN/CS entries, not parallel translations) — INHERITED FROM BRAINSTORM Q8

**Decision:** Confirmed. Each locale has its own three seeded entries, locale-appropriate, not direct translations.

**Why:** The Guide speaks all tongues. A multilingual reference work has different content per edition. Mechanical translation feels tutorial-shaped.

## Constraints and Boundaries

**Architectural / structural:**
- Both samples must be runnable standalone — no shared dependencies on the cc-lab repo's `node_modules` or build pipeline.
- API shape must be identical across stacks (same JSON, same field names in camelCase, same error codes).
- No new top-level directories under `samples/`. The two existing sample directories (`samples/python-react/`, `samples/dotnet-core/`) get rebuilt in place.
- No introduction of a new bundler, framework, or major dependency in either sample beyond the explicit Spectre.Console addition on the .NET side.

**Voice / editorial:**
- All in-app copy follows `docs/cc-lab-design-system.md` voice rules (forbidden words list, no decorative emoji, one-line per surface).
- Entry titles can carry personality; UI chrome cannot.
- Both EN and CS sample CLAUDE.md / README.md files stay in sync structurally; locale is reflected in seeded content only.

**Visual:**
- Rosé Pine Dawn / Moon palette only. CSS variables exactly mirroring `app/globals.css`.
- Manrope (body), Space Grotesk (display), JetBrains Mono (code/terminal).
- No drop shadows beyond `--shadow-soft`. No gradient overlays. No animated backgrounds *except the one-shot boot*.

**Trust / privacy:**
- Zero API keys, zero telemetry, zero external service calls in the seed.
- Both samples must be safe to commit publicly (already are — staying that way).

**Operating:**
- All tasks must keep `pnpm lint && pnpm test && pnpm test:e2e && pnpm build` green at the cc-lab repo root.
- Capture pipeline (`freeze`, `vhs`, Playwright) is the only sanctioned way to produce visual artifacts in `public/`.

## Assumptions

| Assumption | Status | Evidence / How verified |
|---|---|---|
| Both samples can be rebuilt without affecting cc-lab site routing or build | Verified | Sample directories are isolated; no imports from `app/` or `lib/` |
| Rosé Pine CSS vars work in the sample's plain Vite/React stack | Verified | They're vanilla CSS custom properties — no framework dependency |
| Manrope, Space Grotesk, JetBrains Mono are available via fontsource | Unverified | Need to check fontsource catalog during Phase 1 — fallback: `<link>` tags to Google Fonts |
| Spectre.Console latest stable supports .NET 8 (the sample's target) | Unverified | Need to check during Phase 3 — Spectre.Console has a wide compat matrix; high confidence but verify |
| Playwright video recording can capture the boot animation cleanly | Unverified | Existing `scripts/capture/capture-web.ts` does screenshots, not video; may need to extend or use VHS for the boot capture instead |
| `prefers-reduced-motion` is reliably detectable in the sample's React env | Verified | Standard CSS media query; no React-specific concern |
| `chrome-devtools-mcp` can be used to fetch a Wikipedia page for future chapter exercise | Verified | The MCP can navigate and extract page content; suitable as fallback for the deferred chapter exercise |
| The 2026-04-24 lab improvements plan does not block this work | Verified | Research confirmed: no overlap with `samples/`. But chapter rewrites are banned by that plan, which is why chapter 4–9 expansion is deferred to a follow-up plan |
| The brainstormed entry copy can be written in both EN and CS by ondrej | Unverified | Phase 0 task captures the seeded-entries draft for review |
| The boot animation will not feel gimmicky after the design-system exception is added | Unverified — judgment call | Resolved at the Phase 2 visual review gate |
| `dotnet run` and `python *` allow-list additions don't conflict with deny rules | Verified | Current deny list has no overlap with these commands |
| Re-rendering all `.ansi` fixtures will not change unrelated screenshots | Verified | `generate-fixtures.py` deterministically renders only what's in its data structures; unrelated fixtures won't be touched |

**Unverified assumptions are addressed by:**
- Fontsource catalog check → Phase 1 task.
- Spectre.Console .NET 8 compat check → Phase 3 first task.
- Playwright video vs VHS for boot capture → Phase 2 task; fallback path documented.
- EN/CS entry copy draft → Phase 0 task with review gate.
- Boot animation gimmickiness → Phase 2 review gate.

## Risk Analysis

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| The CRT boot animation looks gimmicky in practice, not cinematic | Medium | High (kills the wow goal) | Phase 1 ships the calm view first as the proof slice. Phase 2's boot is gated on visual review. If gimmicky, revert to a tasteful fade-only version (Decision D4 has a fallback). |
| Spectre.Console has compatibility friction on Linux/macOS terminal emulators | Low | Medium | Test on macOS (native) and via the Linux Docker image used in CI. Spectre.Console is widely cross-platform. Fallback: hand-rolled ANSI for the worst case. |
| Participants on slow machines find `pnpm install` (frontend) + `pip install` (backend) frustrating | Medium | Medium | The README front-loads "two terminals, ~90 seconds first install." Existing samples already use this pattern. Not a regression. |
| The `localStorage["cc-lab-guide:booted"]` key persists across sample resets and confuses participants who want to re-experience the boot | Low | Low | Add a one-line note in CLAUDE.md and README: "Clear localStorage to replay the boot." Same on the .NET side: "Delete `.guide-booted` to replay." |
| The chapter 2 exercise (add `DELETE`) is too easy and undersells the new sample | Low | Low | The existing exercise (`GET /health`) is exactly this difficulty level. Trading equally. Future chapter-thread plan adds harder exercises. |
| Bilingual seeded entries lead to confusion when EN and CS users compare notes | Low | Low | The locale toggle filters cleanly, and the entry contributor / title makes the locale obvious. The "different content per locale" decision is itself a teaching moment for chapter `next-steps`. |
| Regenerating ANSI fixtures inadvertently changes other unrelated chapter screenshots | Low | High | Manual diff-review of all `public/visuals/` and `public/screenshots/` changes in the PR. CI screenshot regression test (if exists) catches drift. |
| The Phase 5 follow-up plan stub never gets picked up, leaving the brainstormed chapter thread unrealized | Medium | Medium | The stub is *required* by Phase 5. Future planning sessions can pick it up. The samples themselves have the surface area, so the deferred work is purely chapter MDX, not architecture. |
| Adding `python3 *` to the allow list weakens the security posture of the lab repo | Low | Low | The 2026-04-27 cc-lab-diagnose-followups plan explicitly tightened the allow list with intent to add specific commands as needed. This is one of those needs. Reviewed at Phase 0. |
| The boot animation triggers a Lighthouse performance regression | Low | Medium | CSS-only animation, no JS work, no large assets. Should not regress LCP. Verify with `pnpm test:e2e` if Lighthouse is wired into CI. |

## References

- **Brainstorm:** `docs/brainstorms/2026-04-27-power-up-the-samples-brainstorm.md` — full reframing, rejected alternatives, subjective contract origin.
- **Design system:** `docs/cc-lab-design-system.md` — palette, fonts, voice, visual constraints. Receives the "Cinematic moments" amendment in Phase 0.
- **Lab improvements plan:** `docs/plans/2026-04-24-lab-improvements-plan.md` — defines the YAGNI / no-chapter-rewrites discipline that scopes out the chapter thread expansion from this plan.
- **Diagnose followups plan:** `docs/plans/2026-04-27-cc-lab-diagnose-followups-plan.md` — defines the `.claude/settings.json` allow-list discipline this plan extends.
- **Existing samples:** `samples/python-react/`, `samples/dotnet-core/` — the rebuilds replace these in place.
- **Theme tokens:** `app/globals.css` (CSS vars), `scripts/visuals/vhs.theme.json` (canonical Rosé Pine ANSI mapping).
- **Capture pipeline:** `scripts/capture/capture-web.ts`, `scripts/capture/freeze.json`, `scripts/visuals/sample.tape`, `scripts/capture/generate-fixtures.py`.
- **Chapter references to update:** `content/{en,cs}/first-task.mdx` (lines 19, 76), `content/{en,cs}/teach-claude-your-project.mdx` (line 131).

## Open Questions Inherited from Brainstorm

These were flagged in the brainstorm; this section records how each is resolved (or deferred) by this plan.

1. **Wikipedia MCP availability** — RESOLVED by re-scoping the future chapter exercise (Decision D2). Sample plan does not depend on a web-fetch MCP.
2. **Spectre.Console vs alternatives for .NET ANSI** — RESOLVED in favor of Spectre.Console (Decision D1).
3. **Boot animation duration** — DEFERRED to Phase 2 visual review gate. Working target: 2.5s, but this is a judgment call best made against the rendered output.
4. **Markdown rendering on the React frontend** — RESOLVED in favor of a tiny custom renderer (~30 LOC, Phase 2 task). No new dependencies.
5. **CS seed entries — who writes them?** — RESOLVED: ondrej, in Phase 0, captured in `docs/plans/2026-04-27-guide-seed-entries-draft.md`.
6. **Repo location (`samples/` vs `cc-lab-samples`)** — RESOLVED: stays in `samples/`. Splitting deferred indefinitely.
7. **Existing chapter content updates — same slice or separate slice?** — RESOLVED: same slice (Phase 4 in this plan), to avoid leaving the lab in an inconsistent state where samples and chapters disagree.
8. **Migration of existing samples (delete vs keep alongside)** — RESOLVED: hard delete (in-place rewrite). Git history preserves the prior state for archaeology.

## Notes for `/work`

- Phase ordering is **strict**. Each phase has a hard visual review gate. Do not start Phase N+1 without Phase N's gate passing.
- Phase 0 is non-trivial: the design system amendment, allow-list update, and seeded-entries draft all need human review before code.
- Phase 1's proof slice intentionally omits the boot animation. This is a feature, not an oversight — the calm view must stand on its own first.
- If Phase 2's visual review fails (boot is gimmicky), the fallback is a single 0.5s fade with the typed "DON'T PANIC" still appearing. Do not re-attempt the full CRT effect more than twice.
- If Phase 3's `freeze` capture of the .NET boot doesn't render cleanly (Spectre.Console + freeze theme mismatch), fall back to capturing via VHS only and delete the `freeze` task from acceptance criteria.
- Do not regenerate `.ansi` fixtures until the .NET sample's runtime ANSI output is final. Otherwise you'll regenerate twice.
- The follow-up chapter-thread plan (Phase 5 stub) is a stub on purpose — fill it during a separate `/plan` session after the lab improvements plan unblocks chapter rewrites.

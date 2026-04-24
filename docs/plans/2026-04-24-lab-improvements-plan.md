# Claude Code Lab improvements plan

Date: 2026-04-24  
Repo: `claude-code-lab`  
Status: in progress — Phase 1 complete  
Scope: content, design/UX, architecture, repo health

## Goal

Turn `claude-code-lab` from a strong readable guide into a tighter, trustworthy, artifact-producing workshop lab.

The lab should feel like this:

> I arrived, I followed a path, I produced concrete artifacts, I learned what to do when Claude goes wrong, and I left with a repeatable practice.

## Non-goals

- Do not rewrite all chapter content in one pass.
- Do not introduce a backend or user accounts.
- Do not replace the current visual identity.
- Do not add heavy analytics or tracking.
- Do not change the core teaching arc: install → first task → context → iteration → ecosystem → compound → hardening → reference → behind the scenes.

## Guiding principles

1. **Trust before polish.** Fix broken tests, stale copy, and doc/code contradictions before adding features.
2. **Artifacts over reading.** Every chapter should make clear what the participant leaves with.
3. **Recovery is the lesson.** Teach rewind, narrowing, plan mode, and harnesses through failure drills, not only explanation.
4. **Static until proven otherwise.** This is mostly content. Prefer static rendering, simple generated data, and no runtime complexity unless needed.
5. **Workshop-native UX.** Copyable prompts, checkpoints, progress, and path selection matter more than decorative motion.
6. **Security posture should match the teaching.** Avoid casual loose permissions, stale password-gate claims, or unclear trust boundaries.

---

# Phase 0 — Baseline and branch hygiene

## Tasks

- Create a working branch, e.g. `improve/lab-workshop-readiness`.
- Record current state:
  - `git status --short`
  - `pnpm lint`
  - `pnpm test`
  - `pnpm build`
  - `pnpm test:e2e`
- Decide whether to remove untracked local Claude worktrees immediately or keep them until inspected.

## Known baseline issues

- `pnpm test` passes.
- `pnpm lint` fails:
  - unescaped apostrophe in `app/components/build-stats.tsx`
  - unused import in `app/components/diagram.tsx`
  - React hook lint errors in `app/components/search-command.tsx`
  - duplicated lint failures from untracked `samples/**/.claude/worktrees`
- `pnpm test:e2e` fails because the app now has 9 chapters but test expects 8.
- `pnpm build` succeeds but warns about missing `metadataBase`.
- `git status` shows untracked sample `.claude/` directories.

## Acceptance

- Baseline is captured in the work log or commit message.
- No functional changes yet.

---

# Phase 1 — Trust and repo health fixes

This is the first implementation slice. Do not start UX/content improvements until this phase is green.

## 1.1 Remove accidental Claude worktrees from samples

### Tasks

- Delete generated local worktrees:
  - `samples/dotnet-core/.claude/`
  - `samples/python-react/.claude/`
- Add ignore rules to prevent recurrence:

```gitignore
# Claude Code local worktrees / session artifacts
.claude/worktrees/
**/.claude/worktrees/
```

If the sample projects should never track `.claude` content, consider:

```gitignore
samples/**/.claude/
```

Prefer the narrower `worktrees` ignore unless we intentionally decide sample-local `.claude` files are out of scope forever.

### Acceptance

- `git status --short` no longer shows sample `.claude` worktrees.
- `pnpm lint` no longer scans generated worktree copies.

## 1.2 Fix lint errors in app code

### Tasks

- `app/components/build-stats.tsx`
  - Escape the unescaped apostrophe or rewrite the string.
- `app/components/diagram.tsx`
  - Remove unused `Children` import.
- `app/components/search-command.tsx`
  - Remove synchronous state updates inside effects.
  - Preferred approach:
    - reset `query` and `activeIndex` in the button/open handlers instead of an effect;
    - clamp active index during keyboard navigation or derive a safe active index for render;
    - keep the focus effect because it synchronizes with the DOM.

### Acceptance

- `pnpm lint` passes.

## 1.3 Fix chapter count drift

### Tasks

- Update e2e test name and assertion:
  - `all eight chapters` → `all chapters`
  - expected count should be `9` or derived from app-visible chapter metadata.
- Update stale copy:
  - `README.md`: eight → nine
  - `app/[locale]/lab/page.tsx`: `Eight chapters` / `Osm kapitol` → `Nine chapters` / `Devět kapitol`
  - `content/en/behind-the-scenes.mdx`: eight → nine where describing shipped content
  - `content/cs/behind-the-scenes.mdx`: osm → devět where describing shipped content
  - `skill/SKILL.md` and `skill/README.md`: references to chapters 5–7 should become 5–9 if they mean self-serve material.

### Acceptance

- `pnpm test:e2e` no longer fails on chapter count.
- No visible “eight chapters” copy remains unless intentionally historical.

## 1.4 Resolve password-gate contradiction

### Current contradiction

- README says the site is password-gated via `WORKSHOP_PASSWORD`.
- Skill says the web guide requires a password.
- Code currently does not implement an active password gate.

### Decision needed

Choose one:

#### Option A — Public lab, recommended

Remove password-gate claims from:

- `README.md`
- `skill/SKILL.md`
- `skill/README.md`
- screenshot docs if they imply unlock behavior

Keep `.env.example` only if some other env is needed; otherwise simplify it.

#### Option B — Private workshop lab

Implement a real gate in `proxy.ts` or app boundary and add tests.

### Recommendation

Use **Option A**. This lab is a public artifact and stronger when shared openly.

### Acceptance

- README accurately describes how to run the app.
- Skill does not promise a password if none exists.
- No code/docs mismatch remains.

## 1.5 Fix Open Graph metadata base

### Tasks

- Add `metadataBase` in `app/layout.tsx`.
- Prefer env-driven site URL:

```ts
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
```

- Use production Vercel URL as default only if we are comfortable hardcoding it.

### Acceptance

- `pnpm build` no longer warns about missing `metadataBase`.

## Phase 1 validation

Run:

```bash
pnpm lint
pnpm test
pnpm build
pnpm test:e2e
```

Expected: all pass.

Commit suggestion:

```text
chore: restore lab repo health
```

---

## Phase 1 completion log

Completed on branch `improve/lab-workshop-readiness`:

- Removed accidental sample `.claude` worktrees.
- Added `.gitignore` rules for Claude Code worktrees.
- Fixed lint errors in `BuildStats`, `Diagram`, and `SearchCommand`.
- Updated e2e chapter count from 8 to 9.
- Aligned visible copy from eight/osm to nine/devět chapters.
- Removed password-gate claims from README, skill docs, and capture docs/code.
- Added `metadataBase` via `NEXT_PUBLIC_SITE_URL` fallback.

Validation:

```bash
pnpm lint
pnpm test
pnpm build
pnpm test:e2e
```

All passed locally.

---

# Phase 2 — Workshop-native UX primitives

Add small reusable components before changing lots of content.

## 2.1 Add prompt copy component

### Why

Many chapter prompts are actions. Participants should be able to copy them directly.

### Component

Create an MDX component, e.g. `Prompt`:

```mdx
<Prompt>
Use the Explore agent to find where authentication is handled, then summarise.
</Prompt>
```

Render with:

- visually distinct prompt box;
- copy button;
- accessible label;
- optional caption or title later.

### Files likely touched

- `app/components/mdx-components.tsx`
- new `app/components/prompt.tsx` if client-side copy is needed

### Acceptance

- `Prompt` works in MDX.
- Copy button works in browser.
- Keyboard accessible.
- No hydration warnings.

## 2.2 Add semantic lab callouts

### Why

Current callouts are generic (`note`, `warn`, `tip`). A lab needs learning-state blocks.

### Add components

Either extend `Callout` variants or create wrappers:

- `TryThis`
- `Checkpoint`
- `FailureMode`
- `SafetyBoundary`
- `Output`

Example:

```mdx
<Checkpoint>
You are done when `curl localhost:8000/health` returns `{ "ok": true }`.
</Checkpoint>
```

### Acceptance

- Components are available in MDX.
- Visual distinction is clear but still Rosé Pine-native.
- Existing `Callout` uses remain compatible.

## 2.3 Add chapter artifact metadata

### Minimal approach

Extend `CHAPTERS` in `lib/chapters.ts`:

```ts
artifact: Record<Locale, string>;
track: Record<Locale, string>;
```

Example:

```ts
artifact: {
  en: "Installed Claude + privacy boundary",
  cs: "Nainstalovaný Claude + hranice pro data",
}
```

### Alternative

Move metadata into MDX frontmatter. Better long-term, but bigger. For this phase, prefer minimal extension unless doing the architecture phase now.

### Acceptance

- Lab index cards show artifact/output.
- Chapter header or intro shows what the participant leaves with.

## 2.4 Add progress/completion state

### Simple local-only implementation

- Add a “Mark chapter done” button on chapter pages.
- Store completed slugs in `localStorage`, per locale.
- Show progress in sidebar/index: `3 / 9 complete`.
- Add “Continue where you left off” on `/lab` if any progress exists.

### Files likely touched

- `app/components/chapter-sidebar.tsx`
- new client component for progress state
- `app/[locale]/lab/page.tsx`
- `app/[locale]/lab/[slug]/page.tsx`

### Acceptance

- No account/backend required.
- Works after reload.
- Does not break SSR.
- Accessible button labels.

## Phase 2 validation

Run:

```bash
pnpm lint
pnpm test
pnpm build
pnpm test:e2e
```

Add/update e2e smoke for:

- copy prompt button if stable enough;
- marking chapter complete if implemented.

Commit suggestion:

```text
feat(ux): add workshop progress and prompt primitives
```

---

# Phase 3 — Content upgrades

Use the new primitives to improve teaching without rewriting everything.

## 3.1 Add “what you leave with” to every chapter

Add near the top of each chapter:

```mdx
<Output>
By the end of this chapter you will have ...
</Output>
```

Suggested artifacts:

| Chapter | Artifact |
|---|---|
| 1 Before we start | Installed Claude, signed in, `.claudeignore` decision made |
| 2 Your first task | One working `/health` endpoint and one reviewed diff |
| 3 Teach Claude your project | A useful `CLAUDE.md` with project/conventions/don’t/commands |
| 4 Iteration and control | One rewind branch and one plan-mode run |
| 5 Ecosystem | One installed extension or one tiny generated skill |
| 6 Compound engineering | One plan file and one compound note |
| 7 Next steps | One selected harness upgrade for real work |
| 8 Reference | A bookmarked command/reference surface |
| 9 Behind the scenes | A prompt to render your own usage dashboard |

### Acceptance

- Each EN chapter has a clear output.
- Each CS chapter has equivalent, natural Czech copy.

## 3.2 Add failure drills

### Chapter 4 — Rewind drill

Add an exercise where the participant intentionally prompts badly, observes overreach, rewinds, and narrows.

Key lesson:

> Rewind is cheaper than explaining around a bad branch.

### Chapter 6 — Scope creep drill

Add a plan-review exercise:

- ask Claude for a plan;
- identify if it is too broad;
- constrain to a 30-minute slice;
- only then execute.

Key lesson:

> A plan is not good because it is detailed. It is good because it is bounded.

### Acceptance

- Failure drills are concrete and runnable.
- They do not require special tools beyond Claude Code and sample projects.

## 3.3 Add minimum harness checklist earlier

In Chapter 4, add a compact checklist:

```mdx
<SafetyBoundary title="Minimum harness before longer agent runs">
- test command
- lint/typecheck command
- clean git status
- no secrets in scope
- small commits
- plan before destructive changes
</SafetyBoundary>
```

### Acceptance

- Chapter 4 makes “harness” concrete before Chapter 7 deepens it.

## 3.4 Add “what not to automate yet”

In Chapter 7, add a section warning against autonomous runs for:

- production migrations;
- auth rewrites;
- payment logic;
- secret handling;
- legal/compliance text;
- customer data transformations;
- anything untestable.

### Acceptance

- The lab balances speed with judgment.
- Tone stays calm, not fear-based.

## 3.5 Add Czech glossary

Add to Czech reference chapter or as a callout:

- prompt — zadání pro Claude
- skill — znovupoužitelný pracovní postup
- plugin — balíček skillů/příkazů/hooků
- subagent — delegovaný agent s vlastním kontextem
- harness — sada kontrol, testů a pravidel kolem agenta
- MCP — propojení na externí nástroj/službu

### Acceptance

- Czech readers get term consistency without over-translating established tool names.

## 3.6 Add “current as of” notes

For chapters that mention volatile Claude Code UI/features, add:

```md
Current as of April 2026. Claude Code moves fast; if UI labels differ, trust the official docs linked here.
```

Likely chapters:

- Chapter 1
- Chapter 5
- Chapter 7
- Chapter 8

### Acceptance

- Time-sensitive claims are framed clearly.

## Phase 3 validation

Run:

```bash
pnpm lint
pnpm test
pnpm build
pnpm test:e2e
```

Also run the copy editor if available:

```bash
bun ../heart-of-gold-toolkit/plugins/marvin/skills/copy-editor/scripts/copy-audit.ts --config .copy-editor.yaml
```

Commit suggestion:

```text
feat(content): make chapters artifact-driven
```

---

# Phase 4 — Architectural cleanup

This phase can happen after UX/content, unless static rendering becomes urgent.

## 4.1 Decide static vs dynamic route strategy

### Current issue

`app/layout.tsx` reads request headers to set `<html lang>`:

```ts
const headerStore = await headers();
const headerLocale = headerStore.get("x-locale");
```

This likely makes otherwise static content dynamic.

### Options

#### Option A — Accept dynamic rendering

Pros:
- correct `html lang` from middleware header;
- minimal change.

Cons:
- content routes remain dynamic;
- less cacheable;
- surprising for a static MDX guide.

#### Option B — Static-first layout

Remove `headers()` from root layout. Use a simpler default `lang` or restructure layouts so locale-specific pages set language without dynamic headers.

Pros:
- static routes possible;
- better CDN behavior;
- simpler mental model.

Cons:
- may require Next 16-specific research;
- `html lang` correctness may need a different approach.

### Required research

Because project `AGENTS.md` warns this Next version has breaking changes, read relevant local Next docs before changing routing/layout APIs:

```text
node_modules/next/dist/docs/
```

### Acceptance

- Explicit decision recorded in an ADR or plan note.
- If changed, `pnpm build` route output improves or the tradeoff is documented.

## 4.2 Memoize or prebuild search index

### Current behavior

`LabLayout` calls:

```ts
const searchIndex = await buildSearchIndex(validLocale);
```

This reads MDX files and extracts sections.

### Minimal fix

Wrap in React cache:

```ts
import { cache } from "react";

export const buildSearchIndex = cache(async (locale: Locale) => { ... });
```

### Better fix

Generate static JSON search indexes at build time.

### Acceptance

- Search still works.
- No unnecessary repeated filesystem parsing per request if dynamic rendering remains.

## 4.3 Replace regex heading extraction with AST extraction

### Current behavior

`extractToc` and `extractSections` parse MDX by line regex.

### Improvement

Use unified/remark AST extraction for headings and section snippets.

### Acceptance

- Existing TOC/search tests still pass.
- Add tests for:
  - inline code in headings;
  - links in headings;
  - fenced code blocks;
  - duplicate headings.

## 4.4 Split `BuildStats`

### Current issue

`app/components/build-stats.tsx` mixes:

- localized copy;
- data;
- chart components;
- styles;
- methodology.

### Target structure

```text
app/components/build-stats/
  index.tsx
  data.ts
  copy.tsx
  palette.ts
  parts.tsx
```

or keep component path stable by re-exporting from `app/components/build-stats.tsx`.

### Acceptance

- No visual regression intended.
- Easier to update stats/copy separately.

## 4.5 Revisit Mermaid rendering/security

### Current behavior

`Diagram` uses:

```ts
securityLevel: "loose"
```

### Tasks

- Test whether stricter Mermaid security works for current diagrams.
- If loose is required, add a comment explaining that diagrams are trusted local MDX.
- Consider pre-rendered SVGs later to reduce client JS.

### Acceptance

- Diagram rendering still works.
- Security posture is intentional and documented.

## Phase 4 validation

Run full suite:

```bash
pnpm lint
pnpm test
pnpm build
pnpm test:e2e
```

Commit suggestion:

```text
refactor: simplify lab content architecture
```

---

# Phase 5 — CI and sample hardening

## 5.1 Add GitHub Actions CI

### Workflow

Add `.github/workflows/ci.yml`:

- install pnpm;
- install dependencies with lockfile;
- run:
  - `pnpm lint`
  - `pnpm test`
  - `pnpm build`
  - `pnpm test:e2e`

### Acceptance

- CI runs on PR and push to main.
- CI documents the same harness the lab teaches.

## 5.2 Add sample smoke checks

### Python/React sample

Add either:

- a simple backend smoke test; or
- documented command that CI can run if dependencies are installed.

Possible:

```bash
cd samples/python-react/backend
python -m pip install -r requirements.txt
python -m compileall .
```

If adding actual tests, keep them tiny.

### .NET sample

Possible:

```bash
cd samples/dotnet-core
dotnet build
```

If CI environment has dotnet available, include it; otherwise document local check only.

### Acceptance

- Sample projects do not silently rot.
- README sample instructions match tested commands.

## 5.3 Optional link check

Later, add a link checker for external docs. Because Claude Code docs move quickly, link rot is likely.

### Acceptance

- Link check is non-blocking at first, or scoped to internal links only.

## Phase 5 validation

- CI passes on pushed branch.

Commit suggestion:

```text
ci: add lab quality gates
```

---

# Phase 6 — Bigger product moves

Do these after the lab is healthy and workshop-native.

## 6.1 Participant lab report

Add a final artifact template:

```md
# Claude Code Lab Report

## My repo

## What Claude got right

## Where it failed

## My CLAUDE.md changes

## One workflow I will turn into a skill

## My safety boundary
```

Could live in:

- `docs/lab-report-template.md`
- `public/templates/lab-report.md`
- Chapter 9 exercise

## 6.2 Team adoption kit

Create:

```text
docs/team-adoption/
  30-minute-intro.md
  90-minute-workshop.md
  manager-brief.md
  security-faq.md
  rollout-checklist.md
```

Purpose: make the lab useful beyond individual self-study.

## 6.3 Danger lab sandbox

A deliberately safe failure playground:

- prompt injection in issue text;
- command that tries to read `.env`;
- over-broad refactor;
- missing test catches;
- MCP trust boundary example.

This would make Chapter 7 visceral.

## 6.4 Companion skill modes

Update the skill from “first four chapters only” to explicit modes:

- `starter` — chapters 1–4, 40 min
- `extension` — chapters 5–6, 45 min
- `hardening` — chapter 7, 30 min
- `reference` — chapter 8 lookup
- `retro` — chapter 9 usage dashboard

The skill should ask at activation:

> Do you want the 40-minute starter, the 90-minute workshop, or a specific chapter coach?

## 6.5 Public case study page

Promote Chapter 9 into a public-facing case study:

> We built this Claude Code lab with Claude Code. Here is the receipt.

Could be a separate route or a more prominent landing-page section.

---

# Suggested first work batch

If implementing now, do only this first:

1. Remove accidental `.claude/worktrees` from samples.
2. Add ignore rule.
3. Fix lint errors.
4. Fix e2e chapter count.
5. Update eight → nine copy.
6. Resolve password-gate claims as public lab.
7. Add `metadataBase`.
8. Run full validation.
9. Commit.

This creates a clean base for every later improvement.

## First batch commands

```bash
cd ../claude-code-lab
rm -rf samples/dotnet-core/.claude samples/python-react/.claude
pnpm lint
pnpm test
pnpm build
pnpm test:e2e
```

Remember: use non-interactive flags where relevant; `rm -rf` is intentional here.

---

# Risks

## Risk: turning the guide into a heavy app

Mitigation: keep progress localStorage-only, no backend.

## Risk: content churn in two languages

Mitigation: edit EN first, then CS in small batches. Run copy editor after each batch.

## Risk: Next 16 API assumptions

Mitigation: read local Next docs before routing/layout changes.

## Risk: over-polishing away Ondrej voice

Mitigation: keep copy direct, human, practical. Avoid corporate courseware language.

## Risk: feature drift from Claude Code docs

Mitigation: add “current as of” notes and link official docs.

---

# Definition of done for full improvement program

- Full quality suite passes locally and in CI.
- README matches actual app behavior.
- No stale “eight chapters” copy remains.
- Lab index communicates chapter outputs/artifacts.
- Participants can copy prompts directly.
- Chapters include checkpoints and failure drills.
- Progress is visible without requiring an account.
- Architecture decisions are documented where tradeoffs exist.
- Sample projects have at least smoke-level validation.
- Companion skill accurately reflects the current 9-chapter lab.

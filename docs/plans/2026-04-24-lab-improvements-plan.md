# Claude Code Lab — lean improvement plan

Date: 2026-04-24  
Repo: `claude-code-lab`  
Status: lean review complete — ready for proof-slice image work  
Principle: **YAGNI — keep the lab minimal, polished, and close to what already works.**

## TL;DR

We already did the important trust reset:

- repo is clean enough to build on;
- lint/test/build/e2e pass;
- stale “eight chapters” copy is fixed;
- password-gate docs mismatch is removed;
- accidental Claude worktrees are gone;
- improvement branch is reset to that clean baseline.

The original plan was too ambitious. We are **not** going to turn the site into a course platform.

Drop:

- progress tracking / “chapter completed” state;
- big checkpoint system;
- many new MDX primitives;
- lab-report templates;
- team adoption kit;
- danger lab;
- major architecture refactors;
- CI/sample hardening unless needed later;
- broad content rewrites.

Keep:

- small design/content polish where it clearly improves understanding;
- a few supportive images/diagrams where concepts are hard to grasp from text alone;
- maybe one lightweight copyable prompt component **only if** it feels obviously useful after reviewing the chapters;
- no backend, no tracking, no big UX system.

## Goal

Make an already good lab a little clearer, calmer, and more memorable — without changing its character.

The target is not:

> “A full interactive learning platform.”

The target is:

> “A polished guide with a few visual anchors that help the concepts land.”

## Non-goals

- No progression tracking.
- No account/backend/localStorage completion model.
- No big component system for exercises/checkpoints/outputs.
- No full content rewrite.
- No major routing/static rendering refactor.
- No workshop management tooling.
- No team-adoption package in this pass.
- No danger lab in this pass.
- No CI expansion unless we separately decide it is worth it.

---

# Phase 1 — Done: trust baseline

Completed on branch `improve/lab-workshop-readiness` in commit `0b5d331`.

## What changed

- Removed accidental sample `.claude` worktrees.
- Added `.gitignore` rules for Claude Code worktrees.
- Fixed lint errors in `BuildStats`, `Diagram`, and `SearchCommand`.
- Updated e2e chapter count from 8 to 9.
- Aligned visible copy from eight/osm to nine/devět chapters.
- Removed password-gate claims from README, skill docs, and capture docs/code.
- Added `metadataBase` via `NEXT_PUBLIC_SITE_URL` fallback.

## Validation

```bash
pnpm lint
pnpm test
pnpm build
pnpm test:e2e
```

All passed locally.

---

# Phase 2 — Lean review pass

Before making more changes, do one careful review of the current lab and mark only the places where a small intervention would help.

## Review questions

For each chapter, ask:

1. Is there a concept that is still too abstract?
2. Is there a section where the eye gets tired?
3. Is there an existing screenshot/diagram that feels basic or unnecessary?
4. Would one supportive image make the idea clearer?
5. Is any copy stale, too wordy, or not quite Ondrej/peer voice?

## Output

Create a short punch list, not a new giant plan:

```md
## Keep as-is
- ...

## Small copy polish
- Chapter X: ...

## Candidate supportive imagery
- Chapter X: concept, why it helps, image idea

## Do not touch
- ...
```

## Lean review result

### Existing visual DNA

The current visual system is already coherent:

- dark Rosé Pine Moon base, muted lavender outlines, peach/rose/teal accents;
- mostly flat technical line-art with soft glow, not glossy 3D;
- terminal/window cards, file cards, arrows, circles, and simple diagrams;
- lots of negative space;
- monospaced labels only where they clarify;
- landing hero is the outlier in format, but still shares the same palette, line weight, and calm space-tech feel.

The generated concept images that currently fit best:

- `public/hero.png` — spacious Heart-of-Gold/terminal spaceship;
- `public/screenshots/ch6-compound-loop.png` — strongest current conceptual diagram;
- `public/screenshots/ch7-lethal-trifecta.png` — simple, clear, memorable;
- `public/screenshots/ch3-claude-md-precedence.png` and `ch4-permission-modes.png` — useful diagrammatic UI abstractions.

### Keep as-is

- Chapter 1 install/auth screenshots.
- Chapter 2 sample-task screenshots.
- Chapter 3 `CLAUDE.md` precedence diagram.
- Chapter 6 compound loop diagram.
- Chapter 7 lethal-trifecta diagram and routines screenshot.
- Chapter 9 dashboard.

### Small copy/design polish candidates

Keep these surgical:

- Review captions around concept images. A few can work harder by saying *why the image matters*, not only what it shows.
- Check Chapter 4’s “control → harness” section. It is strong but abstract; one image or one short bridge sentence may help.
- Check Chapter 5’s ecosystem chapter. It has many concepts; one map may reduce cognitive load more than more prose.

### Candidate supportive imagery

Only two candidates survive the YAGNI filter:

1. **Chapter 4 — Control → harness**
   - Reason: this is one of the lab’s most important mental-model shifts.
   - Current state: text is good, but abstract.
   - Proposed image: a calm developer cockpit / engineering harness around an agentic work loop — tests, diffs, permissions, review, and alarms as abstract cards.
   - Decision: **best first proof slice.**

2. **Chapter 5 — Ecosystem map**
   - Reason: chapter introduces many extension concepts at once.
   - Current state: screenshots are useful but do not show the whole ecosystem shape.
   - Proposed image: Claude Code as the center with skills, plugins, MCPs, subagents, remote/web/mobile as surrounding modules.
   - Decision: **only do after Chapter 4 image works.**

### Do not touch for now

- No progression tracking.
- No checkpoint/output/failure component system.
- No new lab-report/team-kit/danger-lab work.
- No architecture refactor.
- No broad chapter rewrites.
- No more than 1–2 new images unless the first proof slice clearly improves the lab.

---

# Phase 3 — Supportive imagery, only where it earns its place

This is the main useful remaining improvement.

Use GPT Image 2 for a few visual anchors that clarify the mental models. Do not add decorative art just because we can.

## Cohesion rule

Before generating any new image, inspect the existing visual family and keep new work inside that design language.

Reference visuals:

- landing hero: `public/hero.png`
- existing generated diagrams/screenshots in `public/screenshots/`
- especially the current compound engineering visual and any Chapter 4/6/7 concept images

The goal is not “make a cool image.” The goal is:

> This looks like it was always part of Claude Code Lab.

If a generated image does not match the existing visual DNA, do not use it.

## Candidate image slots

These are candidates, not commitments.

### 1. Chapter 3 — Context as onboarding

Concept: `CLAUDE.md` is not config trivia. It is onboarding for a new collaborator.

Possible image:

- a developer desk / project map / onboarding dossier;
- Claude as a new teammate receiving project context;
- visual metaphor of “project memory” flowing into useful work.

Why it may help:

- Chapter 3 is conceptual;
- readers often underestimate context;
- an image could make “teach Claude your project” feel concrete.

### 2. Chapter 4 — Control → harness

Concept: the human shifts from watching every diff to designing a verification harness.

Possible image:

- a developer cockpit with tests, diffs, permissions, and alarms around an agent;
- not “robot coding,” more “instrumented engineering loop.”

Why it may help:

- This is one of the strongest ideas in the lab;
- it deserves a memorable visual anchor;
- current text is good, but the posture shift is abstract.

### 3. Chapter 5 — Ecosystem map

Concept: Claude Code extends through skills, plugins, MCPs, subagents, remote/web/mobile.

Possible image:

- clean constellation / toolbox map;
- Claude Code in the center with extension layers around it;
- restrained technical illustration, not hype.

Why it may help:

- Chapter 5 has many concepts;
- a single map could reduce cognitive load.

### 4. Chapter 6 — Compound loop

There is already a diagram/image. Review whether it is good enough.

Only regenerate if the current one does not clearly communicate:

- brainstorm → plan → work → review → compound;
- knowledge accumulating over time;
- reusable practice, not one-off prompting.

### 5. Chapter 7 — Harness / security posture

There is already a lethal-trifecta image. Review whether an additional image is needed. Probably not.

If anything, prefer small copy polish over more art.

## Image style constraints

New images must match the existing lab image DNA:

- calm Rosé Pine-inspired palette;
- muted lavender, peach, rose, teal, and warm dark surfaces;
- soft technical illustration style;
- slightly cinematic but restrained lighting;
- rounded panels, terminal surfaces, diagrams, cards, project artifacts;
- practical software-engineering feeling, not generic AI futurism;
- cohesive with the Heart-of-Gold landing hero and current compound-engineering image;
- low visual noise and generous negative space;
- no glossy SaaS stock illustration style;
- no generic robot/humanoid AI cliché;
- no “robot hands typing code” cliché;
- no fake product UI likely to become inaccurate;
- no text-heavy image unless text is intentionally minimal and legible.

Preferred visual ingredients:

- terminal windows;
- plan documents;
- diffs and tests as abstract cards;
- small project maps;
- soft glowing connection lines;
- developer workbench / cockpit metaphors;
- reusable artifacts accumulating over time.

## Process

### 0. Extract a mini style guide first

Before the first generation, review the existing images and write a short reusable prompt prefix.

Reusable prompt prefix:

```text
Match the existing Claude Code Lab visual family: dark Rosé Pine Moon background, muted lavender line art, peach/rose/teal accents, warm dark terminal surfaces, rounded window cards, thin technical outlines, soft subtle glow, generous negative space, calm software-engineering diagram aesthetic, cohesive with the Heart-of-Gold spaceship hero and compound engineering loop illustration. Flat/semi-flat technical illustration, not glossy 3D. Use practical developer artifacts: terminal windows, diffs, test cards, plan documents, file cards, soft connection lines. No generic AI robots, no humanoid robot, no glossy SaaS stock illustration, no busy fake product UI, no robot hands typing code, no dense text.
```

Use this exact family unless a proof slice shows it needs small tuning.

### Per image

1. Start with the shared style prefix.
2. Add one concept-specific prompt.
3. Generate one proof slice.
4. Review in the chapter context, not in isolation.
5. Keep it only if it clearly improves understanding **and** matches the existing visual family.
6. If style drifts, tune the prompt once or drop the image.
7. Do not batch-generate many variants unless the proof slice works.

## First proof-slice prompt — Chapter 4

Use GPT Image 2 with the reusable prefix plus:

```text
Concept: the shift from direct control to a trusted engineering harness. Show a developer workbench/cockpit made of abstract terminal cards around a central agentic coding loop. Cards represent: plan mode, diff review, tests passing, permissions, security review, and automation hooks. The human is not micromanaging every line; they are designing the verification harness. Keep it calm, minimal, and readable as a concept image. No literal robot. No real product UI. Minimal or no text; if text appears, keep it abstract and legible.
```

Target file if accepted:

- `public/screenshots/ch4-control-to-harness.png`

Placement if accepted:

- Chapter 4, near “The shift: from control to a harness you trust”.

Caption direction:

> The shift is not blind trust. It is replacing constant diff-watching with tests, permissions, reviews, and automation that catch mistakes for you.

## Optional second proof-slice prompt — Chapter 5

Only do this if Chapter 4 image lands well.

```text
Concept: Claude Code as an extensible platform. Show a central terminal/workbench labeled only abstractly, surrounded by six connected modules: skills, plugins, MCPs, subagents, remote control, and web/mobile sessions. Make it feel like a calm ecosystem map, not a network diagram. Same visual family as the compound loop: rounded terminal cards, file cards, soft connection lines, muted Rosé Pine colors, lots of negative space. No robots, no glossy SaaS icons, no dense text.
```

Target file if accepted:

- `public/screenshots/ch5-ecosystem-map.png`

Placement if accepted:

- Chapter 5, near the opening after the multi-session screenshot or as a replacement if it makes the screenshot redundant.

## Acceptance

- Prefer one accepted image, two maximum.
- Every added image has a clear teaching purpose.
- No chapter feels visually bloated.
- If generated style drifts from the existing family, drop the image instead of forcing it in.

---

# Phase 4 — Small content polish

Make surgical edits only.

## Good candidates

- Remove stale wording.
- Tighten overlong paragraphs.
- Make Czech visible copy more natural where it currently feels translated.
- Add a one-sentence bridge before a hard concept.
- Add a short “why this matters” line where a section jumps too fast.

## Avoid

- Rewriting whole chapters.
- Adding many new callouts.
- Adding new formal exercise structure.
- Turning the voice into courseware.
- Adding generic motivational copy.

## Acceptance

- Content still feels like the current lab.
- Changes are small enough to review comfortably.
- Czech remains peer-like and not over-polished.

---

# Phase 5 — Small design polish

Only adjust the existing design system where there is obvious friction.

## Possible small wins

- Improve lab index card hierarchy if it feels too flat.
- Slightly improve spacing around screenshots/diagrams.
- Add subtle “concept image” treatment if new images need consistent framing.
- Improve captions where images need more context.
- Check mobile rendering after image additions.

## Avoid

- New navigation model.
- Completion/progress UI.
- Big landing page redesign.
- Motion-heavy interactions.
- Dashboard-like complexity.

## Acceptance

- Design remains minimal and calm.
- New images feel native to the page.
- No component sprawl.

---

# Optional later — only if pain appears

These are intentionally deferred.

## Copyable prompt component

Maybe useful, but only add if chapter review shows prompt copying is a real friction point.

If added, keep it as one simple component. No broader exercise system.

## CI

Useful eventually, but not necessary for the current polish pass.

## Architecture cleanup

Only revisit if there is an actual performance/build problem. Do not refactor for theoretical neatness.

---

# Recommended next step

Do the lean review pass.

Produce a short list like:

```md
## Proposed minimal changes

1. Add/replace image in Chapter 4 — control → harness.
2. Add ecosystem map in Chapter 5.
3. Tighten two paragraphs in Chapter 6.
4. Update captions for existing diagrams.
5. Stop there.
```

Then implement only that list.

## Current bias

If unsure, **do nothing**.

This lab is already good. The remaining work should make it clearer, not bigger.

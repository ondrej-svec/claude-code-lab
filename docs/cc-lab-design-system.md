# cc-lab design system

The lens. This document encodes what "lab-shaped" means precisely
enough to be input for an AI curator skill (the freshness skill from
Phase 4) and onboarding doc for any new contributor or future Claude
session.

If you're writing for cc-lab — chapter, library entry, sample, copy on
any surface — read this first. If output ever drifts from these rules
without explicit reason, that's the bug.

This doc consolidates conventions that previously lived across:
`docs/visuals.md` (visual production), `skills/cc-lab-screenshot/conventions.md`
(screenshot rules), `feedback_czech_peer_voice.md` (Czech register), and
the cc-lab mastery evolution plan's Subjective Contract section.

---

## Audience

**Primary: builders.** Engineers serious about mastering Claude Code
on real codebases. Self-evaluating, opinionated, busy. They will skim
first and read carefully if the first paragraph earns it. They cite
what they like.

**Secondary: tech leads.** Self-select from builder-quality content.
They have wallets (workshops serve them) but the lab does not chase
them with leadership framing.

**Not the audience:**
- Newcomers looking for "ship a SaaS in 4 hours" energy
- Mid-career generalists hunting for cohort-style courses
- Enterprise marketing audiences who need consensus copy
- Anyone reading to feel motivated rather than to do

If you find yourself adding language to "broaden appeal," stop. The
lab wins by being canon for the right 50 readers, not by being legible
to 5,000 wrong ones.

---

## Voice and register

**Tone in one line:** quietly confident, peer-to-peer, no bullshit.
Cuts through. Pragmatic. Honest about what doesn't work. Concrete
beats abstract. Show before tell.

### Sentence shape

- Short declarative sentences. "The first prompt is never the last
  prompt." not "It's worth bearing in mind that one's initial prompt
  rarely turns out to be one's final prompt."
- Active voice. "Claude listens differently on each surface." not
  "Each surface listens differently to Claude."
- Imperatives are fine in instructions. "Click it, speak, click
  again." reads natural; "You should click it, then speak, then click
  again." doesn't.
- One idea per sentence. If a sentence has two ideas, split it.
- Rhetorical questions are rare and earn their keep. Default: state.

### What to never write

| Forbidden | Replace with |
|---|---|
| "delve into," "dive deep" | concrete verb — "read," "watch," "test" |
| "leverage" | "use" |
| "in order to" | "to" |
| "utilize" | "use" |
| "best-in-class," "world-class" | (delete the sentence) |
| "exciting," "amazing" | (delete the adjective) |
| "let's" anything | imperative — "Do X." |
| "It's important to note that..." | (delete the throat-clearing) |
| Marketing bullets that all start with the same gerund | rewrite as varied prose |
| "Boost your productivity" | concrete claim with a number or example |
| Hashtags | (no hashtags ever, anywhere) |
| Emoji as decoration | only meaningful emoji, used sparingly (the spaceship and gargle blaster are fine; party-popper is not) |

### Concrete > abstract

Every section has a concrete teaching point: a key combo, a command,
a screenshot, a prompt, a piece of code, a number. If a section is
all framing, it's not a section yet — work in something testable.

> Bad: "Voice can be a powerful way to interact with AI assistants."
>
> Good: "Hold `Space`, say 'refactor this auth middleware,' release.
> Edit the transcript before sending."

### Show before tell

The structural shape the lab uses repeatedly:

1. One-line claim or framing
2. Concrete example (Prompt block, Screenshot, code, terminal output)
3. Short paragraph explaining what just happened or why it matters
4. (Optional) When-not-to-use or anti-pattern callout

Avoid the inverse — three paragraphs of theory followed by an example
the reader has stopped caring about.

### Length discipline

- Chapters: aim 800–1500 EN words. Anything longer should split into
  spine + library entry.
- Sentences: most under 25 words. If a sentence runs over 30 words,
  rewrite.
- Paragraphs: 1–4 sentences. Walls of text break the rhythm.

---

## Czech parity (non-negotiable)

Every spine chapter and library entry ships EN canonical → CS
reviewed. CS must read as **peer voice**, not translated-from-English.

The full ruleset lives in
`feedback_czech_peer_voice.md` (in Ondrej's auto-memory). Highlights
that the freshness skill should encode:

- **Reflexive passive over compound passive.** "se řeší autentizace"
  beats "je řešená autentizace."
- **Informal prepositions in peer contexts.** "jestli" not "pokud,"
  "podle API sazeb" not "v API sazbě."
- **No literal idiom translations.** "ať víš tvar" is czenglish; use
  "ať víš, jak je to postavené."
- **Czech NBSP typography.** Single-character prepositions (`v`, `k`,
  `s`, `z`, `o`, `a`, `i`, `u`) bind to the next word with a
  non-breaking space. The copy-editor skill catches this; verify
  before merge.
- **Don't drop temporal/spatial anchors.** "this session," "here" must
  carry over with equivalent specificity.
- **Pick one register and hold it.** Don't mix "Spusť" and "Pusť" in
  parallel sentences.

The CS version is not a translation of EN — it's the same idea,
written natively in Czech for Czech peers. If the EN is too clever to
translate naturally, the EN is too clever.

---

## Anti-goals — what the lab is *not*

- Reference dump masquerading as a guide
- Maturity-model gamification or consulting hierarchy (no L1–L4 scoring)
- Marketing-speak — "ship a SaaS in 4 hours" energy, certifications, badges
- Anthropic-changelog wrapper that lags every release by 6 weeks
- Course-platform expansion (no quizzes, lessons, modules, units)
- Lab-as-mirror as public copy (writer-facing internal frame only)
- Multi-tool coverage (Codex / Cursor / Cline) — Claude Code is the spine
- Sales pages, landing-page funnels, lead capture forms

---

## References (read these to internalize the voice)

- The existing 10 chapters of cc-lab itself. The voice is already
  here; new content matches.
- Boris Cherny — `howborisusesclaudecode.com` (peer-builder voice,
  setup transparency)
- Armin Ronacher — "Agentic Coding Recommendations" (pragmatic, opinionated)
- HumanLayer — "Skill Issue: Harness Engineering for Coding Agents"
  (technical depth + restraint)
- Anthropic — "Effective harnesses for long-running agents" (engineering blog tone)

## Anti-references

- Maven cohort marketing pages
- "Ship a SaaS in 4 hours" framings
- Maturity-ladder consulting decks
- Generic awesome-list dumps
- Vendor-flavored docs that read like product brochures
- shareAI-lab/learn-claude-code's manifesto tone

---

## Visual identity

### Palette

Rose Pine. Dark mode is default (Moon variant), light mode honors the
Dawn variant. Both are configured in `app/components/diagram.tsx` and
`scripts/visuals/freeze.config.json`.

| Surface | Theme |
|---|---|
| Chapter pages, dark mode | Rose Pine Moon (`#232136` bg, `#e0def4` fg) |
| Chapter pages, light mode | Rose Pine Dawn (`#fffaf3` bg, `#575279` fg) |
| Mermaid diagrams | Rose Pine Moon/Dawn via theme variables |
| `freeze` static terminals | `rose-pine-moon` theme, `JetBrains Mono` |
| `vhs` animated terminals | `rose-pine-moon` theme, `JetBrains Mono` |
| Codex GPT Image 2 diagrams | Neutral palette; theme switching at render time |

### Typography

- Headings + body: Manrope, Inter, system-ui (the Diagram component's
  font stack)
- Code, terminal output, prompts: JetBrains Mono
- Never: comic-sans-flavored fonts, decorative display faces, more
  than two font families on a page

### Aesthetic posture

Calm, deliberate, not demo-style flourishy. No excessive drop shadows
beyond the components' built-in `--shadow-soft`. No gradient
overlays. No animated backgrounds. Spaceship illustrations and the
chapter heroes are the only "personality" elements; they earn it.

### Cinematic moments (deliberate exception)

The "no animated backgrounds" rule applies to the *steady-state* UI.
A one-shot opening moment — like a film's title sequence — is a
different category and is permitted under all of these constraints:

- **One-shot per install.** Plays once, then a persistent marker
  (localStorage on web, a gitignored file on disk for CLI) suppresses
  it on every subsequent run. Clearing the marker re-enables it.
- **Dismissible at any time.** Any keypress (web) or `Ctrl-C` (CLI)
  exits to the steady-state UI immediately.
- **`prefers-reduced-motion` respecting.** Drops to a sub-500ms fade
  with no scan-line, no typewriter, no other motion.
- **Narratively meaningful.** Communicates something specific about
  the artifact — its identity, its lineage, its tone — not decoration
  for decoration's sake.
- **Short.** Under three seconds at the default rate. Anything longer
  becomes annoying by run two.

The current canonical use is the Guide sample's first-run boot
(`samples/python-react/`, `samples/dotnet-core/`). New cinematic
moments need an explicit reference here before they ship.

---

## Chapter hero illustrations

Each of the ten spine chapters has a 2:1 aspect-ratio hero image
rendered at the top of its card on `/[locale]/lab`. Read in
sequence, the ten images form one continuous illustrated journey —
they replaced the older single 6-panel journey-comic.

Generated via Codex GPT Image 2 through the `babel-fish:image`
skill. The codex path does not accept reference images, so
consistency is enforced by a locked prompt boilerplate that
describes the canonical ship in full detail. Every chapter generation
pastes the same boilerplate prefix; only the per-chapter scene
differs.

### Reference

`public/hero.png` is the canonical ship — the long sleek angular
cruiser shown on the landing page. Every chapter hero must render
the same ship, recognizable as that one. If a generation produces
a stubby, face-like, or "personable" silhouette, it is wrong and
gets re-rolled.

### Aesthetic posture (heroes)

**Hi-tech sci-fi blueprint.** Hitchhiker's-Guide / Heart-of-Gold
cruiser energy. Engineered, technical, calm. The ship is a vessel,
not a personality.

| Always | Never |
|---|---|
| Long, narrow, engineered silhouettes | Stubby, rounded, face-like proportions |
| Hi-tech sci-fi context (docking rings, satellites, instrument arrays, sensor pods, beacons, thin antenna spires) | Domestic / cottage props (coffee mugs, kitchenware, plants, toys, plates) |
| Thin clean linework, multiple structural panel lines | Smooth jelly-bean shapes with no detail |
| The terminal as an *inset* panel set into the hull | The terminal as the body's overall shape |
| Scattered pinprick stars | Connected-dot constellations |
| At most one delicate hairline curve to suggest a path | Heavy dotted trajectory lines, dashed "highway" tracks |
| Color reserved for the terminal, engine glow, and small chapter-specific accents | Color elsewhere on the hull, antenna, props, or background |
| Calm, deliberate, blueprint mood | Cute, childish, anthropomorphic, demo-flourishy |

### Canonical ship spec (locked)

In horizontal profile, facing right. **Long and narrow** — total
width roughly 4–5× the height. Four distinct hull sections, left
to right:

1. **Rear (~15%)** — small angular thruster cluster of three small
   nozzles; vertical hull panel with three short horizontal vent
   lines
2. **Mid-left (~15%)** — hexagonal hatch/porthole; small circular
   sensor or radar-dish detail; hull lines continue past these to
   the next section
3. **Central terminal section (~40%)** — an INSET rectangular panel
   set INTO the side of the hull (the hull outline continues above
   and below it). Inside the panel: three small mac-style dots in
   red `#eb6f92`, yellow `#f6c177`, blue-teal `#9ccfd8` at the
   upper-left; one short line of monospace text (chapter-specific);
   two thin horizontal progress bars (upper rose `#eb6f92`, lower
   teal `#9ccfd8`)
4. **Nose (~25–30%)** — hull narrows and extends as a long sharp
   triangular wedge; small circular sensor port near the very tip;
   thin antenna line along the wedge

Above the central section: a slim vertical antenna pole with a tiny
ball at its tip. Clean — **no cloth, no flag, no banner, no towel.**

Multiple thin parallel structural lines divide the four sections;
small panel-line detail strokes throughout. The hull is engineered,
not smooth.

### Color rules

- Background: deep navy `#232136`
- Linework: thin off-white lavender `#e0def4` — confident, no wobble,
  no fills, no shading, no chrome
- **Color reserved** for: terminal screen elements (three dots, two
  progress bars, terminal text), engine glow when present, and
  small chapter-specific accent points (a checkmark, a beam, a
  status light)
- Hull, antenna, scene props, gantry, satellites, rings: pure
  off-white-lavender. No color elsewhere.

### Star field & paths

- Scattered tiny pinprick stars only — **no constellation lines, no
  connected dots, no joined-up patterns**
- A faint distant planet curve along the bottom edge is acceptable
  (single thin hairline; no surface detail)
- Where a path is needed, **at most one delicate hairline curve** —
  not a heavy dotted line, not a dashed track

### Composition drift

| Chapters | Ship position | Read as |
|---|---|---|
| 01–05 | Left third of the frame | Outbound — leaving the dock, building the harness |
| 06 | Centered | The pivot — ecosystem fills around it |
| 07–10 | Center-right of the frame | Expansion — compounding, looking outward, looking inward |

Subtle, not dogmatic. The set should pull left-to-right when read
as a sequence.

### Per-chapter storyboard (locked)

| # | Slug | Concept | Sci-fi scene | Terminal text |
|---|---|---|---|---|
| 01 | `before-we-start` | Pre-launch | Ship docked at a thin angular hi-tech docking ring; cold thrusters; small standby indicator; faint distant planet curve | `> claude` (cursor) |
| 02 | `first-task` | First flight | Ship departing the ring; soft engine glow + short tapered exhaust; small distant waypoint marker — a thin ring with a pale-teal ✓ inside | `> /first-task ✓` |
| 03 | `teach-claude-your-project` | Context absorption | Ship near a thin angular satellite labeled `CLAUDE.md`; thin beam of data flowing satellite → ship | `+ context loaded` |
| 04 | `iteration-and-control` | Calibration | Ship inside a thin instrument ring of small sci-fi modules (shield, lock, lightning, check); a thin arrow loops the ring | `> verify ✓✓✓` |
| 05 | `voice-and-interaction` | Senses expand | Ship surrounded by three thin dish/antenna arrays receiving different signal types (sound waves, optical pulse, comms) | `> /voice` |
| 06 | `ecosystem` | Network | Ship at the center of a node-graph of four small angular modules connected by thin lines (plugins · mcp · subagents · web) | `+ plugin loaded` |
| 07 | `compound-engineering` | Compounding | Ship trailing a clean spiral path; small data-marker artifacts (a thin doc, a check, a small star) along the spiral | `✓ compounding` |
| 08 | `next-steps` | Onward | Ship at a quiet junction; two or three thin paths leading to distant horizons / star clusters | `> next` |
| 09 | `reference` | Library | Ship docked beside a modular bookmark / data-core array — a stack of thin labeled tabs / cores | `> ref` |
| 10 | `behind-the-scenes` | Meta | Ship rendered as a CUTAWAY / X-RAY view: internal compartments visible, a tiny figure at a console inside | `> meta` |

### Locked prompt boilerplate

Every chapter generation uses this exact prefix. Only the
"CHAPTER N SCENE" block at the bottom changes per chapter.

```
Wide horizontal illustration, aspect 2:1, hand-drawn thin clean
line-art on a dark navy field. Background: deep navy (#232136) with
scattered tiny pinprick stars only. Linework: thin off-white lavender
(#e0def4). Aesthetic reference: Hitchhiker-Guide-to-the-Galaxy /
Heart-of-Gold sci-fi cruiser blueprint. Engineered, technical,
hi-tech, NEVER cute, NEVER anthropomorphic, NEVER face-like.

THE SHIP — drawn as a TECHNICAL BLUEPRINT, not a personality.
Critical proportions: VERY LONG AND NARROW, total width roughly 4 to
5 times the height. Horizontal profile, facing RIGHT.

Four distinct hull sections, left to right:
1. REAR (~15%): small angular thruster cluster of three nozzles,
   plus a vertical hull panel with three short horizontal vent lines.
2. MID-LEFT (~15%): hexagonal hatch/porthole and a small circular
   sensor or radar dish detail; hull lines continue past these.
3. CENTRAL TERMINAL SECTION (~40%): an INSET RECTANGULAR PANEL set
   INTO the side of the hull (with the hull outline continuing above
   and below it). INSIDE: three small mac-style dots in red (#eb6f92),
   yellow (#f6c177), and blue-teal (#9ccfd8) at the upper-left, one
   short line of monospace text [CHAPTER-SPECIFIC], two thin horizontal
   progress bars (upper rose pink #eb6f92, lower pale teal #9ccfd8).
   The terminal is a panel ON the hull, not the entire hull.
4. NOSE (~25-30%): hull narrows and extends as a LONG SHARP
   TRIANGULAR WEDGE pointing right, small circular sensor port near
   the very tip, thin antenna line along the wedge.

Above the central terminal section: a SLIM VERTICAL ANTENNA POLE
with a tiny ball at its tip. Clean — NO cloth, NO flag, NO towel,
NO banner.

Multiple thin parallel structural lines divide the four sections;
small panel-line detail strokes. Engineered cruiser, not a smooth
jelly-bean. Color RESERVED for terminal screen elements ONLY (three
dots and two progress bars), plus chapter-specific accent points
when listed in the scene. Hull, antenna, all other linework: pure
off-white-lavender.

NEGATIVES (hard constraints, all chapters):
NO cute, NO childish, NO anthropomorphic, NO face-like proportions.
NO domestic props (coffee mug, plates, cushions, toys, plants,
kitchenware). NO comic-strip panel borders. NO speech bubbles. NO
heavy dotted trajectories. NO connecting-line constellations. NO
neon, NO chrome reflections, NO gradients, NO fills, NO shading, NO
wobble. NO watermark. NO text outside the terminal screen and small
chapter-specific markers.

CHAPTER N SCENE — [scene description per storyboard above].
```

### Generation workflow

1. Render each chapter at 1600×800, quality high, via the codex
   path documented in `babel-fish:image`
2. Save under `public/chapters/<NN>-<slug>.png`
3. Wire the path into `lib/chapters.ts` `heroImage` field
4. Verify in browser at desktop (`/en/lab`) and mobile viewport
5. **If the ship drifts** (face-like, stubby, anthropomorphic, wrong
   proportions, color outside the terminal), regenerate with the
   locked spec — do not paper over with CSS

Style consistency across all ten is the bar. Re-roll any outlier.

---

## Hybrid visual strategy

Different visuals fit different production paths. Each entry
specifies what to use for what.

| Asset type | Tool | Output | When |
|---|---|---|---|
| Conceptual diagrams (boxes, arrows, flow) | Codex GPT Image 2 via `image-gen` skill | `.png` | Hero shots, multi-part overviews, anything where a real screenshot would be too literal |
| Static terminal stills | [`freeze`](https://github.com/charmbracelet/freeze) | `.svg` | Command + output where TUI chrome isn't the teaching point |
| Animated terminal sessions | [`vhs`](https://github.com/charmbracelet/vhs) | `.webm` + poster `.png` | Live agent runs, multi-step CLI flows |
| Desktop screenshots | `cc-lab-screenshot` skill (computer-use MCP) | `.png` (2× retina) | Native-app UI, mic state, paste behavior, anything where the live state is the teaching point |
| Mobile screenshots | `cc-lab-screenshot` skill (iOS Simulator preferred) | `.png` | Mobile dictation, iOS Claude app, when desktop equivalents miss the framing |

**Rule of thumb:** if a builder needs to recognize "this is what my
Claude looks like," real screenshot wins. If you're showing terminal
output that doesn't depend on the user's specific terminal app, freeze
wins. If the visual is conceptual (relationships between concepts),
GPT Image 2 wins.

Manual capture is a documented fallback only — never the preferred
path. See `docs/visuals.md` for the full production conventions and
the lessons-from-the-first-run section.

---

## Screenshot rules (PII non-negotiables)

Full list in `skills/cc-lab-screenshot/conventions.md`. The
non-negotiables that the freshness skill should refuse to violate:

- **Dark mode** for all screenshots (matches default reading mode)
- **2× retina** (`screencapture -x` on Apple Silicon)
- **Notification Center hidden, Do Not Disturb on**
- **No PII**: no real account names other than `cc-lab-demo`, no real
  client names (Aibility, Seyfor, others), no real emails, no API
  tokens (even partial), no Slack/Discord avatars of real people
- **Repo names**: only `claude-code-lab` and `cc-lab-samples` are
  acceptable; other real repo names get cropped or replaced
- **Filename pattern**: `<chapter-or-entry-slug>-<descriptor>.<ext>`

Ondrej's first name appearing in a Claude desktop greeting (e.g.,
"Ondra") is acceptable for the lab specifically — it's his publicly
authored work. Last names, account handles, email addresses, or
identifying metadata are not.

---

## MDX components and when to use each

| Component | Use for |
|---|---|
| `<Screenshot>` | Real PNG screenshots from `public/screenshots/` |
| `<Diagram>` | Mermaid diagrams (inline source) — auto-themed for dark/light |
| `<TerminalOutput>` | `freeze`-produced static terminal SVGs (optional `text` prop for copy button) |
| `<TerminalCast>` | `vhs`-produced animated terminal recordings (requires `poster` prop, respects `prefers-reduced-motion`) |
| `<Prompt>` | Copy-paste-able user prompts; renders with copy button |
| `<Callout variant="note|warn|tip">` | Side-band notes that should not derail the main narrative |
| `<BuildStats>` | Build-time stats display (used in behind-the-scenes) |

**Don't invent new MDX primitives** unless absolutely necessary. The
2026-04-24 in-lab improvement plan made this explicit; the mastery
evolution plan inherits it. If a chapter wants visual treatment that
doesn't exist, first ask whether to use existing components creatively
before adding a new one.

---

## Library architecture (hybrid)

The lab has two surfaces:

- **Spine** — the ten ordered chapters. Teaches the path. One reading
  order. Bilingual EN+CS parity, non-negotiable.
- **Library** — depth on demand. Unordered. Each entry sits next to
  one or two spine chapters and goes further than the chapter could
  without bloating the path.

The library is **chapter-affinity primary, topic-tagged secondary.**
Every entry declares one primary chapter (where it lives in
navigation) and zero or more topic tags (skills, hooks, mcp, recipes,
references) that surface it on filtered browse.

### Why hybrid

A pure topic taxonomy (skills/hooks/MCP/recipes/references) was
considered and rejected — half the priority entries don't fit the
buckets cleanly. *Context engineering as practice* is a practice, not
a skill or hook. *Failure modes* is a catalog. Forcing them into
topic buckets either invents fake topics or distorts the entries.

A pure chapter-affinity model was considered and almost picked. It
maps directly to the Subjective Contract — *spine teaches the path;
library is depth on demand.* But cross-cutting entries (Failure
modes, Decision frameworks, the Diagnostic library entry) want a
home that isn't a single chapter. Tags solve that without inventing
a competing primary navigation.

Hybrid is the most reversible of the three. If chapter affinity ever
stops fitting, tags can be promoted; if tags ever feel like dead
weight, they can be dropped. Neither rewrites the entries.

### Route shape

```
/[locale]/lab/library                     — library index
/[locale]/lab/library/[slug]              — entry page
```

Library lives as a sub-tree of `lab`, not at the root of the locale.
The lab is the product; the library is part of the lab.

### Entry frontmatter contract

Every library MDX file declares:

```yaml
---
slug: context-engineering
title: Context engineering as practice
chapter: iteration-and-control      # primary chapter affinity
tags: [practice, context]           # optional, lowercase, kebab-case
readTime: 8 min                     # rough estimate, same shape as chapter readTime
---
```

`chapter` is required and must match a chapter slug. `tags` is
optional. `readTime` is rough — the goal is a heads-up, not a metric.

### Discovery rules

- The **chapter page** surfaces affiliated library entries at the
  bottom under "Go deeper", not in-line with the chapter body.
  Affiliation is computed from `chapter` frontmatter; no manual
  cross-linking.
- The **library index** lists every entry, grouped first by chapter
  (in spine order), with tag chips on each entry for filter.
- A **chapter body** can still link to a library entry inline using
  a regular link — when the entry is the natural next step in the
  argument, not a "see also" footnote.
- A **library entry** can link to other library entries and to spine
  chapters freely.

### Voice for library entries

Same voice as chapters (peer, sharp, no bullshit). One difference:
library entries can be slightly more reference-shaped — annotated
lists, decision tables, more `<Prompt>` and `<TerminalOutput>` than
prose where appropriate. The Subjective-Contract rejection criterion
*"library entry that doesn't compound on the spine"* still applies —
an entry that just restates a chapter is wrong shape.

### What the library is *not*

- **Not a curated awesome-list.** Every entry is written; nothing is
  syndicated link-rot.
- **Not a search-driven dump.** No SEO-shaped title templates. No
  `topic: best practices for X` filler.
- **Not a course platform.** No badges, no progression, no
  prerequisites. The 2026-04-24 in-lab plan's anti-goal still holds.
- **Not a tag taxonomy fight.** Tags are minimal and editorial — if
  three entries don't share a tag, the tag isn't worth having.
- **Not stricter than the spine.** Library entries can ship EN-first
  with CS pending, on Ondrej's call, when bandwidth tightens. Spine
  parity is non-negotiable; library parity is a strong default.

---

## Subjective contract

(Inherited from the cc-lab mastery evolution plan; restated here so
this doc is self-contained.)

- **Target outcome.** A reader who works through the spine emerges
  genuinely capable in Claude Code. A reader who dips into the library
  finds depth without friction. A reader who runs the diagnostic feels
  *seen* — their setup is talked about specifically, not abstractly.
  Builder-canon writers cite the lab as a reference.
- **Tone / taste rules.** No bullshit. Cut through. Pragmatic. Honest
  about what doesn't work. Concrete > abstract. Show before tell.
  Voice is sharp but not preachy. Czech parity matters. Peer voice.
- **Rejection criteria.** Any of the following sends content back:
  - Reads like Anthropic docs (formal, exhaustive, voiceless)
  - Library entry that doesn't compound on the spine
  - Diagnostic output that gives advice without copy-paste artifacts
  - Freshness skill PR that needs heavy editing every week (the skill
    isn't lens-aware enough)
  - Any new content that requires marketing language to justify
  - Czech version that reads as translated rather than peer-voiced
  - Visuals that don't follow the production strategy
  - PII in any screenshot

---

## Using this doc as freshness-skill input

When the freshness skill (Phase 4) processes a new Anthropic primitive
or doc change, it should read this entire document plus the relevant
chapter as context, then propose copy that:

1. Lands in the right chapter (or new library entry)
2. Matches the voice and register rules above
3. Honors the audience (builders primary)
4. Hits at least one anti-goal that the proposal *avoids*, named
   explicitly (e.g., "this proposal avoids the changelog-wrapper
   trap by framing the new primitive in terms of the loop the reader
   already runs")
5. Includes a visual asset brief that picks the right tool from the
   hybrid strategy table
6. Includes EN + CS, with CS following the peer-voice rules
7. Does not invent new MDX primitives
8. Does not include PII in any captured visual

If the proposal can't satisfy all eight, the skill stops and asks
rather than shipping a half-shaped artifact.

---

## Validation

This doc is validated against the principle: a hypothetical reader
applying it to an Anthropic changelog entry should produce
lab-shaped output predictable enough to be recognized as cc-lab voice.

**Self-test for any contributor:** pick one Anthropic primitive that
shipped in the last month and write three sentences for the lab about
it. If your three sentences could swap into any existing chapter
without anyone noticing the seam, this doc is doing its job. If your
sentences need editing to match the chapters, either the doc has a
gap or the sentences need rewriting.

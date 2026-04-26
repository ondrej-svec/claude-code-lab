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
journey comic are the only "personality" elements; they earn it.

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

# Screenshot Phase R Inventory — claude-code-lab

**Date produced:** 2026-04-23
**Scope:** R.1 Inventory · R.2 Triage · R.3 License posture

---

## Top-Level Triage Table

| Row | Feature | Status | Verdict | Notes |
|-----|---------|--------|---------|-------|
| #1 | Desktop main window after first sign-in (redesigned UI) | NOT-AVAILABLE | Capture manually | Blog hero is abstract SVG art, not a UI screenshot. Docs have no embedded screenshot. No press-kit UI imagery. |
| #2 | Permission prompt dialog | NOT-AVAILABLE | Capture manually | No screenshot of permission dialogs found in any official Anthropic source. |
| #4 | Diff review view (redesigned diff viewer) | NOT-AVAILABLE | Capture manually | Diff viewer is described extensively in docs but no screenshot published. |
| #11 | Multi-session sidebar (redesigned desktop) | NOT-AVAILABLE | Capture manually | Sidebar described in blog/docs. No embeddable screenshot found. |
| #15 | Routines scheduling interface | NOT-AVAILABLE | Capture manually | Routines UI lives at claude.ai/code/routines (login-walled). No public screenshot. |

**Summary: all five DESK rows require manual capture by Ondrej. Zero rows qualify as REUSABLE.**

---

## R.1 Per-Image Inventory

### Source 1 — claude.com/blog/claude-code-desktop-redesign

The primary-source blog post contains **zero product screenshots**. All four images on the page are abstract decorative SVG illustrations in Anthropic's brand palette. The redesign features are described entirely in prose.

| # | Image URL | What it shows | Matrix row |
|---|---|---|---|
| B-1 | `cdn.prod.website-files.com/.../6903d22d0099a66d72e05699_*.svg` | Abstract hero art — three organic curved shapes in cream/charcoal. Not a UI screenshot. | None — decorative only |
| B-2–B-4 | `cdn.prod.website-files.com/.../6903d22*.svg` | Related-post thumbnails, all decorative | None |

### Source 2 — anthropic.com/news

No Claude Code desktop redesign post was found on the Anthropic newsroom for the April 14 date. The April 2026 posts visible are Opus 4.7 (Apr 16) and Claude Design by Anthropic Labs (Apr 17). The desktop redesign announcement appears only on `claude.com/blog`.

### Source 3 — code.claude.com/docs

Zero screenshots or embedded images on `/en/overview`, `/en/desktop`, `/en/desktop-quickstart`, `/en/routines`, `/en/plan-mode`, or `/en/memory`. The entire documentation site is text-only — markdown via Mintlify, no `<img>` tags.

### Source 4 — GitHub `anthropics/claude-code`

| # | Image URL | What it shows | Matrix row |
|---|---|---|---|
| G-1 | `raw.githubusercontent.com/anthropics/claude-code/main/demo.gif` | Animated 10.5 MB GIF of the CLI (`claude` in a terminal). Not a desktop app screenshot. | Potential CLI use only |

### Source 5 — GitHub `anthropics/claude-code-action`

| # | Image URL | What it shows | Matrix row |
|---|---|---|---|
| A-1 | `github.com/user-attachments/assets/1d60c2e9-...` | Claude Code Action responding to a GitHub PR — GitHub Actions context, not desktop app. | Potentially CI/agents chapter |

### Source 6 — Anthropic Brandfolder (press kit)

Brandfolder exists at `brandfolder.com/anthropic/newsroom` with 13 public assets. Inventory is auth-walled. Based on available metadata the collection contains logos and brand imagery only, not product UI screenshots.

### Source 7 — Third-party coverage

MacRumors, Thurrott, The New Stack, VentureBeat — either stock imagery or text-only. No reusable product screenshots.

---

## R.2 Triage — DESK Rows

| Row | Feature | Classification | Reasoning |
|---|---|---|---|
| #1 | Desktop main window after first sign-in | **NOT-AVAILABLE** | No UI screenshot of redesigned desktop exists in any crawlable Anthropic source. Blog hero is abstract art. Docs text-only. |
| #2 | Permission prompt dialog | **NOT-AVAILABLE** | No official source has screenshots of permission dialogs. |
| #4 | Diff review view | **NOT-AVAILABLE** | Described in docs, no screenshots published. |
| #11 | Multi-session sidebar | **NOT-AVAILABLE** | Described in blog/docs, no embeddable screenshot. |
| #15 | Routines scheduling interface | **NOT-AVAILABLE** | UI at claude.ai/code/routines is login-walled; no public screenshot. |

---

## R.3 License Posture

**Anthropic ToS (anthropic.com/legal/consumer-terms, §13):**
> "You may not, without our prior written permission, use our name, logos, or other trademarks..."

- No explicit carve-out for educational / non-commercial / open-source use.
- No specific statement on reuse of blog imagery or docs screenshots.
- Permission contact: `marketing@anthropic.com`.

**Reuse markup:** blog posts carry no embed/reuse markup. Docs have no images. No CC-BY or similar statement anywhere.

**Press kit:** Brandfolder exists but contains brand assets, not product screenshots. No dedicated "Claude Code screenshot library."

**Policy conclusion:** All Anthropic imagery is amber (LICENSE-UNCLEAR) at best. Per the project plan's default: amber = don't embed; capture our own or link out. GitHub-hosted images (`demo.gif`, PR screenshot) are also amber — code-repo license doesn't automatically extend to screenshot imagery.

---

## Recommended Next Actions

### All five DESK rows: Ondrej manual capture

Zero reusable official imagery. Plan pivots to the manual-brief path (see `docs/screenshots-manual-brief.md`, Task C.3.b).

### Alternative in prose

For chapters where manual capture slips: link out directly:
- `code.claude.com/docs/en/desktop` (reference)
- `claude.com/blog/claude-code-desktop-redesign` (announcement)
- `claude.ai/code/routines` (reader experiences it firsthand)

### CLI imagery posture

- `demo.gif` and the claude-code-action PR screenshot remain amber. Our plan generates CLI shots via `freeze + tmux` instead — no need to embed third-party imagery.

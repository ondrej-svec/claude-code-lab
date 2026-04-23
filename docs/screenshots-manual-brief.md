---
title: "Screenshots — manual capture brief"
type: brief
date: 2026-04-23
audience: Ondrej
---

# Manual capture brief — redesigned Claude Code desktop

**Why this exists.** Phase R research confirmed Anthropic has published no
reusable imagery of the redesigned (2026-04-14+) Claude Code desktop app. All
five DESK rows in the priority matrix need to be captured by hand. This brief
is the numbered shot list — each entry has exact steps, target filename, and
caption.

See `docs/screenshots-phase-r-inventory.md` for the research that led here and
`docs/plans/2026-04-23-feat-screenshot-capture-plan.md` for the full plan.

---

## Before you start

**Version check.** Open Claude Code desktop. Verify version **≥ v1.2581.0**
(the first redesigned build, 2026-04-14). If you're on an earlier build,
update before capturing — anything pre-April-14 is explicitly rejected by the
plan's acceptance criteria.

**Clean state.**
- Sign into a fresh or throwaway account (no real usernames or emails visible)
- Open a sample project, not a real repo (`claude-code-lab/samples/dotnet-core/`
  is ideal — no sensitive data)
- Hide dock, menu bar extras, and any notifications. System Preferences →
  Control Center → Menu Bar Only → hide what doesn't belong in a screenshot.
- Set appearance to **dark** (matches the existing rose-pine-moon feel).
  If a shot reads better in light, we can add a `darkSrc` variant later.
- Set Display scale to 2× (retina) if on an external monitor.

**Tool.** Use `Cmd+Shift+5` → "Capture selected window" for clean chrome.
The saved PNG lands on your Desktop by default. Drop it into
`public/screenshots/` with the filename listed below.

**No sensitive data.** Double-check each shot before you save — no tokens,
no real repo names other than `claude-code-lab`, no emails.

---

## Shot list

### #1 · Desktop main window after first sign-in (P1)

**File:** `public/screenshots/ch1-desktop-welcome.png`
**Chapter:** `before-we-start.mdx` (Ch 1)
**Caption (EN):** `Claude Code desktop after sign-in. Open a folder to start.`
**Caption (CS):** `Claude Code desktop po přihlášení. Otevři složku a začni.`
**Alt:** `Claude Code desktop app main window on first sign-in, showing the sidebar and empty workspace.`

**Steps**
1. Quit and relaunch Claude Code (Cmd+Q then reopen — the first session view
   looks slightly different from the "mid-session" state).
2. Open the `samples/dotnet-core` folder. No messages sent yet.
3. Capture the full app window.

**Expected contents**
- Left sidebar (sessions list), center prompt area, and workspace visible.
- No open sessions, no unread indicators.

---

### #2 · Permission prompt dialog (P3)

**File:** `public/screenshots/ch1-permission-prompt.png`
**Chapter:** `before-we-start.mdx` (Ch 1)
**Caption (EN):** `Claude asks before the first edit. Say yes to let it continue.`
**Caption (CS):** `Claude se ptá před první editací. Řekni ano a nech ho pokračovat.`
**Alt:** `Permission prompt dialog asking approval before Claude edits a file.`

Only capture this one if it lands cleanly — the plan marks it P3 (skip if trivial).

**Steps**
1. With permissions set to **Ask**, start a new session in `samples/dotnet-core`.
2. Prompt: `Add a TODO comment at the top of Program.cs that says "Hello".`
3. When the approval dialog appears, capture the dialog plus enough of the
   surrounding app to give context.
4. Cancel the edit (don't apply).

---

### #4 · Diff review view (P2)

**File:** `public/screenshots/ch2-diff-review.png`
**Chapter:** `first-task.mdx` (Ch 2)
**Caption (EN):** `The diff viewer opens when a change touches files. Review before accept.`
**Caption (CS):** `Diff viewer se otevře u změn se soubory. Zkontroluj, než potvrdíš.`
**Alt:** `Claude Code diff review window showing a two-column diff with changes highlighted.`

**Steps**
1. In `samples/dotnet-core`, prompt: `Add a /health endpoint to Program.cs
   that returns { ok: true, uptime_seconds: n }.`
2. When Claude proposes the edit, click the `+N -N` diff stats indicator to
   open the diff viewer.
3. Capture the diff window at a wide viewport so the two-column layout fits.

---

### #11 · Multi-session sidebar (P2)

**File:** `public/screenshots/ch5-multi-session-sidebar.png`
**Chapter:** `ecosystem.mdx` (Ch 5)
**Caption (EN):** `Multiple sessions live in the sidebar. Switch without losing context.`
**Caption (CS):** `Sidebar drží víc session najednou. Přepínej, aniž bys ztratil kontext.`
**Alt:** `Claude Code sidebar listing multiple active sessions across projects with status indicators.`

**Steps**
1. Open 2–3 sessions across different folders (sample projects, not real repos).
2. Run one session long enough for a status indicator to appear.
3. Capture the full sidebar panel plus a narrow strip of the main area so the
   reader sees "sidebar + session" context.

---

### #15 · Routines scheduling interface (P3)

**File:** `public/screenshots/ch7-routines.png`
**Chapter:** `next-steps.mdx` (Ch 7)
**Caption (EN):** `Routines run Claude on a schedule. Same prompts, different trigger.`
**Caption (CS):** `Routines pouští Claude na plán. Stejné prompty, jiný spouštěč.`
**Alt:** `Routines scheduling interface showing a routine with a prompt field, trigger selector, and repository picker.`

Only worth it if the interface is clean (plan marks this P3 — skip if the UX
is still rough or if login-wall makes the shot awkward).

**Steps**
1. Visit `claude.ai/code/routines` in the desktop app or browser.
2. Click "New routine". Fill in: name `Friday cleanup`, prompt `Run the
   security-review across src/; write findings to docs/reports/`, trigger
   `Schedule: Fridays 18:00`, repo `claude-code-lab` (sample project).
3. Capture the filled-in form just before "Create" — don't actually create it.

---

## After you capture

1. Drop each PNG into `public/screenshots/` with the filename listed.
2. Run `pnpm build` to make sure no references break.
3. Tell me which shots landed — I'll wire them into the relevant MDX (EN + CS)
   with the captions above.
4. Any shots you skip (P3s especially), just say so; I'll remove the
   reference so the build stays clean.

**Reject a shot and reshoot if:**
- Blurry or not retina 2×
- Dock, wallpaper, menu bar, or notifications visible
- Real email, username, repo name, or path (`/Users/ondrejsvec/...`) visible
- Text too small to read inline at the chapter's width (~800px wide)
- Any pre-April-14 UI (old sidebar, old chrome)

---

## Status (2026-04-23)

Captured via computer-use MCP (see `docs/plans/2026-04-23-feat-lab-visuals-plan.md`):

- **#1 desktop welcome (P1)** — ✅ LANDED. `ch1-desktop-welcome.png` (1200×780). Dark mode, Ondrej's account visible (name/stats kept per explicit approval, Option B). Wired into EN + CS `before-we-start.mdx`.
- **#4 diff review (P2)** — ✅ LANDED. `ch2-diff-review.png` (1500×820). Conversation on left, desktop diff viewer on right showing the `+8 -0` `/health` endpoint change. Wired into EN + CS `first-task.mdx` alongside the existing CLI diff screenshot.
- **#11 multi-session sidebar (P2)** — ✅ LANDED. `ch5-multi-session-sidebar.png` (1500×820). Recents lists two sessions; main area shows the active one. Wired into EN + CS `ecosystem.mdx`.
- **#2 permission dialog (P3)** — ❌ SKIPPED. The dialog exposes the full `/Users/ondrejsvec/...` file path (including `.claude/worktrees/<id>/...`), which is an auto-reject per the privacy rules. Not fixable from the UI; revisit if a future app version redacts the path.
- **#15 Routines form (P3)** — ✅ LANDED. `ch7-routines.png` (1500×820). Form pre-filled with `friday-cleanup` / Weekly / Friday / 18:00. Repo label shows `ondrej-svec/claude-code-lab` (kept by explicit approval). Wired into EN + CS `next-steps.mdx`.

Display resolution note: captures are 1× because the external display is 1× (3440×1440 ultra-wide, not Retina). This matches the existing CLI captures (e.g. `ch2-plan-output.png` at 1200 wide). The strict "2× retina" rule from the original plan isn't achievable on this machine's primary display — consistency with existing shots was preferred.

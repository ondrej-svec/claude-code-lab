#!/usr/bin/env python3
"""generate-fixtures.py — emit ANSI fixture files under sessions/.

Each fixture represents one canonical Claude Code moment referenced by a
chapter. Edit content here (not the .ansi output) when chapters evolve.

Usage: ./scripts/capture/generate-fixtures.py
"""
from __future__ import annotations

import os
import re
import sys
import unicodedata
from pathlib import Path

HERE = Path(__file__).resolve().parent
OUT = HERE / "sessions"
OUT.mkdir(parents=True, exist_ok=True)

# --- ANSI helpers ---------------------------------------------------------
R = "\x1b[0m"
B = "\x1b[1m"            # bold
D = "\x1b[2m"            # dim
I = "\x1b[3m"            # italic
CYAN = "\x1b[1;36m"      # Claude "working on it" bullet
GREEN = "\x1b[1;32m"     # success check
YELLOW = "\x1b[1;33m"    # attention / mode
MUTED = "\x1b[38;5;245m" # subtle text
ACCENT = "\x1b[38;5;216m"  # soft rose (matches Rose Pine rose)
USER = "\x1b[38;5;75m"   # user prompt color

ANSI_RE = re.compile(r"\x1b\[[0-9;]*m")


def visible_width(s: str) -> int:
    """Terminal-visible width of a string, ignoring ANSI codes.
    Counts East-Asian wide chars as 2, combining chars as 0."""
    stripped = ANSI_RE.sub("", s)
    width = 0
    for ch in stripped:
        if unicodedata.combining(ch):
            continue
        width += 2 if unicodedata.east_asian_width(ch) in ("W", "F") else 1
    return width


def pad_right(s: str, width: int, fill: str = " ") -> str:
    """Pad s with `fill` on the right to reach visible width `width`."""
    missing = width - visible_width(s)
    return s + (fill * missing if missing > 0 else "")


def box(title: str, lines: list[str], inner_width: int = 58) -> str:
    """Render an ANSI box with a labeled top-left rule and given inner width."""
    top_prefix = f"{MUTED}┌─{R} {B}{title}{R} {MUTED}"
    top_prefix_vw = visible_width(top_prefix)
    dashes = inner_width + 2 - top_prefix_vw  # +2 accounts for `┌─ ` overhead vs inner
    if dashes < 0:
        dashes = 0
    top = f"{top_prefix}{'─' * dashes}┐{R}"

    mid_lines = []
    for line in lines:
        padded = pad_right(line, inner_width)
        mid_lines.append(f"{MUTED}│{R} {padded} {MUTED}│{R}")

    bottom = f"{MUTED}└{'─' * (inner_width + 2)}┘{R}"
    return "\n".join([top, *mid_lines, bottom])


def write(name: str, content: str) -> None:
    path = OUT / f"{name}.ansi"
    path.write_text(content, encoding="utf-8")
    print(f"wrote {path.relative_to(HERE.parent.parent)}")


# --- ch2-plan-output — Ch 2 First task (shot #3) --------------------------
ch2 = f"""\
{USER}>{R} Add a GET /health endpoint that returns {{ "ok": true, "uptime_seconds": n }}.

{CYAN}●{R} I'll add a {B}/health{R} endpoint to {B}Program.cs{R}.

  {B}Plan{R}

   1. Read {B}Program.cs{R} to see the current minimal-API setup
   2. Capture a process-start timestamp at startup
   3. Register {B}MapGet("/health"){R} returning {{ ok, uptime_seconds }}
   4. Run the sample and hit the endpoint to verify

  {B}Files to edit{R}
   {MUTED}→{R} Program.cs          {MUTED}(add route + uptime field){R}

  {B}Checks{R}
   {MUTED}→{R} dotnet test samples/dotnet-core/

{YELLOW}◆{R} Ready to proceed? {D}[y / n / edit plan]{R}
{USER}>{R} {D}_{R}
"""
write("ch2-plan-output", ch2)


# --- ch3-init-output — Ch 3 Teach Claude (shot #5) ------------------------
ch3 = f"""\
{USER}>{R} /init

{CYAN}●{R} Scanning {B}samples/dotnet-core/{R} ...

  {MUTED}→{R} Program.cs              {MUTED}ASP.NET Core minimal API{R}
  {MUTED}→{R} samples.Tests/          {MUTED}xunit project, 2 tests{R}
  {MUTED}→{R} README.md               {MUTED}setup instructions{R}
  {MUTED}→{R} .editorconfig           {MUTED}spaces, 4 wide{R}

{CYAN}●{R} Proposed {B}CLAUDE.md{R}

  {D}# samples/dotnet-core — ASP.NET Core sample{R}

  {D}## Build{R}
  {D}dotnet build{R}

  {D}## Test{R}
  {D}dotnet test{R}

  {D}## Conventions{R}
  {D}- Minimal APIs in Program.cs{R}
  {D}- Controllers only when routes exceed ~6 endpoints{R}
  {D}- Spaces, 4 wide{R}

{YELLOW}◆{R} Write to {B}CLAUDE.md{R}? {D}[y / n]{R}
{USER}>{R} {D}_{R}
"""
write("ch3-init-output", ch3)


# --- ch4-rewind-menu — Ch 4 Iteration (shot #7) ---------------------------
rewind_lines = [
    f"{ACCENT}▶{R} {B}1.{R}  {MUTED}just now{R}      Add a GET /health endpoint that...",
    f"  {B}2.{R}  {MUTED}2m ago{R}        Read Program.cs and tell me what...",
    f"  {B}3.{R}  {MUTED}5m ago{R}        /init",
    f"  {B}4.{R}  {MUTED}8m ago{R}        explain the dependencies",
    "",
    f"{D}↑↓ navigate · enter rewind · esc cancel{R}",
]
ch4_rewind = box("Rewind", rewind_lines, inner_width=58) + "\n"
write("ch4-rewind-menu", ch4_rewind)


# --- ch4-plan-mode — Ch 4 Iteration (shot #8) -----------------------------
ch4_plan = f"""\
{USER}>{R} Refactor the auth middleware to use dependency injection.

{CYAN}●{R} I can see {B}Program.cs{R} wires {B}AuthMiddleware{R} directly. Thinking it
  through without editing...

  Currently {B}AuthMiddleware{R} reads config from {B}IConfiguration{R}. A cleaner
  shape is to register it as a scoped service and inject {B}IAuthProvider{R}.
  Three files would change:

   {MUTED}→{R} Program.cs
   {MUTED}→{R} Middleware/AuthMiddleware.cs
   {MUTED}→{R} Extensions/ServiceCollectionExtensions.cs

  Want me to leave plan mode and apply? {D}(Shift+Tab){R}

{MUTED}──────────────────────────────────────────────────────────────{R}
{YELLOW}◆ plan mode{R}  {D}· Shift+Tab cycles · read-only, no edits or runs{R}
{USER}>{R} {D}_{R}
"""
write("ch4-plan-mode", ch4_plan)


# --- ch6-plan-output — Ch 6 Compound (shot #12) ---------------------------
plan_lines = [
    f"{B}Wrote{R}    docs/plans/2026-04-23-feat-rate-limiting-plan.md",
    f"{B}Status{R}   {GREEN}approved{R}",
    f"{B}Tasks{R}    8",
    "",
    f"{MUTED}Phase 1   schema + middleware{R}",
    f"{MUTED}Phase 2   limits per-route{R}",
    f"{MUTED}Phase 3   tests + observability{R}",
]
ch6_box = box("Plan ready", plan_lines, inner_width=58)
ch6 = f"""\
{USER}>{R} /plan add rate limiting to the API

{CYAN}●{R} Reading brainstorm at {B}docs/brainstorms/2026-04-23-rate-limiting.md{R} ...
{CYAN}●{R} Drafting plan ...

{ch6_box}

{GREEN}✓{R} Next: {B}/work docs/plans/2026-04-23-feat-rate-limiting-plan.md{R}
"""
write("ch6-plan-output", ch6)


print(f"\nGenerated {len(list(OUT.glob('*.ansi')))} fixture(s) in {OUT.relative_to(HERE.parent.parent)}/")

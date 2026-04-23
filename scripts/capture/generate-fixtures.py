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


# --- ch3-memory-prefix — Ch 3 Teach Claude (shot #6) ---------------------
# `#` memory prefix adds a rule to the right CLAUDE.md.
ch3_memory = f"""\
{USER}>{R} #migrations must be reversible — write the down migration alongside the up one

{CYAN}●{R} Added to memory.

  {B}File{R}    CLAUDE.md   {MUTED}(project scope){R}
  {B}Rule{R}    migrations must be reversible — write the down migration
          alongside the up one
  {B}Reason{R}  Inferred: relates to project conventions, not user preferences

{GREEN}✓{R} Saved. It'll apply from the next prompt on.
"""
write("ch3-memory-prefix", ch3_memory)


# --- ch5-agents-ui — Ch 5 Ecosystem (shot #9) ----------------------------
# `/agents` UI listing available subagents.
agents_lines = [
    f"{MUTED}Project{R}",
    f"  {ACCENT}▶{R} {B}code-reviewer{R}       Reviews diffs against CLAUDE.md",
    f"    {B}test-writer{R}         Writes unit tests for changes",
    f"    {B}doc-editor{R}          Keeps CLAUDE.md tidy",
    "",
    f"{MUTED}Personal{R}",
    f"    {B}explorer{R}            Maps unfamiliar codebases",
    f"    {B}planner{R}             Breaks work into plans",
    "",
    f"{MUTED}Library{R}",
    f"    {D}... browse 40+ more{R}",
    "",
    f"{D}↑↓ navigate · enter select · c create · esc close{R}",
]
agents_box = box("Agents", agents_lines, inner_width=58)
ch5 = f"""\
{USER}>{R} /agents

{agents_box}
"""
write("ch5-agents-ui", ch5)


# --- ch2 stream A / stream B: diff + run fixtures -------------------------
# Ch 2 gets two parallel walkthroughs. Stream A uses samples/dotnet-core,
# Stream B uses samples/python-react. Each stream shows plan → diff → run.
# The existing ch2-plan-output.ansi serves as Stream A's plan shot.

ADD = "\x1b[38;5;150m"    # soft green for diff additions
DEL = "\x1b[38;5;210m"    # soft red for diff deletions
HUNK = "\x1b[38;5;110m"   # blue-grey for @@ hunk headers


# --- ch2a-diff — Stream A (.NET) diff before apply ------------------------
ch2a_diff = f"""\
{CYAN}●{R} Editing {B}Program.cs{R}

  {HUNK}@@ -1,4 +1,6 @@{R}
  {ADD}+using System.Diagnostics;{R}
  {ADD}+{R}
   using Microsoft.AspNetCore.Builder;
   using Microsoft.AspNetCore.Http;
   using Microsoft.Extensions.DependencyInjection;

  {HUNK}@@ -6,6 +8,10 @@{R}
   builder.Services.AddSingleton<ItemStore>();

   var app = builder.Build();
  {ADD}+var startedAt = Stopwatch.StartNew();{R}
  {ADD}+{R}
  {ADD}+app.MapGet("/health", () => new {{ ok = true, uptime_seconds = startedAt.Elapsed.TotalSeconds }});{R}
  {ADD}+{R}
   app.MapGet("/api/items", (ItemStore store) => store.All());

{YELLOW}◆{R} Apply? {D}[y / n / show more]{R}
{USER}>{R} {D}_{R}
"""
write("ch2a-diff", ch2a_diff)


# --- ch2a-run — Stream A (.NET) run output with curl ---------------------
ch2a_run = f"""\
{USER}>{R} dotnet run --project samples/dotnet-core

{CYAN}●{R} {MUTED}info: Microsoft.Hosting.Lifetime[14]{R}
  {MUTED}      Now listening on:{R} {B}http://localhost:5055{R}
  {MUTED}info: Microsoft.Hosting.Lifetime[0]{R}
  {MUTED}      Application started. Press Ctrl+C to shut down.{R}

{USER}>{R} curl -s localhost:5055/health | jq

  {{
    {ACCENT}"ok"{R}: {GREEN}true{R},
    {ACCENT}"uptime_seconds"{R}: {GREEN}3.214{R}
  }}

{GREEN}✓{R} 200 OK  {MUTED}·{R}  41 B  {MUTED}·{R}  4 ms
"""
write("ch2a-run", ch2a_run)


# --- ch2b-plan-output — Stream B (Python+React) plan ---------------------
ch2b_plan = f"""\
{USER}>{R} Add a GET /health endpoint that returns {{ "ok": true, "uptime_seconds": n }}.

{CYAN}●{R} I'll add a {B}/health{R} endpoint to {B}backend/main.py{R}.

  {B}Plan{R}

   1. Read {B}backend/main.py{R} to see the FastAPI wiring
   2. Capture a process-start timestamp at module load
   3. Register {B}@app.get("/health"){R} returning {{ ok, uptime_seconds }}
   4. Run uvicorn and hit the endpoint to verify

  {B}Files to edit{R}
   {MUTED}→{R} backend/main.py     {MUTED}(add route + monotonic timer){R}

  {B}Checks{R}
   {MUTED}→{R} curl localhost:8000/health

{YELLOW}◆{R} Ready to proceed? {D}[y / n / edit plan]{R}
{USER}>{R} {D}_{R}
"""
write("ch2b-plan-output", ch2b_plan)


# --- ch2b-diff — Stream B (Python+React) diff before apply ---------------
ch2b_diff = f"""\
{CYAN}●{R} Editing {B}backend/main.py{R}

  {HUNK}@@ -1,3 +1,4 @@{R}
  {ADD}+import time{R}
   from dataclasses import dataclass, asdict
   from fastapi import FastAPI, HTTPException
   from fastapi.middleware.cors import CORSMiddleware

  {HUNK}@@ -5,6 +6,12 @@{R}

   app = FastAPI(title="cc-lab sample api")

  {ADD}+_started_at = time.monotonic(){R}
  {ADD}+{R}
  {ADD}+@app.get("/health"){R}
  {ADD}+def health() -> dict:{R}
  {ADD}+    return {{"ok": True, "uptime_seconds": time.monotonic() - _started_at}}{R}
  {ADD}+{R}
   app.add_middleware(
       CORSMiddleware,

{YELLOW}◆{R} Apply? {D}[y / n / show more]{R}
{USER}>{R} {D}_{R}
"""
write("ch2b-diff", ch2b_diff)


# --- ch2b-run — Stream B (Python+React) run output with curl -------------
ch2b_run = f"""\
{USER}>{R} uvicorn backend.main:app --reload

{CYAN}●{R} {MUTED}INFO:     Uvicorn running on{R} {B}http://127.0.0.1:8000{R}
  {MUTED}INFO:     Application startup complete.{R}

{USER}>{R} curl -s localhost:8000/health | jq

  {{
    {ACCENT}"ok"{R}: {GREEN}true{R},
    {ACCENT}"uptime_seconds"{R}: {GREEN}2.871{R}
  }}

{GREEN}✓{R} 200 OK  {MUTED}·{R}  39 B  {MUTED}·{R}  2 ms
"""
write("ch2b-run", ch2b_run)


print(f"\nGenerated {len(list(OUT.glob('*.ansi')))} fixture(s) in {OUT.relative_to(HERE.parent.parent)}/")

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
{USER}>{R} Add a {B}DELETE /api/entries/{{id}}{R} endpoint to the Guide so I can
  remove an entry by id.

{CYAN}●{R} I'll add it to {B}Program.cs{R}, alongside the existing routes.

  {B}Plan{R}

   1. Read {B}Program.cs{R} to see how the other endpoints are registered
   2. Read {B}Stores/EntryStore.cs{R} for the right removal primitive
   3. Add {B}EntryStore.Remove(id){R} returning bool
   4. Register {B}MapDelete("/api/entries/{{id:int}}"){R} → 204 / 404
   5. Run the sample and curl DELETE to verify

  {B}Files to edit{R}
   {MUTED}→{R} Stores/EntryStore.cs   {MUTED}(add Remove method){R}
   {MUTED}→{R} Program.cs             {MUTED}(register MapDelete){R}

  {B}Checks{R}
   {MUTED}→{R} curl -X DELETE http://localhost:5100/api/entries/3 -i

{YELLOW}◆{R} Ready to proceed? {D}[y / n / edit plan]{R}
{USER}>{R} {D}_{R}
"""
write("ch2-plan-output", ch2)


# --- ch3-init-output — Ch 3 Teach Claude (shot #5) ------------------------
ch3 = f"""\
{USER}>{R} /init

{CYAN}●{R} Scanning {B}samples/dotnet-core/{R} ...

  {MUTED}→{R} Program.cs              {MUTED}minimal API + first-run boot{R}
  {MUTED}→{R} Models/Entry.cs         {MUTED}Entry record + EntryInput{R}
  {MUTED}→{R} Stores/EntryStore.cs    {MUTED}in-memory, 6 seeded entries{R}
  {MUTED}→{R} Boot/BootSequence.cs    {MUTED}Spectre.Console boot{R}
  {MUTED}→{R} README.md               {MUTED}setup, API, chapter links{R}

{CYAN}●{R} Proposed {B}CLAUDE.md{R}

  {D}# CLAUDE.md — The Guide (dotnet-core sample){R}

  {D}## Project{R}
  {D}Bilingual knowledge-base app, Hitchhiker's-Guide flavored.{R}
  {D}ASP.NET Core minimal API, in-memory store, no API keys.{R}

  {D}## Domain{R}
  {D}Entry: id, title, body, badge, contributor, locale, tags{R}
  {D}Badge: mostly-harmless | mostly-dangerous | unknown{R}

  {D}## Don't{R}
  {D}- Don't add EF, auth, or AI in the seed{R}
  {D}- Don't ship PUT/DELETE — chapter 2 adds DELETE{R}
  {D}- Don't extend the boot — keep under 3 seconds{R}

{YELLOW}◆{R} Write to {B}CLAUDE.md{R}? {D}[y / n]{R}
{USER}>{R} {D}_{R}
"""
write("ch3-init-output", ch3)


# --- ch4-rewind-menu — Ch 4 Iteration (shot #7) ---------------------------
rewind_lines = [
    f"{ACCENT}▶{R} {B}1.{R}  {MUTED}just now{R}      Add a DELETE /api/entries/{{id}} endpoint...",
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
{CYAN}●{R} Editing {B}Stores/EntryStore.cs{R} and {B}Program.cs{R}

  {HUNK}@@ Stores/EntryStore.cs +60,4 @@{R}
   public Entry Add(EntryInput input) {{ ... }}
  {ADD}+{R}
  {ADD}+public bool Remove(int id){R}
  {ADD}+    => _entries.RemoveAll(e => e.Id == id) > 0;{R}

  {HUNK}@@ Program.cs +44,5 @@{R}
   app.MapPost("/api/entries", (EntryInput input, EntryStore store) => {{ ... }});
  {ADD}+{R}
  {ADD}+app.MapDelete("/api/entries/{{id:int}}", (int id, EntryStore store) =>{R}
  {ADD}+    store.Remove(id) ? Results.NoContent() : Results.NotFound());{R}

{YELLOW}◆{R} Apply? {D}[y / n / show more]{R}
{USER}>{R} {D}_{R}
"""
write("ch2a-diff", ch2a_diff)


# --- ch2a-run — Stream A (.NET) run output with curl ---------------------
ch2a_run = f"""\
{USER}>{R} dotnet run --project samples/dotnet-core

{CYAN}●{R} {MUTED}Sub-Etha relay online · http://localhost:5100{R}

{USER}>{R} curl -s localhost:5100/api/entries | jq 'length'

  {GREEN}6{R}

{USER}>{R} curl -s -X DELETE localhost:5100/api/entries/3 -i | head -1

  {GREEN}HTTP/1.1 204 No Content{R}

{USER}>{R} curl -s localhost:5100/api/entries | jq 'length'

  {GREEN}5{R}

{GREEN}✓{R} entry 3 (Vogon poetry) gone  {MUTED}·{R}  204 No Content  {MUTED}·{R}  3 ms
"""
write("ch2a-run", ch2a_run)


# --- ch2b-plan-output — Stream B (Python+React) plan ---------------------
ch2b_plan = f"""\
{USER}>{R} Add a {B}DELETE /api/entries/{{id}}{R} endpoint to the Guide so I can
  remove an entry by id.

{CYAN}●{R} I'll add it to {B}backend/main.py{R}, alongside the existing routes.

  {B}Plan{R}

   1. Read {B}backend/main.py{R} to see how the other endpoints are wired
   2. Add {B}@app.delete("/api/entries/{{id}}"){R} returning 204 / 404
   3. Mutate the in-memory {B}_entries{R} list in place
   4. Run uvicorn and curl DELETE to verify

  {B}Files to edit{R}
   {MUTED}→{R} backend/main.py     {MUTED}(add the delete handler){R}

  {B}Checks{R}
   {MUTED}→{R} curl -X DELETE http://localhost:8000/api/entries/3 -i

{YELLOW}◆{R} Ready to proceed? {D}[y / n / edit plan]{R}
{USER}>{R} {D}_{R}
"""
write("ch2b-plan-output", ch2b_plan)


# --- ch2b-diff — Stream B (Python+React) diff before apply ---------------
ch2b_diff = f"""\
{CYAN}●{R} Editing {B}backend/main.py{R}

  {HUNK}@@ +175,8 @@{R}
   @app.post("/api/entries", status_code=201)
   def create_entry(payload: EntryInput) -> dict:
       ...
  {ADD}+{R}
  {ADD}+@app.delete("/api/entries/{{entry_id}}", status_code=204){R}
  {ADD}+def delete_entry(entry_id: int) -> None:{R}
  {ADD}+    for i, entry in enumerate(_entries):{R}
  {ADD}+        if entry.id == entry_id:{R}
  {ADD}+            _entries.pop(i){R}
  {ADD}+            return{R}
  {ADD}+    raise HTTPException(status_code=404, detail="entry not found"){R}

{YELLOW}◆{R} Apply? {D}[y / n / show more]{R}
{USER}>{R} {D}_{R}
"""
write("ch2b-diff", ch2b_diff)


# --- ch2b-run — Stream B (Python+React) run output with curl -------------
ch2b_run = f"""\
{USER}>{R} uvicorn main:app --reload

{CYAN}●{R} {MUTED}INFO:     Uvicorn running on{R} {B}http://127.0.0.1:8000{R}
  {MUTED}INFO:     Application startup complete.{R}

{USER}>{R} curl -s localhost:8000/api/entries | jq 'length'

  {GREEN}6{R}

{USER}>{R} curl -s -X DELETE localhost:8000/api/entries/3 -i | head -1

  {GREEN}HTTP/1.1 204 No Content{R}

{USER}>{R} curl -s localhost:8000/api/entries | jq 'length'

  {GREEN}5{R}

{GREEN}✓{R} entry 3 (Vogon poetry) gone  {MUTED}·{R}  204 No Content  {MUTED}·{R}  2 ms
"""
write("ch2b-run", ch2b_run)


print(f"\nGenerated {len(list(OUT.glob('*.ansi')))} fixture(s) in {OUT.relative_to(HERE.parent.parent)}/")

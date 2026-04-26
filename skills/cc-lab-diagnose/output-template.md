# cc-lab-diagnose output template

The exact shape the skill returns. Fill in the slots; don't add a
preamble, don't add a closing pep-talk. The reader wants the
observations, not framing.

---

## Opening (verbatim — do not paraphrase)

```
# cc-lab diagnosis — <repo-name> (<YYYY-MM-DD>)

Three to five observations from your `CLAUDE.md`, `.claude/`, and
recent commits. Each one quotes the file it's reading. None of them
score, grade, or rank your setup.
```

`<repo-name>` = the basename of the cwd. `<YYYY-MM-DD>` = today.

If fewer than 3 observations are evidence-grounded, drop the "to five"
and say "two observations" or "one observation" honestly. If zero,
skip the diagnosis and use the fallback closing.

---

## Per-observation block

Repeat 3-5 times, numbering 1 through N. Use H2 (`##`) for the title.
Each observation is its own section with **bolded labels** for the
five fields.

```
## <N>. <Title — 5-9 words, names the pattern>

**What I see.** <2-3 sentences with ≥1 quoted line from the user's
files and the filename. Active voice. Concrete. Don't editorialize —
report.>

**Confidence.** `<high | medium | I can't tell>`

**Try this.**

<copy-pasteable artifact in a code block — a CLAUDE.md addition, a
SKILL.md scaffold, a Bash one-liner, a prompt to send to Claude. Must
be runnable or pasteable as-is. No "you might consider...">

**Read more.** [<Chapter N: Title>](https://cc-lab.ondrejsvec.com/en/<slug>)
```

---

## Example observation (calibration reference)

```
## 1. CLAUDE.md describes loop discipline but no hooks enforce it

**What I see.** Your `CLAUDE.md:42` says "always commit before /clear"
and `CLAUDE.md:48` says "run tests after every meaningful change."
Both are good rules — but `.claude/settings.json` has no `hooks` block,
so the harness won't enforce them. They live as instructions to the
agent, which means they fire when the agent remembers and lapse when
it doesn't.

**Confidence.** `high`

**Try this.** Add a `Stop` hook that checks for uncommitted changes
and warns:

\`\`\`json
// .claude/settings.local.json
{
  "hooks": {
    "Stop": [{
      "matcher": "",
      "hooks": [{
        "type": "command",
        "command": "git diff --quiet HEAD || echo '⚠ uncommitted changes — checkpoint before ending the session'"
      }]
    }]
  }
}
\`\`\`

**Read more.** [Chapter 6: The ecosystem](https://cc-lab.ondrejsvec.com/en/ecosystem)
```

---

## Closing (verbatim — choose one based on the situation)

### Default closing (when 3+ observations shipped)

```
---

That's the read. None of these are scores. None of them are advice
without an artifact. If one of them lands and the other two don't,
that's a good outcome — the chapter links are there if you want
the longer version.
```

### Sparse-signal closing (when 1-2 observations shipped)

```
---

That's all the repo currently shows. Spend a session on it, then
re-run — the diagnostic gets sharper as your setup gets denser.
```

### Empty-signal closing (when 0 observations possible)

```
---

Your repo doesn't have enough Claude Code signal yet to diagnose
specifically. No `CLAUDE.md`, no `.claude/`, or both are too thin
to read. [Chapter 3: Teach Claude your project](https://cc-lab.ondrejsvec.com/en/teach-claude-your-project)
walks the first pass. Re-run after you've shipped one session of
work.
```

---

## What never appears in the output

- "Welcome!" / "Hello!" / "Let me take a look..."
- "Great question!" / "Solid setup!" / "Nice work overall!"
- "I noticed..." (use "I see" or just state the fact)
- "You should consider..." (replace with the artifact)
- "There are several things you could do..." (pick one and ship it)
- Numeric scores, percentages, letter grades, maturity levels
- Emoji as decoration (the H1 chapter heading uses none — neither
  does this output)
- Hashtags
- More than 5 observations (cut to the strongest 5)
- Generic closing pep-talk ("hope this helps!" / "happy hacking!")

---

## Czech variant

If the user's CLAUDE.md is predominantly Czech, or the user explicitly
asks for the diagnosis in Czech, the skill can output Czech text.
Apply `feedback_czech_peer_voice.md` rules:

- Reflexive passive over compound passive
- Informal prepositions in peer contexts
- No literal idiom translations
- Czech NBSP after single-character prepositions (`v`, `k`, `s`, `z`,
  `o`, `a`, `i`, `u`)

The Czech opening:

```
# cc-lab diagnostika — <repo-name> (<YYYY-MM-DD>)

Tři až pět pozorování z tvého `CLAUDE.md`, `.claude/` a posledních
commitů. Každé cituje soubor, ze kterého čte. Žádné z nich tvůj setup
neznámkuje, neřadí ani neoceňuje.
```

The Czech closing:

```
---

To je čtení. Žádné známky. Žádné rady bez konkrétního artefaktu.
Když jedno z pozorování sedne a dvě další ne, to je dobrý výsledek —
odkazy na kapitoly jsou tu, kdyby tě zajímala delší verze.
```

If the user's setup is bilingual (CS + EN), default to EN. The skill
is not a translator — it's a diagnostic. One language per run.

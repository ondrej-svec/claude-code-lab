# Copy-Editor Review — 2026-04-27 — Czech library pages

**Scope:**
- `content/cs/library/autonomous-loops.mdx`
- `content/cs/library/cc-lab-diagnose.mdx`
- `content/cs/library/context-engineering.mdx`

**Layer 1 (typography audit):** 140 fixes applied across two passes (139 from initial `--fix`, 1 from post-edit re-audit). 16 R2 quote findings remain — all are JSX `alt=`/`caption=` string delimiters and are false positives (Czech curly quotes inside the alt text are already correct). 1 R7 sentence-case-heading warning kept (`Ralph Wiggum smyčka` — proper-noun start).
**Layer 2 suggestions:** Pass A (4 grammar errors), Pass B (15 czenglish/idiom fixes), Pass C (6 voice/register fixes) — all applied with Ondrej's go-ahead.
**Human reviewer signoff:** _pending_

## Follow-up flagged (not copy-edit; needs separate decision)

The Czech library page describes the diagnose output as having four labels: `Title / Evidence / Why it matters / What to try`. The actual skill output (`plugins/cc-lab/skills/cc-lab-diagnose/output-template.md:221–235`) uses **five** labels: `Title (H2) / What I see / Confidence / Try this / Read more`. The Czech page's description is partly outdated relative to the real output. Translated the existing labels for Czech-surface fluency, but the structural mismatch is a content-accuracy issue separate from copy-edit and is worth a follow-up pass on `cc-lab-diagnose.mdx:73–80`.

---

## Layer 1 findings

| Rule | Count | Status |
|---|---|---|
| `cs-R1-nbsp-prep` | 81 | fixed |
| `cs-R1b-nbsp-conjunction` | 58 | fixed |
| `cs-R2-quotes` | 16 | not fixed (JSX delimiters — false positive) |
| `cs-R7-sentence-case-heading` | 1 | warning, kept (`Ralph Wiggum smyčka` — proper noun start) |

---

## Layer 2 suggestions

### A. Hard grammar errors (must fix)

| File:line | Original | Fix | Why |
|---|---|---|---|
| `cc-lab-diagnose.mdx:82` | `…ale neříká Claude, co dělat…` | `…ale neříká Claudovi, co dělat…` | Dative — `říkat někomu` |
| `context-engineering.mdx:24` | `…konverzace 30+ kol a drifftuje.` | `…konverzace 30+ kol a driftuje.` | Typo (double `f`) |
| `context-engineering.mdx:78` | `Opravoval jsi Claude čtyřikrát.` | `Opravoval jsi Clauda čtyřikrát.` | Akuzativ animátum — `opravovat někoho` |
| `context-engineering.mdx:110` | `…před clearem řekni Claude, ať stav vyplivne…` | `…před clearem řekni Claudovi, ať stav vyplivne…` | Dative — `říkat někomu` |

### B. Czenglish / literal English idiom translations

| File:line | Original | Fix | Why |
|---|---|---|---|
| `cc-lab-diagnose.mdx:38` | `Tahá tvůj osobní harness za svou váhu?` | `Vyplácí se tvůj osobní harness?` | „Pulls its weight" — vymyšlený český idiom |
| `autonomous-loops.mdx + cc-lab-diagnose.mdx + context-engineering.mdx` (8× across files) | `tahle entry`, `té entry`, `tahle entry je…` | `tahle stránka`, `tahle stať`, `tato položka` | „entry" skloňované jako české femininum — doesn't decline in Czech |
| `cc-lab-diagnose.mdx:13` | `tři až pět evidence-grounded pozorování` | `tři až pět pozorování opřených o důkazy` | English shorthand on visible surface |
| `cc-lab-diagnose.mdx:13` | `Nejblíž peer review, jak to jde bez plánování schůzky.` | `Nejbližší věc peer review, kterou si dáš bez plánování schůzky.` | Awkward calque |
| `cc-lab-diagnose.mdx:35` | `\| Mód \| Otázka… \| Read scope \|` | `\| Mód \| Otázka… \| Co čte \|` | Anglický header v české tabulce |
| `cc-lab-diagnose.mdx:53` | `headline (dvě až čtyři věty…)` | `titulek (dvě až čtyři věty…)` | „Headline" → „titulek" |
| `cc-lab-diagnose.mdx:54` | `uložený do tvojí current directory` | `uložený do tvého pracovního adresáře` | English shorthand |
| `cc-lab-diagnose.mdx:54` | `vykreslená jako self-contained stránka` | `vykreslená jako samostatná stránka` | English shorthand |
| `autonomous-loops.mdx:46` | `…vrať se buď k zelené, nebo k tractable handoffu.` | `…vrať se buď k zelené, nebo k handoffu, který půjde rozplést.` | „Tractable" — czenglish |
| `autonomous-loops.mdx:50` | `Geoff Huntley pojmenoval ten failure mode` | `Geoff Huntley pojmenoval ten typ selhání` | Repeated English shorthand |
| `autonomous-loops.mdx:57` | `agent bere každý sousední soubor jako fair game` | `agent bere každý sousední soubor jako legitimní cíl` | Anglický idiom doslovně |
| `autonomous-loops.mdx:64` | `iterace 2 „opraví" typecheck castem na any` | `iterace 2 „opraví" typecheck přetypováním na `any`` | „Cast" jako české substantivum |
| `autonomous-loops.mdx:107` | `Zákeřný failure mode` | `Zákeřný typ selhání` | Konzistence s úpravou výše |
| `autonomous-loops.mdx:117` | `Postav harness první; instaluj autonomii druhou.` | `Nejdřív postav harness; potom instaluj autonomii.` | Calque „first/second" |
| `context-engineering.mdx:64 (alt)` | `kde je shrnutí samo největším contributorem` | `kde shrnutí samo nejvíc přispívá ke kontextu` | „Contributor" skloňované |
| `context-engineering.mdx:68` | `**Pro tip:**` | `**Tip:**` | English idiom |
| `context-engineering.mdx:88` | `Cleared, začal jsi na čisto…` | `Vyčistil jsi to, začal na čisto…` | English participle jako úvod věty |

### C. Voice / register (peer voice doctrine)

| File:line | Issue | Suggested rewrite |
|---|---|---|
| `autonomous-loops.mdx:22` | `Claude má dovoleno se uvnitř agresivně rozjet.` — slovosled | `Claude se uvnitř může agresivně rozjet.` |
| `autonomous-loops.mdx:95` | `Co ve skutečnosti kupuje, když odejdeš` — implicitní podmět cryptic | `Co ti smyčka ve skutečnosti kupuje, když odejdeš` |
| `cc-lab-diagnose.mdx:78` | `přímá citace ze souboru ve tvém scope` | `přímá citace ze souboru, který diagnostika přečetla` (nebo `…ve tvém rozsahu`) |
| `cc-lab-diagnose.mdx:77–80` | English labels (`Title`, `Evidence`, `Why it matters`, `What to try`) jako bullet titles uprostřed české prózy | Pokud labely v reálném výstupu skillu jsou anglicky → ponechat (vědomé zarovnání s nástrojem). Pokud výstup skillu je česky → překlopit na `Titulek`, `Důkaz`, `Proč to platí`, `Co zkusit`. **Need your call.** |
| `cc-lab-diagnose.mdx:86` | `Pár explicitních non-goalů` | `Pár explicitních ne-cílů` (česky) — nebo přerámovat: `Pár věcí, které diagnostika záměrně nedělá` |
| `context-engineering.mdx:13` | `denní návyk — ten rozpočet aktivně řídit, ne čekat…` | `denní návyk: rozpočet aktivně řídit, nečekat…` (čistší rytmus) |
| `context-engineering.mdx:50` | `Implementační konverzace startuje…` | `Implementační konverzace začíná…` (anglicismus „startovat") |
| `context-engineering.mdx:102` | `drahé, ztratitelné při /clear` — `ztratitelné` je vzácné | `drahé, mizí s /clear` |

### D. Rhythm / spoken readability

Žádný problém — věty mají dobrou variabilitu délky a struktury. Ralph Wiggum smyčka, anti-vzor sekce a „junior, který nikdy nespí" čtou jako autentický peer voice.

### E. Cosmetic — soft calls

- `Pre-flight checklist` (autonomous-loops.mdx:68) — letecký termín, používá se i česky („pre-flight kontrola"). Ponechat?
- `Auto mode`, `harness`, `loop`, `failure mode`, `fan-out`, `drift hranic` — větinou ustálená dev-žargon. Ponechat.
- `non-goal` (cc-lab-diagnose.mdx:86) — viz výše, navrhuji přerámovat.

---

## Next safe move

Apply A (4 grammar errors) without further input — they are pure errors, not judgment calls.

Confirm B (czenglish batch) and C (voice batch) before applying — most are clear improvements but a few (English section labels in cc-lab-diagnose, „Pre-flight") are deliberate-or-not calls only Ondrej can make.

Skip D and most of E.

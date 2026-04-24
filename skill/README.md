# cc-lab companion skill

A Claude Code skill that walks you through the first four chapters of [claude-code-lab](https://github.com/ondrej-svec/claude-code-lab) interactively. Paired with the web guide at https://cc-lab.ondrejsvec.com, this skill turns Claude into your facilitator.

## Install

```bash
curl -fsSL https://raw.githubusercontent.com/ondrej-svec/claude-code-lab/main/skill/install.sh | bash
```

Or from a cloned repo:

```bash
git clone https://github.com/ondrej-svec/claude-code-lab.git
cd claude-code-lab
bash skill/install.sh
```

Both install into `~/.claude/skills/cc-lab/`.

## Use

In Claude Code, say:

- "walk me through the cc-lab"
- "help me prepare for the claude-code-lab workshop"
- "guide me through the first task"

Claude will load the skill and facilitate.

## Remove

```bash
rm -rf ~/.claude/skills/cc-lab
```

## What it does

Walks you through four chapters, one at a time, waiting between each:

1. **Before we start** — install, auth, permissions, privacy
2. **Your first task** — read → plan → change → review → iterate
3. **Teach Claude your project** — `/init` + `CLAUDE.md`
4. **Iteration and control** — rewind, scope narrowing, plan mode

Chapters 5–9 (ecosystem, compound engineering, next steps, reference, behind the scenes) are self-serve material — browse the web guide at your own pace.

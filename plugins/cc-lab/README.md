# cc-lab plugin

Companion skills for [cc-lab.ondrejsvec.com](https://cc-lab.ondrejsvec.com) —
the tools that pair with the lab's chapters.

## Install

In any Claude Code session:

```
/plugin marketplace add ondrej-svec/claude-code-lab
/plugin install cc-lab@cc-lab
```

The first line adds this repo as a marketplace. The second installs
the `cc-lab` plugin from it. Cross-platform — works the same on
macOS, Linux, and Windows.

To update later: `/plugin update cc-lab`. To remove:
`/plugin uninstall cc-lab`.

## Skills in this plugin

| Skill | What it does |
|---|---|
| [`cc-lab-diagnose`](skills/cc-lab-diagnose/) | Reads your repo and returns 3-5 evidence-grounded observations about your Claude Code setup, with copy-paste artifacts and chapter links. Activate with "diagnose my setup" or `/cc-lab-diagnose`. |

More skills land here as the lab evolves — Phase 4 of the mastery
evolution plan adds a freshness skill that watches Anthropic's
shipping cadence and proposes lab-shaped updates.

## Source + license

Source lives in this directory; same MIT license as the lab.

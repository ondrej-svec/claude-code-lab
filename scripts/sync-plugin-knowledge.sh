#!/usr/bin/env bash
# Sync chapter content + design system into plugins/cc-lab/knowledge/.
# Run after any chapter edit; commit alongside the chapter change.
#
# Usage: bash scripts/sync-plugin-knowledge.sh

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC_EN="$REPO_ROOT/content/en"
SRC_CS="$REPO_ROOT/content/cs"
SRC_DS="$REPO_ROOT/docs/cc-lab-design-system.md"

DEST_EN="$REPO_ROOT/plugins/cc-lab/knowledge/chapters/en"
DEST_CS="$REPO_ROOT/plugins/cc-lab/knowledge/chapters/cs"
DEST_DS="$REPO_ROOT/plugins/cc-lab/knowledge/cc-lab-design-system.md"

mkdir -p "$DEST_EN" "$DEST_CS"

echo "→ syncing chapter content into plugin knowledge dir"

# Copy with --update to skip if dest is newer; rsync would be cleaner but cp is portable
for f in "$SRC_EN"/*.mdx; do
  cp "$f" "$DEST_EN/"
done
for f in "$SRC_CS"/*.mdx; do
  cp "$f" "$DEST_CS/"
done
cp "$SRC_DS" "$DEST_DS"

# Show diff if we're in a git repo
if git -C "$REPO_ROOT" rev-parse --is-inside-work-tree > /dev/null 2>&1; then
  echo
  echo "→ git status of plugin knowledge dir:"
  git -C "$REPO_ROOT" status --short plugins/cc-lab/knowledge/ || true
fi

echo
echo "✓ synced. Don't forget to:"
echo "  1. Bump plugins/cc-lab/.claude-plugin/plugin.json version"
echo "  2. Bump .claude-plugin/marketplace.json version (match)"
echo "  3. Commit with 'sync(plugin): bump bundled knowledge to vN.N.N'"

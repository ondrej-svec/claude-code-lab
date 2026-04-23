#!/usr/bin/env bash
# capture-cli.sh — render ANSI fixture files to PNG via freeze.
#
# Each file in sessions/*.ansi is rendered to public/screenshots/<basename>.png
# using the shared freeze config. Deterministic, reproducible, idempotent.
#
# Usage:
#   ./scripts/capture/capture-cli.sh           # render all fixtures
#   ./scripts/capture/capture-cli.sh ch2-plan  # render one fixture by stem
#
# Requirements: freeze (https://github.com/charmbracelet/freeze)
#   brew install charmbracelet/tap/freeze

set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO="$(cd "$HERE/../.." && pwd)"
SESSIONS="$HERE/sessions"
OUT="$REPO/public/screenshots"
CONFIG="$HERE/freeze.json"

if ! command -v freeze >/dev/null 2>&1; then
  echo "ERROR: freeze not found. Install with: brew install charmbracelet/tap/freeze" >&2
  exit 1
fi

if [ ! -f "$CONFIG" ]; then
  echo "ERROR: freeze config not found at $CONFIG" >&2
  exit 1
fi

mkdir -p "$OUT"

filter="${1:-}"
shot_count=0

for fixture in "$SESSIONS"/*.ansi; do
  [ -e "$fixture" ] || { echo "No .ansi fixtures in $SESSIONS"; exit 0; }

  stem="$(basename "$fixture" .ansi)"
  if [ -n "$filter" ] && [ "$stem" != "$filter" ]; then
    continue
  fi

  target="$OUT/$stem.png"
  echo "→ $stem.ansi → $target"

  freeze \
    --config "$CONFIG" \
    --output "$target" \
    "$fixture"

  shot_count=$((shot_count + 1))
done

if [ "$shot_count" -eq 0 ] && [ -n "$filter" ]; then
  echo "ERROR: no fixture matched '$filter' in $SESSIONS" >&2
  exit 1
fi

echo "Done. Rendered $shot_count shot(s)."

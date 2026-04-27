#!/usr/bin/env bash
# Generate a conceptual diagram (boxes, arrows, flow) for a library
# entry via Codex GPT Image 2. No spaceship — these are diagrams, not
# heroes. v3 aesthetic: thin clean linework on dark navy, off-white
# lavender lines, color reserved for accents (rose/gold/teal).
#
# Usage:
#   gen-library-diagram.sh <output.png> <diagram-instruction>

set -euo pipefail

OUT="${1:?output path required}"
DIAGRAM="${2:?diagram instruction required}"

OUT_DIR="$(cd "$(dirname "$OUT")" 2>/dev/null && pwd || echo "$(pwd)")"
OUT_ABS="$OUT_DIR/$(basename "$OUT")"
mkdir -p "$OUT_DIR"

if ! command -v codex >/dev/null 2>&1; then
  echo "Error: codex CLI not found on PATH." >&2
  exit 1
fi

read -r -d '' STYLE <<'EOF' || true
You will generate one conceptual diagram for the Claude Code Lab library.

OUTPUT FORMAT: 1600x900 (16:9), thin clean line-art on a dark navy
field (#232136). Linework: thin off-white lavender (#e0def4). Color
is RESERVED for accent strokes/fills only — rose (#eb6f92), gold
(#f6c177), teal (#9ccfd8), iris (#c4a7e7), foam (#9ccfd8). Use color
sparingly — at most 2-3 accent colors per diagram, picking out the
single most important state or relationship.

LABELS: short, lowercase, technical. Use plain sans-serif (Manrope or
Inter). Labels are off-white-lavender (#e0def4); secondary labels
muted lavender (#908caa). Text size readable at 1200px display width.

NEGATIVES (hard constraints): NO cute, NO childish, NO comic-strip
panels, NO speech bubbles, NO neon, NO chrome, NO gradients, NO heavy
fills, NO shading, NO emojis. NO watermark. NO photographic elements.
NO 3D rendering. NO drop shadows except very subtle.

The aesthetic reference is a calm engineering blueprint — Hitchhiker
Guide to the Galaxy / Heart of Gold technical sketches. Information
density matters; whitespace is a tool, not the point.
EOF

INSTR="${STYLE}

DIAGRAM CONTENT:
${DIAGRAM}

EXECUTION INSTRUCTIONS for the imagegen skill:
1. Call the built-in image_gen tool with size 1600x900 and quality high.
2. After image_gen returns, copy the generated file to ${OUT_ABS} and
   print that absolute path as the final line of your output.
   Do not use any CLI fallback scripts; stay on the built-in path."

echo "Generating diagram via codex (gpt-image-2)..." >&2

codex exec \
  --skip-git-repo-check \
  --sandbox workspace-write \
  --full-auto \
  -C "$OUT_DIR" \
  "$INSTR" 2>/dev/null | tail -5

if [[ -f "$OUT_ABS" ]]; then
  echo "Image saved to: $OUT_ABS"
else
  echo "Error: expected image at $OUT_ABS but none was written." >&2
  exit 1
fi

#!/usr/bin/env bash
# Generate a chapter hero image via Codex GPT Image 2, using
# `public/hero.png` as the locked SHIP REFERENCE. Codex first views the
# reference into context, then runs image_gen in edit mode so the
# generated ship matches the canonical landing-page cruiser.
#
# Usage:
#   gen-chapter-hero.sh <chapter-slug> <output.png> <scene-text>

set -euo pipefail

SLUG="${1:?slug required}"
OUT="${2:?output path required}"
SCENE="${3:?scene text required}"

REF="/Users/ondrejsvec/projects/claude-code-lab/public/hero.png"
OUT_DIR="$(cd "$(dirname "$OUT")" 2>/dev/null && pwd || echo "$(pwd)")"
OUT_ABS="$OUT_DIR/$(basename "$OUT")"
mkdir -p "$OUT_DIR"

if ! command -v codex >/dev/null 2>&1; then
  echo "Error: codex CLI not found on PATH." >&2
  exit 1
fi

read -r -d '' BOILERPLATE <<'EOF' || true
You will generate one chapter hero image for the Claude Code Lab.

REFERENCE IMAGE: the spaceship in the reference image is the canonical
ship for this entire image set. The new image MUST show the SAME ship
— same long-narrow proportions, same hexagonal-rectangular cruiser
silhouette, same long pointed triangular nose wedge on the right,
same inset terminal panel with three mac-style dots and progress
bars, same hexagonal porthole and circular sensor, same slim antenna
with a small ball at the tip, same multiple structural panel lines
on the hull. The ship is engineered, technical, hi-tech, calm — a
Hitchhiker-Guide-to-the-Galaxy / Heart-of-Gold sci-fi cruiser
blueprint. NEVER cute, NEVER anthropomorphic, NEVER face-like. Match
the reference ship faithfully — proportions, sections, detail.

OUTPUT FORMAT: 1600x800 (2:1 wide horizontal), thin clean line-art
on a dark navy field (#232136). Linework: thin off-white lavender
(#e0def4). Color is RESERVED for terminal screen elements (the three
dots — red #eb6f92, yellow #f6c177, blue-teal #9ccfd8 — and two
progress bars: upper rose #eb6f92, lower teal #9ccfd8), engine glow
when present, and small chapter-specific accent points only. Hull,
antenna, satellites, rings, scene props, gantries, planet curves:
all pure off-white-lavender linework.

NEGATIVES (hard constraints): NO cute, NO childish, NO
anthropomorphic, NO face-like proportions. NO domestic props (coffee
mugs, plates, cushions, toys, plants, kitchenware). NO comic-strip
panel borders. NO speech bubbles. NO heavy dotted trajectories. NO
connecting-line constellations. NO neon, NO chrome, NO gradients,
NO fills, NO shading, NO wobble. NO watermark. NO text outside the
terminal screen and small chapter-specific markers.

EOF

INSTR="${BOILERPLATE}
${SCENE}

EXECUTION INSTRUCTIONS for the imagegen skill:
1. First, use the view_image tool to load the reference image at
   ${REF} into context so its ship can be matched faithfully.
2. Then call the built-in image_gen tool in EDIT mode against that
   reference image, producing a new image that keeps the ship and
   style identical while replacing the scene around it with the
   chapter scene described above. Treat the reference as a
   STYLE/SUBJECT reference for the ship; the rest of the scene is
   new content as described.
3. Use size 1600x800 and quality high.
4. After image_gen returns, copy the generated file to ${OUT_ABS}
   and print that absolute path as the final line of your output.
   Do not use any CLI fallback scripts; stay on the built-in path."

echo "Generating Ch via codex (gpt-image-2, ref-locked)..." >&2

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

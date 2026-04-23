#!/usr/bin/env bash
# capture-web.sh — run the Playwright web-capture script.
# Requires `pnpm dev` running in a separate terminal (or override CAPTURE_BASE_URL).
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO="$(cd "$HERE/../.." && pwd)"

cd "$REPO"

if ! command -v pnpm >/dev/null 2>&1; then
  echo "ERROR: pnpm not found." >&2
  exit 1
fi

BASE_URL="${CAPTURE_BASE_URL:-http://localhost:3000}"
if ! curl --silent --head --max-time 3 "$BASE_URL" >/dev/null; then
  echo "ERROR: dev server not reachable at $BASE_URL" >&2
  echo "       Run 'pnpm dev' in a separate terminal first." >&2
  exit 1
fi

exec pnpm exec tsx "$HERE/capture-web.ts" "$@"

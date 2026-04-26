#!/usr/bin/env bash
# Legacy shell installer for cc-lab-diagnose.
#
# The preferred install path is the cc-lab plugin marketplace
# (`/plugin marketplace add ondrej-svec/claude-code-lab` then
# `/plugin install cc-lab@cc-lab` from any Claude Code session). This
# script is a fallback for macOS / Linux users who'd rather not use
# the marketplace. Windows users should use the plugin marketplace.
#
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/ondrej-svec/claude-code-lab/main/plugins/cc-lab/skills/cc-lab-diagnose/install.sh | bash
# or (from a clone):
#   bash plugins/cc-lab/skills/cc-lab-diagnose/install.sh

set -euo pipefail

SKILL_NAME="cc-lab-diagnose"
SKILL_DIR="${HOME}/.claude/skills/${SKILL_NAME}"
REPO_URL="https://github.com/ondrej-svec/claude-code-lab.git"
TMPDIR="$(mktemp -d)"
trap 'rm -rf "${TMPDIR}"' EXIT

echo "→ installing ${SKILL_NAME} into ${SKILL_DIR}"

if [ -d "${SKILL_DIR}" ]; then
  echo "  ${SKILL_DIR} already exists — updating"
else
  mkdir -p "$(dirname "${SKILL_DIR}")"
fi

if [ -f "$(dirname "$0")/SKILL.md" ]; then
  SRC="$(dirname "$0")"
else
  echo "  cloning ${REPO_URL}"
  git clone --depth 1 --filter=blob:none --sparse "${REPO_URL}" "${TMPDIR}/repo" > /dev/null 2>&1
  (cd "${TMPDIR}/repo" && git sparse-checkout set "plugins/cc-lab/skills/${SKILL_NAME}" > /dev/null 2>&1)
  SRC="${TMPDIR}/repo/plugins/cc-lab/skills/${SKILL_NAME}"
fi

rm -rf "${SKILL_DIR}"
mkdir -p "${SKILL_DIR}"
cp -r "${SRC}/." "${SKILL_DIR}/"
rm -f "${SKILL_DIR}/install.sh"

echo "✓ installed to ${SKILL_DIR}"
echo ""
echo "  To use: open Claude Code in any repo and say 'diagnose my setup'"
echo "          or invoke /cc-lab-diagnose directly"
echo "  To update: re-run this script"
echo "  To remove: rm -rf ${SKILL_DIR}"

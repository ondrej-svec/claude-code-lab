#!/usr/bin/env bash
# Install the cc-lab companion skill into ~/.claude/skills/cc-lab
#
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/ondrej-svec/claude-code-lab/main/skill/install.sh | bash
# or (from the repo):
#   bash skill/install.sh

set -euo pipefail

SKILL_NAME="cc-lab"
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

# If this script is being run from inside the repo, use local files.
# Otherwise clone.
if [ -f "$(dirname "$0")/SKILL.md" ]; then
  SRC="$(dirname "$0")"
else
  echo "  cloning ${REPO_URL}"
  git clone --depth 1 --filter=blob:none --sparse "${REPO_URL}" "${TMPDIR}/repo" > /dev/null 2>&1
  (cd "${TMPDIR}/repo" && git sparse-checkout set skill > /dev/null 2>&1)
  SRC="${TMPDIR}/repo/skill"
fi

rm -rf "${SKILL_DIR}"
mkdir -p "${SKILL_DIR}"
cp -r "${SRC}/." "${SKILL_DIR}/"
# Don't install the installer itself.
rm -f "${SKILL_DIR}/install.sh"

echo "✓ installed to ${SKILL_DIR}"
echo ""
echo "  To use: open Claude Code and say 'walk me through the cc-lab'"
echo "  To update: re-run this script"
echo "  To remove: rm -rf ${SKILL_DIR}"

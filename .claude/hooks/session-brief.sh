#!/usr/bin/env bash
# SessionStart: one line of orientation. Exits 0 on any internal failure.
set -uo pipefail

root="${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null)}"
[[ -d "${root:-}" ]] || exit 0
cd "$root" || exit 0

# 2026-09-13 23:59 MYT, the prototype submission. Hardcoded: `date -d` is GNU-only and fails on macOS.
left=$(( (1789315140 - $(date +%s)) / 86400 ))
branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo '?')
dirty=$(git status --porcelain 2>/dev/null | wc -l | tr -d ' ')

echo "CodeNection 2026 | branch=$branch | uncommitted=$dirty | ${left}d to prototype submission"
echo "TODOs live in GitHub Issues (gh issue list). Rules and judging: docs/brief.md."
echo "Ideation happens on the 'research' branch and feeds docs/PRODUCT.md. See README.md."

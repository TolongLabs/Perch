#!/usr/bin/env bash
# SessionStart: orientation, unfiled dumps, and which graded folders hold no
# evidence yet. Exits 0 on any internal failure, so a broken guard never wedges
# a session.
set -uo pipefail

root="${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null)}"
[[ -d "${root:-}" ]] || exit 0
cd "$root" || exit 0

# 2026-09-13 23:59 MYT, the prototype submission. Hardcoded: `date -d` is GNU-only and fails on macOS.
left=$(( (1789315140 - $(date +%s)) / 86400 ))
branch=$(git branch --show-current 2>/dev/null); branch=${branch:-?}
dirty=$(git status --porcelain 2>/dev/null | wc -l | tr -d ' ')

echo "CodeNection research notebook | branch=$branch | unsaved=$dirty | ${left}d to submission"

# READMEs, templates and .gitkeep are scaffolding, not evidence.
real() { find "$1" -type f ! -name '.gitkeep' ! -name 'README.md' ! -name '_template.md' 2>/dev/null | wc -l; }

# A dump with no "Filed:" line has been captured but never routed anywhere.
unfiled=$(grep -rLl '^\*\*Filed:\*\*' docs/inbox/*.md 2>/dev/null | grep -v 'README.md' | wc -l | tr -d ' ')
[[ "${unfiled:-0}" -gt 0 ]] && echo "$unfiled dump(s) in docs/inbox/ not filed yet. Run /tidy."

empty=()
[[ $(real docs/ideas) -eq 0 ]] && empty+=("ideas/ (3%)")
[[ $(real docs/mentors/sessions) -eq 0 ]] && empty+=("mentors/ (7%)")
[[ $(real docs/users/interviews) -eq 0 ]] && empty+=("users/ (Impact, 20%)")
[[ $(real docs/diagrams/exports) -eq 0 ]] && empty+=("diagrams/ (8%)")

[[ ${#empty[@]} -gt 0 ]] && echo "No evidence yet in: ${empty[*]}"

echo "Dump anything with /dump. Sweep with /tidy. Draw with /mindmap."
echo "Rules and rubric: docs/brief.md. How this branch works: docs/README.md."
exit 0

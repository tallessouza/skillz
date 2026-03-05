#!/bin/bash
#
# Batch skill extraction using claude -p
#
# Usage:
#   ./batch-extract.sh                    # Process all pending
#   ./batch-extract.sh --course clean-code # Process single course
#   ./batch-extract.sh --dry-run          # Show what would be processed
#   ./batch-extract.sh --parallel 5       # Run 5 concurrent extractions
#

set -euo pipefail

# Required when running from within Claude Code session
unset CLAUDECODE 2>/dev/null || true

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CATALOG="$SCRIPT_DIR/catalog.json"
PROMPT_FILE="$SCRIPT_DIR/extraction-prompt.md"
SKILLS_DIR="$SCRIPT_DIR/skills-output"
LOG_DIR="$SCRIPT_DIR/logs"
PROGRESS_FILE="$SCRIPT_DIR/progress.json"

# Defaults
PARALLEL=3
DRY_RUN=false
COURSE_FILTER=""
MAX_BUDGET_PER_LESSON="0.05"

# Parse args
while [[ $# -gt 0 ]]; do
    case $1 in
        --course) COURSE_FILTER="$2"; shift 2 ;;
        --dry-run) DRY_RUN=true; shift ;;
        --parallel) PARALLEL="$2"; shift 2 ;;
        --budget) MAX_BUDGET_PER_LESSON="$2"; shift 2 ;;
        *) echo "Unknown: $1"; exit 1 ;;
    esac
done

# Ensure catalog exists
if [ ! -f "$CATALOG" ]; then
    echo "Building catalog..."
    python3 "$SCRIPT_DIR/build-catalog.py"
fi

# Create dirs
mkdir -p "$SKILLS_DIR" "$LOG_DIR"

# Init progress if needed
if [ ! -f "$PROGRESS_FILE" ]; then
    echo '{}' > "$PROGRESS_FILE"
fi

# Count total
TOTAL=$(python3 -c "
import json, sys
catalog = json.load(open('$CATALOG'))
if '$COURSE_FILTER':
    catalog = [l for l in catalog if l['course'] == '$COURSE_FILTER']
print(len(catalog))
")

echo "=== Rocketseat Skill Extraction Pipeline ==="
echo "Total lessons: $TOTAL"
echo "Parallel: $PARALLEL"
echo "Output: $SKILLS_DIR"
echo "Budget per lesson: \$$MAX_BUDGET_PER_LESSON"
echo ""

if [ "$DRY_RUN" = true ]; then
    echo "[DRY RUN] Would process $TOTAL lessons"
    python3 -c "
import json
catalog = json.load(open('$CATALOG'))
if '$COURSE_FILTER':
    catalog = [l for l in catalog if l['course'] == '$COURSE_FILTER']
courses = {}
for l in catalog:
    courses.setdefault(l['course'], 0)
    courses[l['course']] += 1
for c, n in sorted(courses.items()):
    print(f'  {c}: {n} lessons')
"
    exit 0
fi

# Extract single lesson function
extract_lesson() {
    local INDEX="$1"
    local LESSON_JSON="$2"

    local COURSE=$(echo "$LESSON_JSON" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d['course'])")
    local MODULE_TITLE=$(echo "$LESSON_JSON" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d['module_title'])")
    local LESSON_TITLE=$(echo "$LESSON_JSON" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d['lesson_title'])")
    local LESSON_SLUG=$(echo "$LESSON_JSON" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d['lesson_slug'])")
    local LESSON_DESC=$(echo "$LESSON_JSON" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('lesson_description') or 'N/A')")
    local TRANSCRIPT_FILE=$(echo "$LESSON_JSON" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d['transcript_file'])")
    local SKILL_SLUG=$(echo "$LESSON_JSON" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d['skill_slug'])")

    local SKILL_DIR="$SKILLS_DIR/$SKILL_SLUG"
    local SKILL_FILE="$SKILL_DIR/SKILL.md"
    local LOG_FILE="$LOG_DIR/${SKILL_SLUG}.log"

    # Skip if already extracted
    if [ -f "$SKILL_FILE" ]; then
        echo "[$INDEX/$TOTAL] SKIP $SKILL_SLUG (already exists)"
        return 0
    fi

    mkdir -p "$SKILL_DIR"

    echo "[$INDEX/$TOTAL] Extracting: $COURSE / $LESSON_TITLE"

    # Build the prompt with metadata
    local USER_PROMPT="COURSE: $COURSE
MODULE: $MODULE_TITLE
LESSON_TITLE: $LESSON_TITLE
LESSON_SLUG: $LESSON_SLUG
LESSON_DESCRIPTION: $LESSON_DESC

TRANSCRIPT:
$(cat "$TRANSCRIPT_FILE")

---
Extract the skill now. Output ONLY the SKILL.md content starting with ---."

    # Call claude -p
    local START_TIME=$(date +%s)

    if echo "$USER_PROMPT" | claude -p \
        --append-system-prompt-file "$PROMPT_FILE" \
        --dangerously-skip-permissions \
        --max-turns 1 \
        --output-format text \
        > "$SKILL_FILE" 2>"$LOG_FILE"; then

        local END_TIME=$(date +%s)
        local DURATION=$((END_TIME - START_TIME))

        # Validate output has frontmatter
        if head -1 "$SKILL_FILE" | grep -q "^---"; then
            echo "[$INDEX/$TOTAL] OK $SKILL_SLUG (${DURATION}s)"
            # Update progress
            python3 -c "
import json
p = json.load(open('$PROGRESS_FILE'))
p['$SKILL_SLUG'] = {'status': 'ok', 'duration': $DURATION}
json.dump(p, open('$PROGRESS_FILE', 'w'))
"
        else
            echo "[$INDEX/$TOTAL] WARN $SKILL_SLUG - no frontmatter, check log"
            mv "$SKILL_FILE" "${SKILL_FILE}.bad"
        fi
    else
        echo "[$INDEX/$TOTAL] FAIL $SKILL_SLUG - see $LOG_FILE"
        rm -f "$SKILL_FILE"
    fi
}

export -f extract_lesson
export TOTAL SKILLS_DIR LOG_DIR PROGRESS_FILE PROMPT_FILE

# Process lessons with GNU parallel or sequential fallback
if command -v parallel &>/dev/null && [ "$PARALLEL" -gt 1 ]; then
    echo "Using GNU parallel ($PARALLEL workers)..."
    python3 -c "
import json
catalog = json.load(open('$CATALOG'))
if '$COURSE_FILTER':
    catalog = [l for l in catalog if l['course'] == '$COURSE_FILTER']
for i, lesson in enumerate(catalog, 1):
    print(json.dumps({'index': i, 'lesson': lesson}))
" | parallel --jobs "$PARALLEL" --line-buffer '
    INDEX=$(echo {} | python3 -c "import json,sys; print(json.load(sys.stdin)[\"index\"])")
    LESSON=$(echo {} | python3 -c "import json,sys; print(json.dumps(json.load(sys.stdin)[\"lesson\"]))")
    extract_lesson "$INDEX" "$LESSON"
'
else
    echo "Running sequentially..."
    python3 -c "
import json
catalog = json.load(open('$CATALOG'))
if '$COURSE_FILTER':
    catalog = [l for l in catalog if l['course'] == '$COURSE_FILTER']
for i, lesson in enumerate(catalog, 1):
    print(f'{i}|||{json.dumps(lesson)}')
" | while IFS='|||' read -r INDEX LESSON_JSON; do
        extract_lesson "$INDEX" "$LESSON_JSON"
    done
fi

# Summary
echo ""
echo "=== Extraction Complete ==="
DONE=$(python3 -c "
import json
p = json.load(open('$PROGRESS_FILE'))
ok = sum(1 for v in p.values() if v.get('status') == 'ok')
print(ok)
")
echo "Extracted: $DONE / $TOTAL"
echo "Output: $SKILLS_DIR/"

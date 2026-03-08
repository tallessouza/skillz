#!/bin/bash
# validate-skills.sh — Validates skill refs against extraction-prompt.md quality gates
# Usage: ./scripts/validate-skills.sh [router-name] [--fix-report]
# Example: ./scripts/validate-skills.sh rs-full-stack
#          ./scripts/validate-skills.sh              (all routers)

set -euo pipefail

SKILLS_DIR="/home/talle/projects/development/skillz/.claude/skills"
ROUTER_FILTER="${1:-all}"
REPORT_FILE="/home/talle/projects/development/skillz/scripts/validation-report.md"

# Colors
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m'

# Counters
TOTAL=0
PASS=0
FAIL=0
WARN=0

declare -A ROUTER_PASS
declare -A ROUTER_FAIL
declare -A ROUTER_WARN
declare -A ROUTER_TOTAL
declare -A GATE_FAIL_COUNT

GATES=(
  "G01_frontmatter_exists"
  "G02_name_field"
  "G03_name_kebab_case"
  "G04_name_max_64"
  "G05_description_exists"
  "G06_description_length"
  "G07_description_3rd_person"
  "G08_description_make_sure"
  "G09_description_not_for"
  "G10_description_single_line"
  "G11_description_no_angle_brackets"
  "G12_metadata_block"
  "G13_metadata_author"
  "G14_metadata_version"
  "G15_metadata_course"
  "G16_metadata_tags"
  "G17_body_under_300_lines"
  "G18_body_has_code_example"
  "G19_troubleshooting_section"
  "G20_deep_reference_library"
  "G21_no_fluff"
  "G22_has_rules_section"
)

for gate in "${GATES[@]}"; do
  GATE_FAIL_COUNT[$gate]=0
done

# Collect all failures for report
FAILURES_LOG=""

validate_file() {
  local file="$1"
  local router="$2"
  local filename=$(basename "$file")
  local file_issues=""
  local file_pass=true
  local file_warnings=0

  TOTAL=$((TOTAL + 1))
  ROUTER_TOTAL[$router]=$(( ${ROUTER_TOTAL[$router]:-0} + 1 ))

  local content
  content=$(cat "$file")
  local line_count
  line_count=$(wc -l < "$file")

  # === FRONTMATTER GATES ===

  # G01: Has frontmatter delimiters (---)
  if ! echo "$content" | head -1 | grep -q '^---$'; then
    file_issues+="  FAIL G01: Missing frontmatter (no --- on line 1)\n"
    file_pass=false
    GATE_FAIL_COUNT[G01_frontmatter_exists]=$(( ${GATE_FAIL_COUNT[G01_frontmatter_exists]} + 1 ))
  fi

  # Extract frontmatter (between first and second ---)
  local frontmatter=""
  if echo "$content" | head -1 | grep -q '^---$'; then
    frontmatter=$(echo "$content" | sed -n '2,/^---$/p' | sed '$d')
  fi

  # G02: Has name field
  if ! echo "$frontmatter" | grep -q '^name:'; then
    file_issues+="  FAIL G02: Missing 'name:' in frontmatter\n"
    file_pass=false
    GATE_FAIL_COUNT[G02_name_field]=$(( ${GATE_FAIL_COUNT[G02_name_field]} + 1 ))
  else
    local name_val
    name_val=$(echo "$frontmatter" | grep '^name:' | head -1 | sed 's/^name: *//')

    # G03: name is kebab-case
    if echo "$name_val" | grep -qP '[A-Z_ ]'; then
      file_issues+="  FAIL G03: Name not kebab-case: $name_val\n"
      file_pass=false
      GATE_FAIL_COUNT[G03_name_kebab_case]=$(( ${GATE_FAIL_COUNT[G03_name_kebab_case]} + 1 ))
    fi

    # G04: name max 64 chars
    if [ ${#name_val} -gt 64 ]; then
      file_issues+="  FAIL G04: Name exceeds 64 chars (${#name_val}): $name_val\n"
      file_pass=false
      GATE_FAIL_COUNT[G04_name_max_64]=$(( ${GATE_FAIL_COUNT[G04_name_max_64]} + 1 ))
    fi
  fi

  # G05: Has description field
  if ! echo "$frontmatter" | grep -q '^description:'; then
    file_issues+="  FAIL G05: Missing 'description:' in frontmatter\n"
    file_pass=false
    GATE_FAIL_COUNT[G05_description_exists]=$(( ${GATE_FAIL_COUNT[G05_description_exists]} + 1 ))
  else
    # Extract description value (handle quoted multi-line)
    local desc_val
    desc_val=$(echo "$frontmatter" | grep '^description:' | head -1 | sed 's/^description: *"*//' | sed 's/"*$//')
    local desc_len=${#desc_val}

    # G06: description 200-1024 chars
    if [ $desc_len -lt 200 ]; then
      file_issues+="  FAIL G06: Description too short ($desc_len chars, min 200)\n"
      file_pass=false
      GATE_FAIL_COUNT[G06_description_length]=$(( ${GATE_FAIL_COUNT[G06_description_length]} + 1 ))
    elif [ $desc_len -gt 1024 ]; then
      file_issues+="  WARN G06: Description too long ($desc_len chars, max 1024)\n"
      file_warnings=$((file_warnings + 1))
    fi

    # G07: 3rd person verb
    if ! echo "$desc_val" | grep -qiP '^(Enforces|Applies|Follows|Maintains|Ensures|Guards|Analyzes|Generates|Orchestrates|Implements|Configures|Creates|Validates|Manages|Builds|Sets|Establishes|Structures|Transforms|Defines|Handles|Integrates|Deploys|Provisions|Instruments|Monitors|Secures|Optimizes|Designs|Extracts|Formats|Initializes|Launches|Maps|Navigates|Processes|Resolves|Routes|Schedules|Serves|Tests|Wraps|Adapts|Automates|Bundles|Chains|Compiles|Connects|Controls|Converts|Coordinates|Demonstrates|Documents|Enables|Executes|Exports|Extends|Fetches|Filters|Guards|Illustrates|Injects|Inspects|Introduces|Invokes|Isolates|Iterates|Limits|Links|Loads|Locks|Merges|Migrates|Mocks|Normalizes|Opens|Organizes|Outlines|Overrides|Packages|Parses|Patches|Persists|Pipelines|Plugs|Polls|Populates|Prepares|Prevents|Propagates|Protects|Provides|Publishes|Queries|Reads|Refactors|Registers|Renders|Replaces|Replicates|Reports|Requires|Restricts|Retrieves|Runs|Sanitizes|Scaffolds|Scans|Seeds|Selects|Sends|Separates|Serializes|Shows|Signs|Simplifies|Sorts|Spawns|Specifies|Splits|Starts|Stores|Streams|Subscribes|Supplies|Supports|Switches|Syncs|Tags|Teaches|Throttles|Toggles|Traces|Tracks|Translates|Triggers|Trims|Types|Unpacks|Updates|Upgrades|Uploads|Uses|Utilizes|Verifies|Wires|Yields)' ; then
      file_issues+="  FAIL G07: Description doesn't start with 3rd person verb\n"
      file_pass=false
      GATE_FAIL_COUNT[G07_description_3rd_person]=$(( ${GATE_FAIL_COUNT[G07_description_3rd_person]} + 1 ))
    fi

    # G08: "Make sure to use" clause
    if ! echo "$desc_val" | grep -qi 'make sure to use'; then
      file_issues+="  FAIL G08: Missing 'Make sure to use' clause\n"
      file_pass=false
      GATE_FAIL_COUNT[G08_description_make_sure]=$(( ${GATE_FAIL_COUNT[G08_description_make_sure]} + 1 ))
    fi

    # G09: "Not for" boundary
    if ! echo "$desc_val" | grep -qi 'not for'; then
      file_issues+="  FAIL G09: Missing 'Not for' boundary\n"
      file_pass=false
      GATE_FAIL_COUNT[G09_description_not_for]=$(( ${GATE_FAIL_COUNT[G09_description_not_for]} + 1 ))
    fi

    # G10: Single line (no newline in description value)
    local desc_line_count
    desc_line_count=$(echo "$frontmatter" | grep -c '^description:')
    # Check if description spans multiple lines (indicated by | or > or continuation)
    if echo "$frontmatter" | grep -q '^description: *[|>]'; then
      file_issues+="  FAIL G10: Multi-line description (causes silent ignore)\n"
      file_pass=false
      GATE_FAIL_COUNT[G10_description_single_line]=$(( ${GATE_FAIL_COUNT[G10_description_single_line]} + 1 ))
    fi

    # G11: No angle brackets
    if echo "$desc_val" | grep -q '[<>]'; then
      file_issues+="  FAIL G11: Description contains angle brackets (XML injection risk)\n"
      file_pass=false
      GATE_FAIL_COUNT[G11_description_no_angle_brackets]=$(( ${GATE_FAIL_COUNT[G11_description_no_angle_brackets]} + 1 ))
    fi
  fi

  # === METADATA GATES ===

  # G12: Has metadata block
  if ! echo "$frontmatter" | grep -q '^metadata:'; then
    file_issues+="  FAIL G12: Missing 'metadata:' block\n"
    file_pass=false
    GATE_FAIL_COUNT[G12_metadata_block]=$(( ${GATE_FAIL_COUNT[G12_metadata_block]} + 1 ))
  else
    # G13: metadata.author
    if ! echo "$frontmatter" | grep -q '  author:'; then
      file_issues+="  FAIL G13: Missing metadata.author\n"
      file_pass=false
      GATE_FAIL_COUNT[G13_metadata_author]=$(( ${GATE_FAIL_COUNT[G13_metadata_author]} + 1 ))
    fi
    # G14: metadata.version
    if ! echo "$frontmatter" | grep -q '  version:'; then
      file_issues+="  FAIL G14: Missing metadata.version\n"
      file_pass=false
      GATE_FAIL_COUNT[G14_metadata_version]=$(( ${GATE_FAIL_COUNT[G14_metadata_version]} + 1 ))
    fi
    # G15: metadata.course
    if ! echo "$frontmatter" | grep -q '  course:'; then
      file_issues+="  FAIL G15: Missing metadata.course\n"
      file_pass=false
      GATE_FAIL_COUNT[G15_metadata_course]=$(( ${GATE_FAIL_COUNT[G15_metadata_course]} + 1 ))
    fi
    # G16: metadata.tags
    if ! echo "$frontmatter" | grep -q '  tags:'; then
      file_issues+="  FAIL G16: Missing metadata.tags\n"
      file_pass=false
      GATE_FAIL_COUNT[G16_metadata_tags]=$(( ${GATE_FAIL_COUNT[G16_metadata_tags]} + 1 ))
    fi
  fi

  # === BODY GATES ===

  # G17: Under 300 lines
  if [ "$line_count" -gt 300 ]; then
    file_issues+="  WARN G17: Over 300 lines ($line_count lines)\n"
    file_warnings=$((file_warnings + 1))
  fi

  # G18: Has code example
  if ! grep -q 'BACKTICK_TRIPLE' <(sed 's/```/BACKTICK_TRIPLE/g' "$file"); then
    file_issues+="  FAIL G18: No code examples found\n"
    file_pass=false
    GATE_FAIL_COUNT[G18_body_has_code_example]=$(( ${GATE_FAIL_COUNT[G18_body_has_code_example]} + 1 ))
  fi

  # G19: Troubleshooting section
  if ! grep -qi '## Troubleshooting\|## troubleshooting' "$file"; then
    file_issues+="  FAIL G19: Missing ## Troubleshooting section\n"
    file_pass=false
    GATE_FAIL_COUNT[G19_troubleshooting_section]=$(( ${GATE_FAIL_COUNT[G19_troubleshooting_section]} + 1 ))
  fi

  # G20: Deep reference library
  if ! grep -qi 'deep reference library\|deep-explanation\|code-examples' "$file"; then
    file_issues+="  FAIL G20: Missing Deep reference library section\n"
    file_pass=false
    GATE_FAIL_COUNT[G20_deep_reference_library]=$(( ${GATE_FAIL_COUNT[G20_deep_reference_library]} + 1 ))
  fi

  # G21: No fluff ("nesta aula", "vamos aprender")
  if grep -qi 'nesta aula\|vamos aprender\|nessa aula\|nesta licao' "$file"; then
    file_issues+="  FAIL G21: Contains fluff ('nesta aula'/'vamos aprender')\n"
    file_pass=false
    GATE_FAIL_COUNT[G21_no_fluff]=$(( ${GATE_FAIL_COUNT[G21_no_fluff]} + 1 ))
  fi

  # G22: Has ## Rules or ## Steps or ## Key concept section
  if ! grep -qP '^## (Rules|Steps|Key concept|Prerequisites)' "$file"; then
    file_issues+="  FAIL G22: Missing main content section (## Rules / ## Steps / ## Key concept)\n"
    file_pass=false
    GATE_FAIL_COUNT[G22_has_rules_section]=$(( ${GATE_FAIL_COUNT[G22_has_rules_section]} + 1 ))
  fi

  # Report
  if [ "$file_pass" = true ] && [ $file_warnings -eq 0 ]; then
    PASS=$((PASS + 1))
    ROUTER_PASS[$router]=$(( ${ROUTER_PASS[$router]:-0} + 1 ))
  elif [ "$file_pass" = true ]; then
    WARN=$((WARN + 1))
    ROUTER_WARN[$router]=$(( ${ROUTER_WARN[$router]:-0} + 1 ))
    FAILURES_LOG+="WARN $router/$filename\n$file_issues\n"
  else
    FAIL=$((FAIL + 1))
    ROUTER_FAIL[$router]=$(( ${ROUTER_FAIL[$router]:-0} + 1 ))
    FAILURES_LOG+="FAIL $router/$filename\n$file_issues\n"
  fi
}

# Main
echo -e "${CYAN}=== Skill Quality Gate Validator ===${NC}"
echo -e "${CYAN}Based on extraction-prompt.md (22 gates)${NC}"
echo ""

ROUTERS=()
if [ "$ROUTER_FILTER" = "all" ]; then
  for d in "$SKILLS_DIR"/rs-*/; do
    ROUTERS+=($(basename "$d"))
  done
else
  ROUTERS=("$ROUTER_FILTER")
fi

for router in "${ROUTERS[@]}"; do
  ref_dir="$SKILLS_DIR/$router/references"
  if [ ! -d "$ref_dir" ]; then
    echo -e "${YELLOW}SKIP: $router (no references/)${NC}"
    continue
  fi

  file_count=$(ls -1 "$ref_dir"/*.md 2>/dev/null | wc -l)
  echo -e "${CYAN}Validating $router ($file_count files)...${NC}"

  for file in "$ref_dir"/*.md; do
    [ -f "$file" ] || continue
    validate_file "$file" "$router"
  done
done

# Summary
echo ""
echo -e "${CYAN}════════════════════════════════════════════════${NC}"
echo -e "${CYAN}               VALIDATION SUMMARY               ${NC}"
echo -e "${CYAN}════════════════════════════════════════════════${NC}"
echo ""

printf "%-20s %6s %6s %6s %6s %6s\n" "Router" "Total" "Pass" "Warn" "Fail" "Rate"
printf "%-20s %6s %6s %6s %6s %6s\n" "────────────────────" "──────" "──────" "──────" "──────" "──────"

for router in "${ROUTERS[@]}"; do
  t=${ROUTER_TOTAL[$router]:-0}
  p=${ROUTER_PASS[$router]:-0}
  w=${ROUTER_WARN[$router]:-0}
  f=${ROUTER_FAIL[$router]:-0}
  if [ $t -gt 0 ]; then
    rate=$(( (p * 100) / t ))
  else
    rate=0
  fi

  if [ $f -eq 0 ]; then
    color=$GREEN
  elif [ $rate -ge 50 ]; then
    color=$YELLOW
  else
    color=$RED
  fi

  printf "${color}%-20s %6d %6d %6d %6d %5d%%${NC}\n" "$router" "$t" "$p" "$w" "$f" "$rate"
done

echo ""
printf "%-20s %6d %6d %6d %6d\n" "TOTAL" "$TOTAL" "$PASS" "$WARN" "$FAIL"
echo ""

# Gate breakdown
echo -e "${CYAN}═══ GATE FAILURE BREAKDOWN ═══${NC}"
echo ""
printf "%-40s %6s\n" "Gate" "Fails"
printf "%-40s %6s\n" "────────────────────────────────────────" "──────"

for gate in "${GATES[@]}"; do
  count=${GATE_FAIL_COUNT[$gate]}
  if [ $count -gt 0 ]; then
    printf "${RED}%-40s %6d${NC}\n" "$gate" "$count"
  else
    printf "${GREEN}%-40s %6d${NC}\n" "$gate" "$count"
  fi
done

# Write report
echo ""
echo -e "${CYAN}Writing detailed report to: $REPORT_FILE${NC}"

{
  echo "# Skill Validation Report"
  echo ""
  echo "Generated: $(date -Iseconds)"
  echo ""
  echo "## Summary"
  echo ""
  echo "| Router | Total | Pass | Warn | Fail | Rate |"
  echo "|--------|-------|------|------|------|------|"
  for router in "${ROUTERS[@]}"; do
    t=${ROUTER_TOTAL[$router]:-0}
    p=${ROUTER_PASS[$router]:-0}
    w=${ROUTER_WARN[$router]:-0}
    f=${ROUTER_FAIL[$router]:-0}
    [ $t -gt 0 ] && rate=$(( (p * 100) / t )) || rate=0
    echo "| $router | $t | $p | $w | $f | ${rate}% |"
  done
  echo "| **TOTAL** | **$TOTAL** | **$PASS** | **$WARN** | **$FAIL** | |"
  echo ""
  echo "## Gate Failure Breakdown"
  echo ""
  echo "| Gate | Fails | Description |"
  echo "|------|-------|-------------|"
  echo "| G01 | ${GATE_FAIL_COUNT[G01_frontmatter_exists]} | Missing frontmatter |"
  echo "| G02 | ${GATE_FAIL_COUNT[G02_name_field]} | Missing name: field |"
  echo "| G03 | ${GATE_FAIL_COUNT[G03_name_kebab_case]} | Name not kebab-case |"
  echo "| G04 | ${GATE_FAIL_COUNT[G04_name_max_64]} | Name > 64 chars |"
  echo "| G05 | ${GATE_FAIL_COUNT[G05_description_exists]} | Missing description: |"
  echo "| G06 | ${GATE_FAIL_COUNT[G06_description_length]} | Description < 200 chars |"
  echo "| G07 | ${GATE_FAIL_COUNT[G07_description_3rd_person]} | No 3rd person verb |"
  echo "| G08 | ${GATE_FAIL_COUNT[G08_description_make_sure]} | Missing 'Make sure to use' |"
  echo "| G09 | ${GATE_FAIL_COUNT[G09_description_not_for]} | Missing 'Not for' boundary |"
  echo "| G10 | ${GATE_FAIL_COUNT[G10_description_single_line]} | Multi-line description |"
  echo "| G11 | ${GATE_FAIL_COUNT[G11_description_no_angle_brackets]} | Angle brackets in description |"
  echo "| G12 | ${GATE_FAIL_COUNT[G12_metadata_block]} | Missing metadata: block |"
  echo "| G13 | ${GATE_FAIL_COUNT[G13_metadata_author]} | Missing metadata.author |"
  echo "| G14 | ${GATE_FAIL_COUNT[G14_metadata_version]} | Missing metadata.version |"
  echo "| G15 | ${GATE_FAIL_COUNT[G15_metadata_course]} | Missing metadata.course |"
  echo "| G16 | ${GATE_FAIL_COUNT[G16_metadata_tags]} | Missing metadata.tags |"
  echo "| G17 | (warn only) | Over 300 lines |"
  echo "| G18 | ${GATE_FAIL_COUNT[G18_body_has_code_example]} | No code examples |"
  echo "| G19 | ${GATE_FAIL_COUNT[G19_troubleshooting_section]} | Missing Troubleshooting |"
  echo "| G20 | ${GATE_FAIL_COUNT[G20_deep_reference_library]} | Missing Deep reference library |"
  echo "| G21 | ${GATE_FAIL_COUNT[G21_no_fluff]} | Contains fluff |"
  echo "| G22 | ${GATE_FAIL_COUNT[G22_has_rules_section]} | Missing main content section |"
  echo ""
  echo "## Detailed Failures"
  echo ""
  echo 'FAILURES_START'
  echo -e "$FAILURES_LOG"
  echo 'FAILURES_END'
} > "$REPORT_FILE"

echo -e "${GREEN}Done. $PASS/$TOTAL passed all gates.${NC}"

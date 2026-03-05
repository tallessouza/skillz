#!/bin/bash
#
# Run full extraction pipeline overnight.
# Processes all 5,028 lessons with 3 parallel workers.
#
# Usage: nohup ./run-all.sh > extraction.log 2>&1 &
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

unset CLAUDECODE 2>/dev/null || true

echo "=========================================="
echo "Rocketseat Full Extraction"
echo "Started: $(date)"
echo "=========================================="

# Build catalog first
python3 build-catalog.py

# Run extraction with 3 parallel workers
# ~50s/lesson × 5028 lessons ÷ 10 parallel = ~7h
python3 batch-extract.py --parallel 10

echo ""
echo "=========================================="
echo "Finished: $(date)"
echo "=========================================="

#!/bin/bash
# Tier 1 + cursos selecionados
# Total: ~1,040 aulas

set -euo pipefail
cd "$(dirname "$0")"
unset CLAUDECODE 2>/dev/null || true

COURSES="clean-code,node-js-2023,next-js,next-js-app-router-e-testes,saa-s-next-js-rbac,testes-e-arquitetura-no-frontend,api-com-bun,redux-zustand,devops,seguranca-para-devs,ia-node-marketplace-inteligente,masterizando-o-tailwind"

echo "=========================================="
echo "Selected Courses Extraction"
echo "Started: $(date)"
echo "Courses: $COURSES"
echo "=========================================="

python3 build-catalog.py
python3 batch-extract.py --course "$COURSES" --parallel 10

echo ""
echo "=========================================="
echo "Finished: $(date)"
echo "=========================================="

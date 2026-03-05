# Code Examples: Contexto de um Mundo sem DevOps

## Nota

Esta aula é conceitual/cultural e não contém exemplos de código do instrutor. Os exemplos abaixo ilustram os princípios discutidos com cenários práticos.

## Exemplo 1: Automatização de Relatório (Prática DevOps fora de Infra)

O instrutor menciona que automatizar uma extração de relatório para cliente é prática DevOps legítima.

### Antes (manual, repetitivo):
```bash
# Alguém faz isso manualmente toda semana — "são só 15 minutos"
psql -h prod-db -U reader -d app \
  -c "SELECT * FROM orders WHERE created_at > now() - interval '7 days'" \
  > /tmp/weekly_report.csv

# Formata no Excel, envia por email...
```

### Depois (automatizado):
```bash
#!/bin/bash
# scripts/generate-weekly-report.sh
# Automatizado via cron — zero minutos manuais por semana

set -euo pipefail

REPORT_DATE=$(date +%Y-%m-%d)
OUTPUT="reports/weekly-${REPORT_DATE}.csv"

psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" \
  -c "\COPY (SELECT * FROM orders WHERE created_at > now() - interval '7 days') TO STDOUT WITH CSV HEADER" \
  > "$OUTPUT"

# Envia automaticamente
aws ses send-email \
  --to "client@example.com" \
  --subject "Relatório Semanal - ${REPORT_DATE}" \
  --attachment "$OUTPUT"
```

## Exemplo 2: Pensando em Escala

O instrutor enfatiza: "O que era 30 passa a ser 60, passa a ser 2, 3 horas."

```yaml
# Cenário: deploy manual para 1 ambiente = 30 min
# Escala: 3 ambientes (dev, staging, prod) = 90 min
# Escala: 3 ambientes × 5 microserviços = 450 min = 7.5 horas

# Com automatização (CI/CD pipeline):
# 1 ambiente = 5 min (pipeline)
# 3 ambientes × 5 microserviços = 75 min (paralelo: ~15 min)

# O investimento em automatização se paga no segundo uso.
```

## Exemplo 3: Descentralização de Conhecimento via Documentação

```markdown
# runbooks/deploy-production.md
# Antes: só o João sabia fazer deploy
# Depois: documentado, qualquer pessoa do time executa

## Pré-requisitos
- Acesso ao cluster Kubernetes (solicitar via #infra)
- kubectl configurado para contexto production

## Passos
1. Verificar que CI passou: `gh run list --branch main`
2. Aplicar manifests: `kubectl apply -f k8s/production/`
3. Verificar rollout: `kubectl rollout status deployment/app`
4. Validar health: `curl https://app.example.com/health`

## Rollback
Se health check falhar:
kubectl rollout undo deployment/app
```

## Exemplo 4: Projeto que Roda em Qualquer Lugar

O instrutor menciona "projetos concisos que rodam em qualquer lugar, em qualquer máquina, em qualquer servidor":

```dockerfile
# Dockerfile — o projeto roda igual em dev, staging e prod
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

```yaml
# docker-compose.yml — qualquer dev levanta o ambiente inteiro
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgres://user:pass@db:5432/app
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: app
```
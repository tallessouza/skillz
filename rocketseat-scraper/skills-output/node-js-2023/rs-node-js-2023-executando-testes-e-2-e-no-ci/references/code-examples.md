# Code Examples: E2E Tests no CI

## Workflow completo final (apos correcoes)

```yaml
# .github/workflows/run-e2e-tests.yml
name: run-e2e-tests

on: [pull_request]

jobs:
  run-e2e-tests:
    name: run-e2e-tests
    runs-on: ubuntu-latest

    services:
      postgres:
        image: bitnami/postgresql
        ports:
          - 5432:5432
        env:
          POSTGRESQL_USERNAME: docker
          POSTGRESQL_PASSWORD: docker
          POSTGRESQL_DATABASE: apisolid

    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'

      - run: npm ci

      - run: npm run test:e2e
        env:
          JWT_SECRET: testing
          DATABASE_URL: "postgresql://docker:docker@localhost:5432/apisolid?schema=public"
```

## Workflow de unit tests (para comparacao)

```yaml
# .github/workflows/run-unit-tests.yml
name: run-unit-tests

on: [push]

jobs:
  run-unit-tests:
    name: run-unit-tests
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'

      - run: npm ci

      - run: npm run test
```

## Docker Compose original (fonte da conversao)

```yaml
# docker-compose.yml
services:
  api-solid-pg:
    image: bitnami/postgresql
    ports:
      - 5432:5432
    environment:
      - POSTGRESQL_USERNAME=docker
      - POSTGRESQL_PASSWORD=docker
      - POSTGRESQL_DATABASE=apisolid
```

## Comparacao: Docker Compose vs GitHub Actions services

```yaml
# Docker Compose syntax:
services:
  api-solid-pg:
    image: bitnami/postgresql
    ports:
      - 5432:5432
    environment:                    # ← "environment"
      - POSTGRESQL_USERNAME=docker  # ← com "="

# GitHub Actions syntax:
services:
  postgres:
    image: bitnami/postgresql
    ports:
      - 5432:5432
    env:                            # ← "env" (NAO "environment")
      POSTGRESQL_USERNAME: docker   # ← com ":" (NAO "=")
```

## Com health check (versao robusta)

```yaml
services:
  postgres:
    image: bitnami/postgresql
    ports:
      - 5432:5432
    env:
      POSTGRESQL_USERNAME: docker
      POSTGRESQL_PASSWORD: docker
      POSTGRESQL_DATABASE: apisolid
    options: >-
      --health-cmd "pg_isready -U docker"
      --health-interval 10s
      --health-timeout 5s
      --health-retries 5
```

## Comandos git usados na aula

```bash
# Criar branch para o workflow
git checkout -b e2e

# Commit do workflow
git add .github/workflows/run-e2e-tests.yml
git commit -m "ci: add e2e-tests-workflow"

# Abrir PR via GitHub CLI
gh pr create

# Apos merge, criar nova branch para testar
git checkout -b update-readme

# Commit e push
git add .
git commit -m "docs: update readme"
gh pr create  # faz push automaticamente

# Correcoes subsequentes
git add .
git commit -m "ci: fix environment name on service"
git push origin update-readme
```

## Erros cometidos e correcoes (aprendizado real)

### Erro 1: `environment` ao inves de `env`
```yaml
# ERRADO (sintaxe Docker Compose)
services:
  postgres:
    environment:
      POSTGRESQL_USERNAME: docker

# CORRETO (sintaxe GitHub Actions)
services:
  postgres:
    env:
      POSTGRESQL_USERNAME: docker
```

### Erro 2: `=` ao inves de `:`
```yaml
# ERRADO
env:
  POSTGRESQL_USERNAME=docker

# CORRETO
env:
  POSTGRESQL_USERNAME: docker
```

### Erro 3: Estrutura YAML incorreta
O instrutor precisou ajustar a indentacao ao converter do Docker Compose — a estrutura de services no GitHub Actions fica no nivel do job, nao dentro de steps.
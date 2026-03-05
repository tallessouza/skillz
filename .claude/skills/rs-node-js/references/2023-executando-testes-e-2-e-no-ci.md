---
name: rs-node-js-2023-e2e-tests-ci
description: "Generates GitHub Actions workflow for running E2E tests on pull requests. Use when user asks to 'setup CI for e2e tests', 'run end-to-end tests in GitHub Actions', 'configure CI pipeline', 'add e2e workflow', or 'test on pull request'. Applies patterns: service containers for databases, environment variables without .env, health checks, PR-only triggers. Make sure to use this skill whenever configuring CI for integration or e2e tests that need database access. Not for unit test CI, deployment pipelines, or Docker Compose local development."
---

# E2E Tests no CI com GitHub Actions

> Configure testes end-to-end para rodar automaticamente em pull requests usando service containers para dependencias como banco de dados.

## Prerequisites

- Repositorio no GitHub com GitHub Actions habilitado
- Testes E2E configurados localmente (ex: `npm run test:e2e`)
- Docker Compose funcional para desenvolvimento local
- Se banco de dados necessario: imagem Docker disponivel

## Steps

### Step 1: Criar workflow separado dos unit tests

E2E tests sao lentos e custosos — rodar em cada push estoura o plano gratuito do GitHub Actions. Trigger somente em `pull_request`.

```yaml
# .github/workflows/run-e2e-tests.yml
name: run-e2e-tests

on: [pull_request]

jobs:
  run-e2e-tests:
    name: run-e2e-tests
    runs-on: ubuntu-latest
```

### Step 2: Configurar service containers

Converter o servico do `docker-compose.yml` para a sintaxe do GitHub Actions. Atencao: a sintaxe difere em dois pontos criticos.

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
```

### Step 3: Configurar steps com variaveis ambiente

Sem arquivo `.env` no CI — passar variaveis inline via `env` no step de execucao.

```yaml
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

## Output format

Arquivo `.github/workflows/run-e2e-tests.yml` completo e funcional.

## Error handling

- Se testes falham com "connection refused": o container ainda nao subiu. Adicionar health check options ao service:
  ```yaml
  options: >-
    --health-cmd "pg_isready -U docker"
    --health-interval 10s
    --health-timeout 5s
    --health-retries 5
  ```
- Se variaveis ambiente nao sao reconhecidas: verificar se estao no nivel correto (dentro do step `run`, nao no job)
- Se workflow nao executa: confirmar que o arquivo `.yml` esta na branch `main` — workflows novos so ativam apos merge

## Heuristics

| Situacao | Acao |
|----------|------|
| Testes unitarios | Trigger em `push` — sao rapidos |
| Testes E2E | Trigger em `pull_request` — sao lentos e custosos |
| Precisa de banco no CI | Usar `services` do GitHub Actions, nao Docker Compose |
| Secrets sensiveis | Usar GitHub Secrets, nao hardcode no workflow |
| Workflow novo nao roda | Fazer merge para main primeiro, depois abrir nova PR |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Rodar E2E em cada push | Rodar E2E somente em `pull_request` |
| Usar `environment` nos services do Actions | Usar `env` (sintaxe GitHub Actions difere do Docker Compose) |
| Usar `=` para atribuir valores em `env` do service | Usar `:` (YAML syntax) |
| Copiar `docker-compose.yml` sem adaptar | Converter sintaxe: `environment` → `env`, `=` → `:` |
| Rodar testes sem garantir que DB esta pronto | Configurar health check no service container |
| Commitar `.env` no repositorio | Passar variaveis via `env` no workflow |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-executando-testes-e-2-e-no-ci/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-executando-testes-e-2-e-no-ci/references/code-examples.md)

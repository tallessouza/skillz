---
name: rs-testes-arq-frontend-ci-pipeline
description: "Generates GitHub Actions CI pipeline configurations for Next.js/Node.js projects. Use when user asks to 'create CI', 'setup GitHub Actions', 'add CI/CD pipeline', 'configure continuous integration', or 'automate tests on PR'. Applies correct step ordering, database services, Prisma generation, and Dependabot setup. Make sure to use this skill whenever setting up CI for Node.js projects with Prisma or similar ORMs. Not for CD/deployment configuration, Docker production builds, or Kubernetes orchestration."
---

# Pipeline de CI com GitHub Actions

> Configurar CI que valide codigo automaticamente em cada PR, garantindo que nenhum desenvolvedor consiga burlar validacoes locais.

## Rules

1. **Ordem dos steps e crucial** — checkout primeiro, depois Node, package manager, dependencias, geracao de cliente ORM, lint, typecheck, testes, build, porque cada step depende do anterior e inverter causa falhas silenciosas
2. **Configure servicos de banco antes dos steps** — Postgres como service do GitHub Actions com health check, porque o build e migrations precisam de conexao ativa
3. **Gere o cliente ORM antes de lint/typecheck** — `prisma generate` deve vir apos install e antes de lint, porque typecheck falha sem os tipos gerados
4. **Declare variaveis de ambiente no job** — `DATABASE_URL` e similares no bloco `env` do job, porque steps como migrate e build precisam dessas variaveis
5. **Limite PRs do Dependabot** — configure `open-pull-requests-limit` para evitar flood de PRs abertas simultaneamente
6. **CI dispara em pull_request** — nunca apenas em push, porque a validacao deve bloquear merge de PRs quebradas

## How to write

### Workflow completo

```yaml
name: CI

on:
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres
        env:
          POSTGRES_USER: docker
          POSTGRES_PASSWORD: docker
          POSTGRES_DB: app_db
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    env:
      DATABASE_URL: "postgresql://docker:docker@localhost:5432/app_db?schema=public"

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22

      - uses: pnpm/action-setup@v4
        with:
          version: latest

      - run: pnpm install

      - name: Generate Prisma Client
        run: pnpm prisma generate

      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test
      - run: pnpm build
```

### Dependabot

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "daily"
      time: "05:00"
    open-pull-requests-limit: 10
```

## Example

**Before (CI sem servico de banco — falha no build):**
```yaml
steps:
  - uses: actions/checkout@v4
  - uses: actions/setup-node@v4
  - run: npm install
  - run: npm run lint
  - run: npm run typecheck  # FALHA: tipos do Prisma nao gerados
  - run: npm test
  - run: npm run build      # FALHA: sem banco disponivel
```

**After (CI completa com servicos e geracao de tipos):**
```yaml
services:
  postgres:
    image: postgres
    env:
      POSTGRES_USER: docker
      POSTGRES_PASSWORD: docker
      POSTGRES_DB: app_db
    ports:
      - 5432:5432
    options: >-
      --health-cmd pg_isready
      --health-interval 10s
      --health-timeout 5s
      --health-retries 5

env:
  DATABASE_URL: "postgresql://docker:docker@localhost:5432/app_db"

steps:
  - uses: actions/checkout@v4
  - uses: actions/setup-node@v4
    with:
      node-version: 22
  - uses: pnpm/action-setup@v4
  - run: pnpm install
  - run: pnpm prisma generate    # Gera tipos ANTES do typecheck
  - run: pnpm lint
  - run: pnpm typecheck
  - run: pnpm test
  - run: pnpm build              # Banco disponivel via service
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Projeto usa ORM (Prisma, Drizzle) | Adicionar step de generate antes de lint/typecheck |
| Projeto precisa de banco no build | Adicionar service de Postgres/MySQL com health check |
| Primeira vez criando CI | Esperar erros iterativos — subir, testar, ajustar e repetir |
| Left hook ja existe no projeto | CI complementa como garantia centralizada que nao pode ser burlada |
| Muitas dependencias desatualizadas | Configurar Dependabot com limite de PRs |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Colocar build antes de lint/typecheck | Ordem: lint → typecheck → test → build |
| Esquecer `prisma generate` na CI | Adicionar step apos install de dependencias |
| CI sem servico de banco quando ORM precisa | Configurar service com health check |
| Dependabot sem limite de PRs | Usar `open-pull-requests-limit: 10` |
| Confiar apenas em left hooks | Left hooks + CI — hooks podem ser comentados |
| Hardcodar secrets no workflow | Usar bloco `env` no job ou GitHub Secrets |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/testes-e/rs-testes-e-arquitetura-no-frontend-criando-pipeline-de-ci/references/deep-explanation.md)
- [Code examples](../../../data/skills/testes-e/rs-testes-e-arquitetura-no-frontend-criando-pipeline-de-ci/references/code-examples.md)

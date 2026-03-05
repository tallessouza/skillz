# Code Examples: Pipeline de CI com GitHub Actions

## Estrutura de arquivos

```
.github/
├── workflows/
│   └── ci.yml
└── dependabot.yml
```

## CI workflow completo (versao final da aula)

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

## Evolucao passo a passo

### Versao 1 — Minima (vai falhar com Prisma)

```yaml
name: CI

on:
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - uses: pnpm/action-setup@v4
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm typecheck  # ERRO: tipos do Prisma nao existem
      - run: pnpm test
      - run: pnpm build
```

**Erro:** typecheck falha porque os arquivos gerados pelo Prisma nao existem.

### Versao 2 — Com Prisma generate (falha no build)

```yaml
steps:
  - uses: actions/checkout@v4
  - uses: actions/setup-node@v4
    with:
      node-version: 22
  - uses: pnpm/action-setup@v4
  - run: pnpm install
  - name: Generate Prisma Client
    run: pnpm prisma generate
  - run: pnpm lint
  - run: pnpm typecheck  # Agora passa
  - run: pnpm test
  - run: pnpm build      # ERRO: sem DATABASE_URL
```

**Erro:** build falha porque `DATABASE_URL` nao esta definida.

### Versao 3 — Com env (falha no build por falta de banco)

```yaml
env:
  DATABASE_URL: "postgresql://docker:docker@localhost:5432/app_db?schema=public"

steps:
  # ... mesmos steps
  - run: pnpm build  # ERRO: nenhum Postgres rodando na porta 5432
```

**Erro:** build/migrate falha porque nao ha servidor Postgres rodando.

### Versao 4 — Final com service de Postgres

Versao completa no topo deste arquivo. Todos os steps passam.

## Dependabot configuration

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

### Variacoes de schedule

```yaml
# Semanal (menos PRs)
schedule:
  interval: "weekly"
  day: "monday"
  time: "09:00"

# Mensal (minimo de PRs)
schedule:
  interval: "monthly"
```

## Scripts no package.json referenciados

```json
{
  "scripts": {
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "build": "next build",
    "prisma:generate": "prisma generate",
    "prisma:migrate:deploy": "prisma migrate deploy"
  }
}
```

## Adaptacao para npm ao inves de pnpm

```yaml
steps:
  - uses: actions/checkout@v4
  - uses: actions/setup-node@v4
    with:
      node-version: 22
  # Sem step de pnpm
  - run: npm ci          # ci ao inves de install para CI
  - run: npx prisma generate
  - run: npm run lint
  - run: npm run typecheck
  - run: npm test
  - run: npm run build
```

## Adaptacao para yarn

```yaml
steps:
  - uses: actions/checkout@v4
  - uses: actions/setup-node@v4
    with:
      node-version: 22
  - run: yarn install --frozen-lockfile
  - run: yarn prisma generate
  - run: yarn lint
  - run: yarn typecheck
  - run: yarn test
  - run: yarn build
```
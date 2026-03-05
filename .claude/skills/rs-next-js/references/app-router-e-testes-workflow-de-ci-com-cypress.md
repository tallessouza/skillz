---
name: rs-nextjs-app-router-ci-cypress
description: "Generates GitHub Actions CI workflows for Cypress E2E tests in Next.js projects. Use when user asks to 'setup CI', 'run cypress in CI', 'create github actions workflow', 'automate e2e tests', or 'configure continuous integration for Next.js'. Covers build caching with pnpm, API separation for SSR builds, and Cypress GitHub Action. Make sure to use this skill whenever setting up E2E test automation in CI for Next.js apps. Not for unit test CI, deployment pipelines, or Cypress test writing."
---

# Workflow de CI com Cypress no Next.js

> Configurar um workflow de GitHub Actions que executa testes E2E do Cypress contra um build de producao do Next.js, com cache de dependencias e API externa.

## Prerequisitos

- Projeto Next.js com testes Cypress configurados
- pnpm como package manager
- API separada do frontend (deploy independente) — porque o build do Next.js precisa acessar a API para pre-renderizacao, e durante o CI a app nao esta no ar

## Problema central

Quando a aplicacao Next.js depende de uma API interna (route handlers), o comando `next build` falha porque a API nao esta disponivel durante o build. A solucao e separar a API em um projeto independente com deploy proprio.

## Steps

### Step 1: Separar a API do frontend

Extrair os route handlers (`app/api/`) para um projeto Next.js separado e fazer deploy independente (ex: Vercel). Atualizar `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=https://sua-api-deployada.vercel.app
APP_URL=http://localhost:3000
```

### Step 2: Ignorar erros de lint/TS no build

```typescript
// next.config.js
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}
```

Esses erros devem ser tratados antes do merge, nao no build.

### Step 3: Criar o workflow

```yaml
# .github/workflows/run-e2e.yml
name: Run End-to-End Tests

on: [push]

jobs:
  cypress-run:
    runs-on: ubuntu-22.04
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 20

      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          run_install: false

      - name: Get pnpm store directory
        shell: bash
        run: |
          echo "STORE_PATH=$(pnpm store path --silent)" >> $GITHUB_ENV

      - name: Setup pnpm cache
        uses: actions/cache@v3
        with:
          path: ${{ env.STORE_PATH }}
          key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
          restore-keys: |
            ${{ runner.os }}-pnpm-store-

      - name: Install dependencies
        run: pnpm install

      - name: Cypress run
        uses: cypress-io/github-action@v5
        with:
          build: pnpm run build
          start: pnpm start
        env:
          APP_URL: http://localhost:3000
          NEXT_PUBLIC_API_BASE_URL: https://sua-api-deployada.vercel.app
```

### Step 4: Variaveis ambiente no workflow

Declarar as variaveis ambiente no step do Cypress, porque o build e start precisam delas para pre-renderizar as paginas e servir a aplicacao.

## Heuristics

| Situacao | Acao |
|----------|------|
| API esta dentro do proprio Next.js | Separar em projeto independente antes de configurar CI |
| Erros de ESLint/TS bloqueiam build | `ignoreDuringBuilds: true` — tratar no lint pre-merge |
| Primeira execucao do workflow | Cache miss esperado, proximas execucoes serao mais rapidas |
| pnpm-lock.yaml mudou | Cache invalida automaticamente, reinstala dependencias |
| Testes precisam da app rodando | Usar `build` + `start` na Cypress Action, nunca `dev` |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Rodar `next dev` no CI | Rodar `next build` + `next start` (simula producao) |
| Manter API dentro do Next.js para CI | Separar API em deploy independente |
| Instalar dependencias sem cache | Configurar `actions/cache` com pnpm store |
| Hardcodar URL da API no codigo | Usar variaveis ambiente no step do workflow |
| Usar `ubuntu-latest` | Especificar versao (`ubuntu-22.04`) para ambiente reproduzivel |
| Rodar `pnpm install` no step do pnpm | Usar `run_install: false` e instalar depois do cache |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/next-js/rs-next-js-app-router-e-testes-workflow-de-ci-com-cypress/references/deep-explanation.md)
- [Code examples](../../../data/skills/next-js/rs-next-js-app-router-e-testes-workflow-de-ci-com-cypress/references/code-examples.md)

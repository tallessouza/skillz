# Code Examples: Workflow de CI com Cypress

## Workflow completo do GitHub Actions

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

## Configuracao do next.config.js

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

module.exports = nextConfig
```

## Arquivo .env.local atualizado

```env
# Antes (API interna — causa falha no build)
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000

# Depois (API deployada externamente)
NEXT_PUBLIC_API_BASE_URL=https://ignite-devstore-api.vercel.app
APP_URL=http://localhost:3000
```

## Comandos usados na aula

```bash
# Criar repositorio no GitHub e fazer push
gh repo create dev-store --private --source=. --push

# Verificar repositorio
gh repo view

# Build local para testar
pnpm run build

# Rodar Cypress em modo headless (CI)
npx cypress run

# Commit e push para disparar o workflow
git add .
git commit -m "create cypress end-to-end workflow"
git push origin main
```

## Variacao: Workflow com npm ao inves de pnpm

```yaml
# Se usar npm, o workflow simplifica (sem steps de cache manual)
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
          cache: 'npm'  # cache nativo do setup-node

      - name: Install dependencies
        run: npm ci

      - name: Cypress run
        uses: cypress-io/github-action@v5
        with:
          build: npm run build
          start: npm start
        env:
          APP_URL: http://localhost:3000
          NEXT_PUBLIC_API_BASE_URL: https://sua-api.vercel.app
```

## Variacao: Rodar apenas em PRs (nao em todo push)

```yaml
# Mais economico — roda apenas quando abre/atualiza PR
on:
  pull_request:
    branches: [main]
```

## Estrutura de pastas resultante

```
projeto/
├── .github/
│   └── workflows/
│       └── run-e2e.yml        # Workflow de CI
├── cypress/
│   └── e2e/
│       ├── add-product-to-cart.cy.ts
│       └── search-products.cy.ts
├── .env.local                  # URL da API externa
├── next.config.js              # ignoreDuringBuilds
└── ...
```
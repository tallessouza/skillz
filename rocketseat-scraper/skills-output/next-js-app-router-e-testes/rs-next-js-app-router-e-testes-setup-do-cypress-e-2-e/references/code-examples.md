# Code Examples: Setup do Cypress (E2E)

## Instalacao

```bash
# Com pnpm
pnpm add -D cypress

# Com npm
npm install -D cypress

# Com yarn
yarn add -D cypress
```

## tsconfig.json — Antes (Next.js padrao)

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**Problema:** Cypress falha com `option bundler can only be used when module is set to es2015`.

## tsconfig.json — Depois (compativel com Cypress)

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "moduleResolution": "node",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## Abrindo Cypress pela primeira vez

```bash
pnpm cypress open
# ou
npx cypress open
```

## Spec de exemplo criada pelo Cypress

```typescript
// cypress/e2e/hello-world.cy.ts
describe('template spec', () => {
  it('passes', () => {
    cy.visit('https://example.cypress.io')
  })
})
```

## Demonstracao do instrutor — visitando site e clicando

```typescript
describe('template spec', () => {
  it('passes', () => {
    // Visita uma pagina
    cy.visit('https://rocketseat.com.br')

    // Busca botao por texto (case insensitive) e clica
    cy.contains('quero assinar agora', { matchCase: false }).click()
  })
})
```

**Nota:** Por padrao `cy.contains()` e case-sensitive. O instrutor encontrou esse problema ao vivo — o texto do botao estava em caixa alta e o teste falhava. Solucao: `{ matchCase: false }`.

## Scripts no package.json

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "cypress:open": "cypress open",
    "cypress:run": "cypress run"
  }
}
```

## Rodando testes via CLI (headless)

```bash
# Roda todos os testes sem interface grafica
pnpm cypress run

# Roda spec especifica
pnpm cypress run --spec cypress/e2e/home.cy.ts

# Roda em navegador especifico
pnpm cypress run --browser chrome
```

## Estrutura de pastas final

```
projeto/
├── cypress/
│   ├── e2e/
│   │   └── hello-world.cy.ts
│   ├── fixtures/
│   │   └── example.json
│   └── support/
│       ├── commands.ts
│       └── e2e.ts
├── cypress.config.ts
├── tsconfig.json          # Com baseUrl e moduleResolution corrigidos
└── package.json           # Com scripts cypress:open e cypress:run
```
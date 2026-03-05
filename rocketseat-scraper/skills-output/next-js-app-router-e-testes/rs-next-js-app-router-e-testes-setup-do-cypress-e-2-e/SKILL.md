---
name: rs-nextjs-app-router-setup-cypress-e2e
description: "Applies Cypress E2E test setup and configuration for Next.js projects. Use when user asks to 'setup cypress', 'add e2e tests', 'configure end-to-end testing', 'install cypress', or 'create cypress config'. Covers installation, tsconfig fixes for Next.js compatibility, and first spec creation. Make sure to use this skill whenever setting up Cypress in a Next.js App Router project. Not for component testing, unit testing, or Playwright setup."
---

# Setup do Cypress (E2E) em Next.js

> Instale e configure o Cypress para testes end-to-end em projetos Next.js App Router, corrigindo incompatibilidades do tsconfig.

## Rules

1. **Instale como devDependency** — `npm install -D cypress` (ou pnpm/yarn equivalente), porque Cypress e apenas ferramenta de desenvolvimento
2. **Corrija o tsconfig.json para compatibilidade** — Next.js gera um tsconfig incompleto para Cypress; adicione `baseUrl` e mude `moduleResolution`, porque sem isso o Cypress falha com erro de bundler/module
3. **Use E2E testing, nao component testing** — component testing do Cypress ainda nao tem suporte oficial para React Server Components
4. **Arquivos de teste usam extensao `.cy.ts`** — convencao do Cypress para identificar specs
5. **Testes E2E sao independentes do framework** — Cypress testa a interface como usuario, nao importa se e React, Next ou outro

## Steps

### Step 1: Instalar Cypress

```bash
pnpm add -D cypress
# ou: npm install -D cypress / yarn add -D cypress
```

### Step 2: Corrigir tsconfig.json

Adicione `baseUrl` e mude `moduleResolution` para `node`:

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

**Por que:** O Next.js usa `moduleResolution: "bundler"` por padrao, que causa o erro `option bundler can only be used when module is set to es2015`. Mudar para `node` resolve. Isso nao afeta o build de producao — o Next.js usa seu proprio compilador, o tsconfig serve apenas para desenvolvimento e inteligencia do editor.

**`baseUrl: "."`** e obrigatorio quando se usa `paths` — indica que os paths customizados partem da raiz do projeto.

### Step 3: Abrir Cypress pela primeira vez

```bash
pnpm cypress open
```

Isso abre a interface grafica do Cypress. Selecione:
1. **E2E Testing** (nao Component Testing)
2. O Cypress cria automaticamente: `cypress.config.ts`, pasta `cypress/` com `e2e/`, `fixtures/`, `support/`
3. Escolha o navegador instalado (Chrome, Firefox, Edge)
4. Clique em **Start E2E Testing**

### Step 4: Criar primeira spec

Crie o arquivo em `cypress/e2e/nome-do-teste.cy.ts`:

```typescript
describe('Home Page', () => {
  it('should load successfully', () => {
    cy.visit('http://localhost:3000')
  })
})
```

### Step 5: Adicionar script ao package.json

```json
{
  "scripts": {
    "cypress:open": "cypress open",
    "cypress:run": "cypress run"
  }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Erro de `bundler` no Cypress | Mude `moduleResolution` para `node` no tsconfig |
| Usa `paths` no tsconfig | Adicione `baseUrl: "."` |
| Pouco tempo para testes | Priorize E2E sobre testes unitarios — cobrem fluxos completos |
| Precisa rodar no CI | Use `cypress run` (headless) em vez de `cypress open` |
| Quer component testing com RSC | Aguarde suporte oficial — ainda nao ha docs claros |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Instalar Cypress como dependencia normal | `pnpm add -D cypress` (devDependency) |
| Deixar `moduleResolution: "bundler"` com Cypress | Mudar para `"node"` |
| Usar component testing sem suporte a RSC | Usar E2E testing |
| Esquecer `baseUrl` quando usa `paths` | Adicionar `"baseUrl": "."` |
| Criar specs sem extensao `.cy.ts` | Sempre usar `nome.cy.ts` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

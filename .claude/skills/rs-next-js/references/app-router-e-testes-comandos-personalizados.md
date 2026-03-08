---
name: rs-nextjs-app-router-testes-comandos-personalizados
description: "Enforces Cypress custom command patterns and fixture-based mocking strategy when writing E2E tests. Use when user asks to 'create cypress command', 'add custom command', 'write e2e test', 'mock api in cypress', or 'use fixtures'. Applies rules: prefer real API calls over mocks, use fixtures only for unstable external APIs, create parent/child/dual commands correctly, declare types via namespace Cypress. Make sure to use this skill whenever creating or refactoring Cypress E2E tests. Not for unit tests, integration tests, or non-Cypress testing frameworks."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: next-js
  module: app-router-e-testes
  tags: [cypress, custom-commands, e2e-testing, fixtures, intercept, typescript]
---

# Comandos Personalizados no Cypress

> Crie comandos customizados para eliminar repeticao nos testes E2E, mas mantenha os testes o mais proximo possivel do comportamento real do usuario.

## Rules

1. **Evite mocks ao maximo em testes E2E** — testes end-to-end devem bater nas APIs reais, porque mocks criam falsos positivos quando o backend muda rotas ou formato de resposta
2. **Use fixtures apenas para APIs externas instaveis** — se uma API externa (ex: Correios, gateway de pagamento) e lenta ou instavel, use `cy.intercept` com fixtures para simular a resposta, nunca para APIs internas do projeto
3. **Crie comandos para sequencias repetidas** — se multiplos testes repetem a mesma sequencia de acoes (navegar, preencher, clicar), extraia para um comando customizado em `cypress/support/commands.ts`
4. **Declare tipos via `namespace Cypress`** — use `declare namespace Cypress` (nao `declare global`) para adicionar tipagem dos comandos customizados, porque o ESLint rejeita `declare global` em alguns configs
5. **Escolha o tipo correto de comando** — `parent` para comandos independentes (`cy.meuComando()`), `child` para comandos que dependem de elemento previo (`cy.get().meuComando()`), `dual` para ambos

## How to write

### Comando parent (mais comum)

```typescript
// cypress/support/commands.ts
Cypress.Commands.add('searchByQuery', (query: string) => {
  cy.visit('/')
  cy.get('input[name="q"]').type(query)
  cy.get('form').submit()
})
```

### Tipagem do comando

```typescript
// cypress/support/commands.ts (topo do arquivo)
declare namespace Cypress {
  interface Chainable {
    searchByQuery(query: string): Chainable<void>
  }
}
```

### Uso de fixtures para API externa instavel

```typescript
// cypress/fixtures/shipping-quote.json
{ "price": 1590, "days": 5, "carrier": "SEDEX" }

// No teste
cy.intercept('GET', '/api/shipping/*', { fixture: 'shipping-quote.json' }).as('shipping')
cy.get('[data-testid="calculate-shipping"]').click()
cy.wait('@shipping')
```

## Example

**Before (repeticao em cada teste):**
```typescript
it('should show search results', () => {
  cy.visit('/')
  cy.get('input[name="q"]').type('camiseta')
  cy.get('form').submit()
  cy.location('pathname').should('include', '/search')
})

it('should add searched product to cart', () => {
  cy.visit('/')
  cy.get('input[name="q"]').type('camiseta')
  cy.get('form').submit()
  cy.get('a[href^="/product"]').first().click()
  cy.get('button[type="submit"]').click()
})
```

**After (com comando customizado):**
```typescript
it('should show search results', () => {
  cy.searchByQuery('camiseta')
  cy.location('pathname').should('include', '/search')
})

it('should add searched product to cart', () => {
  cy.searchByQuery('camiseta')
  cy.get('a[href^="/product"]').first().click()
  cy.get('button[type="submit"]').click()
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Sequencia usada em 3+ testes | Extraia para comando customizado |
| API interna do projeto | Deixe bater na API real, sem mock |
| API externa lenta/instavel | Use fixture com `cy.intercept` |
| Comando nao depende de elemento | Use parent command |
| Comando opera sobre elemento selecionado | Use child command |
| ESLint reclama de `declare global` | Desabilite `@typescript-eslint/no-namespace` |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Mock de todas as chamadas HTTP | Deixe o frontend bater no backend real |
| `declare global { namespace Cypress }` | `declare namespace Cypress` direto |
| Repetir 10 linhas de setup em cada teste | Extrair para comando customizado |
| Criar comando para acao unica simples | Use `cy.get().click()` diretamente |
| Usar `Cypress.Commands.overwrite` sem necessidade | Crie um comando novo com nome descritivo |

## Troubleshooting

### Comportamento diferente entre dev e producao
**Symptom:** Funcionalidade funciona em `npm run dev` mas nao em `npm run build && npm start`
**Cause:** Dev mode e mais permissivo — producao aplica otimizacoes, cache agressivo, e validacoes mais estritas
**Fix:** Sempre testar com `npm run build && npm start` antes de deploy. Verificar que nao ha erros no build output. Limpar .next antes de rebuildar

### Erro "Module not found" apos refatoracao
**Symptom:** Import de modulo falha apos mover arquivo
**Cause:** Path do import nao foi atualizado, ou alias de path (@/) nao esta configurado
**Fix:** Atualizar todos os imports que referenciam o arquivo movido. Verificar tsconfig.json paths para aliases

## Deep reference library

- [deep-explanation.md](../../../data/skills/next-js-app-router-e-testes/rs-next-js-app-router-e-testes-comandos-personalizados/references/deep-explanation.md) — O instrutor enfatiza um ponto critico que muitos devs (e ate instrutores) erram: **mocks em testes E
- [code-examples.md](../../../data/skills/next-js-app-router-e-testes/rs-next-js-app-router-e-testes-comandos-personalizados/references/code-examples.md) — /// <reference types="cypress" />

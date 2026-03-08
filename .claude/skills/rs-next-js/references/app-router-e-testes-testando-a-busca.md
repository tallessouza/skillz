---
name: rs-nextjs-app-router-testando-a-busca
description: "Applies Cypress E2E search testing patterns when writing tests for search functionality in Next.js applications. Use when user asks to 'test search', 'write cypress tests', 'test redirect', 'e2e test form submission', or 'test navigation flow'. Covers beforeEach setup, baseUrl config, form interaction, location assertions, and suppressing Next.js redirect exceptions. Make sure to use this skill whenever writing Cypress tests for search or redirect flows. Not for unit tests, API tests, or non-Cypress testing frameworks."

metadata:
  author: Rocketseat
  version: 2.0.0
  course: next-js
  module: app-router-e-testes
  tags: [next-js, cypress, e2e-testing, search-test, baseUrl, redirect-testing]
---

# Testando Busca com Cypress em Next.js

> Testes E2E de busca validam o fluxo completo: digitar no input, submeter o formulario, verificar redirecionamento e resultados.

## Rules

1. **Configure baseUrl no cypress.config** — evita repetir `http://localhost:3000` em todos os testes, porque facilita troca de ambiente e reduz duplicacao
2. **Use beforeEach para navegacao comum** — visitar a pagina inicial antes de cada teste, porque garante estado limpo entre testes
3. **Mova cy.visit para dentro do teste quando o ponto de entrada difere** — nem todo teste comeca na home, porque beforeEach com visit generico quebra testes que precisam acessar rotas especificas
4. **Valide pathname E query params separadamente** — `cy.location('pathname')` para rota e `cy.location('search')` para parametros, porque sao assertions independentes e mais debugaveis
5. **Suprima excecoes de redirect do Next.js com cy.on** — Next.js usa `throw` para redirects, Cypress interpreta como erro, porque sem isso o teste falha mesmo com comportamento correto
6. **Use should('exist') para validar presenca de resultados** — nao precisa clicar no elemento, apenas garantir que apareceu, porque o objetivo e testar a busca e nao a navegacao ao produto

## How to write

### Configuracao de baseUrl

```typescript
// cypress.config.ts
import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
  },
})
```

### Teste de busca com resultados

```typescript
// cypress/e2e/search.cy.ts
describe('search products', () => {
  it('should be able to search for products', () => {
    cy.visit('/')

    cy.get('input[name="q"]').type('moletom')
    cy.get('form').submit()

    cy.location('pathname').should('include', '/search')
    cy.location('search').should('include', 'q=moletom')

    cy.get('a[href^="/product"]').should('exist')
  })
})
```

### Teste de redirect sem query param

```typescript
it('should not be able to visit search page without a search query', () => {
  cy.on('uncaught:exception', () => {
    return false
  })

  cy.visit('/search')

  cy.location('pathname').should('equal', '/')
})
```

## Example

**Before (testes frageis com URL hardcoded e sem tratamento de redirect):**

```typescript
describe('search', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/')
  })

  it('searches', () => {
    cy.get('input').type('moletom')
    cy.get('form').submit()
    // sem validacao de pathname ou query
    cy.get('a').should('exist')
  })

  it('redirects without query', () => {
    // FALHA: Next.js throw no redirect causa uncaught exception
    cy.visit('http://localhost:3000/search')
    cy.url().should('eq', 'http://localhost:3000/')
  })
})
```

**After (com this skill applied):**

```typescript
describe('search products', () => {
  it('should be able to search for products', () => {
    cy.visit('/')

    cy.get('input[name="q"]').type('moletom')
    cy.get('form').submit()

    cy.location('pathname').should('include', '/search')
    cy.location('search').should('include', 'q=moletom')
    cy.get('a[href^="/product"]').should('exist')
  })

  it('should not be able to visit search page without a search query', () => {
    cy.on('uncaught:exception', () => {
      return false
    })

    cy.visit('/search')
    cy.location('pathname').should('equal', '/')
  })
})
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Todos os testes comecam na mesma pagina | Use beforeEach com cy.visit('/') |
| Testes comecam em paginas diferentes | Mova cy.visit para dentro de cada teste |
| Next.js faz redirect e teste falha com exception | Adicione cy.on('uncaught:exception', () => false) |
| Precisa validar URL apos navegacao | Use cy.location('pathname') e cy.location('search') separadamente |
| Quer garantir que resultado apareceu | Use should('exist'), nao precisa clicar |
| URL pode mudar entre ambientes | Configure baseUrl no cypress.config, use paths relativos |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `cy.visit('http://localhost:3000/')` em cada teste | `baseUrl` no config + `cy.visit('/')` |
| `cy.url().should('include', 'search?q=moletom')` | `cy.location('pathname')` + `cy.location('search')` separados |
| Ignorar falha de redirect do Next.js | `cy.on('uncaught:exception', () => false)` antes do visit |
| `cy.get('a').first().should('exist')` | `cy.get('a[href^="/product"]').should('exist')` com seletor especifico |
| beforeEach com visit quando testes acessam rotas diferentes | cy.visit dentro de cada it() |

## Troubleshooting

### Teste Cypress falha ao encontrar elemento
**Symptom:** `cy.get()` retorna timeout — elemento nao encontrado
**Cause:** Elemento ainda nao renderizou (loading state), ou seletor incorreto
**Fix:** Usar `cy.contains()` para texto visivel ou `data-testid` para seletores estaveis. Adicionar assertions que esperam o elemento aparecer

### Testes passam localmente mas falham no CI
**Symptom:** Suite verde localmente, vermelha no GitHub Actions
**Cause:** Dependencias de ambiente (banco, API), timeouts curtos, ou falta de build antes do teste
**Fix:** Garantir que `npm run build` roda antes dos testes E2E. Configurar variaveis de ambiente no CI. Aumentar timeouts para ambientes mais lentos

## Deep reference library

- [deep-explanation.md](../../../data/skills/next-js-app-router-e-testes/rs-next-js-app-router-e-testes-testando-a-busca/references/deep-explanation.md) — O instrutor explica que enquanto os testes rodam na maquina local, a URL sera `localhost:3000`. Mas 
- [code-examples.md](../../../data/skills/next-js-app-router-e-testes/rs-next-js-app-router-e-testes-testando-a-busca/references/code-examples.md) — import { defineConfig } from 'cypress'

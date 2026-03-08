---
name: rs-nextjs-app-router-testando-carrinho
description: "Enforces Cypress E2E test patterns for shopping cart functionality in Next.js apps. Use when user asks to 'write cypress tests', 'test add to cart', 'e2e test shopping cart', 'create spec file', or 'test user navigation flow'. Applies patterns: cy.visit for navigation, cy.get with CSS selectors, cy.contains for text-based selection, cy.location for URL assertions, .first() for multiple matches, .parent().submit() for form submission. Make sure to use this skill whenever writing Cypress specs for e-commerce or cart features. Not for unit tests, API tests, or non-Cypress testing frameworks."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: next-js
  module: app-router-e-testes
  tags: [cypress, e2e, shopping-cart, next-js, testing, cy-visit, cy-get, cy-contains]
---

# Testando o Carrinho com Cypress

> Cada spec Cypress simula o fluxo real do usuario: navegar, interagir, e validar estado visual.

## Rules

1. **Nomeie specs pela funcionalidade** — `add-product-to-cart.cy.ts` nao `test1.cy.ts`, porque o nome do arquivo e documentacao viva do que esta sendo testado
2. **Cada test case comeca do zero** — sempre `cy.visit()` no inicio de cada `it()`, porque Cypress reseta estado entre testes
3. **Selecione por semantica, nao por classe CSS** — use `cy.contains('texto')` ou seletores de atributo como `a[href^="/product"]`, porque classes mudam, texto e rotas sao estaveis
4. **Use `.first()` quando ha multiplos matches** — `cy.get('a[href^="/product"]').first().click()`, porque sem `.first()` o Cypress falha em elementos ambiguos
5. **Valide URL apos navegacao** — `cy.location('pathname').should('include', '/product')`, porque garante que o clique realmente navegou
6. **Valide estado visual, nao estado interno** — `cy.contains('Cart (1)').should('exist')`, porque E2E testa o que o usuario ve

## How to write

### Navegacao e clique em produto

```typescript
cy.visit('http://localhost:3000')
cy.get('a[href^="/product"]').first().click()
cy.location('pathname').should('include', '/product')
```

### Adicionar ao carrinho e validar contador

```typescript
cy.contains('Adicionar ao carrinho').click()
cy.contains('Cart (1)').should('exist')
```

### Busca com submit de formulario

```typescript
cy.get('input[name=q]').type('moletom')
cy.get('input[name=q]').parent('form').submit()
```

### Teste de produto duplicado

```typescript
cy.contains('Adicionar ao carrinho').click()
cy.contains('Adicionar ao carrinho').click()
cy.contains('Cart (1)').should('exist') // count por produto, nao quantidade
```

## Example

**Before (teste fragil e incompleto):**
```typescript
it('test cart', () => {
  cy.visit('http://localhost:3000')
  cy.get('.product-card').click()
  cy.get('.add-btn').click()
  cy.get('.cart-count').contains('1')
})
```

**After (com este skill aplicado):**
```typescript
it('should be able to navigate to product page and add it to cart', () => {
  cy.visit('http://localhost:3000')
  cy.get('a[href^="/product"]').first().click()
  cy.location('pathname').should('include', '/product')
  cy.contains('Adicionar ao carrinho').click()
  cy.contains('Cart (1)').should('exist')
})

it('should not count duplicated products on cart', () => {
  cy.visit('http://localhost:3000')
  cy.get('a[href^="/product"]').first().click()
  cy.contains('Adicionar ao carrinho').click()
  cy.contains('Adicionar ao carrinho').click()
  cy.contains('Cart (1)').should('exist')
})

it('should be able to search for a product and add it to the cart', () => {
  cy.visit('http://localhost:3000')
  cy.get('input[name=q]').type('moletom')
  cy.get('input[name=q]').parent('form').submit()
  cy.get('a[href^="/product"]').first().click()
  cy.location('pathname').should('include', '/product')
  cy.contains('Adicionar ao carrinho').click()
  cy.contains('Cart (1)').should('exist')
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Multiplos elementos iguais na tela | Use `.first()`, `.last()`, ou `.eq(index)` |
| Precisa validar URL | Use `cy.location('pathname')` ao inves de `cy.url()` para ignorar dominio |
| Precisa submeter form sem botao visivel | Use `.parent('form').submit()` |
| Precisa digitar em input | Use `cy.get('input[name=...]').type('texto')` |
| Precisa validar texto na tela | Use `cy.contains('texto').should('exist')` |
| Carrinho conta produtos unicos, nao quantidade | Clique 2x no mesmo produto e valide que counter nao muda |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `cy.get('.btn-primary').click()` | `cy.contains('Adicionar ao carrinho').click()` |
| `cy.url().should('eq', 'http://...')` | `cy.location('pathname').should('include', '/product')` |
| `cy.wait(2000)` antes de assertion | `cy.contains('Cart (1)').should('exist')` (Cypress auto-retry) |
| `cy.get('#product-1')` com ID hardcoded | `cy.get('a[href^="/product"]').first()` |
| Teste sem `cy.visit()` no inicio | Sempre comece com `cy.visit()` em cada `it()` |

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

- [deep-explanation.md](../../../data/skills/next-js-app-router-e-testes/rs-next-js-app-router-e-testes-testando-o-carrinho/references/deep-explanation.md) — O instrutor enfatiza que cada `it()` block reseta o estado da aplicacao. Isso significa que o carrin
- [code-examples.md](../../../data/skills/next-js-app-router-e-testes/rs-next-js-app-router-e-testes-testando-o-carrinho/references/code-examples.md) — Arquivo: `cypress/e2e/add-product-to-cart.cy.ts`

# Code Examples: Comandos Personalizados no Cypress

## Exemplo 1: Criando o comando searchByQuery

### commands.ts completo

```typescript
/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    searchByQuery(query: string): Chainable<void>
  }
}

Cypress.Commands.add('searchByQuery', (query: string) => {
  cy.visit('/')
  cy.get('input[name="q"]').type(query)
  cy.get('form').submit()
})
```

### Passo a passo:
1. `/// <reference types="cypress" />` — referencia os tipos do Cypress
2. `declare namespace Cypress` — extende a interface Chainable com o novo comando
3. `Chainable<void>` — indica que o comando nao retorna elemento encadeavel
4. `Cypress.Commands.add('searchByQuery', ...)` — registra o comando como parent command

## Exemplo 2: Usando o comando nos testes

### search.cy.ts (antes)

```typescript
it('should be able to search for products', () => {
  cy.visit('/')
  cy.get('input[name="q"]').type('moletom')
  cy.get('form').submit()

  cy.location('pathname').should('include', '/search')
  cy.location('search').should('include', 'q=moletom')
})
```

### search.cy.ts (depois)

```typescript
it('should be able to search for products', () => {
  cy.searchByQuery('moletom')

  cy.location('pathname').should('include', '/search')
  cy.location('search').should('include', 'q=moletom')
})
```

## Exemplo 3: Usando em add-product-to-cart.cy.ts

### Antes

```typescript
it('should be able to add product to cart', () => {
  cy.visit('/')
  cy.get('input[name="q"]').type('camiseta')
  cy.get('form').submit()

  cy.get('a[href^="/product"]').first().click()
  cy.get('button[type="submit"]').click()
  // ... assertions do carrinho
})
```

### Depois

```typescript
it('should be able to add product to cart', () => {
  cy.searchByQuery('camiseta')

  cy.get('a[href^="/product"]').first().click()
  cy.get('button[type="submit"]').click()
  // ... assertions do carrinho
})
```

## Exemplo 4: Comando com retorno (variacao)

```typescript
declare namespace Cypress {
  interface Chainable {
    searchByQuery(query: string): Chainable<JQuery<HTMLFormElement>>
  }
}

Cypress.Commands.add('searchByQuery', (query: string) => {
  cy.visit('/')
  cy.get('input[name="q"]').type(query)
  return cy.get('form').submit()
})

// Uso com encadeamento:
cy.searchByQuery('moletom').should('exist')
```

## Exemplo 5: Fixture para API externa

```json
// cypress/fixtures/shipping-quote.json
{
  "price": 1590,
  "estimatedDays": 5,
  "carrier": "SEDEX",
  "zipCode": "01001-000"
}
```

```typescript
// No teste
beforeEach(() => {
  cy.intercept('GET', 'https://api.correios.com.br/**', {
    fixture: 'shipping-quote.json'
  }).as('shippingQuote')
})

it('should calculate shipping', () => {
  cy.get('[data-testid="zip-code"]').type('01001-000')
  cy.get('[data-testid="calculate-shipping"]').click()
  cy.wait('@shippingQuote')
  cy.contains('R$ 15,90').should('be.visible')
})
```

## Exemplo 6: Configuracao ESLint

```json
// .eslintrc.json
{
  "rules": {
    "@typescript-eslint/no-namespace": "off"
  }
}
```

## Exemplo 7: Estrutura de pastas resultante

```
cypress/
├── e2e/
│   ├── search.cy.ts
│   └── add-product-to-cart.cy.ts
├── fixtures/
│   └── shipping-quote.json          # Apenas para APIs externas instaveis
├── downloads/                        # Arquivos baixados durante testes
└── support/
    ├── e2e.ts                        # Carregado automaticamente
    └── commands.ts                   # Comandos customizados
```
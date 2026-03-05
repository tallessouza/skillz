# Code Examples: Testando a Busca com Cypress

## Configuracao completa do cypress.config.ts

```typescript
import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    // Outras configuracoes possiveis:
    // setupNodeEvents(on, config) {},
    // specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
  },
})
```

## Arquivo de teste completo: search.cy.ts

```typescript
describe('search products', () => {
  it('should be able to search for products', () => {
    cy.visit('/')

    // Encontra o input de busca e digita o termo
    cy.get('input[name="q"]').type('moletom')

    // Submete o formulario
    cy.get('form').submit()

    // Verifica que foi redirecionado para /search
    cy.location('pathname').should('include', '/search')

    // Verifica que o parametro de busca esta na URL
    cy.location('search').should('include', 'q=moletom')

    // Verifica que pelo menos um produto foi encontrado
    cy.get('a[href^="/product"]').should('exist')
  })

  it('should not be able to visit search page without a search query', () => {
    // Suprime a excecao que o Next.js lanca ao fazer redirect
    // Next.js usa throw internamente para redirects,
    // e o Cypress interpreta como erro nao tratado
    cy.on('uncaught:exception', () => {
      return false
    })

    // Tenta acessar /search sem parametro q
    cy.visit('/search')

    // Verifica que foi redirecionado de volta para home
    cy.location('pathname').should('equal', '/')
  })
})
```

## Exemplo com beforeEach (quando todos os testes comecam na home)

```typescript
describe('add product to cart', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should be able to navigate and add product to cart', () => {
    // cy.visit ja foi chamado no beforeEach
    cy.get('a[href^="/product"]').first().click()
    // ...resto do teste
  })

  it('should be able to add product from search', () => {
    // cy.visit ja foi chamado no beforeEach
    cy.get('input[name="q"]').type('camiseta')
    // ...resto do teste
  })
})
```

## Variacao: beforeEach removido quando testes tem pontos de entrada diferentes

```typescript
// ANTES (problematico):
describe('search', () => {
  beforeEach(() => {
    cy.visit('/') // Isso atrapalha o teste que precisa visitar /search
  })

  it('searches', () => { /* ... */ })
  it('redirects without query', () => {
    cy.visit('/search') // Visita /search DEPOIS de ja ter visitado /
  })
})

// DEPOIS (correto):
describe('search', () => {
  // Sem beforeEach — cada teste controla seu ponto de entrada

  it('searches', () => {
    cy.visit('/') // Explicito
    // ...
  })

  it('redirects without query', () => {
    cy.on('uncaught:exception', () => false)
    cy.visit('/search') // Direto, sem visitar home antes
    // ...
  })
})
```

## Patterns de cy.location para diferentes cenarios

```typescript
// Verificar pathname exato
cy.location('pathname').should('equal', '/')

// Verificar pathname parcial
cy.location('pathname').should('include', '/search')

// Verificar query string
cy.location('search').should('include', 'q=moletom')

// Verificar URL completa (evitar — acoplado ao ambiente)
// cy.url().should('eq', 'http://localhost:3000/search?q=moletom') // NAO RECOMENDADO

// Verificar hash (se aplicavel)
cy.location('hash').should('equal', '#section')
```

## Pattern de supressao de excecao para redirects Next.js

```typescript
// ESCOPO: dentro do teste especifico (recomendado)
it('test with redirect', () => {
  cy.on('uncaught:exception', () => false)
  cy.visit('/protected-route')
  cy.location('pathname').should('equal', '/login')
})

// ESCOPO: global no support/e2e.ts (NAO recomendado — mascara erros reais)
// Cypress.on('uncaught:exception', () => false) // EVITAR
```
# Code Examples: Testando o Carrinho com Cypress

## Spec completa da aula

Arquivo: `cypress/e2e/add-product-to-cart.cy.ts`

```typescript
describe('add product to cart', () => {
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

    cy.location('pathname').should('include', '/product')

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
})
```

## Detalhamento passo a passo

### 1. Visitar a aplicacao

```typescript
cy.visit('http://localhost:3000')
```
Navega para a pagina inicial. Prerequisito: a aplicacao deve estar rodando (`pnpm run dev`).

### 2. Selecionar produto com seletor de atributo

```typescript
// Seleciona todos os links cujo href comeca com "/product"
cy.get('a[href^="/product"]')

// Pega apenas o primeiro (evita ambiguidade)
cy.get('a[href^="/product"]').first()

// Clica no primeiro produto
cy.get('a[href^="/product"]').first().click()
```

**Nota importante:** O valor do atributo deve estar entre aspas duplas dentro do seletor: `href^="/product"`. Sem as aspas, Cypress retorna "Unrecognized expression".

### 3. Validar navegacao via URL

```typescript
// Opcao 1: URL completa
cy.url().should('include', 'product')

// Opcao 2: Apenas pathname (preferivel)
cy.location('pathname').should('include', '/product')
```

`cy.location()` aceita qualquer propriedade de URL: `pathname`, `search`, `hash`, `host`, `port`, etc.

### 4. Interagir com botao por texto

```typescript
cy.contains('Adicionar ao carrinho').click()
```

`cy.contains()` busca o primeiro elemento que contenha o texto especificado.

### 5. Validar existencia de elemento

```typescript
cy.contains('Cart (1)').should('exist')
```

Verifica que existe um elemento na tela com o texto "Cart (1)". O Cypress auto-retry por ate 4 segundos (default).

### 6. Digitar em input e submeter form

```typescript
// Seleciona input pelo atributo name
cy.get('input[name=q]').type('moletom')

// Navega ao form pai e submete
cy.get('input[name=q]').parent('form').submit()
```

`.parent('form')` sobe na arvore DOM ate encontrar o elemento `<form>` pai. `.submit()` dispara o evento submit nativo.

## Variacoes uteis

### Selecionar por indice especifico

```typescript
// Segundo produto (indice 1)
cy.get('a[href^="/product"]').eq(1).click()

// Ultimo produto
cy.get('a[href^="/product"]').last().click()
```

### Validar quantidade de elementos encontrados

```typescript
cy.get('a[href^="/product"]').should('have.length', 3)
```

### Validar que carrinho comeca vazio

```typescript
cy.contains('Cart (0)').should('exist')
```
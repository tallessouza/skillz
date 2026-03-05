# Code Examples: Interfaces no TypeScript

## Exemplo base da aula

```typescript
// Declaracao da interface com PascalCase
interface Product {
  id: number,
  name: string
}

// Funcao que recebe o tipo customizado
function newProduct(product: Product) {
  // product.id e product.name disponiveis com autocomplete
}

// Chamada correta
newProduct({ id: 1, name: "Produto x" })
```

## Variacao: mais propriedades

```typescript
interface Product {
  id: number
  name: string
  price: number
  description: string
  inStock: boolean
}

function createProduct(product: Product) {
  console.log(`${product.name}: R$ ${product.price}`)
}

createProduct({
  id: 1,
  name: "Camiseta",
  price: 49.90,
  description: "Camiseta algodao",
  inStock: true
})
```

## Variacao: propriedades opcionais

```typescript
interface Product {
  id: number
  name: string
  description?: string  // opcional com ?
}

function createProduct(product: Product) {
  console.log(product.name)
  if (product.description) {
    console.log(product.description)
  }
}

// Valido — description e opcional
createProduct({ id: 1, name: "Produto X" })
```

## Variacao: reutilizando interface em multiplas funcoes

```typescript
interface Product {
  id: number
  name: string
  price: number
}

function createProduct(product: Product) {
  // cadastrar produto
}

function updateProduct(product: Product) {
  // atualizar produto
}

function displayProduct(product: Product) {
  console.log(`${product.name} - R$ ${product.price}`)
}
```

## Variacao: interface como tipo de retorno

```typescript
interface Product {
  id: number
  name: string
}

function getProduct(id: number): Product {
  return {
    id,
    name: "Produto encontrado"
  }
}

const product = getProduct(1)
// product.id e product.name com autocomplete
```

## Cenarios de erro demonstrados na aula

```typescript
interface Product {
  id: number
  name: string
}

// ERRO: falta a propriedade 'id'
newProduct({ name: "Produto x" })
// Property 'id' is missing in type '{ name: string; }'

// ERRO: tipo errado para 'id'
newProduct({ id: "1", name: "Produto x" })
// Type 'string' is not assignable to type 'number'

// CORRETO
newProduct({ id: 1, name: "Produto x" })
```

## Variacao: array de interface

```typescript
interface Product {
  id: number
  name: string
}

const products: Product[] = [
  { id: 1, name: "Produto A" },
  { id: 2, name: "Produto B" },
  { id: 3, name: "Produto C" }
]

function listProducts(products: Product[]) {
  products.forEach(product => {
    console.log(`${product.id}: ${product.name}`)
  })
}
```
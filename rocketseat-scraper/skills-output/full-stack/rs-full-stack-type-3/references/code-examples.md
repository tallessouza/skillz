# Code Examples: Usando Type (Type Alias) em TypeScript

## Exemplo 1: Type básico para domínio (da aula)

```typescript
type Product = {
  id: number,
  name: string
}

function newProduct(product: Product) {
  // cadastra o produto
}

// Uso correto
newProduct({ id: 1, name: "Produto X" })

// ERRO: id deveria ser number
newProduct({ id: "1", name: "Produto X" })
// Type 'string' is not assignable to type 'number'

// ERRO: faltando propriedade name
newProduct({ id: 1 })
// Property 'name' is missing in type '{ id: number }'
```

## Exemplo 2: Union type para resposta de banco (da aula)

```typescript
type SelectResponse = Product[] | null

function selectProducts(): SelectResponse {
  return null // válido — atende o tipo null
}

function selectProductsWithData(): SelectResponse {
  return [{ id: 1, name: "Produto X" }] // válido — atende Product[]
}
```

## Variação 1: Type com mais propriedades

```typescript
type Product = {
  id: number,
  name: string,
  priceInCents: number,
  category: string,
  isActive: boolean
}
```

## Variação 2: Union type com erro

```typescript
type ApiResponse = {
  data: Product[] | null,
  error: string | null
}

function fetchProducts(): ApiResponse {
  try {
    const products = db.query("SELECT * FROM products")
    return { data: products, error: null }
  } catch (err) {
    return { data: null, error: "Falha ao buscar produtos" }
  }
}
```

## Variação 3: Intersection type (composição)

```typescript
type Product = {
  id: number,
  name: string
}

type ProductWithPrice = Product & {
  priceInCents: number
}

// ProductWithPrice tem: id, name, priceInCents
```

## Variação 4: Type para funções

```typescript
type CreateProductFn = (product: Product) => Product

const createProduct: CreateProductFn = (product) => {
  return { ...product, id: Math.random() }
}
```

## Variação 5: Type com literal types

```typescript
type OrderStatus = "pending" | "shipped" | "delivered" | "cancelled"

type Order = {
  id: number,
  status: OrderStatus,
  products: Product[]
}
```

## Variação 6: Type genérico para resposta de banco

```typescript
type DbResponse<T> = T[] | null

type ProductResponse = DbResponse<Product>
type OrderResponse = DbResponse<Order>

function selectAll<T>(table: string): DbResponse<T> {
  const result = db.query(`SELECT * FROM ${table}`)
  return result.length > 0 ? result : null
}
```

## Padrão: Type + função tipada completa

```typescript
type Product = {
  id: number,
  name: string
}

type SelectResponse = Product[] | null

function createProduct(product: Product): Product {
  return product
}

function selectProducts(): SelectResponse {
  return null
}

function selectProductById(id: number): Product | null {
  return null
}
```
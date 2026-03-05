# Code Examples: TypeScript typeof para Extração de Tipos

## Exemplo base da aula

```typescript
interface Product {
  id: number
  name: string
  quantity: number
}

const product1: Product = { id: 1, name: "Produto 1", quantity: 3 }

// typeof extrai a tipagem de product1 (que é Product)
const product2: typeof product1 = { id: 2, name: "Produto 2", quantity: 5 }
```

**O que acontece internamente:** `typeof product1` resolve para `Product`, então `product2` tem tipo `Product`. Se `product1` não tivesse anotação explícita, typeof extrairia o tipo inferido (com valores literais).

## Propagação automática de mudanças

```typescript
// Antes: sem quantity
interface Product {
  id: number
  name: string
}

const product1: Product = { id: 1, name: "Produto 1" }
const product2: typeof product1 = { id: 2, name: "Produto 2" } // OK

// Depois: adiciona quantity
interface Product {
  id: number
  name: string
  quantity: number  // novo campo
}

const product1: Product = { id: 1, name: "Produto 1", quantity: 3 }
const product2: typeof product1 = { id: 2, name: "Produto 2" }
// ❌ Error: Property 'quantity' is missing
// typeof propagou a mudança automaticamente
```

## typeof com objetos sem interface explícita

```typescript
// Sem interface — TypeScript infere o tipo
const defaultSettings = {
  theme: "light",
  fontSize: 14,
  language: "pt-BR",
}

// typeof extrai o tipo inferido: { theme: string; fontSize: number; language: string }
const userSettings: typeof defaultSettings = {
  theme: "dark",
  fontSize: 16,
  language: "en-US",
}
```

## typeof com retorno de função (cenário de API/biblioteca)

```typescript
// Simulando retorno tipado de uma lib
function createDatabaseConnection(config: { host: string; port: number }) {
  return {
    query: (sql: string) => Promise.resolve([]),
    close: () => {},
    config,
    isConnected: true,
  }
}

const db = createDatabaseConnection({ host: "localhost", port: 5432 })

// Extrai o tipo completo do retorno sem precisar definir interface
type DatabaseConnection = typeof db
// Equivale a: { query: (sql: string) => Promise<never[]>; close: () => void; config: {...}; isConnected: boolean }

function logConnection(conn: typeof db) {
  console.log(conn.isConnected)
}
```

## typeof com as const (tipos literais)

```typescript
const STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  PENDING: "pending",
} as const

// typeof extrai tipos literais exatos
type Status = typeof STATUS
// { readonly ACTIVE: "active"; readonly INACTIVE: "inactive"; readonly PENDING: "pending" }

type StatusValue = (typeof STATUS)[keyof typeof STATUS]
// "active" | "inactive" | "pending"
```

## Combinando typeof com utility types

```typescript
const fullConfig = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
  retries: 3,
  debug: false,
  headers: { "Content-Type": "application/json" },
}

// Só parte do config
type MinimalConfig = Pick<typeof fullConfig, "apiUrl" | "timeout">
// { apiUrl: string; timeout: number }

// Config onde tudo é opcional
type PartialConfig = Partial<typeof fullConfig>
```

## ReturnType com typeof (padrão avançado)

```typescript
async function fetchUser(id: string) {
  const response = await fetch(`/api/users/${id}`)
  return response.json() as Promise<{ id: string; name: string; email: string }>
}

// Extrai o tipo de retorno da função (unwrapped da Promise)
type User = Awaited<ReturnType<typeof fetchUser>>
// { id: string; name: string; email: string }
```
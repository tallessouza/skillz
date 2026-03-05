# Code Examples: TypeScript Pick Utility Type

## Exemplo base da aula

```typescript
interface Book {
  title: string
  pages: number
  author: string
  description: string
}

// Abordagem ERRADA: duplicar interface
interface BookPreview {
  title: string
}

// Abordagem CORRETA: usar Pick
const book1: BookPreview = { title: "TypeScript" }
const book2: Pick<Book, "title" | "pages"> = { title: "TypeScript", pages: 150 }
```

## Variacoes praticas

### Pick para props de componente React

```typescript
interface User {
  id: string
  name: string
  email: string
  avatar: string
  createdAt: Date
  role: "admin" | "user"
}

// Card so precisa de nome e avatar
type UserCardProps = Pick<User, "name" | "avatar">

// Lista precisa de id, nome e role
type UserListItemProps = Pick<User, "id" | "name" | "role">
```

### Pick para payloads de API

```typescript
interface Product {
  id: string
  name: string
  price: number
  stock: number
  description: string
  createdAt: Date
}

// Criar produto nao envia id nem createdAt
type CreateProductPayload = Pick<Product, "name" | "price" | "stock" | "description">

// Listagem mostra so o basico
type ProductListItem = Pick<Product, "id" | "name" | "price">
```

### Pick com type alias

```typescript
interface Order {
  id: string
  userId: string
  items: OrderItem[]
  total: number
  status: "pending" | "paid" | "shipped" | "delivered"
  createdAt: Date
}

// Pode atribuir a um type alias para reusar
type OrderSummary = Pick<Order, "id" | "total" | "status">

const orders: OrderSummary[] = [
  { id: "1", total: 9990, status: "paid" },
  { id: "2", total: 4500, status: "pending" },
]
```

### Pick combinado com outras utility types

```typescript
interface Config {
  host: string
  port: number
  debug: boolean
  logLevel: "info" | "warn" | "error"
  maxRetries: number
}

// Pega algumas propriedades e torna opcionais
type OptionalNetworkConfig = Partial<Pick<Config, "host" | "port" | "maxRetries">>

// Resultado: { host?: string; port?: number; maxRetries?: number }
```

### Demonstracao do autocomplete

```typescript
interface Book {
  title: string
  pages: number
  author: string
  description: string
}

// Ao digitar Pick<Book, ""> e pressionar Ctrl+Space:
// O editor sugere: "title", "pages", "author", "description"

// Apos selecionar "title" e adicionar |:
// Pick<Book, "title" | "">
// O editor sugere: "pages", "author", "description" (exclui title ja selecionado)
```
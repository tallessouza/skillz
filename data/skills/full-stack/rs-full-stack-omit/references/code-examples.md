# Code Examples: Omit

## Exemplo base da aula

```typescript
interface Book {
  title: string
  pages: number
  author: string
  description: string
}

// Omit simples — sem description
const book1: Omit<Book, "description"> = {
  title: "TypeScript",
  pages: 100,
  author: "Rodrigo",
}

// Omit multiplo — sem description e pages
const book2: Omit<Book, "description" | "pages"> = {
  title: "TypeScript",
  author: "Rodrigo",
}
```

## Variacao: Criar type alias reutilizavel

```typescript
// Em vez de usar Omit inline, crie um type alias
type BookSummary = Omit<Book, "description" | "pages">

const summary: BookSummary = {
  title: "TypeScript",
  author: "Rodrigo",
}
```

## Variacao: Entidade de banco de dados

```typescript
interface User {
  id: string
  name: string
  email: string
  createdAt: Date
  updatedAt: Date
}

// Tipo para criacao — sem campos gerados automaticamente
type CreateUserInput = Omit<User, "id" | "createdAt" | "updatedAt">

const newUser: CreateUserInput = {
  name: "Rodrigo",
  email: "rodrigo@email.com",
}
```

## Variacao: Props de componente React

```typescript
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  footer: React.ReactNode
}

// Modal sem footer customizado
type SimpleModalProps = Omit<ModalProps, "footer">

function SimpleModal({ isOpen, onClose, title, children }: SimpleModalProps) {
  // ...
}
```

## Variacao: Omit combinado com intersecao

```typescript
interface Product {
  id: string
  name: string
  price: number
  stock: number
}

// Substituir o tipo de uma propriedade
type ProductWithFormattedPrice = Omit<Product, "price"> & {
  price: string // agora e string formatada
}

const product: ProductWithFormattedPrice = {
  id: "1",
  name: "Notebook",
  price: "R$ 3.500,00",
  stock: 10,
}
```

## Variacao: API response vs request

```typescript
interface Article {
  id: string
  title: string
  content: string
  authorId: string
  publishedAt: Date | null
  viewCount: number
}

// Para criar artigo — sem campos do servidor
type CreateArticleRequest = Omit<Article, "id" | "publishedAt" | "viewCount">

// Para atualizar — sem id (vem na URL) e sem viewCount
type UpdateArticleRequest = Omit<Article, "id" | "viewCount">
```
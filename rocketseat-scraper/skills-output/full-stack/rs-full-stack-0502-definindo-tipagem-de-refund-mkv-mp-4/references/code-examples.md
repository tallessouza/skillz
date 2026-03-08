# Code Examples: Definindo Tipagem de Retorno de API

## Exemplo 1: Estrutura completa de arquivos DTO

### DTOs/categories.d.ts
```typescript
enum CategoriesAPI {
  Food = "food",
  Others = "others",
  Services = "services",
  Transport = "transport",
  Accommodation = "accommodation",
}
```

### DTOs/refound.d.ts
```typescript
type RefoundAPIResponse = {
  id: string
  userId: string
  name: string
  category: CategoriesAPI
  amount: number
  filename: string
  user: {
    name: string
  }
}

type RefoundsPaginationAPIResponse = {
  refounds: RefoundAPIResponse[]
  pagination: {
    page: number
    perPage: number
    totalRecords: number
    totalPages: number
  }
}
```

## Exemplo 2: Usando a tipagem na requisição

### Sem tipagem (antes)
```typescript
// Dashboard.tsx
const { data } = await api.get("/refounds")

// ❌ Nenhum autocomplete
console.log(data.refounds) // any
console.log(data.pagination) // any
```

### Com tipagem (depois)
```typescript
// Dashboard.tsx
const { data } = await api.get<RefoundsPaginationAPIResponse>("/refounds")

// ✅ Autocomplete completo
data.refounds[0].id          // string
data.refounds[0].name        // string
data.refounds[0].category    // CategoriesAPI
data.refounds[0].amount      // number
data.refounds[0].user.name   // string
data.pagination.page          // number
data.pagination.perPage       // number
data.pagination.totalRecords  // number
data.pagination.totalPages    // number
```

## Exemplo 3: Variação — DTO para outra entidade (Users)

Aplicando o mesmo padrão para uma entidade diferente:

### DTOs/roles.d.ts
```typescript
enum RolesAPI {
  Admin = "admin",
  User = "user",
  Manager = "manager",
}
```

### DTOs/user.d.ts
```typescript
type UserAPIResponse = {
  id: string
  name: string
  email: string
  role: RolesAPI
  createdAt: string
}

type UsersPaginationAPIResponse = {
  users: UserAPIResponse[]
  pagination: {
    page: number
    perPage: number
    totalRecords: number
    totalPages: number
  }
}
```

### Uso
```typescript
const { data } = await api.get<UsersPaginationAPIResponse>("/users")
data.users[0].role  // RolesAPI — autocomplete com Admin, User, Manager
```

## Exemplo 4: Variação — Tipo de paginação reutilizável

Quando múltiplas rotas usam o mesmo formato de paginação:

### DTOs/pagination.d.ts
```typescript
type PaginationAPIResponse = {
  page: number
  perPage: number
  totalRecords: number
  totalPages: number
}
```

### DTOs/refound.d.ts (usando paginação compartilhada)
```typescript
type RefoundsPaginationAPIResponse = {
  refounds: RefoundAPIResponse[]
  pagination: PaginationAPIResponse
}
```

### DTOs/user.d.ts (usando paginação compartilhada)
```typescript
type UsersPaginationAPIResponse = {
  users: UserAPIResponse[]
  pagination: PaginationAPIResponse
}
```

## Exemplo 5: Variação — Com generic de paginação

Nível avançado — tipo genérico para qualquer lista paginada:

```typescript
// DTOs/pagination.d.ts
type PaginatedResponse<T> = {
  data: T[]
  pagination: {
    page: number
    perPage: number
    totalRecords: number
    totalPages: number
  }
}

// Uso
type RefoundsPaginated = PaginatedResponse<RefoundAPIResponse>
type UsersPaginated = PaginatedResponse<UserAPIResponse>
```

## Exemplo 6: Usando o tipo unitário isoladamente

O instrutor enfatiza criar o tipo separado para poder usar sozinho:

```typescript
// Componente que renderiza UM refound
interface RefoundCardProps {
  refound: RefoundAPIResponse
}

function RefoundCard({ refound }: RefoundCardProps) {
  return (
    <div>
      <h3>{refound.name}</h3>
      <span>{refound.category}</span>
      <span>{refound.amount}</span>
      <p>Solicitado por: {refound.user.name}</p>
    </div>
  )
}
```

## Exemplo 7: Enum em condicionais

```typescript
function getCategoryLabel(category: CategoriesAPI): string {
  switch (category) {
    case CategoriesAPI.Food:
      return "Alimentação"
    case CategoriesAPI.Transport:
      return "Transporte"
    case CategoriesAPI.Accommodation:
      return "Hospedagem"
    case CategoriesAPI.Services:
      return "Serviços"
    case CategoriesAPI.Others:
      return "Outros"
  }
}

// TypeScript garante que todos os cases são cobertos (exhaustive check)
```

## Exemplo 8: Axios vs Fetch — generics

### Com Axios
```typescript
const { data } = await api.get<RefoundsPaginationAPIResponse>("/refounds")
// data já é tipado como RefoundsPaginationAPIResponse
```

### Com Fetch nativo
```typescript
const response = await fetch("/api/refounds")
const data: RefoundsPaginationAPIResponse = await response.json()
// Precisa tipar manualmente o .json()
```

### Com wrapper tipado para Fetch
```typescript
async function typedFetch<T>(url: string): Promise<T> {
  const response = await fetch(url)
  return response.json() as Promise<T>
}

const data = await typedFetch<RefoundsPaginationAPIResponse>("/api/refounds")
```
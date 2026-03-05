# Code Examples: Conclusao do Modulo TypeScript

## Resumo dos patterns TypeScript fundamentais do modulo

Esta aula e de encerramento e nao contem codigo novo. Abaixo, um resumo dos patterns centrais cobertos ao longo do modulo que serao aplicados nos proximos modulos (React e Node).

### Tipos basicos e interfaces

```typescript
// Tipos primitivos
let name: string = "Rocketseat"
let age: number = 25
let isActive: boolean = true

// Interface para objetos
interface User {
  name: string
  email: string
  age: number
  isActive: boolean
}
```

### Generics

```typescript
// Funcao generica
function getFirst<T>(items: T[]): T {
  return items[0]
}

const firstUser = getFirst<User>(users)
const firstName = getFirst<string>(names)
```

### Utility types

```typescript
// Partial — todos os campos opcionais
type UpdateUser = Partial<User>

// Pick — selecionar campos
type UserPreview = Pick<User, "name" | "email">

// Omit — excluir campos
type UserWithoutEmail = Omit<User, "email">
```

### Union types e narrowing

```typescript
type Status = "active" | "inactive" | "pending"

function handleStatus(status: Status) {
  switch (status) {
    case "active":
      return "Usuario ativo"
    case "inactive":
      return "Usuario inativo"
    case "pending":
      return "Aguardando aprovacao"
  }
}
```

### Aplicacao futura: React

```typescript
// Como esses patterns aparecerao no React
interface ButtonProps {
  label: string
  variant: "primary" | "secondary"
  onClick: () => void
  disabled?: boolean
}

function Button({ label, variant, onClick, disabled }: ButtonProps) {
  return <button onClick={onClick} disabled={disabled}>{label}</button>
}
```

### Aplicacao futura: Node

```typescript
// Como esses patterns aparecerao no Node
interface CreateUserRequest {
  name: string
  email: string
  password: string
}

interface CreateUserResponse {
  user: Pick<User, "name" | "email">
  token: string
}

async function createUser(request: CreateUserRequest): Promise<CreateUserResponse> {
  // implementacao
}
```
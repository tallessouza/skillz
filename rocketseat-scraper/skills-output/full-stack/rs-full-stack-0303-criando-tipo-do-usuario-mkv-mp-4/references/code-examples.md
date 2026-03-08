# Code Examples: Tipagem de Contexto com DTOs

## Exemplo 1: Estrutura completa do DTO

```typescript
// src/dtos/user.d.ts

// Define os papéis possíveis do usuário na API
type UserAPIRole = "employee" | "manager" | "admin"

// Espelha o retorno do endpoint de login/sessão
type UserAPIResponse = {
  token: string
  user: {
    id: string
    name: string
    email: string
    role: UserAPIRole
  }
}
```

**Observação:** O arquivo não tem `export` — em `.d.ts`, os tipos são globais automaticamente.

## Exemplo 2: Tipagem do contexto de autenticação

```typescript
// src/contexts/auth.tsx
import { createContext, useContext, useState } from "react"

type AuthContext = {
  session: UserAPIResponse | null
}

const AuthContext = createContext<AuthContext>({} as AuthContext)

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<UserAPIResponse | null>(null)

  return (
    <AuthContext.Provider value={{ session }}>
      {children}
    </AuthContext.Provider>
  )
}

function useAuth() {
  const context = useContext(AuthContext)
  return context
}

export { AuthProvider, useAuth }
```

## Exemplo 3: Consumindo o contexto tipado nas rotas

```typescript
// src/routes/index.tsx
import { useAuth } from "../hooks/useAuth"

function Routes() {
  const context = useAuth()

  // TypeScript sabe que session pode ser null
  // Autocomplete mostra: context.session?.token, context.session?.user
  
  if (context.session) {
    // Dentro deste bloco, session não é null
    console.log(context.session.user.name)
    console.log(context.session.user.email)
    console.log(context.session.user.role)
    console.log(context.session.token)
  }
}
```

## Exemplo 4: Consumindo em um componente qualquer

```typescript
// src/pages/Dashboard.tsx
import { useAuth } from "../hooks/useAuth"

function Dashboard() {
  const context = useAuth()

  // Acesso seguro com optional chaining
  const userName = context.session?.user?.name

  return (
    <div>
      <h1>Bem-vindo, {userName ?? "Visitante"}</h1>
    </div>
  )
}
```

**Ponto do instrutor:** "De qualquer lugar eu consigo acessar o nome do usuário, essa é a mágica do contexto."

## Exemplo 5: Variação — DTO com campos opcionais

Se a API retorna campos que nem sempre estão presentes:

```typescript
// src/dtos/user.d.ts
type UserAPIRole = "employee" | "manager" | "admin"

type UserAPIResponse = {
  token: string
  user: {
    id: string
    name: string
    email: string
    role: UserAPIRole
    avatar?: string      // nem todo usuário tem avatar
    department?: string  // campo opcional
  }
}
```

## Exemplo 6: Variação — Contexto com mais campos

Conforme a aplicação cresce, o contexto pode incluir mais dados:

```typescript
type AuthContext = {
  session: UserAPIResponse | null
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => void
  isLoading: boolean
}
```

## Exemplo 7: Baseando DTOs no response da API

O instrutor inspeciona o retorno no Insomnia antes de criar os tipos:

```json
// Response do POST /sessions
{
  "token": "eyJhbGciOiJIUzI1...",
  "user": {
    "id": "uuid-here",
    "name": "João Silva",
    "email": "joao@email.com",
    "role": "employee",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

O DTO tipado ignora `created_at` e `updated_at` porque a aplicação não os utiliza:

```typescript
type UserAPIResponse = {
  token: string
  user: {
    id: string
    name: string
    email: string
    role: UserAPIRole
    // created_at e updated_at não tipados — app não usa
  }
}
```
# Code Examples: Salvando Dados de Autenticação no Contexto

## 1. Tipagem completa do contexto

```typescript
// types/api.ts
type UserApiResponse = {
  user: {
    id: string
    name: string
    email: string
    role: "manager" | "employee"
  }
  token: string
}

// contexts/auth-context.ts
type AuthContextType = {
  session: UserApiResponse | null
  save: (data: UserApiResponse) => void
}
```

## 2. Provider com função save

```typescript
// contexts/auth-provider.tsx
import { createContext, useState, ReactNode } from "react"

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<UserApiResponse | null>(null)

  function save(data: UserApiResponse) {
    setSession(data)
  }

  return (
    <AuthContext.Provider value={{ session, save }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }
```

## 3. Hook customizado para consumir o contexto

```typescript
// hooks/use-auth.ts
import { useContext } from "react"
import { AuthContext } from "../contexts/auth-context"

function useAuth() {
  const context = useContext(AuthContext)
  return context
}

export { useAuth }
```

## 4. Sign-in usando save do contexto

```typescript
// pages/sign-in.tsx
import { useAuth } from "../hooks/use-auth"
import { api } from "../services/api"

function SignIn() {
  const auth = useAuth()

  async function handleSignIn({ email, password }: SignInFormData) {
    try {
      const response = await api.post("/sessions", { email, password })
      auth.save(response.data)
      // Sem navigate() — as rotas reagem automaticamente
    } catch (error) {
      console.error("Erro ao fazer login:", error)
    }
  }

  return (
    <form onSubmit={handleSubmit(handleSignIn)}>
      <input type="email" placeholder="E-mail" />
      <input type="password" placeholder="Senha" />
      <button type="submit">Entrar</button>
    </form>
  )
}
```

## 5. Rotas reagindo ao estado de sessão

### Antes (com constante de teste)
```typescript
// routes/index.tsx
// ❌ Constante fixa — remover quando contexto estiver pronto
const session = { user: { role: "manager" } }

function route() {
  switch (session?.user.role) {
    case "manager":
      return <ManagerRoutes />
    case "employee":
      return <EmployeeRoutes />
    default:
      return <AuthRoutes />
  }
}

export function Routes() {
  return <BrowserRouter>{route()}</BrowserRouter>
}
```

### Depois (com estado do contexto)
```typescript
// routes/index.tsx
import { useAuth } from "../hooks/use-auth"

export function Routes() {
  const { session } = useAuth()

  function route() {
    switch (session?.user.role) {
      case "manager":
        return <ManagerRoutes />
      case "employee":
        return <EmployeeRoutes />
      default:
        return <AuthRoutes />
    }
  }

  return <BrowserRouter>{route()}</BrowserRouter>
}
```

## 6. Testando diferentes estados manualmente

O instrutor demonstra que mudar o valor inicial do useState altera a rota exibida:

```typescript
// Para testar rota de manager:
const [session, setSession] = useState<UserApiResponse | null>({
  user: { id: "1", name: "Test", email: "test@test.com", role: "manager" },
  token: "fake-token"
})

// Para testar rota de employee:
const [session, setSession] = useState<UserApiResponse | null>({
  user: { id: "1", name: "Test", email: "test@test.com", role: "employee" },
  token: "fake-token"
})

// Para testar rota de auth (não logado):
const [session, setSession] = useState<UserApiResponse | null>(null)
```

## 7. Fluxo completo da demonstração

```
1. Usuário abre app → session é null → switch cai no default → AuthRoutes → tela de SignIn

2. Usuário preenche email e senha → clica em "Entrar"
   → handleSignIn dispara
   → api.post("/sessions", { email, password })
   → API retorna { user: { role: "employee", ... }, token: "..." }
   → auth.save(response.data)
   → setSession(response.data)
   → session agora tem user.role = "employee"
   → componente Routes re-renderiza
   → switch avalia "employee"
   → EmployeeRoutes renderiza
   → usuário vê página de criar solicitação

3. Se mesmo fluxo com role "manager":
   → switch avalia "manager"
   → ManagerRoutes renderiza
   → usuário vê dashboard de solicitações
```
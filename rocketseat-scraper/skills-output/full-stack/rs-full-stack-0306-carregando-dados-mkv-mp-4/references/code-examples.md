# Code Examples: Carregando Dados de Autenticação

## Exemplo 1: Contexto de auth completo com loadUser

```typescript
// src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from "react"

interface User {
  id: string
  name: string
  email: string
  role: "employee" | "admin"
}

interface Session {
  token: string
  user: User
}

interface AuthContextData {
  session: Session | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => void
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

const TOKEN_KEY = "@refound:token"
const USER_KEY = "@refound:user"

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Função interna — não exposta no contexto
  function loadUser() {
    const token = localStorage.getItem(TOKEN_KEY)
    const user = localStorage.getItem(USER_KEY)

    if (token && user) {
      setSession({ token, user: JSON.parse(user) })
    }

    setIsLoading(false)
  }

  useEffect(() => {
    loadUser()
  }, [])

  async function signIn(email: string, password: string) {
    // ... lógica de login
    const response = await api.post("/sessions", { email, password })
    const { token, user } = response.data

    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))

    setSession({ token, user })
  }

  function signOut() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setSession(null)
  }

  return (
    <AuthContext.Provider value={{ session, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

function useAuth() {
  return useContext(AuthContext)
}

export { AuthProvider, useAuth }
```

## Exemplo 2: Index de rotas com guarda isLoading

```typescript
// src/routes/index.tsx
import { useAuth } from "../contexts/AuthContext"
import { Loading } from "../components/Loading"
import { AppRoutes } from "./app.routes"
import { AuthRoutes } from "./auth.routes"

export function Routes() {
  const { session, isLoading } = useAuth()

  // Guarda: mostra loading enquanto verifica localStorage
  if (isLoading) {
    return <Loading />
  }

  // Só renderiza rotas após verificação completa
  if (session) {
    if (session.user.role === "employee") {
      return <EmployeeRoutes />
    }
    return <AdminRoutes />
  }

  return <AuthRoutes />
}
```

## Exemplo 3: Componente Loading simples

```typescript
// src/components/Loading.tsx
export function Loading() {
  return (
    <div className="loading-container">
      <p>Carregando...</p>
    </div>
  )
}
```

## Exemplo 4: Antes vs. Depois — Evolução do index de rotas

### Antes (com isLoading hardcoded)
```typescript
export function Routes() {
  const { session } = useAuth()
  const isLoading = false // constante local, não reativa

  if (isLoading) {
    return <Loading />
  }

  return session ? <AppRoutes /> : <AuthRoutes />
}
```

### Depois (isLoading vindo do contexto)
```typescript
export function Routes() {
  const { session, isLoading } = useAuth()
  // isLoading agora é estado real, controlado pelo contexto

  if (isLoading) {
    return <Loading />
  }

  return session ? <AppRoutes /> : <AuthRoutes />
}
```

## Exemplo 5: Variação — loadUser com tratamento de erro

```typescript
function loadUser() {
  try {
    const token = localStorage.getItem(TOKEN_KEY)
    const userString = localStorage.getItem(USER_KEY)

    if (token && userString) {
      const user = JSON.parse(userString)
      setSession({ token, user })
    }
  } catch {
    // Se JSON.parse falhar (dados corrompidos), limpa o storage
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  } finally {
    setIsLoading(false)
  }
}
```

## Exemplo 6: Variação — chaves do localStorage como constantes

```typescript
// Padrão usado no curso: prefixo @app:recurso
const STORAGE_KEYS = {
  TOKEN: "@refound:token",
  USER: "@refound:user",
} as const

// Uso consistente em save e load
localStorage.setItem(STORAGE_KEYS.TOKEN, token)
localStorage.getItem(STORAGE_KEYS.TOKEN)
```

## Fluxo visual completo

```
1. Usuário faz login
   → signIn() salva no localStorage + atualiza estado
   → Rotas renderizam baseado na session

2. Usuário fecha o navegador e reabre
   → Estado: session=null, isLoading=true
   → Tela: <Loading />
   → useEffect → loadUser()
   → localStorage tem token e user
   → setSession() + setIsLoading(false)
   → Tela: <AppRoutes /> (sem piscada de login)

3. Usuário sem sessão anterior
   → useEffect → loadUser()
   → localStorage vazio
   → setIsLoading(false) (sem setSession)
   → Tela: <AuthRoutes /> (login normal)
```
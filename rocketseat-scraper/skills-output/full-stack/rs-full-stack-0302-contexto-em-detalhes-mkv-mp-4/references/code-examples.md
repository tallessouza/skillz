# Code Examples: React Context em Detalhes

## Exemplo 1: Contexto basico com createContext

```tsx
// src/context/auth-context.tsx
import { createContext } from "react"

// Valor inicial e usado apenas quando nao ha Provider acima na arvore
export const AuthContext = createContext({ name: "Rodrigo" })
```

## Exemplo 2: Usando o Provider no App.tsx (versao inline)

```tsx
// src/app.tsx
import { AuthContext } from "./context/auth-context"
import { Routes } from "./routes"

export function App() {
  return (
    <AuthContext.Provider value={{ name: "Rodrigo" }}>
      <Routes />
    </AuthContext.Provider>
  )
}
```

## Exemplo 3: Consumindo com useContext (React 18)

```tsx
// src/routes/index.tsx
import { useContext } from "react"
import { AuthContext } from "../context/auth-context"

export function Home() {
  const context = useContext(AuthContext)
  console.log(context) // { name: "Rodrigo" }
  return <p>{context.name}</p>
}
```

## Exemplo 4: Consumindo com use() (React 19)

```tsx
// src/routes/index.tsx
import { use } from "react"
import { AuthContext } from "../context/auth-context"

export function Home() {
  const context = use(AuthContext)
  console.log(context) // { name: "Rodrigo" }
  return <p>{context.name}</p>
}
```

## Exemplo 5: Hook customizado useAuth

```tsx
// src/hooks/use-auth.tsx
import { use } from "react"
import { AuthContext } from "../context/auth-context"

export function useAuth() {
  const context = use(AuthContext)
  return context
}
```

Uso em componentes:

```tsx
// src/routes/index.tsx
import { useAuth } from "../hooks/use-auth"

export function Home() {
  const { name } = useAuth()
  return <p>{name}</p>
}
```

## Exemplo 6: Provider extraido como componente

```tsx
// src/context/auth-context.tsx
import { createContext, type ReactNode } from "react"

export const AuthContext = createContext({})

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <AuthContext.Provider value={{ name: "Rodrigo" }}>
      {children}
    </AuthContext.Provider>
  )
}
```

App.tsx simplificado:

```tsx
// src/app.tsx
import { AuthProvider } from "./context/auth-context"
import { Routes } from "./routes"

export function App() {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  )
}
```

## Exemplo 7: Contexto com multiplas propriedades

```tsx
// src/context/auth-context.tsx
import { createContext, type ReactNode } from "react"

interface AuthContextData {
  name: string
  email: string
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <AuthContext.Provider value={{ name: "Rodrigo", email: "rodrigo@email.com" }}>
      {children}
    </AuthContext.Provider>
  )
}
```

Consumindo propriedades especificas:

```tsx
import { useAuth } from "../hooks/use-auth"

function Profile() {
  const { name, email } = useAuth()
  return (
    <div>
      <p>{name}</p>
      <p>{email}</p>
    </div>
  )
}
```

## Exemplo 8: Evolucao completa (antes → depois)

### Antes: tudo acoplado no componente

```tsx
// src/routes/index.tsx
import { use } from "react"
import { AuthContext } from "../context/auth-context"

export function Home() {
  const context = use(AuthContext)
  return <p>{context.name}</p>
}

// src/app.tsx
import { AuthContext } from "./context/auth-context"
import { Routes } from "./routes"

export function App() {
  return (
    <AuthContext.Provider value={{ name: "Rodrigo" }}>
      <Routes />
    </AuthContext.Provider>
  )
}
```

### Depois: tres camadas separadas

```tsx
// src/context/auth-context.tsx
import { createContext, type ReactNode } from "react"

export const AuthContext = createContext({})

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <AuthContext.Provider value={{ name: "Rodrigo" }}>
      {children}
    </AuthContext.Provider>
  )
}

// src/hooks/use-auth.tsx
import { use } from "react"
import { AuthContext } from "../context/auth-context"

export function useAuth() {
  return use(AuthContext)
}

// src/routes/index.tsx
import { useAuth } from "../hooks/use-auth"

export function Home() {
  const { name } = useAuth()
  return <p>{name}</p>
}

// src/app.tsx
import { AuthProvider } from "./context/auth-context"
import { Routes } from "./routes"

export function App() {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  )
}
```
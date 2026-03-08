---
name: rs-full-stack-contexto-em-detalhes
description: "Enforces React Context API best practices when creating contexts, providers, and custom hooks for state sharing. Use when user asks to 'create a context', 'share state between components', 'build an auth provider', 'use useContext', or 'create a custom hook for context'. Applies rules: separate context/provider/hook into dedicated files, use custom hooks to encapsulate context consumption, extract Provider as a standalone component with children. Make sure to use this skill whenever implementing shared state with React Context. Not for Redux, Zustand, or server-side state management."
---

# React Context em Detalhes

> Organize contextos em tres camadas separadas: contexto, provider, e hook customizado — cada um em seu lugar, pronto para uso.

## Rules

1. **Crie uma pasta `context/`** — todos os contextos vivem em `src/context/`, porque centralizar facilita descoberta e manutencao
2. **Exporte o contexto separado do provider** — `createContext` em um arquivo, provider como componente separado, porque responsabilidades distintas nao devem se misturar
3. **Crie um hook customizado para cada contexto** — `useAlf` ao inves de `useContext(AlfContext)` em cada componente, porque elimina importacoes repetitivas e centraliza a logica de acesso
4. **Provider recebe `children` e envolve componentes** — use `React.ReactNode` para tipar children, porque o provider e um componente wrapper
5. **Use `use()` do React 19 ao inves de `useContext()`** — comportamento identico com sintaxe mais simples, porque e a API moderna recomendada
6. **Envolva as rotas no nivel mais alto necessario** — coloque o Provider no `App.tsx` por volta das rotas, porque tudo dentro do provider tem acesso ao contexto

## How to write

### Criando o contexto

```tsx
// src/context/auth-context.tsx
import { createContext } from "react"

export const AuthContext = createContext({})
```

### Extraindo o Provider como componente

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

### Criando hook customizado

```tsx
// src/hooks/use-auth.tsx
import { use } from "react"
import { AuthContext } from "../context/auth-context"

export function useAuth() {
  const context = use(AuthContext)
  return context
}
```

### Usando no App.tsx

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

### Consumindo o contexto em qualquer componente

```tsx
// src/routes/index.tsx
import { useAuth } from "../hooks/use-auth"

export function Home() {
  const { name } = useAuth()
  return <p>{name}</p>
}
```

## Example

**Before (repetitivo e acoplado):**
```tsx
// Cada componente repete isso:
import { use } from "react"
import { AuthContext } from "../context/auth-context"

function Profile() {
  const context = use(AuthContext)
  return <p>{context.name}</p>
}
```

**After (hook customizado):**
```tsx
import { useAuth } from "../hooks/use-auth"

function Profile() {
  const { name } = useAuth()
  return <p>{name}</p>
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Dado compartilhado entre muitas rotas | Criar contexto + provider + hook |
| Apenas 2 componentes vizinhos | Props bastam, contexto e overkill |
| Provider com logica complexa | Extrair provider como componente separado |
| React 19 disponivel | Usar `use()` ao inves de `useContext()` |
| Multiplos contextos | Uma pasta `context/`, um hook por contexto em `hooks/` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `useContext(AuthContext)` em cada componente | `useAuth()` via hook customizado |
| Provider inline no App com value hardcoded | Provider extraido como componente proprio |
| Contexto e provider no mesmo export sem separacao | `AuthContext` + `AuthProvider` exportados separadamente |
| `import { AuthContext } from ...` em componentes de pagina | `import { useAuth } from "../hooks/use-auth"` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre separacao de contexto, provider e hook
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
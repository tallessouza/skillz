# Code Examples: Criando Rotas Separadas por Contexto

## Exemplo 1: Página mínima (como mostrado na aula)

```tsx
// src/pages/refund.tsx
export function Refund() {
  return <h1>Refund</h1>
}
```

Estrutura mínima — apenas um export nomeado com conteúdo placeholder. Suficiente para testar a rota.

## Exemplo 2: Arquivo de rotas do funcionário

```tsx
// src/routes/employ-routes.tsx
import { Routes, Route } from "react-router-dom"

import { Refund } from "../pages/refund"
import { NotFound } from "../pages/not-found"

export function EmployRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Refund />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
```

Pontos importantes:
- Import de `Routes` e `Route` do `react-router-dom`
- Rota raiz `/` aponta para a página principal do contexto
- Wildcard `*` captura qualquer URL não mapeada

## Exemplo 3: Troca manual no index

```tsx
// src/routes/index.tsx
import { BrowserRouter } from "react-router-dom"

// import { AuthRoutes } from "./auth-routes"
import { EmployRoutes } from "./employ-routes"

export function AppRoutes() {
  return (
    <BrowserRouter>
      <EmployRoutes />
    </BrowserRouter>
  )
}
```

Por enquanto, comentando `AuthRoutes` e renderizando `EmployRoutes` diretamente.

## Variação: Múltiplas páginas no grupo employee

```tsx
// src/routes/employ-routes.tsx
import { Routes, Route } from "react-router-dom"

import { Refund } from "../pages/refund"
import { RefundDetails } from "../pages/refund-details"
import { Profile } from "../pages/profile"
import { NotFound } from "../pages/not-found"

export function EmployRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Refund />} />
      <Route path="/refund/:id" element={<RefundDetails />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
```

Conforme novas páginas são criadas, basta adicionar mais `Route` dentro do mesmo grupo.

## Variação: Futura dinamização (mencionada pelo instrutor)

```tsx
// src/routes/index.tsx — versão futura (dinâmica)
import { BrowserRouter } from "react-router-dom"

import { AuthRoutes } from "./auth-routes"
import { EmployRoutes } from "./employ-routes"
import { useAuth } from "../hooks/use-auth"

export function AppRoutes() {
  const { isAuthenticated, user } = useAuth()

  return (
    <BrowserRouter>
      {isAuthenticated ? <EmployRoutes /> : <AuthRoutes />}
    </BrowserRouter>
  )
}
```

O ternário troca o grupo inteiro de rotas baseado no estado de autenticação.

## Variação: Múltiplos perfis de usuário

```tsx
// src/routes/index.tsx — com múltiplos perfis
import { BrowserRouter } from "react-router-dom"

import { AuthRoutes } from "./auth-routes"
import { EmployRoutes } from "./employ-routes"
import { AdminRoutes } from "./admin-routes"
import { useAuth } from "../hooks/use-auth"

export function AppRoutes() {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated) {
    return (
      <BrowserRouter>
        <AuthRoutes />
      </BrowserRouter>
    )
  }

  return (
    <BrowserRouter>
      {user.role === "admin" ? <AdminRoutes /> : <EmployRoutes />}
    </BrowserRouter>
  )
}
```

Cada perfil tem seu próprio arquivo de rotas, e a lógica no index decide qual renderizar.

## Padrão completo: Auth Routes (contexto anterior)

```tsx
// src/routes/auth-routes.tsx
import { Routes, Route } from "react-router-dom"

import { SignIn } from "../pages/sign-in"
import { SignUp } from "../pages/sign-up"
import { NotFound } from "../pages/not-found"

export function AuthRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
```

Mesmo padrão: grupo isolado, catch-all próprio, componentes importados das pages.
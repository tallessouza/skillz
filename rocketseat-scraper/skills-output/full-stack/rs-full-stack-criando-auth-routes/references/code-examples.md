# Code Examples: Criando Auth Routes

## Exemplo 1: Estrutura basica (da aula)

### Pagina de signin

```typescript
// src/pages/signin.tsx
export function SignIn() {
  return <h1>Sign In</h1>
}
```

### Auth routes

```typescript
// src/routes/auth-routes.tsx
import { Route, Routes } from "react-router"
import { SignIn } from "../pages/signin"

export function AuthRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
    </Routes>
  )
}
```

### Index de rotas

```typescript
// src/routes/index.tsx
import { BrowserRouter } from "react-router"
import { AuthRoutes } from "./auth-routes"

export function Routes() {
  return (
    <BrowserRouter>
      <AuthRoutes />
    </BrowserRouter>
  )
}
```

### App.tsx conectando as rotas

```typescript
// src/app.tsx
import { Routes } from "./routes"

export function App() {
  return <Routes />
}
```

## Exemplo 2: Com decisao de auth no index

```typescript
// src/routes/index.tsx
import { BrowserRouter } from "react-router"
import { AuthRoutes } from "./auth-routes"
import { AppRoutes } from "./app-routes"

export function Routes() {
  const isAuthenticated = false // futuramente vira do contexto de auth

  return (
    <BrowserRouter>
      {isAuthenticated ? <AppRoutes /> : <AuthRoutes />}
    </BrowserRouter>
  )
}
```

## Exemplo 3: Auth routes com signup

```typescript
// src/routes/auth-routes.tsx
import { Route, Routes } from "react-router"
import { SignIn } from "../pages/signin"
import { SignUp } from "../pages/signup"

export function AuthRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  )
}
```

## Exemplo 4: Multiplos perfis

```typescript
// src/routes/index.tsx
import { BrowserRouter } from "react-router"
import { AuthRoutes } from "./auth-routes"
import { AppRoutes } from "./app-routes"
import { AdminRoutes } from "./admin-routes"

export function Routes() {
  const { isAuthenticated, user } = useAuth()

  function resolveRoutes() {
    if (!isAuthenticated) return <AuthRoutes />
    if (user.role === "admin") return <AdminRoutes />
    return <AppRoutes />
  }

  return (
    <BrowserRouter>
      {resolveRoutes()}
    </BrowserRouter>
  )
}
```

## Exemplo 5: App routes para usuario logado

```typescript
// src/routes/app-routes.tsx
import { Route, Routes } from "react-router"
import { Dashboard } from "../pages/dashboard"
import { Profile } from "../pages/profile"
import { Requests } from "../pages/requests"

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/requests" element={<Requests />} />
    </Routes>
  )
}
```

## Exemplo 6: Admin routes

```typescript
// src/routes/admin-routes.tsx
import { Route, Routes } from "react-router"
import { AdminPanel } from "../pages/admin-panel"
import { UserManagement } from "../pages/user-management"
import { AllRequests } from "../pages/all-requests"

export function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminPanel />} />
      <Route path="/users" element={<UserManagement />} />
      <Route path="/requests" element={<AllRequests />} />
    </Routes>
  )
}
```

## Instalacao do React Router

```bash
npm i react-router
```

## Estrutura de pastas final

```
src/
├── pages/
│   ├── signin.tsx
│   ├── signup.tsx
│   ├── dashboard.tsx
│   ├── profile.tsx
│   ├── requests.tsx
│   ├── admin-panel.tsx
│   ├── user-management.tsx
│   └── all-requests.tsx
├── routes/
│   ├── index.tsx           # BrowserRouter + decisao de qual grupo
│   ├── auth-routes.tsx     # Rotas para nao-logado
│   ├── app-routes.tsx      # Rotas para usuario comum
│   └── admin-routes.tsx    # Rotas para admin
└── app.tsx                 # Renderiza <Routes />
```
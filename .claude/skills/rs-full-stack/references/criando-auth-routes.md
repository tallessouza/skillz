---
name: rs-full-stack-criando-auth-routes
description: "Enforces authentication route architecture when structuring React Router routes by user profile and login state. Use when user asks to 'create login page', 'setup auth routes', 'configure react router', 'separate routes by role', or 'protect routes by authentication'. Applies pattern: route files grouped by auth state (auth-routes, app-routes, admin-routes), centralized route decision in index, BrowserRouter at top level. Make sure to use this skill whenever building multi-profile navigation or login/signup flows in React. Not for backend auth logic, JWT handling, or API route protection."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: react-routing
  tags: [react, react-router, authentication, routes, login]
---

# Criando Auth Routes

> Separe arquivos de rotas por perfil de usuario e estado de autenticacao, centralizando a decisao de qual grupo carregar em um unico index.

## Rules

1. **Agrupe rotas por estado de autenticacao** — `auth-routes.tsx` para nao-logado, `app-routes.tsx` para logado, porque isso impede acesso manual a rotas restritas
2. **Centralize a decisao de roteamento em `routes/index.tsx`** — esse arquivo decide qual grupo de rotas carregar baseado no estado de login, porque evita logica de auth espalhada pelos componentes
3. **Use `BrowserRouter` apenas no index de rotas** — nunca em componentes internos, porque multiplos routers causam comportamento imprevisivel
4. **`app.tsx` renderiza apenas o componente `<Routes />`** — sem logica de negocio no ponto de entrada, porque mantem o app.tsx como orquestrador puro
5. **Crie a pasta `pages/` para componentes de pagina** — separe paginas de componentes reutilizaveis, porque facilita navegacao no projeto

## Steps

### Step 1: Criar estrutura de pastas

```
src/
├── pages/
│   └── signin.tsx
├── routes/
│   ├── index.tsx
│   └── auth-routes.tsx
└── app.tsx
```

### Step 2: Instalar React Router

```bash
npm i react-router
```

### Step 3: Criar pagina de signin

```typescript
// src/pages/signin.tsx
export function SignIn() {
  return <h1>Sign In</h1>
}
```

### Step 4: Criar auth-routes

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

### Step 5: Criar index de rotas com decisao centralizada

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

### Step 6: Conectar ao app.tsx

```typescript
// src/app.tsx
import { Routes } from "./routes"

export function App() {
  return <Routes />
}
```

## Example

**Before (rotas misturadas no app.tsx):**
```typescript
// app.tsx — tudo junto, sem separacao por perfil
import { BrowserRouter, Route, Routes } from "react-router"

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  )
}
```

**After (rotas separadas por perfil):**
```typescript
// routes/auth-routes.tsx — rotas para usuario nao-logado
export function AuthRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  )
}

// routes/app-routes.tsx — rotas para usuario logado
export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
    </Routes>
  )
}

// routes/index.tsx — decisao centralizada
export function Routes() {
  const isAuthenticated = /* estado de auth */
  return (
    <BrowserRouter>
      {isAuthenticated ? <AppRoutes /> : <AuthRoutes />}
    </BrowserRouter>
  )
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Usuario nao-logado tenta acessar rota protegida | Renderize apenas AuthRoutes — a rota nem existe para ele |
| Multiplos perfis (admin, funcionario) | Crie arquivo de rotas separado por perfil: `admin-routes.tsx`, `employee-routes.tsx` |
| Pagina compartilhada entre perfis | Coloque no grupo de rotas mais restritivo e importe nos outros |
| Nova pagina de auth (signup, forgot-password) | Adicione Route dentro de `auth-routes.tsx` |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Todas as rotas em `app.tsx` | Separe em arquivos por perfil de auth |
| `BrowserRouter` em cada arquivo de rotas | `BrowserRouter` apenas em `routes/index.tsx` |
| Verificar auth dentro de cada pagina | Decidir qual grupo de rotas carregar no index |
| Nomear arquivo como `router.tsx` | Use `routes/index.tsx` como ponto de entrada |

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| Erro `useRoutes() may be used only in context of <Router>` | `BrowserRouter` ausente ou duplicado | Coloque `BrowserRouter` apenas em `routes/index.tsx`, nunca em componentes internos |
| Pagina de login aparece em branco | Componente nao retorna JSX ou import errado | Verifique que `SignIn` exporta uma funcao que retorna JSX valido |
| Usuario logado ve tela de login | Decisao de roteamento no index nao verifica estado de auth | Implemente condicional `isAuthenticated ? <AppRoutes /> : <AuthRoutes />` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre separacao por perfil e seguranca de rotas
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
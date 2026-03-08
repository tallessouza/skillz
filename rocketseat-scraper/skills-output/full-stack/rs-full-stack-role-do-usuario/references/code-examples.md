# Code Examples: Role-Based Conditional Routing

## Exemplo completo da aula

### Estrutura de rotas separadas

```tsx
// auth-routes.tsx
function AuthRoutes() {
  return (
    // Rotas de autenticacao: login, criar conta
  )
}

// employee-routes.tsx
function EmployeeRoutes() {
  return (
    // Rotas do employee: solicitar reembolso
  )
}

// manager-routes.tsx
function ManagerRoutes() {
  return (
    // Rotas do manager: visualizar solicitacoes
  )
}
```

### Session com role definido

```tsx
const session = {
  user: {
    role: "manager"
  }
}

function Route() {
  switch (session?.user?.role) {
    case "employee":
      return <EmployeeRoutes />
    case "manager":
      return <ManagerRoutes />
    default:
      return <AuthRoutes />
  }
}

function App() {
  return <Route />
}
```

### Sessao inexistente (simulacao da aula)

```tsx
const session = undefined

function Route() {
  switch (session?.user?.role) {
    case "employee":
      return <EmployeeRoutes />
    case "manager":
      return <ManagerRoutes />
    default:
      // session e undefined, cai aqui
      return <AuthRoutes />
  }
}
```

## Variacoes

### Com 3+ roles

```tsx
function Route() {
  switch (session?.user?.role) {
    case "employee":
      return <EmployeeRoutes />
    case "manager":
      return <ManagerRoutes />
    case "admin":
      return <AdminRoutes />
    case "viewer":
      return <ViewerRoutes />
    default:
      return <AuthRoutes />
  }
}
```

### Com React Router

```tsx
import { BrowserRouter } from "react-router-dom"

function Route() {
  switch (session?.user?.role) {
    case "employee":
      return (
        <BrowserRouter>
          <EmployeeRoutes />
        </BrowserRouter>
      )
    case "manager":
      return (
        <BrowserRouter>
          <ManagerRoutes />
        </BrowserRouter>
      )
    default:
      return (
        <BrowserRouter>
          <AuthRoutes />
        </BrowserRouter>
      )
  }
}
```

### Extraindo o BrowserRouter para evitar repeticao

```tsx
import { BrowserRouter } from "react-router-dom"

function RouteContent() {
  switch (session?.user?.role) {
    case "employee":
      return <EmployeeRoutes />
    case "manager":
      return <ManagerRoutes />
    default:
      return <AuthRoutes />
  }
}

function App() {
  return (
    <BrowserRouter>
      <RouteContent />
    </BrowserRouter>
  )
}
```

### Com hook de sessao (cenario real)

```tsx
import { useSession } from "./hooks/use-session"

function Route() {
  const { session, isLoading } = useSession()

  if (isLoading) {
    return <LoadingScreen />
  }

  switch (session?.user?.role) {
    case "employee":
      return <EmployeeRoutes />
    case "manager":
      return <ManagerRoutes />
    default:
      return <AuthRoutes />
  }
}
```

### Testando a funcao Route isoladamente

```tsx
// route.test.tsx
describe("Route", () => {
  it("renders EmployeeRoutes for employee role", () => {
    const session = { user: { role: "employee" } }
    // render com session mockada
    // expect EmployeeRoutes to be rendered
  })

  it("renders AuthRoutes when session is undefined", () => {
    const session = undefined
    // render sem session
    // expect AuthRoutes to be rendered
  })

  it("renders AuthRoutes for unknown role", () => {
    const session = { user: { role: "unknown" } }
    // render com role desconhecido
    // expect AuthRoutes to be rendered (default case)
  })
})
```
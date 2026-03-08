# Code Examples: Criar o AppLayout

## Exemplo 1: AppLayout basico (da aula)

```tsx
// src/components/app.layout.tsx
import { Outlet } from "react-router-dom"

export function AppLayout() {
  return (
    <div className="w-full h-screen bg-gray-400 flex flex-col items-center text-gray-100">
      <main className="m-3 w-full md:w-auto">
        <Outlet />
      </main>
    </div>
  )
}
```

## Exemplo 2: Integrando nas rotas do employee

```tsx
// src/routes/employee.routes.tsx
import { Route } from "react-router-dom"
import { AppLayout } from "../components/app.layout"
import { Dashboard } from "../pages/Dashboard"

export function EmployeeRoutes() {
  return (
    <Route path="/" element={<AppLayout />}>
      <Route index element={<Dashboard />} />
    </Route>
  )
}
```

## Exemplo 3: AppLayout com header (proximo passo da aula)

```tsx
import { Outlet } from "react-router-dom"

export function AppLayout() {
  return (
    <div className="w-full h-screen bg-gray-400 flex flex-col items-center text-gray-100">
      <header className="w-full flex items-center justify-between p-4">
        <img src="/logo.svg" alt="Logo" />
        <div className="flex items-center gap-4">
          <span>João Silva</span>
          <button>Sair</button>
        </div>
      </header>
      <main className="m-3 w-full md:w-auto">
        <Outlet />
      </main>
    </div>
  )
}
```

## Exemplo 4: Reutilizando para manager e employee

```tsx
// src/routes/index.tsx
import { Routes, Route } from "react-router-dom"
import { AppLayout } from "../components/app.layout"

export function AppRoutes() {
  return (
    <Routes>
      {/* Employee routes */}
      <Route path="/" element={<AppLayout />}>
        <Route index element={<EmployeeDashboard />} />
        <Route path="profile" element={<EmployeeProfile />} />
      </Route>

      {/* Manager routes */}
      <Route path="/manager" element={<AppLayout />}>
        <Route index element={<ManagerDashboard />} />
        <Route path="team" element={<ManageTeam />} />
      </Route>
    </Routes>
  )
}
```

## Exemplo 5: Variacao com sidebar (extensao do padrao)

```tsx
import { Outlet } from "react-router-dom"

export function AppLayoutWithSidebar() {
  return (
    <div className="w-full h-screen bg-gray-400 flex flex-col items-center text-gray-100">
      <header className="w-full p-4">{/* header content */}</header>
      <div className="flex w-full flex-1">
        <aside className="w-64 bg-gray-500 p-4">
          {/* sidebar navigation */}
        </aside>
        <main className="m-3 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
```

## Exemplo 6: Testando que o layout renderiza o Outlet

```tsx
import { render, screen } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import { AppLayout } from "./app.layout"

test("renders child route content via Outlet", () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<h1>Dashboard</h1>} />
        </Route>
      </Routes>
    </MemoryRouter>
  )

  expect(screen.getByText("Dashboard")).toBeInTheDocument()
})
```
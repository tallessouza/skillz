# Code Examples: Criando o AuthLayout

## Exemplo 1: AuthLayout completo

```tsx
// src/components/AuthLayout.tsx
import { Outlet } from "react-router-dom"
import logoSvg from "../assets/logo.svg"

export function AuthLayout() {
  return (
    <div className="w-screen h-screen bg-gray-400 flex flex-col justify-center items-center text-gray-100">
      <main className="bg-gray-500 p-8 rounded-md flex items-center flex-col md:min-w-[462px]">
        <img src={logoSvg} alt="Logo" className="my-8" />
        <Outlet />
      </main>
    </div>
  )
}
```

### Decomposicao das classes:

**Container externo (div):**
| Classe | Efeito | Equivalente CSS |
|--------|--------|-----------------|
| `w-screen` | Largura total da viewport | `width: 100vw` |
| `h-screen` | Altura total da viewport | `height: 100vh` |
| `bg-gray-400` | Cor de fundo cinza medio | `background-color: #9ca3af` |
| `flex` | Ativa Flexbox | `display: flex` |
| `flex-col` | Direcao coluna | `flex-direction: column` |
| `justify-center` | Centraliza verticalmente | `justify-content: center` |
| `items-center` | Centraliza horizontalmente | `align-items: center` |
| `text-gray-100` | Cor de texto padrao clara | `color: #f3f4f6` |

**Card (main):**
| Classe | Efeito | Equivalente CSS |
|--------|--------|-----------------|
| `bg-gray-500` | Fundo do card | `background-color: #6b7280` |
| `p-8` | Padding de 32px (8 * 4px) | `padding: 2rem` |
| `rounded-md` | Bordas arredondadas | `border-radius: 0.375rem` |
| `flex` | Ativa Flexbox | `display: flex` |
| `items-center` | Centraliza itens | `align-items: center` |
| `flex-col` | Direcao coluna | `flex-direction: column` |
| `md:min-w-[462px]` | Largura minima em telas >= 768px | `@media (min-width: 768px) { min-width: 462px }` |

**Logo (img):**
| Classe | Efeito |
|--------|--------|
| `my-8` | Margem vertical de 32px |

## Exemplo 2: Registro de rotas com layout

```tsx
// src/App.tsx ou routes.tsx
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { AuthLayout } from "./components/AuthLayout"
import { SignIn } from "./pages/SignIn"
import { SignUp } from "./pages/SignUp"

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthLayout />}>
          <Route path="sign-in" element={<SignIn />} />
          <Route path="sign-up" element={<SignUp />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
```

O `AuthLayout` e usado como `element` de uma `Route` pai. As rotas filhas sao renderizadas no `Outlet`.

## Exemplo 3: Testando breakpoints com cor

Tecnica didatica para visualizar quando um breakpoint ativa:

```tsx
// Adicione uma cor diferente no breakpoint para debug
<main className="bg-gray-500 md:bg-red-500 p-8 rounded-md">
  {/* Em telas < 768px: fundo cinza */}
  {/* Em telas >= 768px: fundo vermelho */}
</main>
```

Abra o DevTools, clique no icone de dispositivo movel, e redimensione para ver a transicao no ponto de 768px.

## Exemplo 4: Variacoes de layout para outros contextos

### DashboardLayout (mesmo padrao, contexto diferente)

```tsx
import { Outlet } from "react-router-dom"
import { Sidebar } from "./Sidebar"

export function DashboardLayout() {
  return (
    <div className="w-screen h-screen flex">
      <Sidebar />
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
```

### Layout com header fixo

```tsx
import { Outlet } from "react-router-dom"
import { Header } from "./Header"

export function AppLayout() {
  return (
    <div className="w-screen h-screen flex flex-col">
      <Header />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
```

## Exemplo 5: Breakpoints disponiveis no Tailwind

| Prefixo | Min-width | Uso tipico |
|---------|-----------|------------|
| `sm:` | 640px (40rem) | Smartphones grandes |
| `md:` | 768px (48rem) | Tablets |
| `lg:` | 1024px (64rem) | Laptops |
| `xl:` | 1280px (80rem) | Desktops |
| `2xl:` | 1536px (96rem) | Telas grandes |

Exemplo combinando multiplos breakpoints:

```tsx
<main className="w-full sm:min-w-[320px] md:min-w-[462px] lg:min-w-[600px]">
  <Outlet />
</main>
```

## Exemplo 6: Valores customizados com colchetes

```tsx
// Largura exata
<div className="w-[200px]">...</div>

// Cor exata (hex)
<div className="bg-[#1a1a2e]">...</div>

// Calculo
<div className="w-[calc(100%-2rem)]">...</div>

// Combinado com breakpoint
<div className="md:min-w-[462px] lg:max-w-[800px]">...</div>
```
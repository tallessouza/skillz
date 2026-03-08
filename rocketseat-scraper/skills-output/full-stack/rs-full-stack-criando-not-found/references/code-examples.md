# Code Examples: Criando Not Found

## Exemplo base do instrutor

### Componente NotFound completo

```tsx
// src/pages/NotFound.tsx
export function NotFound() {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="flex flex-col">
        <h1 className="text-gray-100 font-semibold text-2xl mb-10">
          Ops! Essa página não existe 😢
        </h1>
        <a
          href="/"
          className="font-semibold text-center text-green-100 hover:text-green-200 transition is-linear"
        >
          Voltar para o início
        </a>
      </div>
    </div>
  )
}
```

### Registro da rota catch-all

```tsx
// src/routes.tsx
import { Routes, Route } from "react-router-dom"
import { SignIn } from "./pages/SignIn"
import { SignUp } from "./pages/SignUp"
import { NotFound } from "./pages/NotFound"

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/register" element={<SignUp />} />
      {/* Catch-all: SEMPRE a última rota */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
```

## Variação: usando Link do React Router

Se o projeto já usa React Router, prefira `<Link>` em vez de `<a>` para evitar reload completo da página:

```tsx
import { Link } from "react-router-dom"

export function NotFound() {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="flex flex-col">
        <h1 className="text-gray-100 font-semibold text-2xl mb-10">
          Ops! Essa página não existe 😢
        </h1>
        <Link
          to="/"
          className="font-semibold text-center text-green-100 hover:text-green-200 transition is-linear"
        >
          Voltar para o início
        </Link>
      </div>
    </div>
  )
}
```

## Variação: com código de status visual

```tsx
export function NotFound() {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="flex flex-col items-center">
        <span className="text-8xl mb-4">😢</span>
        <h1 className="text-gray-100 font-bold text-6xl mb-2">404</h1>
        <p className="text-gray-300 text-lg mb-8">
          Essa página não existe
        </p>
        <Link
          to="/"
          className="font-semibold text-green-100 hover:text-green-200 transition is-linear"
        >
          Voltar para o início
        </Link>
      </div>
    </div>
  )
}
```

## Variação: Not Found com dark background explícito

```tsx
export function NotFound() {
  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gray-900">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-gray-100 font-semibold text-2xl">
          Ops! Essa página não existe 😢
        </h1>
        <Link
          to="/"
          className="px-6 py-3 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition"
        >
          Voltar para o início
        </Link>
      </div>
    </div>
  )
}
```

## Padrão de centralização full-screen reutilizável

Este padrão aparece em diversas páginas de estado (404, loading, erro):

```tsx
// Container que centraliza qualquer conteúdo na tela toda
<div className="w-screen h-screen flex justify-center items-center">
  {/* Conteúdo centralizado aqui */}
</div>
```

Tailwind classes breakdown:
- `w-screen` → `width: 100vw`
- `h-screen` → `height: 100vh`
- `flex` → `display: flex`
- `justify-center` → `justify-content: center`
- `items-center` → `align-items: center`
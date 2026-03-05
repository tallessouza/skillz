# Code Examples: Sidebar Colapsavel em React/Next.js

## Exemplo 1: Estado de colapso com useState

```typescript
"use client"

import { useState } from "react"

// Estado binario: aberto (false) ou colapsado (true)
const [isCollapsed, setIsCollapsed] = useState(false)

// Funcoes nomeadas — nao um toggle generico
const collapseSidebar = () => setIsCollapsed(true)
const expandSidebar = () => setIsCollapsed(false)
```

## Exemplo 2: Botao mobile com acessibilidade

```typescript
import { X } from "lucide-react"

// Botao so visivel no mobile (md:hidden no wrapper)
<div className="flex items-center justify-between md:hidden mb-4">
  <Button
    variant="secondary"
    aria-label="Fechar menu"
    title="Fechar menu"
  >
    <X className="w-5 h-5 text-gray-100" />
  </Button>
</div>
```

## Exemplo 3: Header com logo e botao de colapsar

```typescript
import { ArrowLeftToLine } from "lucide-react"

<header className="flex w-full items-center justify-between">
  <Logo />
  <Button
    variant="icon"
    onClick={collapseSidebar}
    className="hidden md:inline-flex p-2 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-slate-500 rounded-lg transition-colors"
    aria-label="Colapsar sidebar"
    title="Colapsar sidebar"
  >
    <ArrowLeftToLine className="w-5 h-5 text-gray-100" />
  </Button>
</header>
```

## Exemplo 4: Estado colapsado com botao de expandir

```typescript
import { ArrowRightToLine } from "lucide-react"

// Quando colapsado, layout minimo: so o botao de expandir
<section className="px-2 py-6">
  <header className="flex items-center justify-center mb-6">
    <Button
      variant="icon"
      onClick={expandSidebar}
      aria-label="Expandir sidebar"
      title="Expandir sidebar"
    >
      <ArrowRightToLine className="w-5 h-5 text-gray-100" />
    </Button>
  </header>
</section>
```

## Exemplo 5: Navegacao programatica com useRouter

```typescript
import { useRouter } from "next/navigation" // App Router, NAO next/router

const router = useRouter()

const handleNewPrompt = () => {
  router.push("/new")
}

// Uso no botao
<Button size="large" onClick={handleNewPrompt}>
  <Plus className="w-5 h-5 mr-2" />
  Novo prompt
</Button>
```

## Exemplo 6: Componente Logo completo

```typescript
import Link from "next/link"
import { MessageSquare } from "lucide-react"

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <MessageSquare className="w-6 h-6" />
      <span className="text-lg font-semibold">Prompts</span>
    </Link>
  )
}
```

## Exemplo 7: Renderizacao condicional completa

```typescript
// Dois layouts completamente diferentes — nao apenas esconder/mostrar
{!isCollapsed ? (
  <section>
    {/* Layout expandido: logo, titulo, botoes, conteudo */}
    <div className="md:hidden mb-4">...</div>
    <header>...</header>
    <div>
      <Button size="large" onClick={handleNewPrompt}>...</Button>
    </div>
  </section>
) : (
  <section className="px-2 py-6">
    {/* Layout colapsado: apenas botao de expandir */}
    <header className="flex items-center justify-center mb-6">
      <Button variant="icon" onClick={expandSidebar}>...</Button>
    </header>
  </section>
)}
```

## Exemplo 8: Estilizacao dinamica do aside

```typescript
// Template literal para classes condicionais
<aside className={`
  ${isCollapsed ? "w-16" : "w-64"}
  transition-all duration-200
  bg-gray-900 h-screen
`}>
```

## Variacoes uteis

### Sidebar com overlay no mobile

```typescript
// Adicionando backdrop quando sidebar abre no mobile
{isMobileOpen && (
  <div
    className="fixed inset-0 bg-black/50 z-40 md:hidden"
    onClick={closeMobileSidebar}
  />
)}
<aside className={`
  fixed md:relative z-50
  ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
  ${isCollapsed ? "md:w-16" : "md:w-64"}
  transition-all
`}>
```

### Sidebar com persistencia do estado

```typescript
// Persistir preferencia de colapso no localStorage
const [isCollapsed, setIsCollapsed] = useState(() => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("sidebar-collapsed") === "true"
  }
  return false
})

const collapseSidebar = () => {
  setIsCollapsed(true)
  localStorage.setItem("sidebar-collapsed", "true")
}

const expandSidebar = () => {
  setIsCollapsed(false)
  localStorage.setItem("sidebar-collapsed", "false")
}
```
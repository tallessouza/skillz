---
name: rs-testes-e-iniciando-a-sidebar
description: "Applies collapsible sidebar patterns when building React/Next.js navigation components. Use when user asks to 'create a sidebar', 'build a menu', 'collapsible navigation', 'mobile menu', or 'sidebar component'. Enforces useState toggle pattern, accessibility attributes (aria-label, title), responsive hiding with Tailwind, and router.push navigation. Make sure to use this skill whenever building sidebar or collapsible menu components in React/Next.js. Not for backend routes, API endpoints, or non-navigation UI components."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: testes-e-arquitetura-no-frontend
  module: ui-components
  tags: [testing, next-js, react, responsive]
---

# Sidebar Colapsavel em React/Next.js

> Construa sidebars com estado de colapso controlado, acessibilidade completa e responsividade mobile-first.

## Rules

1. **Use `useState` para controle de colapso** — `const [isCollapsed, setIsCollapsed] = useState(false)`, porque o estado binario aberto/fechado e a interacao mais comum de sidebars
2. **Crie funcoes nomeadas para cada acao** — `collapseSidebar` e `expandSidebar` separadas, nao um toggle generico, porque facilita leitura e permite comportamentos distintos por acao
3. **Sempre inclua `aria-label` e `title` em botoes de icone** — porque botoes sem texto visivel sao invisiveis para leitores de tela
4. **Use renderizacao condicional por estado** — `{!isCollapsed ? <ExpandedView /> : <CollapsedView />}`, porque cada estado tem layout completamente diferente
5. **Marque como `"use client"`** — componentes com `useState` ou interacoes precisam ser Client Components no Next.js
6. **Use `router.push()` para navegacao programatica** — importe `useRouter` de `next/navigation`, nao de `next/router`

## How to write

### Estrutura base do sidebar

```typescript
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeftToLine, ArrowRightToLine, X, Plus } from "lucide-react"

export function SidebarContent() {
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const collapseSidebar = () => setIsCollapsed(true)
  const expandSidebar = () => setIsCollapsed(false)

  return (
    <aside className={`${isCollapsed ? "w-16" : "w-64"} transition-all`}>
      {!isCollapsed ? (
        <section>
          {/* Mobile close button - hidden on desktop */}
          <div className="flex items-center justify-between md:hidden mb-4">
            <Button variant="secondary" aria-label="Fechar menu" title="Fechar menu">
              <X className="w-5 h-5 text-gray-100" />
            </Button>
          </div>

          {/* Header with logo and collapse button */}
          <header className="flex w-full items-center justify-between mb-6">
            <Logo />
            <Button variant="icon" onClick={collapseSidebar}
              aria-label="Colapsar sidebar" title="Colapsar sidebar">
              <ArrowLeftToLine className="w-5 h-5 text-gray-100" />
            </Button>
          </header>

          {/* Action button */}
          <Button size="large" onClick={() => router.push("/new")}>
            <Plus className="w-5 h-5 mr-2" />
            Novo prompt
          </Button>
        </section>
      ) : (
        <section className="px-2 py-6">
          <header className="flex items-center justify-center mb-6">
            <Button variant="icon" onClick={expandSidebar}
              aria-label="Expandir sidebar" title="Expandir sidebar">
              <ArrowRightToLine className="w-5 h-5 text-gray-100" />
            </Button>
          </header>
        </section>
      )}
    </aside>
  )
}
```

### Componente Logo simples

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

## Example

**Before (sem controle de colapso, sem acessibilidade):**
```typescript
function Sidebar() {
  return (
    <div>
      <button onClick={() => {}}>←</button>
      <h2>Menu</h2>
      <button>+ New</button>
    </div>
  )
}
```

**After (com esta skill aplicada):**
```typescript
"use client"
import { useState } from "react"
import { ArrowLeftToLine, ArrowRightToLine } from "lucide-react"

function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const collapseSidebar = () => setIsCollapsed(true)
  const expandSidebar = () => setIsCollapsed(false)

  return (
    <aside className={isCollapsed ? "w-16" : "w-64"}>
      {!isCollapsed ? (
        <section>
          <header className="flex items-center justify-between mb-6">
            <Logo />
            <button onClick={collapseSidebar} aria-label="Colapsar sidebar" title="Colapsar sidebar">
              <ArrowLeftToLine className="w-5 h-5" />
            </button>
          </header>
        </section>
      ) : (
        <section className="px-2 py-6">
          <button onClick={expandSidebar} aria-label="Expandir sidebar" title="Expandir sidebar">
            <ArrowRightToLine className="w-5 h-5" />
          </button>
        </section>
      )}
    </aside>
  )
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Botao so tem icone | Sempre adicionar `aria-label` e `title` |
| Botao aparece so no mobile | Usar `md:hidden` no wrapper |
| Navegacao programatica no Next.js App Router | `useRouter` de `next/navigation` |
| Componente precisa de estado | Marcar com `"use client"` |
| Sidebar colapsada | Renderizar layout alternativo completo, nao apenas esconder elementos |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `const [open, setOpen] = useState(true)` | `const [isCollapsed, setIsCollapsed] = useState(false)` |
| `<button onClick={() => setOpen(!open)}>` | `<button onClick={collapseSidebar}>` com funcao nomeada |
| `<button>X</button>` sem acessibilidade | `<button aria-label="Fechar menu" title="Fechar menu">` |
| `import { useRouter } from "next/router"` | `import { useRouter } from "next/navigation"` |
| `{open && <Content />}` escondendo tudo | Renderizar versao expandida E colapsada com layouts proprios |


## Troubleshooting

### Teste falha inesperadamente
**Symptom:** Teste que funcionava comeca a falhar sem mudancas no codigo
**Cause:** Mock de teste anterior vazando estado ou dependencia externa mudou
**Fix:** Adicionar mockReset/mockClear no beforeEach e isolar dependencias

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

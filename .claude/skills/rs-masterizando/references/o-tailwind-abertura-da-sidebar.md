---
name: rs-tailwind-abertura-da-sidebar
description: "Applies Radix UI Collapsible pattern for responsive sidebar toggle when building sidebars with Tailwind CSS. Use when user asks to 'create a sidebar', 'make sidebar responsive', 'toggle sidebar', 'collapsible menu', or 'mobile navigation'. Enforces forceMount with data-state attributes for desktop-always-open/mobile-toggle pattern. Make sure to use this skill whenever implementing sidebar visibility logic in React/Next.js projects. Not for accordion components, dialog modals, or non-sidebar collapsible content."
---

# Abertura da Sidebar com Radix Collapsible

> Use `@radix-ui/react-collapsible` com `forceMount` e data-attributes do Radix para criar sidebars que ficam sempre abertas no desktop e colapsáveis no mobile.

## Rules

1. **Use Collapsible ao invés de useState** — `Collapsible.Root` gerencia estado acessível automaticamente, porque um simples `useState` não fornece acessibilidade (aria-expanded, keyboard nav)
2. **forceMount no Content** — sempre passe `forceMount` no `Collapsible.Content` para que o conteúdo esteja disponível no DOM mesmo quando fechado, porque no desktop o conteúdo deve estar sempre visível
3. **Controle visibilidade via data-state** — use `data-[state=closed]:hidden` e `lg:data-[state=closed]:flex` para esconder no mobile e mostrar no desktop, porque isso delega a responsividade ao CSS sem JS adicional
4. **Trigger hidden no desktop** — passe `lg:hidden` no `Collapsible.Trigger` para esconder o botão hambúrguer em telas grandes, porque no desktop a sidebar está sempre aberta
5. **Sidebar fixed com h-screen** — use `fixed` + `h-screen` na sidebar e `col-start-2` no main content para que o grid funcione com sidebar fixa, porque elemento fixed sai do flow do grid
6. **asChild no Trigger** — passe `asChild` no `Collapsible.Trigger` para usar seu próprio componente `Button` como trigger, porque evita wrapper HTML desnecessário

## How to write

### Estrutura base da Sidebar

```tsx
import * as Collapsible from '@radix-ui/react-collapsible'
import { Menu } from 'lucide-react'
import { Button } from './Button'

export function Sidebar() {
  return (
    <Collapsible.Root className="fixed left-0 top-0 z-20 flex flex-col gap-6 border-b border-zinc-200 bg-white p-4 data-[state=open]:h-screen lg:right-auto lg:h-screen lg:w-80 lg:border-r lg:px-5 lg:py-8 lg:data-[state=closed]:h-screen">
      <div className="flex items-center justify-between">
        <Logo />
        <Collapsible.Trigger asChild className="lg:hidden">
          <Button variant="ghost">
            <Menu className="h-6 w-6" />
          </Button>
        </Collapsible.Trigger>
      </div>

      <Collapsible.Content
        forceMount
        className="flex flex-1 flex-col gap-6 data-[state=closed]:hidden lg:data-[state=closed]:flex"
      >
        <SearchInput />
        <Nav />
        <UsedSpaceWidget />
        <Profile />
      </Collapsible.Content>
    </Collapsible.Root>
  )
}
```

### Layout com grid para sidebar fixa

```tsx
// layout.tsx
<div className="grid min-h-screen grid-cols-1 lg:grid-cols-app">
  <Sidebar />
  <main className="col-start-2 px-4 pb-12 pt-24 lg:px-8">
    {children}
  </main>
</div>
```

## Example

**Before (useState sem acessibilidade):**
```tsx
const [isOpen, setIsOpen] = useState(false)

return (
  <aside className={isOpen ? 'block' : 'hidden lg:block'}>
    <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden">
      <Menu />
    </button>
    <nav>{/* conteudo */}</nav>
  </aside>
)
```

**After (Collapsible acessível com data-state):**
```tsx
<Collapsible.Root className="data-[state=open]:h-screen lg:data-[state=closed]:h-screen">
  <div className="flex items-center justify-between">
    <Logo />
    <Collapsible.Trigger asChild className="lg:hidden">
      <Button variant="ghost"><Menu className="h-6 w-6" /></Button>
    </Collapsible.Trigger>
  </div>
  <Collapsible.Content forceMount className="flex flex-1 flex-col gap-6 data-[state=closed]:hidden lg:data-[state=closed]:flex">
    <nav>{/* conteudo */}</nav>
  </Collapsible.Content>
</Collapsible.Root>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Sidebar precisa toggle no mobile | Use Collapsible com forceMount |
| Sidebar fixa no desktop | `fixed` + `h-screen` + grid `col-start-2` no main |
| Botao toggle so no mobile | `lg:hidden` no Trigger |
| Conteudo visivel no desktop mesmo "closed" | `lg:data-[state=closed]:flex` |
| Componente usa Collapsible | Marque como `'use client'` no Next.js |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `useState` para toggle de sidebar | `Collapsible.Root` do Radix |
| `className={isOpen ? 'block' : 'hidden'}` | `data-[state=closed]:hidden lg:data-[state=closed]:flex` |
| `<button>` direto como trigger | `<Collapsible.Trigger asChild>` com seu `<Button>` |
| Omitir `forceMount` (conteudo desmonta) | `forceMount` para manter no DOM |
| Sidebar sem `fixed` tentando usar grid | `fixed` + `col-start-2` no main |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/masterizando/rs-masterizando-o-tailwind-abertura-da-sidebar/references/deep-explanation.md)
- [Code examples](../../../data/skills/masterizando/rs-masterizando-o-tailwind-abertura-da-sidebar/references/code-examples.md)

---
name: rs-saas-nextjs-navegacao-abas
description: "Applies tab navigation pattern with active link highlighting in Next.js App Router layouts. Use when user asks to 'create tabs', 'add navigation tabs', 'highlight active link', 'build tab menu', or 'create layout with navigation'. Implements NavLink client component with usePathname, asChild pattern for styled links, and data-current attribute for active state. Make sure to use this skill whenever building tabbed navigation in Next.js applications. Not for bottom navigation, sidebar menus, or breadcrumbs."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: saa-s-next-js-rbac
  module: frontend
  tags: [saas, nextjs, ui, tailwind]
---

# Navegacao por Abas no Next.js App Router

> Crie navegacao por abas usando layout compartilhado, componente NavLink com deteccao de rota ativa via usePathname, e pattern asChild para links estilizados como botoes.

## Rules

1. **Coloque tabs no layout, nao na pagina** — navegacao por abas pertence ao `layout.tsx` da rota pai, porque ela persiste entre paginas filhas sem re-render
2. **Use asChild no Button para renderizar Link** — `<Button asChild>` repassa estilos do botao ao Link do Next.js, mantendo navegacao client-side sem `<button>` semantico incorreto
3. **Detecte rota ativa com usePathname** — compare `props.href.toString()` com `pathname` para determinar `data-current`, porque isso funciona com App Router sem prop drilling
4. **Estilize via data attributes** — use `data-[current=true]:` para estilos condicionais no Tailwind, porque mantem a logica no CSS sem classes dinamicas
5. **Mantenha largura consistente** — tabs, header e conteudo devem compartilhar o mesmo `max-w-[1200px] mx-auto`, porque garante alinhamento visual

## How to write

### NavLink (client component para deteccao de rota ativa)

```typescript
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ComponentProps } from 'react'

interface NavLinkProps extends ComponentProps<typeof Link> {}

export function NavLink(props: NavLinkProps) {
  const pathname = usePathname()
  const isCurrent = props.href.toString() === pathname

  return <Link data-current={isCurrent} {...props} />
}
```

### Tabs component (server component)

```typescript
import { Button } from '@/components/ui/button'
import { NavLink } from './nav-link'
import { getCurrentOrg } from '@/auth/auth'

export async function Tabs() {
  const currentOrg = getCurrentOrg()

  return (
    <div className="border-b py-4">
      <nav className="mx-auto flex max-w-[1200px] items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="border border-transparent text-muted-foreground data-[current=true]:border-border data-[current=true]:text-foreground"
          asChild
        >
          <NavLink href={`/org/${currentOrg}`}>Projects</NavLink>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="border border-transparent text-muted-foreground data-[current=true]:border-border data-[current=true]:text-foreground"
          asChild
        >
          <NavLink href={`/org/${currentOrg}/members`}>Members</NavLink>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="border border-transparent text-muted-foreground data-[current=true]:border-border data-[current=true]:text-foreground"
          asChild
        >
          <NavLink href={`/org/${currentOrg}/settings`}>
            Settings & Billing
          </NavLink>
        </Button>
      </nav>
    </div>
  )
}
```

### Layout com tabs

```typescript
import { Header } from '@/components/header'
import { Tabs } from '@/components/tabs'

export default function OrgLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="pt-6">
        <Header />
        <Tabs />
      </div>
      <main className="mx-auto w-full max-w-[1200px] py-4">
        {children}
      </main>
    </div>
  )
}
```

## Example

**Before (tabs inline na pagina, sem deteccao de ativo):**
```typescript
export default function ProjectsPage() {
  return (
    <>
      <Header />
      <nav>
        <Link href="/projects">Projects</Link>
        <Link href="/members">Members</Link>
        <Link href="/settings">Settings</Link>
      </nav>
      <h1>Projects</h1>
    </>
  )
}
```

**After (tabs no layout, NavLink com rota ativa):**
```typescript
// layout.tsx — tabs persistem entre paginas
export default function OrgLayout({ children }) {
  return (
    <div>
      <div className="pt-6">
        <Header />
        <Tabs />
      </div>
      <main className="mx-auto w-full max-w-[1200px] py-4">
        {children}
      </main>
    </div>
  )
}

// page.tsx — so conteudo
export default function ProjectsPage() {
  return <h1>Projects</h1>
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Navegacao que aparece em todas as paginas de um segmento | Coloque no layout.tsx desse segmento |
| Precisa saber rota ativa em server component | Use `getCurrentOrg()` ou params do layout |
| Precisa saber rota ativa em client component | Use `usePathname()` do next/navigation |
| Button precisa ser um Link | Use `asChild` do Radix para composicao |
| Estilo condicional por estado | Use `data-[attr=value]:` no Tailwind |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `<button onClick={() => router.push(...)}>` em nav | `<Button asChild><NavLink href="...">` |
| `className={isActive ? 'text-white' : 'text-gray'}` | `className="data-[current=true]:text-foreground"` |
| Header duplicado em cada page.tsx | Header no layout.tsx compartilhado |
| `useRouter()` para navegacao simples | `<Link>` ou `<NavLink>` |
| Larguras diferentes entre header, tabs e content | Mesmo `max-w-[1200px] mx-auto` em todos |

## Troubleshooting

### Componente server/client mismatch
**Symptom:** Erro de hydration ou hooks nao funcionam
**Cause:** Componente que usa hooks (useState, useEffect) nao tem 'use client'
**Fix:** Adicione 'use client' no topo do arquivo do componente que usa hooks ou event handlers

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

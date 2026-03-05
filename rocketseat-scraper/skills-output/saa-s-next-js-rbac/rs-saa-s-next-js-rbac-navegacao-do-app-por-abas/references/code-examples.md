# Code Examples: Navegacao por Abas no Next.js App Router

## 1. Layout da organizacao completo

```typescript
// app/(app)/org/[slug]/layout.tsx
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

**Notas:**
- `pt-6` no wrapper do header para espaçamento superior
- Header e Tabs ficam dentro do mesmo wrapper
- `main` recebe `mx-auto w-full max-w-[1200px]` para centralizar com largura maxima
- `py-4` para padding vertical do conteudo

## 2. NavLink — client component reutilizavel

```typescript
// components/nav-link.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ComponentProps } from 'react'

interface NavLinkProps extends ComponentProps<typeof Link> {}

export function NavLink(props: NavLinkProps) {
  const pathname = usePathname()

  // Comparacao direta entre href e pathname atual
  const isCurrent = props.href.toString() === pathname

  return <Link data-current={isCurrent} {...props} />
}
```

**Notas:**
- `ComponentProps<typeof Link>` garante que NavLink aceita todas as props do Link
- `usePathname()` retorna a rota atual (ex: `/org/acme/members`)
- `data-current` e um data attribute HTML — pode ser usado com Tailwind `data-[current=true]:`
- Spread `{...props}` repassa href, children, className, etc.

## 3. Tabs — server component com getCurrentOrg

```typescript
// components/tabs.tsx
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

**Notas:**
- `border border-transparent` — todos os botoes tem borda, mas invisivel por padrao
- `data-[current=true]:border-border` — quando NavLink seta `data-current="true"`, a borda aparece
- `data-[current=true]:text-foreground` — texto fica mais claro no item ativo
- `text-muted-foreground` — itens inativos ficam opacos
- `variant="ghost"` e `size="sm"` do shadcn/ui
- `asChild` faz o Button delegar renderizacao ao NavLink (que renderiza um `<a>`)

## 4. Pagina simplificada (header removido, so conteudo)

```typescript
// app/(app)/org/[slug]/page.tsx
export default function ProjectsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Projects</h1>
      {/* listagem de projetos */}
    </div>
  )
}
```

**Antes da refatoracao**, cada pagina tinha o Header importado diretamente. Depois de criar o layout, o Header e as Tabs foram removidos de todas as paginas individuais.

## 5. Variacao: usando useParams em client component

Se o Tabs precisasse ser client component (por exemplo, para animacoes):

```typescript
'use client'

import { useParams } from 'next/navigation'

export function Tabs() {
  const { slug } = useParams<{ slug: string }>()

  // slug substitui getCurrentOrg() em client components
  return (
    <nav>
      <NavLink href={`/org/${slug}`}>Projects</NavLink>
      <NavLink href={`/org/${slug}/members`}>Members</NavLink>
    </nav>
  )
}
```

## 6. Pattern de classes extraidas (para evitar repeticao)

```typescript
const tabClassName =
  'border border-transparent text-muted-foreground data-[current=true]:border-border data-[current=true]:text-foreground'

// Uso:
<Button variant="ghost" size="sm" className={tabClassName} asChild>
  <NavLink href={`/org/${currentOrg}`}>Projects</NavLink>
</Button>
```
# Code Examples: Estrutura da Pagina de Issue

## 1. Layout encadeado completo (issues/layout.tsx)

```typescript
// app/issues/layout.tsx
import { UserButton } from '@/components/header/UserButton'

export default function IssuesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="flex items-center justify-between border-b border-zinc-800 px-6 py-4">
        {/* Logo ou titulo do app */}
        <span className="text-lg font-bold">Board App</span>
        <UserButton />
      </header>
      {children}
    </>
  )
}
```

**Diferenca do layout do board:** nao inclui `SearchInput`. O App Router compoe `RootLayout > IssuesLayout > IssuePage` automaticamente.

## 2. Componente UserButton extraido

```typescript
// components/header/UserButton.tsx
'use client'

import { UserButton as ClerkUserButton } from '@clerk/nextjs'

export function UserButton() {
  return <ClerkUserButton afterSignOutUrl="/" />
}
```

**Quando extrair:** quando o mesmo componente aparece em 2+ layouts ou paginas.

## 3. Pagina de issue completa

```typescript
// app/issues/[id]/page.tsx
import Link from 'next/link'
import { MoveLeft, ArchiveIcon } from 'lucide-react'

const statusLabels = {
  backlog: 'Backlog',
  todo: 'TODO',
  inprogress: 'In Progress',
  done: 'Done',
} as const

export default async function IssuePage({ params }: { params: { id: string } }) {
  const issue = await getIssue(params.id)

  return (
    <main className="max-w-[900px] mx-auto w-full flex flex-col gap-4 p-6 bg-zinc-800 border-[0.5px] border-zinc-500 rounded-xl">
      {/* Botao voltar */}
      <Link
        href="/"
        className="flex items-center gap-2 text-zinc-200 hover:text-zinc-100"
      >
        <MoveLeft className="size-4" />
        <span className="text-xs">Back to board</span>
      </Link>

      {/* Status + like */}
      <div className="flex items-center gap-2">
        <span className="bg-zinc-700 rounded-lg px-3 py-1.5 flex items-center gap-2 text-xs">
          <ArchiveIcon className="size-3" />
          {statusLabels[issue.status]}
        </span>
        <button className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200">
          ♥ {issue.likes}
        </button>
      </div>

      {/* Titulo e descricao */}
      <div className="space-y-2">
        <h1 className="font-semibold text-2xl">{issue.title}</h1>
        <p className="text-zinc-100 text-sm leading-relaxed">
          {issue.description}
        </p>
      </div>
    </main>
  )
}
```

## 4. Comparacao: as const vs sem as const

```typescript
// SEM as const — TypeScript infere tipos genericos
const labels = {
  backlog: 'Backlog',
  todo: 'TODO',
}
// tipo: { backlog: string; todo: string }
// labels.backlog pode ser qualquer string

// COM as const — TypeScript preserva valores literais
const labels = {
  backlog: 'Backlog',
  todo: 'TODO',
} as const
// tipo: { readonly backlog: 'Backlog'; readonly todo: 'TODO' }
// labels.backlog e exatamente 'Backlog', nunca outra coisa
```

## 5. Estilos usados na pagina

| Elemento | Classes Tailwind | Proposito |
|----------|-----------------|-----------|
| Container main | `max-w-[900px] mx-auto w-full flex flex-col gap-4 p-6 bg-zinc-800 border-[0.5px] border-zinc-500 rounded-xl` | Caixa centralizada com borda sutil |
| Link voltar | `flex items-center gap-2 text-zinc-200 hover:text-zinc-100` | Navegacao discreta |
| Texto do link | `text-xs` (12px) | Bem pequeno, secundario |
| Badge status | `bg-zinc-700 rounded-lg px-3 py-1.5 flex items-center gap-2 text-xs` | Mesmo estilo dos cards do board |
| Icone status | `size-3` | Proporcional ao texto xs |
| Titulo h1 | `font-semibold text-2xl` | Destaque principal |
| Descricao p | `text-zinc-100 text-sm leading-relaxed` | Legivel com line-height aumentado |
| Wrapper corpo | `space-y-2` | Espacamento entre titulo e descricao |
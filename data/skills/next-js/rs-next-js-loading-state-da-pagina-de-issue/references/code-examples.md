# Code Examples: Loading State com Skeleton Screen

## 1. Simulando delay para testar loading state

```typescript
// app/issues/[id]/page.tsx
import { setTimeout } from 'node:timers/promises'

export default async function IssuePage({ params }: { params: { id: string } }) {
  await setTimeout(2000) // simula latencia de rede
  const issue = await getIssue(params.id)
  // ...render
}
```

## 2. Loading.tsx completo do exemplo

```typescript
// app/issues/[id]/loading.tsx
import Link from 'next/link'
import { Skeleton } from '@/components/skeleton'

export default function IssueLoading() {
  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Navegacao - elemento estatico, nao precisa de skeleton */}
      <Link href="/board" className="text-sm text-blue-400 hover:underline">
        ← Back to board
      </Link>

      {/* Header: status badge + action button */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-7 w-24" />
        <Skeleton className="h-7 w-16" />
      </div>

      {/* Titulo + descricao */}
      <div className="space-y-2">
        {/* Titulo - w-2/3 para simular texto medio */}
        <Skeleton className="h-8 w-2/3" />

        {/* Descricao - multiplas linhas */}
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        {/* Ultima linha menor para simular texto terminando */}
        <Skeleton className="h-4 w-3/5" />
      </div>
    </main>
  )
}
```

## 3. Componente Skeleton com twMerge

```typescript
// components/skeleton.tsx
import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

type SkeletonProps = ComponentProps<'div'>

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={twMerge('bg-nave-700 animate-pulse rounded-lg', className)}
      {...props}
    />
  )
}
```

### Como o twMerge funciona aqui

```typescript
// Skeleton recebe apenas dimensoes - classes base sao automaticas
<Skeleton className="h-7 w-24" />
// Resultado: "bg-nave-700 animate-pulse rounded-lg h-7 w-24"

// Se precisar override de cor em caso especial:
<Skeleton className="h-7 w-24 bg-nave-600" />
// twMerge resolve conflito: "animate-pulse rounded-lg h-7 w-24 bg-nave-600"
```

## 4. Antes da extracao do Skeleton (codigo original)

```typescript
// Como o loading.tsx ficava ANTES de extrair o componente
export default function IssueLoading() {
  return (
    <main>
      <div className="flex items-center gap-2">
        <div className="bg-nave-700 rounded-lg h-7 w-24 animate-pulse" />
        <div className="bg-nave-700 rounded-lg h-7 w-16 animate-pulse" />
      </div>
      <div className="space-y-2">
        <div className="bg-nave-700 rounded-lg h-8 w-2/3 animate-pulse" />
        <div className="bg-nave-700 rounded-lg h-4 w-full animate-pulse" />
        <div className="bg-nave-700 rounded-lg h-4 w-full animate-pulse" />
        <div className="bg-nave-700 rounded-lg h-4 w-full animate-pulse" />
        <div className="bg-nave-700 rounded-lg h-4 w-3/5 animate-pulse" />
      </div>
    </main>
  )
}
```

## 5. Referencia de tamanhos Tailwind usados

| Classe | Pixels | Uso no exemplo |
|--------|--------|----------------|
| `h-4` | 16px | Linhas de descricao |
| `h-7` | 28px | Badge de status, botoes |
| `h-8` | 32px | Titulo |
| `w-16` | 64px | Botao pequeno |
| `w-24` | 96px | Badge de status |
| `w-2/3` | 66.6% | Titulo (largura variavel) |
| `w-3/5` | 60% | Ultima linha de texto |
| `w-full` | 100% | Linhas de descricao completas |
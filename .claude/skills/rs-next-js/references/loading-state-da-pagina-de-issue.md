---
name: rs-next-js-loading-state-da-pagina-de-issue
description: "Applies Next.js loading state patterns with skeleton screens when building page loading states. Use when user asks to 'create a loading state', 'add skeleton screen', 'implement loading.tsx', 'show loading feedback', or 'create placeholder UI'. Enforces colocated loading.tsx convention, reusable Skeleton component with twMerge, and animate-pulse patterns. Make sure to use this skill whenever creating loading states in Next.js App Router projects. Not for API loading indicators, suspense boundaries configuration, or client-side spinner components."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: next-js
  module: loading-states
  tags: [loading, skeleton, animate-pulse, loading-tsx, suspense, app-router, next-js, tailwind-merge]
---

# Loading State com Skeleton Screen no Next.js

> Crie arquivos `loading.tsx` colocados ao lado de `page.tsx` com skeleton screens que representam a estrutura da pagina sem os dados.

## Rules

1. **Crie `loading.tsx` ao lado de `page.tsx`** — o Next.js App Router detecta automaticamente e exibe enquanto a page carrega, porque e uma convencao do framework
2. **Skeleton deve espelhar a estrutura da pagina** — copie o layout (containers, espacamentos, classes de grid) da page real e substitua conteudo por blocos animados, porque o usuario precisa reconhecer a pagina antes dos dados chegarem
3. **Extraia um componente `Skeleton` reutilizavel** — classes repetidas como `bg-nave-700 animate-pulse rounded-lg` devem viver num componente que recebe apenas dimensoes via className, porque evita duplicacao
4. **Use `animate-pulse` do Tailwind** — nao crie animacoes customizadas para loading, porque pulse e o padrao reconhecido para skeleton screens
5. **Nao busque precisao pixel-perfect** — tamanhos aproximados bastam (h7, h8, w-2/3), porque o conteudo real varia e o loading e transitorio
6. **Mantenha elementos estaticos visiveis** — links de navegacao e headers que nao dependem de dados ficam reais no loading, porque ja estao disponiveis

## How to write

### Componente Skeleton reutilizavel

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

### Loading page com skeleton

```typescript
// app/issues/[id]/loading.tsx
import Link from 'next/link'
import { Skeleton } from '@/components/skeleton'

export default function IssueLoading() {
  return (
    <main className="...mesmo layout da page...">
      <Link href="/board">Back to board</Link>

      <div className="flex items-center gap-2">
        <Skeleton className="h-7 w-24" />
        <Skeleton className="h-7 w-16" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/5" />
      </div>
    </main>
  )
}
```

## Example

**Before (sem loading state):**
```typescript
// app/issues/[id]/page.tsx existe
// app/issues/[id]/loading.tsx NAO existe
// Usuario ve tela em branco por 2s enquanto dados carregam
```

**After (com loading state):**
```
app/issues/[id]/
├── page.tsx        # pagina real com dados
├── loading.tsx     # skeleton automatico durante carregamento
components/
└── skeleton.tsx    # componente reutilizavel
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Pagina com fetch demorado | Criar `loading.tsx` ao lado da `page.tsx` |
| Multiplos blocos de skeleton repetidos | Extrair componente `Skeleton` com twMerge |
| Elemento nao depende de dados (nav, links) | Manter real no loading, nao substituir por skeleton |
| Duvida sobre tamanho exato do skeleton | Inspecionar elemento real no DevTools, usar classe Tailwind mais proxima |
| Titulo de tamanho variavel | Usar largura fracionaria (w-2/3) em vez de fixa |
| Descricao com multiplas linhas | Replicar Skeleton full-width N vezes, ultima com largura menor |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Tela em branco durante loading | `loading.tsx` com skeleton screen |
| Duplicar `bg-nave-700 animate-pulse rounded-lg` em cada div | Componente `Skeleton` reutilizavel |
| Skeleton pixel-perfect identico a pagina | Aproximacao da estrutura com tamanhos Tailwind |
| Spinner centralizado generico | Skeleton que espelha o layout real da pagina |
| Skeleton para elementos ja disponiveis (links, nav) | Renderizar elementos estaticos normalmente |

## Troubleshooting

### Loading state nao aparece durante carregamento
**Symptom:** Pagina fica em branco durante o carregamento, sem skeleton ou spinner
**Cause:** Arquivo `loading.tsx` ausente no diretorio da rota, ou Suspense boundary nao configurado
**Fix:** Criar arquivo `loading.tsx` no diretorio da pagina que demora para carregar. Para granularidade maior, envolver componentes lentos com `<Suspense fallback={...}>`

### Streaming SSR nao funciona
**Symptom:** Pagina inteira espera todos os dados antes de renderizar
**Cause:** Dados sao carregados na pagina principal sem Suspense boundary
**Fix:** Mover fetch de dados para componentes filhos async e envolver com `<Suspense>`. Cada Suspense boundary habilita streaming independente

## Deep reference library

- [deep-explanation.md](../../../data/skills/next-js/rs-next-js-loading-state-da-pagina-de-issue/references/deep-explanation.md) — O instrutor demonstra o problema simulando delay com `setTimeout` de 2 segundos na requisicao `getIs
- [code-examples.md](../../../data/skills/next-js/rs-next-js-loading-state-da-pagina-de-issue/references/code-examples.md) — // app/issues/[id]/page.tsx

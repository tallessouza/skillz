---
name: rs-next-js-partial-pre-rendering-suspense-api
description: "Applies Next.js Partial Pre-Rendering with React Suspense to split page loading into critical and deferred sections. Use when user asks to 'optimize page loading', 'add loading states', 'use Suspense', 'stream content', 'partial pre-rendering', or 'avoid blocking the whole page on slow data'. Make sure to use this skill whenever a Next.js page has multiple async server components with different loading priorities. Not for client-side data fetching, SWR/React Query patterns, or route-level loading.tsx files."
---

# Partial Pre-Rendering com Suspense API

> Envolva server components lentos com Suspense para exibir conteudo critico imediatamente e carregar o resto via streaming.

## Rules

1. **Identifique o conteudo critico vs secundario** — titulo e descricao sao criticos, comentarios sao secundarios, porque o usuario precisa ver a informacao principal sem esperar tudo carregar
2. **Envolva apenas o componente lento com Suspense** — nao envolva a pagina inteira, porque o Next por padrao aguarda TODOS os awaits de server components antes de renderizar
3. **Sempre passe um fallback com skeleton** — nunca deixe o fallback vazio, porque o usuario precisa de feedback visual de que algo esta carregando
4. **Use streaming, nao loading.tsx para controle granular** — loading.tsx aplica ao nivel de rota inteira, Suspense aplica por componente, porque voce escolhe exatamente o que bloqueia e o que nao

## How to write

### Suspense envolvendo server component async

```tsx
import { Suspense } from 'react'

export default async function IssuePage({ params }: { params: { id: string } }) {
  const issue = await getIssue(params.id)

  return (
    <div>
      <h1>{issue.title}</h1>
      <p>{issue.description}</p>

      <Suspense fallback={<CommentsSkeleton />}>
        <CommentsList issueId={params.id} />
      </Suspense>
    </div>
  )
}
```

### Skeleton para lista de itens

```tsx
function CommentsSkeleton() {
  const items = Array.from({ length: 3 })

  return (
    <div className="space-y-3">
      {items.map((_, index) => (
        <div key={index} className="flex gap-3">
          <Skeleton className="size-8 rounded-full shrink-0" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  )
}
```

## Example

**Before (pagina inteira bloqueada por comentarios lentos):**
```tsx
export default async function IssuePage({ params }) {
  const issue = await getIssue(params.id)
  // Pagina inteira espera isso terminar
  return (
    <div>
      <h1>{issue.title}</h1>
      <CommentsList issueId={params.id} />
    </div>
  )
}
```

**After (conteudo critico imediato, comentarios via streaming):**
```tsx
import { Suspense } from 'react'

export default async function IssuePage({ params }) {
  const issue = await getIssue(params.id)

  return (
    <div>
      <h1>{issue.title}</h1>
      <Suspense fallback={<CommentsSkeleton />}>
        <CommentsList issueId={params.id} />
      </Suspense>
    </div>
  )
}
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Pagina com um unico fetch rapido | Nao precisa de Suspense |
| Pagina com multiplos fetches de velocidades diferentes | Envolva os lentos com Suspense |
| Componente async dentro de outro async | O mais lento deve ter Suspense |
| Lista de comentarios, reviews, historico | Candidato natural para Suspense |
| Titulo, descricao, metadados principais | Conteudo critico — NAO envolva com Suspense |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `loading.tsx` para controlar loading de um componente especifico | `<Suspense fallback={...}>` envolvendo o componente |
| Suspense sem fallback ou com fallback vazio | Suspense com skeleton que simula a estrutura do conteudo |
| Aguardar todos os dados para renderizar a pagina | Separar dados criticos (await direto) de secundarios (Suspense) |
| Envolva a pagina inteira com Suspense | Envolva apenas os componentes lentos |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

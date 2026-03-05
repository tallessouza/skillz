---
name: rs-next-js-carregamento-interacoes-issue
description: "Enforces patterns for loading authenticated interactions (likes, reactions) in Next.js apps using React Query and Suspense. Use when user asks to 'load likes', 'fetch interactions', 'add like button', 'implement reactions', 'use React Query with Suspense', or 'handle authenticated fetch'. Applies rules: credentials include for client-side auth, manual headers for server components, useSuspenseQuery over useQuery+isLoading, reusable components with initial props pattern, data attributes for conditional styling. Make sure to use this skill whenever implementing any interaction loading or like/reaction feature in Next.js. Not for server actions, form submissions, or database schema design."
---

# Carregamento de Interacoes em Next.js

> Carregue interacoes autenticadas usando React Query com Suspense, separando client components no menor pedaco possivel.

## Rules

1. **Uma unica rota para single e batch** — crie uma funcao HTTP que aceite array de IDs e reutilize para carregar 1 ou N interacoes, porque evita duplicacao de rotas na API
2. **credentials: 'include' no client-side** — adicione ao fetch para enviar cookies automaticamente, porque o BetterAuth salva o token nos cookies e eles trafegam via headers
3. **headers manuais no server component** — importe `headers` de `next/headers` e repasse no fetch, porque server components nao enviam cookies automaticamente
4. **useSuspenseQuery sobre useQuery** — prefira Suspense com fallback skeleton ao inves de isLoading condicional, porque elimina checagem de undefined no data e centraliza o loading state
5. **query key com ID unico** — inclua o ID do recurso na query key (`['issue-likes', id]`), porque sem ele todas as issues compartilhariam o mesmo cache
6. **Props com prefixo initial** — nomeie como `initialLikes`, `initialLiked`, porque o valor pode mudar apos interacao do usuario e o nome comunica isso
7. **Data attributes para estilo condicional** — use `data-liked={liked}` com classes Tailwind condicionais no atributo, porque desacopla logica de estilo do JSX

## How to write

### Funcao HTTP unificada (single e batch)

```typescript
// http/get-issue-interactions.ts
export async function getIssueInteractions({ issueIds }: { issueIds: string[] }) {
  const url = new URL('/interactions', API_BASE)
  url.searchParams.set('issueIds', issueIds.join(','))

  const response = await fetch(url, {
    credentials: 'include', // envia cookies automaticamente no client-side
  })

  const data = await response.json()
  return issueInteractionsResponseSchema.parse(data)
}
```

### useSuspenseQuery no client component

```typescript
'use client'

function IssueLikeButton({ issueId }: { issueId: string }) {
  const { data } = useSuspenseQuery({
    queryKey: ['issue-likes', issueId],
    queryFn: () => getIssueInteractions({ issueIds: [issueId] }),
  })

  const interaction = data.interactions[0]

  return (
    <LikeButton
      issueId={issueId}
      initialLikes={interaction.likesCount}
      initialLiked={interaction.isLiked}
    />
  )
}
```

### Suspense wrapper na page (server component)

```tsx
// page.tsx (server component — nao vira client component)
<Suspense fallback={<Skeleton className="h-7 w-16" />}>
  <IssueLikeButton issueId={issue.id} />
</Suspense>
```

### Componente reutilizavel com data attributes

```tsx
interface LikeButtonProps extends ComponentProps<'button'> {
  issueId: string
  initialLikes: number
  initialLiked?: boolean
}

function LikeButton({ issueId, initialLikes, initialLiked = false, ...props }: LikeButtonProps) {
  const liked = initialLiked // sera expandido com logica de toggle

  return (
    <button
      data-liked={liked}
      aria-label={liked ? 'unlike' : 'like'}
      className="data-[liked=true]:bg-indigo-600 data-[liked=true]:text-white data-[liked=true]:hover:bg-indigo-500"
      {...props}
    >
      <ThumbsUp />
      {initialLikes}
    </button>
  )
}
```

## Example

**Before (client component grande com isLoading):**
```tsx
'use client'
export default function IssuePage({ id }: { id: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['issue-likes'],
    queryFn: () => fetch(`/api/interactions?id=${id}`),
  })

  if (isLoading) return <Spinner />
  if (!data) return null

  return (
    <div>
      <h1>{data.title}</h1>
      <button className={data.isLiked ? 'bg-blue-500' : ''}>
        {data.likesCount}
      </button>
    </div>
  )
}
```

**After (com esta skill aplicada):**
```tsx
// page.tsx — server component preservado
export default async function IssuePage({ params }: { params: { id: string } }) {
  const issue = await getIssue(params.id)

  return (
    <div>
      <h1>{issue.title}</h1>
      <Suspense fallback={<Skeleton className="h-7 w-16" />}>
        <IssueLikeButton issueId={params.id} />
      </Suspense>
    </div>
  )
}

// issue-like-button.tsx — client component minimo
'use client'
function IssueLikeButton({ issueId }: { issueId: string }) {
  const { data } = useSuspenseQuery({
    queryKey: ['issue-likes', issueId],
    queryFn: () => getIssueInteractions({ issueIds: [issueId] }),
  })
  const interaction = data.interactions[0]

  return (
    <LikeButton
      issueId={issueId}
      initialLikes={interaction.likesCount}
      initialLiked={interaction.isLiked}
    />
  )
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Fetch autenticado no client-side | `credentials: 'include'` no fetch |
| Fetch autenticado no server component | Importe `headers()` de `next/headers` e passe manualmente |
| Componente precisa de dados async | Extraia para client component minimo com useSuspenseQuery |
| Mesmo botao usado em 2+ lugares | Crie componente com props `initial*` e estenda ComponentProps |
| Estilo condicional binario (liked/not) | Use `data-*` attribute + classes Tailwind condicionais |
| API aceita 1 ou N IDs | Uma unica funcao HTTP, passe array sempre |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `useQuery` + `isLoading` + `if (!data)` | `useSuspenseQuery` + `<Suspense fallback>` |
| Transformar page inteira em `'use client'` | Extrair menor client component possivel |
| `queryKey: ['issue-likes']` sem ID | `queryKey: ['issue-likes', issueId]` |
| `className={liked ? 'bg-indigo-600' : ''}` | `data-liked={liked}` + `data-[liked=true]:bg-indigo-600` |
| Duas funcoes HTTP para single/batch | Uma funcao que recebe `issueIds: string[]` |
| `fetch(url)` sem credentials em rota autenticada | `fetch(url, { credentials: 'include' })` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/next-js/rs-next-js-carregamento-das-interacoes-na-issue/references/deep-explanation.md)
- [Code examples](../../../data/skills/next-js/rs-next-js-carregamento-das-interacoes-na-issue/references/code-examples.md)

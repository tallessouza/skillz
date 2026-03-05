# Code Examples: Carregando Interacoes no Board

## Exemplo 1: Extraindo server page para client component

### Antes (tudo na page server-side)

```typescript
// app/board/page.tsx
import { getIssues } from '@/api/issues'

export const metadata = { title: 'Board' }

export default async function BoardPage() {
  const issues = await getIssues()

  return (
    <main>
      <div className="board-column">
        <h2>Backlog</h2>
        {issues.backlog.map(issue => (
          <div key={issue.id}>
            <span>{issue.title}</span>
            <span>👍 0</span> {/* Likes estaticos */}
          </div>
        ))}
      </div>
      {/* ... todo, inProgress, done */}
    </main>
  )
}
```

### Depois (separado em server page + client component)

```typescript
// app/board/page.tsx (server — so faz fetch)
import { getIssues } from '@/api/issues'
import { BoardContent } from './board-content'

export const metadata = { title: 'Board' }

export default async function BoardPage() {
  const issues = await getIssues()
  return <BoardContent issues={issues} />
}
```

```typescript
// app/board/board-content.tsx (client — usa hooks)
'use client'

import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { type z } from 'zod'
import { type issueListResponseSchema } from '@/api/schemas'
import { getIssueInteractions } from '@/http/interactions'
import { IssueLikeButton } from '@/components/issue-like-button'

type InteractionsMap = Map<string, {
  isLiked: boolean
  likesCount: number
}>

interface BoardContentProps {
  issues: z.infer<typeof issueListResponseSchema>
}

export function BoardContent({ issues }: BoardContentProps) {
  // Coletar todos os IDs de todas as colunas
  const allIssueIds = [
    ...issues.backlog.map(issue => issue.id),
    ...issues.todo.map(issue => issue.id),
    ...issues.inProgress.map(issue => issue.id),
    ...issues.done.map(issue => issue.id),
  ]

  // Buscar interacoes de todas as issues de uma vez
  const { data: interactionsData, isLoading: isLoadingInteractions } = useQuery({
    queryKey: ['issues-interactions', allIssueIds.sort().join(',')],
    queryFn: () => getIssueInteractions({ issueIds: allIssueIds }),
  })

  // Construir Map para lookup O(1)
  const interactions = useMemo<InteractionsMap>(() => {
    if (!interactionsData) return new Map()

    return new Map(
      interactionsData.interactions.map(interaction => [
        interaction.issueId,
        {
          isLiked: interaction.isLiked,
          likesCount: interaction.likesCount,
        }
      ])
    )
  }, [interactionsData])

  return (
    <main>
      {/* Backlog */}
      <div className="board-column">
        <h2>Backlog</h2>
        {issues.backlog.map(issue => {
          const interaction = interactions.get(issue.id)
          return (
            <div key={issue.id}>
              <span>{issue.title}</span>
              <IssueLikeButton
                issueId={issue.id}
                initialLikes={interaction?.likesCount ?? 0}
                initialLiked={interaction?.isLiked ?? false}
              />
              <span>{issue.comments} comments</span>
            </div>
          )
        })}
      </div>

      {/* Todo — mesma logica */}
      <div className="board-column">
        <h2>Todo</h2>
        {issues.todo.map(issue => {
          const interaction = interactions.get(issue.id)
          return (
            <div key={issue.id}>
              <span>{issue.title}</span>
              <IssueLikeButton
                issueId={issue.id}
                initialLikes={interaction?.likesCount ?? 0}
                initialLiked={interaction?.isLiked ?? false}
              />
              <span>{issue.comments} comments</span>
            </div>
          )
        })}
      </div>

      {/* In Progress e Done seguem o mesmo padrao */}
    </main>
  )
}
```

## Exemplo 2: Construcao do Map tipado

```typescript
// Sem tipo explicito — TypeScript infere Map<string, { isLiked: any, likesCount: any }>
const interactions = useMemo(() => {
  if (!interactionsData) return new Map()
  return new Map(
    interactionsData.interactions.map(i => [i.issueId, { isLiked: i.isLiked, likesCount: i.likesCount }])
  )
}, [interactionsData])

// Com tipo explicito — TypeScript sabe exatamente o shape
type InteractionsMap = Map<string, { isLiked: boolean; likesCount: number }>

const interactions = useMemo<InteractionsMap>(() => {
  if (!interactionsData) return new Map()
  return new Map(
    interactionsData.interactions.map(i => [i.issueId, { isLiked: i.isLiked, likesCount: i.likesCount }])
  )
}, [interactionsData])
```

## Exemplo 3: Query key estavel

```typescript
// ERRADO: ordem muda quando issues trocam de coluna
queryKey: ['issues-interactions', allIssueIds.join(',')]
// IDs: "3,1,2" vs "1,3,2" = cache invalidado!

// CORRETO: sort garante mesma key independente da ordem
queryKey: ['issues-interactions', allIssueIds.sort().join(',')]
// IDs: "1,2,3" sempre = cache reutilizado
```

## Exemplo 4: Importacao correta (http vs api)

```typescript
// ERRADO em client component:
import { getIssueInteractions } from '@/api/interactions'
// Funcoes de api/ usam headers do server — quebra no cliente

// CORRETO em client component:
import { getIssueInteractions } from '@/http/interactions'
// Funcoes de http/ fazem fetch client-side
```
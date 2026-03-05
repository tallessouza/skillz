# Code Examples: Partial Pre-Rendering com Suspense API

## Exemplo completo da aula: Issue Page com Suspense

### Pagina da issue (antes — tudo bloqueado)

```tsx
// app/issues/[id]/page.tsx
export default async function IssuePage({ params }: { params: { id: string } }) {
  const issue = await getIssue(params.id)

  return (
    <div>
      <h1>{issue.title}</h1>
      <p>{issue.description}</p>
      {/* Este componente tem await interno — bloqueia a pagina inteira */}
      <CommentsList issueId={params.id} />
    </div>
  )
}
```

### Pagina da issue (depois — com Suspense)

```tsx
// app/issues/[id]/page.tsx
import { Suspense } from 'react'
import { CommentsList } from './comments-list'
import { IssueCommentsSkeleton } from './issue-comments-skeleton'

export default async function IssuePage({ params }: { params: { id: string } }) {
  const issue = await getIssue(params.id)

  return (
    <div>
      <h1>{issue.title}</h1>
      <p>{issue.description}</p>

      <Suspense fallback={<IssueCommentsSkeleton />}>
        <CommentsList issueId={params.id} />
      </Suspense>
    </div>
  )
}
```

### Server component com await (o componente lento)

```tsx
// app/issues/[id]/comments-list.tsx
import { setTimeout } from 'node:timers/promises'

export async function CommentsList({ issueId }: { issueId: string }) {
  await setTimeout(3000) // Simula latencia
  const comments = await getComments(issueId)

  return (
    <div className="space-y-3">
      {comments.map((comment) => (
        <div key={comment.id} className="flex gap-3">
          <img
            src={comment.author.avatar}
            className="size-8 rounded-full shrink-0"
            alt=""
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{comment.author.name}</span>
              <span className="text-sm text-muted">{comment.createdAt}</span>
            </div>
            <p>{comment.body}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
```

### Skeleton espelhando a estrutura do componente real

```tsx
// app/issues/[id]/issue-comments-skeleton.tsx
import { Skeleton } from '@/components/skeleton'

export function IssueCommentsSkeleton() {
  const items = Array.from({ length: 3 })

  return (
    <div className="space-y-3">
      {items.map((_, index) => (
        <div key={index} className="flex gap-3">
          {/* Avatar — shrink-0 impede compressao pelo flexbox */}
          <Skeleton className="size-8 rounded-full shrink-0" />

          <div className="flex-1">
            {/* Linha do nome + data */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>

            {/* Corpo do comentario — duas linhas simuladas */}
            <div className="space-y-1.5">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
```

## Variacao: multiplos Suspense boundaries na mesma pagina

```tsx
import { Suspense } from 'react'

export default async function DashboardPage() {
  const user = await getUser() // Rapido — critico

  return (
    <div>
      <h1>Ola, {user.name}</h1>

      <div className="grid grid-cols-2 gap-4">
        <Suspense fallback={<StatsSkeleton />}>
          <StatsPanel userId={user.id} />
        </Suspense>

        <Suspense fallback={<ActivitySkeleton />}>
          <RecentActivity userId={user.id} />
        </Suspense>
      </div>

      <Suspense fallback={<NotificationsSkeleton />}>
        <NotificationsList userId={user.id} />
      </Suspense>
    </div>
  )
}
```

Cada Suspense boundary carrega independentemente. Se `StatsPanel` resolve em 200ms e `RecentActivity` em 2s, o usuario ve as stats imediatamente enquanto o skeleton de activity ainda aparece.

## Nota sobre Array.from para skeletons

```tsx
// Array.from cria array com slots vazios (undefined)
const items = Array.from({ length: 3 })
// items = [undefined, undefined, undefined]

// Usar index como key e seguro aqui porque:
// 1. O array nunca muda de tamanho
// 2. Os itens nunca sao reordenados
// 3. E apenas um placeholder visual
items.map((_, index) => <div key={index}>...</div>)
```

## Nota sobre import do setTimeout

```tsx
// Para usar await com setTimeout em server components:
import { setTimeout } from 'node:timers/promises'

// Isso retorna uma Promise, diferente do setTimeout global do browser
await setTimeout(3000)
```
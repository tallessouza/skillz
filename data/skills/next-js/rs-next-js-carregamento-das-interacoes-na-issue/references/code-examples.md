# Code Examples: Carregamento de Interacoes na Issue

## 1. Funcao HTTP para carregar interacoes

```typescript
// http/get-issue-interactions.ts
import { issueInteractionsResponseSchema } from '@/schemas'

interface GetIssueInteractionsParams {
  issueIds: string[]
}

export async function getIssueInteractions({ issueIds }: GetIssueInteractionsParams) {
  const url = new URL(`${API_BASE}/interactions`)
  url.searchParams.set('issueIds', issueIds.join(','))

  const response = await fetch(url.toString(), {
    credentials: 'include', // envia cookies para autenticacao client-side
  })

  const data = await response.json()
  return issueInteractionsResponseSchema.parse(data)
}
```

**Ponto-chave:** `issueIds.join(',')` porque a API espera IDs separados por virgula como search param.

## 2. IssueLikeButton — client component minimo

```typescript
// components/issue-like-button.tsx
'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
import { getIssueInteractions } from '@/http/get-issue-interactions'
import { LikeButton } from '@/components/like-button'

interface IssueLikeButtonProps {
  issueId: string
}

export function IssueLikeButton({ issueId }: IssueLikeButtonProps) {
  const { data } = useSuspenseQuery({
    queryKey: ['issue-likes', issueId], // ID na key para cache independente
    queryFn: () => getIssueInteractions({ issueIds: [issueId] }),
  })

  const interaction = data.interactions[0] // unica interacao no array

  return (
    <LikeButton
      issueId={issueId}
      initialLikes={interaction.likesCount}
      initialLiked={interaction.isLiked}
    />
  )
}
```

## 3. LikeButton — componente reutilizavel

```tsx
// components/like-button.tsx
import { ComponentProps } from 'react'
import { Button } from '@/components/ui/button'
import { ThumbsUp } from 'lucide-react'

interface LikeButtonProps extends ComponentProps<'button'> {
  issueId: string
  initialLikes: number
  initialLiked?: boolean
}

export function LikeButton({
  issueId,
  initialLikes,
  initialLiked = false,
  ...props
}: LikeButtonProps) {
  const liked = initialLiked // sera expandido com logica de mutacao

  return (
    <Button
      data-liked={liked}
      aria-label={liked ? 'unlike' : 'like'}
      className="data-[liked=true]:bg-indigo-600 data-[liked=true]:text-white data-[liked=true]:hover:bg-indigo-500"
      {...props}
    >
      <ThumbsUp />
      {initialLikes}
    </Button>
  )
}
```

## 4. Page com Suspense — server component preservado

```tsx
// app/issues/[id]/page.tsx
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { IssueLikeButton } from '@/components/issue-like-button'

export default async function IssuePage({ params }: { params: { id: string } }) {
  const issue = await getIssue(params.id)

  return (
    <div>
      <h1>{issue.title}</h1>
      {/* ... conteudo da issue ... */}
      <Suspense fallback={<Skeleton className="h-7 w-16" />}>
        <IssueLikeButton issueId={params.id} />
      </Suspense>
    </div>
  )
}
```

## 5. Variacao: fetch autenticado em server component

```typescript
// Quando o fetch acontece no server component (nao no navegador)
import { headers } from 'next/headers'

export async function getIssueInteractionsServer({ issueIds }: { issueIds: string[] }) {
  const url = new URL(`${API_BASE}/interactions`)
  url.searchParams.set('issueIds', issueIds.join(','))

  const response = await fetch(url.toString(), {
    headers: await headers(), // repassa cookies manualmente
  })

  const data = await response.json()
  return issueInteractionsResponseSchema.parse(data)
}
```

## 6. Erro comum: nome do parametro errado

```typescript
// ERRADO — causa "received undefined" no Zod
url.searchParams.set('issuesIds', issueIds.join(',')) // 'issuesIds' com 's' extra

// CORRETO — deve bater exatamente com o que a API espera
url.searchParams.set('issueIds', issueIds.join(','))
```

## 7. Pattern completo: query key com ID

```typescript
// ERRADO — mesmo cache para todas as issues
const { data } = useSuspenseQuery({
  queryKey: ['issue-likes'], // todas compartilham
  queryFn: () => getIssueInteractions({ issueIds: [issueId] }),
})

// CORRETO — cache independente por issue
const { data } = useSuspenseQuery({
  queryKey: ['issue-likes', issueId], // unico por issue
  queryFn: () => getIssueInteractions({ issueIds: [issueId] }),
})
```
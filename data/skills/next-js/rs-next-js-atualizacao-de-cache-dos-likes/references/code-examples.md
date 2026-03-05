# Code Examples: Atualizacao de Cache dos Likes

## Exemplo 1: LikeButton com stopPropagation

O componente recebe `onToggleLike` como prop e cria um handler local para tratar o evento:

```typescript
// components/like-button.tsx
import { MouseEvent } from 'react'

interface LikeButtonProps {
  likesCount: number
  isLiked: boolean
  onToggleLike: () => void
}

export function LikeButton({ likesCount, isLiked, onToggleLike }: LikeButtonProps) {
  function handleToggleLike(event: MouseEvent) {
    event.stopPropagation()
    event.preventDefault()
    onToggleLike()
  }

  return (
    <button onClick={handleToggleLike}>
      {isLiked ? '❤️' : '🤍'} {likesCount}
    </button>
  )
}
```

**Ponto-chave:** O tipo `MouseEvent` vem do React (`React.MouseEvent`), nao do DOM nativo.

## Exemplo 2: Mutation com getQueriesData/setQueriesData

Antes (query unica):

```typescript
const likeMutation = useMutation({
  mutationFn: (issueId: string) => toggleIssueLike(issueId),
  onMutate: async (issueId) => {
    await queryClient.cancelQueries({ queryKey: ['issueLikes', issueId] })

    const previousData = queryClient.getQueryData(['issueLikes', issueId])

    queryClient.setQueryData(['issueLikes', issueId], (old: LikesData) => ({
      ...old,
      total: old.isLiked ? old.total - 1 : old.total + 1,
      isLiked: !old.isLiked,
    }))

    return { previousData }
  },
  onError: (_err, issueId, context) => {
    queryClient.setQueryData(['issueLikes', issueId], context?.previousData)
  },
})
```

Depois (todas as queries com prefixo):

```typescript
const likeMutation = useMutation({
  mutationFn: (issueId: string) => toggleIssueLike(issueId),
  onMutate: async (issueId) => {
    // Cancela todas as queries que comecam com 'issueLikes'
    await queryClient.cancelQueries({ queryKey: ['issueLikes'] })

    // Captura snapshot de TODAS as queries com esse prefixo
    const previousData = queryClient.getQueriesData({
      queryKey: ['issueLikes'],
    })

    // Atualiza TODAS as queries com o prefixo
    queryClient.setQueriesData(
      { queryKey: ['issueLikes'] },
      (old: LikesData | undefined) => {
        if (!old) return old
        return {
          ...old,
          total: old.isLiked ? old.total - 1 : old.total + 1,
          isLiked: !old.isLiked,
        }
      }
    )

    return { previousData }
  },
  onError: (_err, _issueId, context) => {
    // Itera o array de [queryKey, data] para restaurar cada uma
    for (const [queryKey, data] of context?.previousData ?? []) {
      queryClient.setQueryData(queryKey, data)
    }
  },
})
```

## Exemplo 3: Como as queries compartilham prefixo

No board (lista):
```typescript
const { data: likes } = useQuery({
  queryKey: ['issueLikes', issueId],
  queryFn: () => getIssueLikes(issueId),
})
```

Na pagina interna (detalhe):
```typescript
const { data: likes } = useQuery({
  queryKey: ['issueLikes', issueId],
  queryFn: () => getIssueLikes(issueId),
})
```

Ambas comecam com `'issueLikes'`, entao `getQueriesData({ queryKey: ['issueLikes'] })` captura as duas. Mesmo que tenham `issueId` diferentes como segundo elemento, o prefixo match funciona.

## Exemplo 4: Tipagem do previousData no context

```typescript
// O retorno de getQueriesData e um array de tuplas
type PreviousData = [QueryKey, LikesData | undefined][]

// No onMutate, o retorno define o tipo do context
onMutate: async (issueId) => {
  const previousData = queryClient.getQueriesData({ queryKey: ['issueLikes'] })
  return { previousData } // context.previousData sera PreviousData
}

// No onError, TypeScript sabe que context.previousData e iteravel
onError: (_err, _vars, context) => {
  for (const [queryKey, data] of context?.previousData ?? []) {
    queryClient.setQueryData(queryKey, data)
  }
}
```
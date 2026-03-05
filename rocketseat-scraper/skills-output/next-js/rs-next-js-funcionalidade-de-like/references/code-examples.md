# Code Examples: Funcionalidade de Like

## 1. Funcao HTTP para toggle like

```typescript
// http/toggle-like.ts
interface ToggleLikeParams {
  issueId: string
}

export async function toggleLike({ issueId }: ToggleLikeParams) {
  const response = await api.post(`/issues/${issueId}/like`)
  return issueLikeResponseSchema.parse(response.data)
}
```

**Nota:** O metodo e POST (nao GET). O instrutor cometeu o erro de usar GET inicialmente e recebeu 404 — a API espera POST para o toggle.

## 2. Schema separado para reutilizacao

```typescript
// api/routes/schemas/issue-likes.ts
import { z } from 'zod'

export const issueLikeResponseSchema = z.object({
  likesCount: z.number(),
  liked: z.boolean(),
})

// Tipagem derivada do schema
export type IssueLikeResponse = z.infer<typeof issueLikeResponseSchema>
```

**Insight:** O instrutor precisou extrair o schema para um arquivo separado porque o schema original nao era exportado da rota da API. Manter schemas em arquivos dedicados facilita o reuso entre back-end e front-end.

## 3. LikeButton completo com interface otimista

```typescript
// components/like-button.tsx
'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toggleLike } from '@/http/toggle-like'
import { getIssueInteractions } from '@/http/get-issue-interactions'
import type { IssueInteractionsResponse } from '@/api/routes/schemas/issue-interactions'

interface LikeButtonProps {
  issueId: string
}

export function LikeButton({ issueId }: LikeButtonProps) {
  const queryClient = useQueryClient()

  // Query client-side (sem Suspense para evitar erro de hidratacao)
  const { data, isLoading } = useQuery({
    queryKey: ['issueLikes', issueId],
    queryFn: () => getIssueInteractions({ issueId }),
  })

  const { mutate: handleToggleLike, isPending } = useMutation({
    mutationFn: () => toggleLike({ issueId }),

    onMutate: async () => {
      // 1. Salvar estado anterior
      const previousData = queryClient.getQueryData<IssueInteractionsResponse>(
        ['issueLikes', issueId]
      )

      // 2. Atualizar cache otimisticamente
      queryClient.setQueryData<IssueInteractionsResponse>(
        ['issueLikes', issueId],
        (old) => {
          if (!old) return undefined
          return {
            ...old,
            interactions: old.interactions.map((interaction) =>
              interaction.issueId === issueId
                ? {
                    ...interaction,
                    isLiked: !interaction.isLiked,
                    likesCount: interaction.isLiked
                      ? interaction.likesCount - 1
                      : interaction.likesCount + 1,
                  }
                : interaction
            ),
          }
        }
      )

      // 3. Retornar para rollback
      return previousData
    },

    onError: (_error, _variables, context) => {
      // Rollback ao estado anterior
      if (context) {
        queryClient.setQueryData(['issueLikes', issueId], context)
      }
    },
  })

  if (isLoading) return <Skeleton />

  const likesCount = data?.likesCount ?? 0
  const isLiked = data?.isLiked ?? false

  return (
    <button onClick={() => handleToggleLike()} disabled={isPending}>
      {isLiked ? '❤️' : '🤍'} {likesCount}
    </button>
  )
}
```

## 4. Teste de rollback com erro forcado

```typescript
// Para testar se o rollback funciona, force um erro na funcao:
export async function toggleLike({ issueId }: ToggleLikeParams) {
  throw new Error('test') // Erro forcado
  const response = await api.post(`/issues/${issueId}/like`)
  return issueLikeResponseSchema.parse(response.data)
}

// Comportamento esperado:
// 1. Usuario clica → UI atualiza instantaneamente (otimista)
// 2. Erro e capturado pelo onError
// 3. Cache e restaurado com previousData
// 4. UI volta ao estado original
```

## 5. Tipagem com z.infer para cache do React Query

```typescript
import { z } from 'zod'
import { issueInteractionsSchema } from '@/api/routes/schemas/issue-interactions'

// Derivar tipo do schema Zod
type IssueInteractionsResponse = z.infer<typeof issueInteractionsSchema>

// Usar no getQueryData para tipagem correta
const previousData = queryClient.getQueryData<IssueInteractionsResponse>(queryKey)

// O setQueryData agora sabe o formato exato do updater
queryClient.setQueryData<IssueInteractionsResponse>(queryKey, (old) => {
  // TypeScript valida que o retorno tem o formato correto
  return { ...old, /* campos tipados */ }
})
```

## 6. Diferenca: Suspense vs useQuery para dados auth-dependent

```typescript
// ERRADO: Suspense com dados que dependem de auth
// Causa erro de hidratacao (servidor nao tem cookies do usuario)
<Suspense fallback={<Skeleton />}>
  <LikeButton issueId={issueId} />  {/* useSuspenseQuery interno */}
</Suspense>

// CORRETO: useQuery normal, loading manual
function LikeButton({ issueId }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: ['issueLikes', issueId],
    queryFn: () => getIssueInteractions({ issueId }),
  })

  if (isLoading) return <Skeleton />

  // Agora a requisicao so acontece no client-side
  // Sempre tera os cookies/headers do usuario logado
}
```
---
name: rs-next-js-funcionalidade-de-like
description: "Applies optimistic UI update patterns with React Query mutations when implementing like/toggle features in Next.js applications. Use when user asks to 'add a like button', 'implement optimistic updates', 'toggle feature with React Query', 'handle mutation rollback', or 'update UI before server response'. Ensures correct cache manipulation, error rollback, and hydration-safe data fetching. Make sure to use this skill whenever building interactive toggle features that need instant feedback. Not for server-side data fetching, static pages, or non-interactive UI components."
---

# Funcionalidade de Like com Interface Otimista

> Ao implementar toggles interativos, atualize a UI instantaneamente via manipulacao otimista do cache do React Query, com rollback automatico em caso de erro.

## Rules

1. **Use useMutation para acoes de escrita** — nunca faca POST/PATCH direto no onClick, porque useMutation gerencia estado de pending, erro e rollback automaticamente
2. **Desabilite o botao durante a mutation** — extraia `isPending` do useMutation e passe para `disabled`, porque previne cliques duplicados e requisicoes concorrentes
3. **Faca interface otimista no onMutate** — atualize o cache ANTES da resposta do servidor, porque o usuario ve feedback instantaneo sem esperar a rede
4. **Retorne previousData no onMutate** — salve o estado anterior e retorne-o, porque o onError precisa desse valor para fazer rollback
5. **Rollback no onError via context** — acesse `context.previousData` e restaure o cache com setQueryData, porque garante consistencia quando o servidor falha
6. **Evite Suspense para dados que dependem de autenticacao client-side** — use useQuery normal com isLoading, porque o servidor nao tem os cookies/headers do usuario logado, causando erros de hidratacao

## How to write

### Mutation com interface otimista

```typescript
const queryClient = useQueryClient()

const { mutate: handleToggleLike, isPending } = useMutation({
  mutationFn: () => toggleLike({ issueId }),
  onMutate: async () => {
    const previousData = queryClient.getQueryData<IssueInteractionsResponse>(
      ['issueLikes', issueId]
    )

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

    return previousData
  },
  onError: (_error, _variables, context) => {
    if (context) {
      queryClient.setQueryData(['issueLikes', issueId], context)
    }
  },
})
```

### Botao com disabled durante mutation

```typescript
<button onClick={() => handleToggleLike()} disabled={isPending}>
  {likesCount}
</button>
```

### Query client-side sem Suspense (evitar erro de hidratacao)

```typescript
const { data, isLoading } = useQuery({
  queryKey: ['issueLikes', issueId],
  queryFn: () => getIssueInteractions({ issueId }),
})

if (isLoading) return <Skeleton />

const likesCount = data?.likesCount ?? 0
const isLiked = data?.isLiked ?? false
```

## Example

**Before (sem interface otimista):**
```typescript
const { mutate } = useMutation({
  mutationFn: () => toggleLike({ issueId }),
})

// Usuario clica → espera 200-500ms → UI atualiza
// Se der erro, UI fica inconsistente
<button onClick={() => mutate()}>Like</button>
```

**After (com interface otimista e rollback):**
```typescript
const { mutate, isPending } = useMutation({
  mutationFn: () => toggleLike({ issueId }),
  onMutate: async () => {
    const previous = queryClient.getQueryData(['issueLikes', issueId])
    queryClient.setQueryData(['issueLikes', issueId], (old) => ({
      ...old,
      isLiked: !old.isLiked,
      likesCount: old.isLiked ? old.likesCount - 1 : old.likesCount + 1,
    }))
    return previous
  },
  onError: (_err, _vars, context) => {
    if (context) queryClient.setQueryData(['issueLikes', issueId], context)
  },
})

// Usuario clica → UI atualiza instantaneamente → se erro, volta ao original
<button onClick={() => mutate()} disabled={isPending}>Like</button>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Toggle (like, favorite, bookmark) | Sempre use interface otimista com rollback |
| Dados dependem do usuario logado | useQuery client-side, nunca Suspense no server |
| Botao de acao que faz POST/PATCH | Sempre desabilite com isPending |
| Cache precisa refletir acao imediata | setQueryData no onMutate, nao espere onSuccess |
| Erro na mutation | Restaure previousData via context no onError |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `onClick={() => fetch('/api/like', { method: 'POST' })}` | `onClick={() => mutate()}` com useMutation |
| Suspense em dados que dependem de auth client-side | useQuery com isLoading e fallback manual |
| `onSuccess: () => queryClient.invalidateQueries(...)` para toggles | `onMutate` com atualizacao otimista (mais rapido) |
| Mutation sem `disabled={isPending}` no botao | Sempre extraia isPending e passe para disabled |
| `setQueryData` sem salvar previousData | Sempre salve e retorne previousData para rollback |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

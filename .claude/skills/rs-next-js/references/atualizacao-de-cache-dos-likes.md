---
name: rs-next-js-atualizacao-cache-likes
description: "Applies optimistic cache update patterns for TanStack Query mutations in Next.js when user asks to 'add like', 'implement favorite', 'optimistic update', 'invalidate cache', or 'update query cache'. Enforces prefix-based query matching with getQueriesData/setQueriesData to update all related queries simultaneously. Make sure to use this skill whenever implementing mutations that affect data shown in multiple views. Not for server-side caching, HTTP cache headers, or static page revalidation."
---

# Atualizacao de Cache dos Likes

> Ao implementar mutacoes que afetam dados exibidos em multiplas views, atualize todas as queries relacionadas via prefixo, nunca uma query individual.

## Rules

1. **Use prefixo para buscar queries relacionadas** — `getQueriesData({ queryKey: ['issueLikes'] })` em vez de `getQueryData(['issueLikes', id])`, porque a mesma entidade aparece em listagens e paginas de detalhe simultaneamente
2. **Use setQueriesData para atualizar em lote** — aplica a funcao de atualizacao em todas as queries que compartilham o prefixo, porque garante consistencia entre board e pagina interna
3. **Rollback com iteracao no onError** — percorra `context.previousData` com `for...of` e restaure cada query individualmente, porque o setQueriesData afeta multiplas queries
4. **stopPropagation em botoes dentro de links** — `event.stopPropagation()` + `event.preventDefault()` quando um botao interativo esta dentro de um card clicavel, porque evita navegacao indesejada ao clicar no like
5. **Separe handler interno do callback da mutation** — crie `handleToggleLike` local que trata o evento e depois chama `onToggleLike`, porque o handler precisa acessar o evento antes de delegar a logica de negocio

## How to write

### Optimistic update com prefixo (TanStack Query)

```typescript
const likeMutation = useMutation({
  mutationFn: toggleLike,
  onMutate: async (issueId) => {
    // Cancela queries com o prefixo
    await queryClient.cancelQueries({ queryKey: ['issueLikes'] })

    // Captura TODAS as queries que comecam com o prefixo
    const previousData = queryClient.getQueriesData({ queryKey: ['issueLikes'] })

    // Atualiza TODAS de uma vez
    queryClient.setQueriesData(
      { queryKey: ['issueLikes'] },
      (old: LikesData | undefined) => {
        if (!old) return old
        // aplica logica de toggle no old
        return { ...old, total: old.isLiked ? old.total - 1 : old.total + 1, isLiked: !old.isLiked }
      }
    )

    return { previousData }
  },
  onError: (_err, _vars, context) => {
    // Rollback iterando todas as queries salvas
    for (const [queryKey, data] of context?.previousData ?? []) {
      queryClient.setQueryData(queryKey, data)
    }
  },
})
```

### Botao de like dentro de card clicavel

```typescript
function handleToggleLike(event: React.MouseEvent) {
  event.stopPropagation()
  event.preventDefault()
  onToggleLike()
}

return (
  <button onClick={handleToggleLike}>
    {likesCount}
  </button>
)
```

## Example

**Before (atualiza apenas uma query — board fica desatualizado):**
```typescript
const previousData = queryClient.getQueryData(['issueLikes', issueId])
queryClient.setQueryData(['issueLikes', issueId], (old) => ({
  ...old, total: old.total + 1, isLiked: true
}))
// onError
queryClient.setQueryData(['issueLikes', issueId], context.previousData)
```

**After (atualiza todas as queries com prefixo — board e detalhe sincronizados):**
```typescript
const previousData = queryClient.getQueriesData({ queryKey: ['issueLikes'] })
queryClient.setQueriesData({ queryKey: ['issueLikes'] }, (old) => ({
  ...old, total: old.isLiked ? old.total - 1 : old.total + 1, isLiked: !old.isLiked
}))
// onError
for (const [queryKey, data] of context.previousData) {
  queryClient.setQueryData(queryKey, data)
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Dado aparece em uma unica view | `getQueryData` / `setQueryData` com key exata |
| Dado aparece em multiplas views (lista + detalhe) | `getQueriesData` / `setQueriesData` com prefixo |
| Botao interativo dentro de elemento clicavel | `stopPropagation()` + `preventDefault()` |
| Mutation precisa de rollback multi-query | Salvar array de `getQueriesData` e iterar no `onError` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `getQueryData(['likes', id])` quando dado aparece em multiplas views | `getQueriesData({ queryKey: ['likes'] })` |
| `setQueryData` unico para atualizar lista e detalhe | `setQueriesData` com prefixo compartilhado |
| `onClick={onToggleLike}` direto em botao dentro de link | `onClick={handleToggleLike}` com stopPropagation |
| Rollback com `setQueryData` unico apos `setQueriesData` | `for...of` iterando `context.previousData` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/next-js/rs-next-js-atualizacao-de-cache-dos-likes/references/deep-explanation.md)
- [Code examples](../../../data/skills/next-js/rs-next-js-atualizacao-de-cache-dos-likes/references/code-examples.md)

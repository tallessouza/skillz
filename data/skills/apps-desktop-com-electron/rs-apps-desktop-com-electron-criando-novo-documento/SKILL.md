---
name: rs-electron-criando-novo-documento
description: "Applies React Query useMutation with optimistic cache updates via setQueryData when writing mutation logic. Use when user asks to 'create a mutation', 'add item to list', 'update cache after mutation', 'useMutation', or 'avoid refetch after create'. Enforces setQueryData over invalidateQueries for known data, immutable state updates, and proper loading state naming. Make sure to use this skill whenever implementing create/update/delete operations with React Query. Not for initial data fetching, useQuery setup, or server-side logic."
---

# React Query Mutations com Cache Otimizado

> Ao criar mutations com React Query, atualize o cache diretamente com `setQueryData` quando voce ja tem os dados, evitando requisicoes desnecessarias.

## Rules

1. **Use `useMutation` para operacoes de escrita** — criar, alterar, remover usam `useMutation`, nunca `useQuery`, porque `useQuery` e exclusivo para leitura de dados
2. **Prefira `mutateAsync` sobre `mutate`** — `mutateAsync` retorna uma Promise, permitindo composicao com async/await e melhor controle de fluxo
3. **Renomeie `isLoading` com contexto** — `isCreatingNewDocument` nao `isLoading`, porque um componente pode ter multiplas mutations e `isLoading` e ambiguo
4. **Prefira `setQueryData` sobre `invalidateQueries`** — quando a mutation retorna os dados criados/alterados, atualize o cache diretamente, porque `invalidateQueries` gera uma requisicao extra desnecessaria
5. **Atualize estado de forma imutavel** — `[...documents, newDoc]` nao `documents.push(newDoc)`, porque React Query exige imutabilidade para detectar mudancas
6. **Nunca passe funcao diretamente no onClick** — use arrow function anonima `() => createDocument()`, porque onClick repassa o evento como argumento para a funcao

## How to write

### Estrutura basica de useMutation

```typescript
const { mutateAsync: createDocument, isLoading: isCreatingNewDocument } = useMutation({
  mutationFn: async () => {
    const response = await window.api.createDocument()
    return response.data
  },
  onSuccess: (data) => {
    queryClient.setQueryData(['documents'], (documents: Document[] | undefined) => {
      if (documents && documents.length >= 0) {
        return [...documents, data]
      }
      return [data]
    })
  },
})
```

### Binding no onClick

```typescript
<button
  onClick={() => createDocument()}
  disabled={isCreatingNewDocument}
  className="disabled:opacity-60"
>
  Novo documento
</button>
```

## Example

**Before (invalidateQueries — requisicao extra):**
```typescript
const { mutateAsync: createDocument } = useMutation({
  mutationFn: async () => {
    const response = await window.api.createDocument()
    return response.data
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['documents'] })
  },
})
```

**After (setQueryData — sem requisicao extra):**
```typescript
const queryClient = useQueryClient()

const { mutateAsync: createDocument, isLoading: isCreatingNewDocument } = useMutation({
  mutationFn: async () => {
    const response = await window.api.createDocument()
    return response.data
  },
  onSuccess: (data) => {
    queryClient.setQueryData(['documents'], (documents: Document[] | undefined) => {
      if (documents && documents.length >= 0) {
        return [...documents, data]
      }
      return [data]
    })
  },
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Mutation retorna o dado criado/alterado | Use `setQueryData` para adicionar ao cache |
| Mutation nao retorna dados uteis | Use `invalidateQueries` como fallback |
| Multiplas queries dependem da mutation | Combine `setQueryData` + `invalidateQueries` seletivo |
| Componente tem multiplas mutations | Renomeie cada `isLoading` com contexto especifico |
| Electron/IPC (sem latencia real) | `invalidateQueries` e aceitavel, mas `setQueryData` ainda e preferivel |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `isLoading` (generico) | `isCreatingNewDocument` (contextual) |
| `onClick={createDocument}` | `onClick={() => createDocument()}` |
| `documents.push(newItem)` | `[...documents, newItem]` |
| `invalidateQueries` quando tem os dados | `setQueryData` com atualizacao imutavel |
| `mutate()` sem controle de Promise | `mutateAsync()` com async/await |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

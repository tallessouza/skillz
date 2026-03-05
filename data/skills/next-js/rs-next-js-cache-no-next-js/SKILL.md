---
name: rs-next-js-cache-no-next-js
description: "Applies Next.js caching patterns with useCache, cacheLife, cacheTag, and updateTag when writing or reviewing Next.js server components. Use when user asks to 'add cache', 'optimize loading', 'cache server component', 'use useCache', 'invalidate cache', or 'revalidate data' in Next.js apps. Enforces server-only caching, tag-based invalidation, and proper cache lifetime configuration. Make sure to use this skill whenever implementing data fetching in Next.js server components. Not for client-side state management, React Query, SWR, or browser caching strategies."
---

# Cache no Next.js

> Cache no Next.js so funciona server-side e so deve cachear dados comuns entre todos os usuarios — nunca dados especificos de um usuario autenticado.

## Rules

1. **Somente server-side** — `useCache` so funciona dentro de server components e server actions, porque cache client-side e especifico por usuario e nao otimiza nada globalmente
2. **Nunca cachear dados de usuario** — funcoes com `useCache` nao podem acessar `headers()` ou `cookies()`, porque cache compartilhado com dados por usuario quebra o proposito
3. **Separar requisicoes cacheaveis das nao-cacheaveis** — dados comuns (cards do board) em uma requisicao, dados por usuario (interacoes/curtidas) em outra, porque permite cachear o que e compartilhado
4. **Sempre usar cacheTag para dados que podem mudar** — identificar o cache com uma chave unica permite invalidacao precisa com `updateTag`
5. **Escolher cacheLife adequado** — dados que mudam raramente usam intervalos maiores (hora/dia), dados frequentes usam minutos; default e 15 minutos
6. **Habilitar cache na config** — adicionar `cacheComponents: true` no `next.config` enquanto a API estiver em transicao

## How to write

### Ativando cache no projeto

```typescript
// next.config.ts
const nextConfig = {
  cacheComponents: true,
}
export default nextConfig
```

### useCache em funcao de dados

```typescript
import { cacheLife, cacheTag } from 'next/cache'

async function listIssues() {
  'use cache'
  cacheLife('minutes')
  cacheTag('board-issues')

  const issues = await fetchIssuesFromAPI()
  return issues
}
```

### Invalidacao com updateTag

```typescript
import { updateTag } from 'next/cache'

async function createComment(issueId: string, content: string) {
  'use server'

  await api.createComment({ issueId, content })
  updateTag(`issue-comments-${issueId}`)
}
```

### Cache com tag dinamica

```typescript
async function listIssueComments(issueId: string) {
  'use cache'
  cacheLife('minutes')
  cacheTag(`issue-comments-${issueId}`)

  const comments = await fetchComments(issueId)
  return comments
}
```

## Example

**Before (sem cache, carrega toda vez):**
```typescript
async function BoardPage() {
  // Busca toda vez que qualquer usuario acessa
  const issues = await fetch('/api/issues')
  const interactions = await fetch('/api/interactions')
  return <Board issues={issues} interactions={interactions} />
}
```

**After (com cache aplicado):**
```typescript
// Separado: dados comuns cacheados, dados por usuario nao
async function getIssues() {
  'use cache'
  cacheLife('minutes')
  cacheTag('board-issues')
  return await fetch('/api/issues')
}

// Client component busca interacoes do usuario (nao cacheavel server-side)
async function BoardPage() {
  const issues = await getIssues()
  return (
    <Suspense fallback={<Loading />}>
      <Board issues={issues} />
    </Suspense>
  )
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Dados identicos para todos os usuarios | `useCache` + `cacheTag` + `cacheLife` adequado |
| Dados que dependem de cookies/headers | NAO cachear, buscar separadamente |
| Mutacao que altera dados cacheados | `updateTag` com a mesma chave do `cacheTag` |
| Componente client com fetch | Cache so acontece no browser daquele usuario, nao usar `useCache` |
| Pagina com mix de dados comuns e por usuario | Separar em duas requisicoes distintas |
| Dados que quase nunca mudam | `cacheLife('hours')` ou `cacheLife('days')` |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `useCache` em funcao que acessa `cookies()` | Separar dados do usuario em outra requisicao |
| `useCache` em client component | Mover fetch para server component |
| Cache sem `cacheTag` em dados mutaveis | Adicionar `cacheTag` para poder invalidar |
| `updateTag` no client-side | Chamar via server action |
| Cache de dados personalizados por usuario | Cachear apenas dados compartilhados |
| Esquecer `Suspense`/`loading.tsx` ao habilitar cache | Toda pagina precisa de fallback de loading |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

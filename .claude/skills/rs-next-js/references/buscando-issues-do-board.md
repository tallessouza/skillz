---
name: rs-next-js-buscando-issues-do-board
description: "Enforces patterns for fetching and displaying API data in Next.js App Router server components. Use when user asks to 'fetch data', 'call API from server component', 'list items from backend', 'create HTTP request layer', or 'validate API response with schema'. Applies rules: dedicated HTTP folder, schema-parsed responses, async server components, no async in client components. Make sure to use this skill whenever building data fetching in Next.js App Router. Not for client-side fetching with useEffect, React Query, or SWR."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: next-js
  module: data-fetching
  tags: [fetch, server-components, zod, schema-validation, http-layer, next-js, app-router]
---

# Buscando Dados em Server Components (Next.js App Router)

> Organize requisicoes HTTP em uma camada dedicada, valide respostas com schemas, e use async/await diretamente em Server Components.

## Rules

1. **Crie uma pasta `src/http/`** — cada requisicao HTTP vira um arquivo separado (`list-issues.ts`, `create-issue.ts`), porque isola responsabilidades e facilita reutilizacao
2. **Valide respostas com schema parse** — use `.parse(data)` do Zod no retorno da API, porque garante tipagem e formato correto em tempo de execucao
3. **Use async/await direto no Server Component** — Server Components (sem `"use client"`) suportam funcoes assincronas nativamente, porque e um recurso do React Server Components
4. **Nunca use async/await em Client Components** — componentes com `"use client"` nao suportam esse formato, porque o React nao permite funcoes assincronas em componentes do cliente
5. **Importe da pasta HTTP, nunca da pasta API** — o componente consome `src/http/list-issues`, nao `src/app/api/routes/list-issues`, porque a camada HTTP e a interface publica
6. **Exporte schemas das rotas de API** — cada rota exporta seu response schema para ser reutilizado na camada HTTP, porque centraliza o contrato de dados

## How to write

### Camada HTTP

```typescript
// src/http/list-issues.ts
import { IssuesListResponseSchema } from '@/api/routes/list-issues'

export async function listIssues() {
  const response = await fetch('http://localhost:3000/api/issues')
  const data = await response.json()

  return IssuesListResponseSchema.parse(data)
}
```

### Server Component consumindo dados

```typescript
// src/app/board/page.tsx (Server Component — sem "use client")
import { listIssues } from '@/http/list-issues'

export default async function BoardPage() {
  const issues = await listIssues()

  return (
    <section>
      <span>{issues.backlog.length}</span>
      {issues.backlog.map((issue) => (
        <Card key={issue.id}>
          <span>{issue.issueNumber}</span>
          <h3>{issue.title}</h3>
        </Card>
      ))}
    </section>
  )
}
```

## Example

**Before (sem camada HTTP, sem validacao):**
```typescript
// Direto no componente, sem tipagem, sem validacao
export default async function BoardPage() {
  const res = await fetch('http://localhost:3000/api/issues')
  const data = await res.json() // data: any

  return <div>{data.backlog.length}</div> // sem garantia de formato
}
```

**After (com camada HTTP e schema):**
```typescript
// src/http/list-issues.ts
import { IssuesListResponseSchema } from '@/api/routes/list-issues'

export async function listIssues() {
  const response = await fetch('http://localhost:3000/api/issues')
  const data = await response.json()
  return IssuesListResponseSchema.parse(data) // tipado e validado
}

// src/app/board/page.tsx
import { listIssues } from '@/http/list-issues'

export default async function BoardPage() {
  const issues = await listIssues() // TypeScript sabe o formato exato
  return <div>{issues.backlog.length}</div>
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Nova requisicao HTTP | Criar arquivo em `src/http/` com nome descritivo |
| Resposta da API sem tipagem | Criar schema Zod e usar `.parse()` |
| Precisa carregar dados na pagina | Usar async/await no Server Component |
| Componente precisa de interatividade E dados | Separar: Server Component busca dados, Client Component recebe via props |
| Erro de hidratacao por estado do usuario | Estado client-only (auth) causa mismatch esperado — resolver com Server Component ou aceitar temporariamente |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `const data = await res.json()` sem parse | `SchemaName.parse(await res.json())` |
| fetch direto no componente | funcao dedicada em `src/http/` |
| `import from '@/api/routes/...'` no componente | `import from '@/http/...'` no componente |
| `"use client"` + `async function Page()` | Remover `"use client"` ou mover fetch para Server Component pai |
| `data.backlog.length` com `data: any` | `issues.backlog.length` com schema validado |

## Troubleshooting

### Busca nao retorna resultados
**Symptom:** Campo de busca nao filtra ou retorna lista vazia
**Cause:** Query parameter nao esta sendo lido corretamente ou filtro no servidor esta incorreto
**Fix:** Verificar que o search param esta sendo passado via URL (`?search=termo`). No servidor, usar `searchParams` da pagina para acessar o valor

### Busca recarrega a pagina inteira
**Symptom:** Ao digitar no campo de busca, toda a pagina recarrega
**Cause:** Formulario fazendo submit tradicional ao inves de navegacao client-side
**Fix:** Usar `router.push()` com query params ao inves de form submit. Debounce no onChange para evitar requisicoes excessivas

## Deep reference library

- [deep-explanation.md](../../../data/skills/next-js/rs-next-js-buscando-issues-do-board/references/deep-explanation.md) — O instrutor explica que gosta de criar uma pasta `src/http/` onde tudo relacionado a requisicoes HTT
- [code-examples.md](../../../data/skills/next-js/rs-next-js-buscando-issues-do-board/references/code-examples.md) — src/

---
name: rs-next-js-aplicando-filtro-na-listagem
description: "Applies Next.js search filter patterns when building list pages with server-side filtering. Use when user asks to 'add search to a list', 'filter server components', 'use URL params for filtering', 'implement search in Next.js', or 'build a board with filters'. Covers URL constructor for fetch params, useQueryState shallow:false for server re-render, Next.js Image cost decisions, and empty states. Make sure to use this skill whenever implementing search/filter in Next.js server components. Not for client-side-only filtering, pagination, or infinite scroll."
---

# Aplicando Filtro na Listagem (Next.js)

> Filtros em server components exigem que a URL atualize com shallow:false para disparar nova requisicao ao servidor.

## Rules

1. **Use o construtor URL para montar query params** — `new URL(path, baseURL)` + `url.searchParams.set()`, porque concatenar strings com crase fica bagunçado conforme os parametros crescem
2. **Sete shallow:false no useQueryState** — por default, shallow e true e atualiza apenas no client-side, sem fazer nova requisicao ao servidor, o que quebra server components
3. **Nao use o componente Image do Next.js para imagens de avatar** — avatares sao muitos (1 por usuario) e ja vem otimizados da origem; a Vercel cobra por imagem otimizada alem do plano
4. **Use Image do Next.js apenas para imagens compartilhadas** — posts de blog, banners, hero images onde TODOS os usuarios veem a mesma imagem e ela precisa de redimensionamento
5. **Implemente empty states em listas filtradas** — quando `items.length === 0`, mostre mensagem como "No issues matching your filters" em vez de nada
6. **Passe search params como props do server component** — a pagina extrai searchParams da URL e passa para o componente de listagem que faz o fetch

## How to write

### URL constructor para fetch com params

```typescript
async function listIssues({ search }: { search?: string }) {
  const url = new URL('/api/issues', process.env.NEXT_PUBLIC_API_URL)

  if (search) {
    url.searchParams.set('search', search)
  }

  const response = await fetch(url)
  return response.json()
}
```

### useQueryState com shallow:false

```typescript
const [search, setSearch] = useQueryState('q', {
  shallow: false, // dispara requisicao ao servidor quando URL muda
})
```

### Empty state em lista filtrada

```tsx
{issues.backlog.length === 0 ? (
  <div className="flex items-center justify-center py-8 text-center">
    <p className="text-sm text-navy-300">No issues matching your filters</p>
  </div>
) : (
  issues.backlog.map((issue) => <IssueCard key={issue.id} issue={issue} />)
)}
```

## Example

**Before (string concatenation + sem empty state):**
```typescript
const response = await fetch(`${baseUrl}/api/issues?search=${search}`)
const issues = await response.json()

// No componente:
{issues.map((issue) => <Card key={issue.id} {...issue} />)}
```

**After (URL constructor + empty state + shallow:false):**
```typescript
const url = new URL('/api/issues', process.env.NEXT_PUBLIC_API_URL)
if (search) url.searchParams.set('search', search)
const response = await fetch(url)
const issues = await response.json()

// useQueryState com shallow:false
const [search, setSearch] = useQueryState('q', { shallow: false })

// No componente:
{issues.length === 0 ? (
  <div className="flex items-center justify-center py-8 text-center">
    <p className="text-sm text-navy-300">No issues matching your filters</p>
  </div>
) : (
  issues.map((issue) => <Card key={issue.id} {...issue} />)
)}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Imagem de avatar (1 por usuario) | Use `<img>` nativa, suprima regra do biome |
| Imagem de blog post (compartilhada) | Use `<Image>` do Next.js |
| Fetch com 1 query param | URL constructor ja vale a pena |
| Fetch com 3+ query params | URL constructor e obrigatorio |
| Lista pode ficar vazia apos filtro | Sempre implemente empty state |
| Server component precisa reagir a URL | `shallow: false` no useQueryState |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `` `${base}/api?search=${s}&status=${st}` `` | `new URL()` + `searchParams.set()` |
| `useQueryState('q')` em server component | `useQueryState('q', { shallow: false })` |
| `<Image>` para avatar de usuario | `<img>` com suppress da regra |
| Lista vazia sem feedback visual | Empty state com mensagem descritiva |
| `{items.map(...)}` sem checar length | Ternario: `length === 0 ? empty : map` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/next-js/rs-next-js-aplicando-filtro-na-listagem/references/deep-explanation.md)
- [Code examples](../../../data/skills/next-js/rs-next-js-aplicando-filtro-na-listagem/references/code-examples.md)

---
name: rs-next-js-carregando-interacoes-no-board
description: "Applies the pattern of loading client-side data (likes, interactions) inside server-side Next.js pages by extracting a client component. Use when user asks to 'add likes to a server page', 'use useQuery in a server component', 'load interactions in Next.js board', 'mix server and client data fetching', or 'optimize repeated lookups with useMemo Map'. Make sure to use this skill whenever combining server-side data loading with client-side React Query in Next.js App Router. Not for pure API routes, full client-side apps, or server actions."
---

# Carregando Interacoes em Paginas Server-Side (Next.js)

> Quando uma pagina server-side precisa de dados client-side (React Query), extraia o conteudo para um client component que recebe os dados iniciais como props.

## Rules

1. **Nunca use hooks em server components** — `useQuery`, `useState`, `useMemo` exigem `use client`, porque o React so executa hooks no cliente
2. **Mantenha o fetch inicial no server component** — o carregamento assincrono de dados fica na page, porque server components suportam `async/await` e o client component nao
3. **Extraia o conteudo visual para um client component** — crie um `BoardContent` (ou similar) com `use client` que recebe dados via props, porque isso separa responsabilidades server/client
4. **Use Map para lookup de interacoes** — `new Map()` com chave `issueId` em vez de `.find()` repetido, porque Map tem O(1) de lookup vs O(n) do find
5. **Estabilize query keys com sort + join** — ordene IDs antes de criar a query key, porque mudanca de ordem invalida o cache do React Query desnecessariamente
6. **Proteja acessos opcionais com fallback** — `interaction?.likesCount ?? 0`, porque a interacao pode nao existir para uma issue

## How to write

### Separacao server/client

```typescript
// page.tsx (server component — mantem o fetch)
export default async function BoardPage() {
  const issues = await getIssues()
  return <BoardContent issues={issues} />
}

// board-content.tsx (client component — usa hooks)
'use client'
export function BoardContent({ issues }: BoardContentProps) {
  const { data } = useQuery({ ... })
  return <main>...</main>
}
```

### Query key estavel com multiplos IDs

```typescript
const allIssueIds = [
  ...issues.backlog.map(issue => issue.id),
  ...issues.todo.map(issue => issue.id),
  ...issues.inProgress.map(issue => issue.id),
  ...issues.done.map(issue => issue.id),
]

const { data: interactionsData } = useQuery({
  queryKey: ['issues-interactions', allIssueIds.sort().join(',')],
  queryFn: () => getIssueInteractions({ issueIds: allIssueIds }),
})
```

### Map tipado para lookup de interacoes

```typescript
type InteractionsMap = Map<string, {
  isLiked: boolean
  likesCount: number
}>

const interactions = useMemo<InteractionsMap>(() => {
  if (!interactionsData) return new Map()

  return new Map(
    interactionsData.interactions.map(interaction => [
      interaction.issueId,
      { isLiked: interaction.isLiked, likesCount: interaction.likesCount }
    ])
  )
}, [interactionsData])
```

### Consumo seguro do Map

```typescript
const interaction = interactions.get(issue.id)

<IssueLikeButton
  issueId={issue.id}
  initialLikes={interaction?.likesCount ?? 0}
  initialLiked={interaction?.isLiked ?? false}
/>
```

## Example

**Before (quebrado — hook em server component):**
```typescript
// page.tsx (server component)
export default async function BoardPage() {
  const issues = await getIssues()
  const { data } = useQuery({ ... }) // ERRO: hooks nao funcionam aqui
  return <main>...</main>
}
```

**After (com separacao server/client):**
```typescript
// page.tsx
export default async function BoardPage() {
  const issues = await getIssues()
  return <BoardContent issues={issues} />
}

// board-content.tsx
'use client'
export function BoardContent({ issues }: { issues: IssueListResponse }) {
  const allIssueIds = [
    ...issues.backlog.map(i => i.id),
    ...issues.todo.map(i => i.id),
    ...issues.inProgress.map(i => i.id),
    ...issues.done.map(i => i.id),
  ]

  const { data: interactionsData, isLoading } = useQuery({
    queryKey: ['issues-interactions', allIssueIds.sort().join(',')],
    queryFn: () => getIssueInteractions({ issueIds: allIssueIds }),
  })

  const interactions = useMemo<InteractionsMap>(() => {
    if (!interactionsData) return new Map()
    return new Map(
      interactionsData.interactions.map(i => [
        i.issueId,
        { isLiked: i.isLiked, likesCount: i.likesCount }
      ])
    )
  }, [interactionsData])

  return (
    <main>
      {issues.backlog.map(issue => {
        const interaction = interactions.get(issue.id)
        return (
          <IssueCard key={issue.id} issue={issue}>
            <IssueLikeButton
              issueId={issue.id}
              initialLikes={interaction?.likesCount ?? 0}
              initialLiked={interaction?.isLiked ?? false}
            />
          </IssueCard>
        )
      })}
    </main>
  )
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Pagina server-side precisa de hook | Extraia conteudo para client component, passe dados como props |
| Multiplas categorias de itens (backlog, todo, etc) | Concatene todos os IDs em um unico array para batch request |
| Query key depende de lista de IDs | Sort + join para estabilizar a key |
| Lookup repetido dentro de `.map()` | Use `Map` com `useMemo` em vez de `.find()` |
| Interacao pode nao existir | Fallback com `?? 0` ou `?? false` |
| Sem React Compiler | Use `useMemo` para calculos derivados pesados |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `useQuery` direto em server component | Extraia client component, passe dados via props |
| `issues.find(i => i.id === id)` dentro de loop | `Map.get(id)` com Map pre-calculado |
| Query key com array nao ordenado | `allIds.sort().join(',')` para estabilidade |
| `interaction.likesCount` sem null check | `interaction?.likesCount ?? 0` |
| Importar de `api` no client component | Importar de `http` (funcoes client-side) |
| Repetir logica de lookup em cada coluna | Extrair `interactions.get(issue.id)` uma vez por item |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/next-js/rs-next-js-carregando-interacoes-no-board/references/deep-explanation.md)
- [Code examples](../../../data/skills/next-js/rs-next-js-carregando-interacoes-no-board/references/code-examples.md)

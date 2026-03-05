# Code Examples: Aplicando Filtro na Listagem

## 1. Suprimindo regra do Image no Biome

```tsx
// biome-ignore lint/a11y/useAltText: GitHub already optimizes the image
<img src={user.avatar_url} alt="" width={24} height={24} />
```

## 2. Interface de parametros para listagem

```typescript
interface ListIssuesParams {
  search?: string
}

async function listIssues({ search }: ListIssuesParams) {
  const url = new URL('/api/issues', process.env.NEXT_PUBLIC_API_URL)

  if (search) {
    url.searchParams.set('search', search)
  }

  const response = await fetch(url)
  return response.json()
}
```

## 3. Pagina passando searchParams para o componente

```tsx
// app/page.tsx (server component)
export default async function BoardPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  return <ListIssues search={searchParams.q} />
}
```

## 4. Search input com useQueryState shallow:false

```tsx
'use client'

import { useQueryState } from 'nuqs'

export function SearchInput() {
  const [search, setSearch] = useQueryState('q', {
    shallow: false, // CRITICO: sem isso, server components nao re-executam
  })

  return (
    <input
      type="text"
      value={search ?? ''}
      onChange={(e) => setSearch(e.target.value || null)}
      placeholder="Search issues..."
    />
  )
}
```

## 5. Empty state pattern para cada coluna do board

```tsx
function BoardColumn({
  title,
  issues,
}: {
  title: string
  issues: Issue[]
}) {
  return (
    <div>
      <h2>{title}</h2>
      {issues.length === 0 ? (
        <div className="flex items-center justify-center py-8 text-center">
          <p className="text-sm text-navy-300">
            No issues matching your filters
          </p>
        </div>
      ) : (
        issues.map((issue) => (
          <IssueCard key={issue.id} issue={issue} />
        ))
      )}
    </div>
  )
}
```

## 6. Aplicando o pattern em multiplas colunas

```tsx
<BoardColumn title="Backlog" issues={issues.backlog} />
<BoardColumn title="Todo" issues={issues.todo} />
<BoardColumn title="In Progress" issues={issues.inProgress} />
<BoardColumn title="Done" issues={issues.done} />
```

## 7. URL constructor vs template literal (comparacao)

```typescript
// RUIM: template literal com multiplos params
const response = await fetch(
  `${baseUrl}/api/issues?search=${search}&status=${status}&page=${page}`
)

// BOM: URL constructor
const url = new URL('/api/issues', baseUrl)
if (search) url.searchParams.set('search', search)
if (status) url.searchParams.set('status', status)
if (page) url.searchParams.set('page', String(page))
const response = await fetch(url)
```

## 8. Habilitando logging no next.config para debug

```javascript
// next.config.js
module.exports = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
}
```

Isso permite ver no terminal do servidor quais requisicoes estao sendo feitas e com quais parametros — util para debugar se o search param esta sendo enviado corretamente.
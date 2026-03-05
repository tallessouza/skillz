# Code Examples: Buscando Issues do Board

## 1. Estrutura de pastas

```
src/
├── http/
│   └── list-issues.ts          # Funcao de requisicao HTTP
├── app/
│   ├── api/
│   │   └── routes/
│   │       └── list-issues/
│   │           └── index.ts    # Rota API + exporta schema
│   └── board/
│       └── page.tsx            # Server Component que consome dados
```

## 2. Funcao HTTP completa

```typescript
// src/http/list-issues.ts
import { IssuesListResponseSchema } from '@/api/routes/list-issues'

export async function listIssues() {
  const response = await fetch('http://localhost:3000/api/issues')
  const data = await response.json()

  // parse valida E tipa o retorno
  return IssuesListResponseSchema.parse(data)
}
```

## 3. Schema exportado da rota

```typescript
// src/app/api/routes/list-issues/index.ts
import { z } from 'zod'

const IssueSchema = z.object({
  id: z.string(),
  title: z.string(),
  issueNumber: z.number(),
  // ... outros campos
})

export const IssuesListResponseSchema = z.object({
  backlog: z.array(IssueSchema),
  todo: z.array(IssueSchema),
  inProgress: z.array(IssueSchema),
  done: z.array(IssueSchema),
})
```

## 4. Board page completa (Server Component)

```typescript
// src/app/board/page.tsx
import { listIssues } from '@/http/list-issues'
import { Card } from '@/components/card'

export default async function BoardPage() {
  const issues = await listIssues()

  return (
    <div className="grid grid-cols-4 gap-4">
      {/* Backlog */}
      <section>
        <div className="relative">
          <header>
            <span>Backlog</span>
            <span>{issues.backlog.length}</span>
          </header>
          <div className="absolute inset-0 top-10 overflow-y-auto scrollbar scrollbar-track-transparent scrollbar-thumb-nave-600">
            {issues.backlog.map((issue) => (
              <Card.Root key={issue.id}>
                <span>{issue.issueNumber}</span>
                <Card.Title>{issue.title}</Card.Title>
              </Card.Root>
            ))}
          </div>
        </div>
      </section>

      {/* Todo */}
      <section>
        {/* Mesmo padrao com issues.todo */}
      </section>

      {/* In Progress */}
      <section>
        {/* Mesmo padrao com issues.inProgress */}
      </section>

      {/* Done */}
      <section>
        {/* Mesmo padrao com issues.done */}
      </section>
    </div>
  )
}
```

## 5. Configuracao do plugin tailwind-scrollbar

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  // ...
  plugins: [
    require('tailwind-scrollbar'),
  ],
}

export default config
```

Classes utilizadas:
- `scrollbar` — ativa o plugin
- `scrollbar-track-transparent` — fundo invisivel
- `scrollbar-thumb-nave-600` — cor do indicador

## 6. Hack do position absolute para scroll em section

```html
<!-- Container pai -->
<div class="relative">
  <!-- Header fixo -->
  <header>Backlog (14)</header>

  <!-- Content com scroll que ocupa o resto -->
  <div class="absolute inset-0 top-10 overflow-y-auto">
    <!-- Cards aqui -->
  </div>
</div>
```

O `top-10` (ou `top-11`, `top-12`) compensa a altura do header para que o conteudo scrollavel comece abaixo dele.
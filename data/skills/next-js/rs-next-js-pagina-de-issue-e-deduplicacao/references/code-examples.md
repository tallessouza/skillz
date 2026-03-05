# Code Examples: Pagina de Issue e Deduplicacao

## 1. Estrutura de pastas completa

```
app/
  issues/
    [id]/
      page.tsx
```

O nome `[id]` entre colchetes cria um route parameter dinamico. Acessar `/issues/123` faz com que `params.id` seja `"123"`.

## 2. Interface de props da pagina

```typescript
interface IssuePageProps {
  params: Promise<{ id: string }>
}
```

O `id` no tipo DEVE corresponder ao nome da pasta `[id]`. Se a pasta fosse `[slug]`, o tipo seria `{ slug: string }`.

## 3. Pagina completa com fetch e metadata

```typescript
import { getIssue } from '@/http/get-issue'
import type { Metadata } from 'next'

interface IssuePageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: IssuePageProps): Promise<Metadata> {
  const { id } = await params
  const issue = await getIssue(id)

  return {
    title: issue.title,
  }
}

export default async function IssuePage({ params }: IssuePageProps) {
  const { id } = await params
  const issue = await getIssue(id)

  return (
    <div>
      <pre>{JSON.stringify(issue, null, 2)}</pre>
    </div>
  )
}
```

Nota: `getIssue` e chamada tanto em `generateMetadata` quanto no componente, mas o Next.js deduplica automaticamente — apenas UMA requisicao HTTP e feita.

## 4. Funcao getIssue (HTTP)

```typescript
import { issueSchema } from './schemas'

interface GetIssueParams {
  id: string
}

export async function getIssue({ id }: GetIssueParams) {
  const response = await fetch(`https://api.example.com/issues/${id}`)
  const data = await response.json()

  return issueSchema.parse(data)
}
```

Nao precisa de setTimeout, delay, ou cache manual — o Next.js cuida da deduplicacao.

## 5. Link para pagina de detalhe (card)

```typescript
import Link from 'next/link'

// Antes: <a> tag
<a href={`/issues/${issue.id}`}>{issue.title}</a>

// Depois: Link do Next.js (prefetch, client-side navigation)
<Link href={`/issues/${issue.id}`}>{issue.title}</Link>
```

## 6. Estendendo props de componentes Next.js

```typescript
// Opcao 1: Importar props diretamente (se disponivel)
import type { LinkProps } from 'next/link'

interface CardRootProps extends LinkProps {
  className?: string
  children: React.ReactNode
}

// Opcao 2: Inferir props via ComponentProps (sempre funciona)
import Link from 'next/link'
import type { ComponentProps } from 'react'

interface CardRootProps extends ComponentProps<typeof Link> {
  // props adicionais
}
```

## 7. unstable_cache para non-fetch

```typescript
import { unstable_cache as dedup } from 'next/cache'

// Funcao original que acessa banco diretamente
async function getUserFromDatabase(id: string) {
  // query direto no banco — nao passa pelo fetch
  return db.user.findUnique({ where: { id } })
}

// Versao deduplicada
const dedupGetUser = dedup(
  getUserFromDatabase,
  ['get-user'] // cache key para invalidacao
)

// Usar dedupGetUser em vez de getUserFromDatabase
// em generateMetadata e page — chamada unica garantida
```
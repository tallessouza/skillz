---
name: rs-next-js-pagina-issue-deduplicacao
description: "Enforces Next.js dynamic route pages with fetch deduplication patterns. Use when user asks to 'create a detail page', 'add dynamic route', 'setup generateMetadata', 'deduplicate requests', or 'fetch same data in metadata and page'. Applies rules: params as Promise, generateMetadata shares props with page, fetch auto-deduplication, unstable_cache for non-fetch. Make sure to use this skill whenever building Next.js dynamic pages or configuring metadata from route params. Not for static pages, client components, or API route handlers."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: next-js
  module: dynamic-routes-deduplication
  tags: [next-js, dynamic-routes, generateMetadata, fetch-deduplication, unstable-cache, params, app-router]
---

# Pagina Dinamica com Deduplicacao no Next.js

> Ao criar paginas dinamicas no Next.js, use params como Promise, compartilhe dados entre generateMetadata e page, e confie na deduplicacao automatica do fetch.

## Rules

1. **Params sao Promise** — sempre use `await` para acessar params em pages e generateMetadata, porque no Next.js 15+ params e searchParams sao assincronos
2. **Nome do param = nome da pasta** — `[id]` na pasta significa `params.id`, porque o Next.js mapeia diretamente o nome entre colchetes ao campo do objeto
3. **generateMetadata recebe as mesmas props** — use os mesmos params da page para configurar titulo e Open Graph, porque o Next.js injeta props identicas
4. **Fetch com mesmos parametros e deduplicado automaticamente** — nao se preocupe em chamar a mesma funcao fetch no generateMetadata e no page, porque o Next.js detecta URL + parametros iguais e faz uma unica requisicao
5. **Non-fetch precisa de unstable_cache** — chamadas diretas a banco de dados, SDKs (Stripe, etc.) nao sao deduplicadas automaticamente, porque so o fetch nativo tem essa otimizacao
6. **Prefira fetch sobre acesso direto ao banco** — em 98% dos casos, use fetch (front chamando back), porque ganha deduplicacao e cache automaticos

## How to write

### Estrutura de pastas para rota dinamica

```
app/
  issues/
    [id]/
      page.tsx    ← params.id disponivel
```

### Page com params tipados

```typescript
interface IssuePageProps {
  params: Promise<{ id: string }>
}

export default async function IssuePage({ params }: IssuePageProps) {
  const { id } = await params
  const issue = await getIssue(id)

  return <div>{issue.title}</div>
}
```

### generateMetadata com mesmos params

```typescript
export async function generateMetadata({ params }: IssuePageProps): Promise<Metadata> {
  const { id } = await params
  const issue = await getIssue(id)

  return { title: issue.title }
}
```

### Deduplicacao para non-fetch (unstable_cache)

```typescript
import { unstable_cache as dedup } from 'next/cache'

const dedupGetSomething = dedup(
  getSomethingFromDatabase,
  ['cache-key']
)

// Use dedupGetSomething em generateMetadata e page — chamada unica
```

## Example

**Before (sem deduplicacao para non-fetch):**
```typescript
// generateMetadata chama getUser(id) → hit no banco
// page chama getUser(id) → OUTRO hit no banco (duplicado!)

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const user = await getUserFromDB(id) // chamada 1
  return { title: user.name }
}

export default async function Page({ params }: Props) {
  const { id } = await params
  const user = await getUserFromDB(id) // chamada 2 (duplicada!)
  return <div>{user.name}</div>
}
```

**After (com deduplicacao):**
```typescript
const dedupGetUser = unstable_cache(getUserFromDB, ['user'])

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const user = await dedupGetUser(id) // deduplicada
  return { title: user.name }
}

export default async function Page({ params }: Props) {
  const { id } = await params
  const user = await dedupGetUser(id) // mesma chamada, resultado compartilhado
  return <div>{user.name}</div>
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Mesma fetch URL em generateMetadata e page | Nao faca nada — deduplicacao automatica |
| Chamada direta a banco/SDK em dois lugares | Envolva com `unstable_cache` |
| Link para pagina de detalhe | Use `Link` do next/link com href template literal |
| Precisa de params tipados | Crie interface com `params: Promise<{ campo: tipo }>` |
| Titulo dinamico na aba | Use generateMetadata, nao useEffect no client |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `params.id` sem await | `const { id } = await params` |
| `<a href={...}>` para navegacao interna | `<Link href={...}>` do next/link |
| `useEffect` para setar document.title | `generateMetadata` no server component |
| Criar state/cache manual para evitar fetch duplo | Confiar na deduplicacao automatica do Next.js |
| `unstable_cache` para chamadas fetch | Desnecessario — fetch ja e deduplicado |

## Troubleshooting

### Dados cacheados nao atualizam apos mutacao
**Symptom:** Apos criar/editar/deletar, a listagem mostra dados antigos
**Cause:** Cache do Next.js serve a versao antiga da pagina
**Fix:** Usar `revalidatePath('/caminho')` ou `revalidateTag('tag')` na server action apos a mutacao. Verificar que o path passado corresponde exatamente a rota da listagem

### fetch retorna dados stale em producao
**Symptom:** Dados frescos em desenvolvimento mas desatualizados em producao
**Cause:** Em producao, Next.js aplica cache agressivo por padrao em fetch requests
**Fix:** Adicionar `{ cache: 'no-store' }` ao fetch para desabilitar cache, ou usar `{ next: { revalidate: N } }` para ISR

## Deep reference library

- [deep-explanation.md](../../../data/skills/next-js/rs-next-js-pagina-de-issue-e-deduplicacao/references/deep-explanation.md) — No Next.js 15, tanto `params` quanto `searchParams` foram transformados em Promises. Isso significa 
- [code-examples.md](../../../data/skills/next-js/rs-next-js-pagina-de-issue-e-deduplicacao/references/code-examples.md) — app/

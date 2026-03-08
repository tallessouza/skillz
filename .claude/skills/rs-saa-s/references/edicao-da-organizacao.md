---
name: rs-saas-next-rbac-edicao-org
description: "Applies Next.js organization edit form patterns with Server Actions and cache revalidation. Use when user asks to 'edit form', 'update entity', 'revalidate cache', 'server action update', or 'dual-purpose form' in Next.js App Router. Enforces revalidateTag usage, form action switching, initialData patterns, and 'use server' export constraints. Make sure to use this skill whenever building update flows with Server Components and Server Actions. Not for client-side state management, React Query, or SPA-style data fetching."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: saa-s-next-js-rbac
  module: organizacoes
  tags: [saas, nextjs, zod, organization, server-actions]
---

# Edicao de Organizacao — Next.js Server Actions + Cache

> Formularios de edicao no Next.js App Router usam Server Actions para mutacao e revalidateTag para sincronizar cache de Server Components.

## Rules

1. **Formulario dual-purpose com flag isUpdating** — receba `isUpdating?: boolean` com default `false`, porque evita alterar todos os locais que ja usam o formulario para criacao
2. **initialData tipado pelo schema Zod** — use `z.infer<typeof schema>` para tipar initialData, porque garante que os dados iniciais respeitam a mesma validacao do formulario
3. **Nunca exporte schemas de arquivos 'use server'** — arquivos com `'use server'` so podem exportar funcoes async (Server Actions) e tipagens, porque o Next bloqueia exports de objetos como schemas Zod
4. **Use revalidateTag apos mutacoes** — chame `revalidateTag('tag-name')` no final da Server Action, porque Server Components cacheiam fetches e sem revalidacao a UI fica desatualizada
5. **revalidateTag so funciona em Server Actions** — nunca tente chamar no client-side, porque e uma funcao exclusiva do servidor
6. **Selecione a action dinamicamente** — `const formAction = isUpdating ? updateAction : createAction`, porque mantem um unico formulario para ambos os fluxos

## How to write

### Formulario dual-purpose

```typescript
interface OrganizationFormProps {
  isUpdating?: boolean
  initialData?: OrganizationSchema
}

export function OrganizationForm({
  isUpdating = false,
  initialData,
}: OrganizationFormProps) {
  const formAction = isUpdating
    ? updateOrganizationAction
    : createOrganizationAction

  return (
    <form action={formAction}>
      <Input name="name" defaultValue={initialData?.name} />
      <Input name="domain" defaultValue={initialData?.domain} />
      <Checkbox
        name="shouldAttachUsersByDomain"
        defaultChecked={initialData?.shouldAttachUsersByDomain}
      />
      <Button type="submit">Save</Button>
    </form>
  )
}
```

### Server Action com revalidateTag

```typescript
'use server'

import { revalidateTag } from 'next/cache'

export async function updateOrganizationAction(data: FormData) {
  const currentOrg = getCurrentOrg()!

  await updateOrganization({
    org: currentOrg,
    name: data.get('name') as string,
    domain: data.get('domain') as string,
  })

  revalidateTag('organizations')
}
```

### Fetch tagueado no Server Component

```typescript
const response = await fetch(`${api}/organizations`, {
  next: { tags: ['organizations'] },
})
```

### HTTP client com endpoint de update

```typescript
async function updateOrganization({
  org,
  ...body
}: { org: string } & UpdateOrgBody) {
  await api.put(`organizations/${org}`, body)
}
```

## Example

**Before (sem revalidacao — UI desatualizada):**
```typescript
export async function updateAction(data: FormData) {
  await api.put('/org', data)
  // UI nao atualiza ate o proximo F5
}
```

**After (com revalidateTag — UI sincronizada):**
```typescript
export async function updateAction(data: FormData) {
  await api.put('/org', data)
  revalidateTag('organizations') // Switcher atualiza instantaneamente
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Formulario serve para criar E editar | Use flag `isUpdating` + `initialData` opcional |
| Precisa do ID da entidade na action | Use `getCurrentOrg()` do auth, nao input hidden |
| Schema Zod no mesmo arquivo da action | Mova o schema para arquivo separado ou exporte apenas a tipagem |
| Fetch de Server Component precisa invalidar | Adicione `next: { tags: ['nome'] }` no fetch |
| Multiplas actions precisam invalidar o mesmo dado | Use a mesma tag string em todas |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `export const schema = z.object(...)` em arquivo `'use server'` | Mova schema para arquivo separado, exporte apenas a tipagem |
| `revalidateTag()` no client component | Chame dentro de uma Server Action |
| Input hidden para passar org ID | `getCurrentOrg()` dentro da Server Action |
| Formulario separado para criar e editar | Um formulario com `isUpdating` flag |
| Fetch sem tags em Server Components | `fetch(url, { next: { tags: ['tag'] } })` |

## Troubleshooting

### Server action nao executa
**Symptom:** Formulario submete mas nada acontece
**Cause:** A funcao nao tem a diretiva 'use server' ou o componente nao esta usando 'use client'
**Fix:** Adicione 'use server' no topo do arquivo da action e 'use client' no componente do formulario

### Componente server/client mismatch
**Symptom:** Erro de hydration ou hooks nao funcionam
**Cause:** Componente que usa hooks (useState, useEffect) nao tem 'use client'
**Fix:** Adicione 'use client' no topo do arquivo do componente que usa hooks ou event handlers

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

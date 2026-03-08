---
name: rs-saas-nextjs-action-remover-membro
description: "Applies Server Action patterns for member removal in Next.js App Router with RBAC. Use when user asks to 'create a server action', 'remove a member', 'delete from a list', 'pass parameters to server action', or 'use .bind with server actions'. Covers .bind() for parameterized actions, conditional button disabling, and cache revalidation with parameterized tags. Make sure to use this skill whenever building CRUD actions in Next.js server components. Not for client components, React Query, or non-Next.js frameworks."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: saa-s-next-js-rbac
  module: server-actions
  tags: [saas, nextjs, members, server-actions]
---

# Server Actions: Remover Membro com Parametros

> Em server components, use `.bind(null, param)` para passar parametros a server actions — arrow functions nao funcionam.

## Rules

1. **Use `.bind()` para parametros em server actions** — `action={myAction.bind(null, id)}` nao `action={() => myAction(id)}`, porque server components nao permitem criar funcoes inline
2. **Desabilite botoes por permissao** — verifique se o usuario e ele mesmo OU o dono da organizacao, porque ninguem deve deletar a si proprio nem o owner
3. **Use tags parametrizadas no cache** — `${org}/members` nao `members`, porque cada organizacao tem sua propria lista e voce nao quer invalidar o cache de outra org
4. **Envolva botoes de action em `<form>`** — `<form action={...}><button type="submit">` porque e a forma idiomatica de disparar server actions
5. **Revalide o cache apos mutacao** — `revalidateTag()` com a mesma tag usada no fetch, porque senao a lista nao atualiza automaticamente

## How to write

### Server Action com parametro

```typescript
// app/(app)/org/[slug]/members/actions.ts
'use server'

import { revalidateTag } from 'next/cache'
import { getCurrentOrg } from '@/auth'
import { removeMember } from '@/http/remove-member'

export async function removeMemberAction(memberId: string) {
  const currentOrg = await getCurrentOrg()
  await removeMember({ org: currentOrg!, memberId })
  revalidateTag(`${currentOrg}/members`)
}
```

### Fetch com tag parametrizada

```typescript
const response = await fetch(`/api/organizations/${org}/members`, {
  next: { tags: [`${org}/members`] },
})
```

### Botao com .bind() e disabled condicional

```tsx
<form action={removeMemberAction.bind(null, member.id)}>
  <button
    type="submit"
    disabled={
      member.userId === membership.userId ||
      member.userId === organization.ownerId
    }
  >
    <UserMinus className="mr-2 size-4" />
    Remove
  </button>
</form>
```

## Example

**Before (erro comum — arrow function em server component):**
```tsx
// ERRO: server components nao permitem criar funcoes inline
<form action={() => removeMemberAction(member.id)}>
  <button type="submit">Remove</button>
</form>
```

**After (com .bind):**
```tsx
<form action={removeMemberAction.bind(null, member.id)}>
  <button
    type="submit"
    disabled={
      member.userId === membership.userId ||
      member.userId === organization.ownerId
    }
  >
    Remove
  </button>
</form>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Server action precisa de parametro | Use `.bind(null, param1, param2, ...)` |
| Multiplos parametros | `.bind(null, param1, param2)` — cada argumento adicional apos o this |
| Cache de lista pertence a uma entidade pai | Tag parametrizada: `${parentId}/children` |
| Botao de delete em lista | Desabilite para o proprio usuario e para o owner |
| Acao destrutiva em producao | Adicione dialog de confirmacao antes de submeter |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `action={() => serverAction(id)}` em server component | `action={serverAction.bind(null, id)}` |
| `next: { tags: ['members'] }` (tag global) | `next: { tags: [\`${org}/members\`] }` (tag parametrizada) |
| Botao de delete sem disabled para self | `disabled={member.userId === currentUserId}` |
| Server action sem revalidateTag | Sempre revalide apos mutacao |

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

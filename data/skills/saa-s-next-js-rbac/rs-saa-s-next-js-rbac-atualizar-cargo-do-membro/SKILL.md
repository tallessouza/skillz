---
name: rs-saas-nextjs-rbac-update-member-role
description: "Applies pattern for building role-update selectors in Next.js SaaS apps with RBAC. Use when user asks to 'create a role selector', 'update member role', 'build permission-based select', or 'implement role management UI'. Covers component composition with Shadcn Select, server actions, permission guards, and optimistic revalidation. Make sure to use this skill whenever building member management or role-switching interfaces in Next.js. Not for authentication flows, signup forms, or general dropdown/select components unrelated to roles."
---

# Atualizar Cargo do Membro

> Crie seletores de role como componentes isolados que encapsulam UI, permissoes e mutacao via server action.

## Rules

1. **Componente isolado para o select de role** — crie um componente dedicado (`UpdateMemberRoleSelect`) porque ele combina UI + logica de permissao + mutacao, responsabilidades demais para ficar inline
2. **Estenda ComponentProps do select base** — use `ComponentProps<typeof Select>` para herdar todas as props nativas e adicione apenas `memberId`, porque isso mantém flexibilidade sem reinventar a API
3. **Desabilite o select com base em 3 condicoes** — usuario nao pode trocar: role do dono, propria role, ou sem permissao (`cannot('update', 'User')`), porque cada condicao protege um caso de abuso diferente
4. **Server action para mutacao** — use server actions (nao API routes client-side) para o PUT, porque mantem a logica no servidor e permite `revalidateTag` automatico
5. **`onValueChange` dispara a action diretamente** — sem estado intermediario ou botao de confirmar, porque a troca de role e uma operacao atomica que nao precisa de form
6. **`revalidateTag` apos mutacao** — revalide a lista de membros para refletir a nova ordenacao por role imediatamente

## How to write

### Componente UpdateMemberRoleSelect

```typescript
'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ComponentProps } from 'react'
import { updateMemberAction } from './actions'

interface UpdateMemberRoleSelectProps extends ComponentProps<typeof Select> {
  memberId: string
}

export function UpdateMemberRoleSelect({ memberId, ...props }: UpdateMemberRoleSelectProps) {
  async function updateMemberRole(role: string) {
    await updateMemberAction({ memberId, role })
  }

  return (
    <Select onValueChange={updateMemberRole} {...props}>
      <SelectTrigger className="w-32 h-8">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ADMIN">Admin</SelectItem>
        <SelectItem value="MEMBER">Member</SelectItem>
        <SelectItem value="BILLING">Billing</SelectItem>
      </SelectContent>
    </Select>
  )
}
```

### Server action

```typescript
'use server'

import { updateMember } from '@/http/update-member'
import { revalidateTag } from 'next/cache'

export async function updateMemberAction({ memberId, role }: { memberId: string; role: string }) {
  const org = getCurrentOrg()
  await updateMember({ org, memberId, role })
  revalidateTag(`${org}/members`)
}
```

### HTTP client

```typescript
export async function updateMember({ org, memberId, role }: { org: string; memberId: string; role: string }) {
  await api.put(`/organizations/${org}/members/${memberId}`, {
    json: { role },
  })
}
```

### Uso na lista de membros (com guards de permissao)

```tsx
<UpdateMemberRoleSelect
  memberId={member.id}
  value={member.role}
  disabled={
    member.role === 'OWNER' ||
    member.userId === currentUserId ||
    cannot('update', 'User')
  }
/>
```

## Example

**Before (select inline sem isolamento):**
```tsx
// Tudo jogado dentro da MemberList
<select onChange={(e) => fetch(`/api/members/${id}`, { method: 'PUT', body: JSON.stringify({ role: e.target.value }) })}>
  <option value="ADMIN">Admin</option>
  <option value="MEMBER">Member</option>
</select>
```

**After (componente isolado com server action):**
```tsx
<UpdateMemberRoleSelect
  memberId={member.id}
  value={member.role}
  disabled={member.role === 'OWNER' || member.userId === currentUserId || cannot('update', 'User')}
/>
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Select muda estado no servidor | Server action + revalidateTag, nunca fetch client-side |
| Valores do select sao enum do banco | Use os valores exatos do banco (ADMIN, MEMBER, BILLING) no `value` |
| Select precisa de tamanho menor | Ajuste no SelectTrigger com classes utilitarias (w-32 h-8) |
| Lista reordena por role | revalidateTag garante nova ordenacao sem refresh manual |
| Dono da org aparece na lista | Desabilite o select para o role OWNER |

## Anti-patterns

| Nunca faca | Faca instead |
|------------|--------------|
| `fetch('/api/members/...')` no onChange | Server action com `updateMemberAction` |
| Estado local + botao "Salvar" para troca de role | `onValueChange` direto na action (operacao atomica) |
| Select inline na lista de membros | Componente isolado `UpdateMemberRoleSelect` |
| Hardcodar disabled sem checar permissao CASL | `cannot('update', 'User')` do ability |
| Valores lowercase no select (admin, member) | Valores identicos ao banco (ADMIN, MEMBER, BILLING) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---
name: rs-saas-nextjs-rbac-listagem-convites
description: "Applies invite listing and revocation patterns when building Next.js SaaS invitation systems. Use when user asks to 'list invites', 'show pending invitations', 'revoke invite', 'manage invites', or 'build invitation UI'. Follows pattern: API helper, permission check, table display, server action revoke with revalidation. Make sure to use this skill whenever implementing invite/invitation features in Next.js App Router projects. Not for authentication flows, member management, or email sending logic."
---

# Listagem e Revogacao de Convites

> Implemente listagem de convites com API helper tipado, verificacao de permissoes, tabela com revogacao via server action e revalidacao por tag.

## Rules

1. **Crie um API helper tipado para convites** — `getInvites(org)` retorna array tipado com `id`, `email`, `role`, `createdAt`, porque centraliza acesso e garante type-safety
2. **Verifique permissoes antes de renderizar acoes** — `ability.can('delete', 'Invite')` antes de mostrar botao de revoke, porque RBAC deve ser enforced na UI
3. **Separe botoes com server actions em componentes proprios** — `RevokeInviteButton` isolado, porque precisa de interatividade e pode ser client component
4. **Use revalidateTag para atualizar a lista** — tag especifica para invites, porque evita revalidar dados nao relacionados
5. **Mostre estado vazio quando nao ha convites** — "No invites found" com `text-muted-foreground`, porque feedback visual e essencial

## How to write

### API Helper

```typescript
// api/get-invites.ts
import { api } from './api-client'

interface GetInvitesResponse {
  invites: {
    id: string
    email: string
    role: 'ADMIN' | 'MEMBER' | 'BILLING'
    createdAt: string
  }[]
}

export async function getInvites(org: string) {
  const result = await api
    .get(`organizations/${org}/invites`, {
      next: { tags: [`${org}/invites`] },
    })
    .json<GetInvitesResponse>()

  return result
}
```

### Revoke API Helper

```typescript
// api/revoke-invite.ts
import { api } from './api-client'

export async function revokeInvite(org: string, inviteId: string) {
  await api.delete(`organizations/${org}/invites/${inviteId}`)
}
```

### Server Action

```typescript
// actions.ts
'use server'

import { revalidateTag } from 'next/cache'
import { revokeInvite } from '@/http/revoke-invite'

export async function revokeInviteAction(inviteId: string) {
  const currentOrg = getCurrentOrg()
  await revokeInvite(currentOrg!, inviteId)
  revalidateTag(`${currentOrg}/invites`)
}
```

### Componente RevokeInviteButton

```tsx
// revoke-invite-button.tsx
import { XOctagon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { revokeInviteAction } from './actions'

interface RevokeInviteButtonProps {
  inviteId: string
}

export function RevokeInviteButton({ inviteId }: RevokeInviteButtonProps) {
  return (
    <form action={revokeInviteAction.bind(null, inviteId)}>
      <Button size="sm" variant="destructive">
        <XOctagon className="mr-2 size-4" />
        Revoke invite
      </Button>
    </form>
  )
}
```

### Pagina de Listagem

```tsx
export default async function InvitesPage() {
  const currentOrg = getCurrentOrg()
  const permissions = await ability()
  const { invites } = await getInvites(currentOrg!)

  return (
    <div className="space-y-4">
      {permissions?.can('create', 'Invite') && (
        <Card>
          <CardHeader>
            <CardTitle>Invite member</CardTitle>
          </CardHeader>
          <CardContent>{/* Formulario */}</CardContent>
        </Card>
      )}

      <Table>
        <TableBody>
          {invites.length === 0 ? (
            <TableRow>
              <TableCell className="text-center text-muted-foreground">
                No invites found.
              </TableCell>
            </TableRow>
          ) : (
            invites.map((invite) => (
              <TableRow key={invite.id}>
                <TableCell>
                  <span className="text-muted-foreground">{invite.email}</span>
                </TableCell>
                <TableCell className="font-medium">{invite.role}</TableCell>
                <TableCell>
                  <div className="flex justify-end">
                    {permissions?.can('delete', 'Invite') && (
                      <RevokeInviteButton inviteId={invite.id} />
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Convite so tem email (sem nome) | Mostre apenas email com `text-muted-foreground` |
| Acao destrutiva (revoke) | `variant="destructive"` + icone `XOctagon` |
| Lista vazia | TableCell com colspan e mensagem centralizada |
| Botao com server action | Isole em componente separado, use `form` + `action` com `.bind()` |
| Permissao condicional | Verifique `ability.can()` antes de renderizar o botao |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| Mostrar botao revoke sem checar permissao | `permissions?.can('delete', 'Invite') && <RevokeInviteButton />` |
| Server action inline no componente de pagina | Componente separado com `form action={action.bind()}` |
| Revalidar tudo apos revogar | `revalidateTag('org/invites')` especifico |
| Usar POST para revogar convite | Usar DELETE — semantica HTTP correta |
| Deixar lista vazia sem feedback | Mostrar "No invites found" |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

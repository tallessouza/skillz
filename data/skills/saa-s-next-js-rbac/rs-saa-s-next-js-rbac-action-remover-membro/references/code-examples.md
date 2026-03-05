# Code Examples: Server Actions para Remover Membro

## Exemplo completo: Action file

```typescript
// app/(app)/org/[slug]/members/actions.ts
'use server'

import { revalidateTag } from 'next/cache'
import { getCurrentOrg } from '@/auth'

export async function removeMemberAction(memberId: string) {
  const currentOrg = await getCurrentOrg()

  await api.delete(`organizations/${currentOrg}/members/${memberId}`)

  revalidateTag(`${currentOrg}/members`)
}
```

## Exemplo completo: HTTP client function

```typescript
// http/remove-member.ts
interface RemoveMemberRequest {
  org: string
  memberId: string
}

export async function removeMember({ org, memberId }: RemoveMemberRequest) {
  await api.delete(`organizations/${org}/members/${memberId}`)
}
```

## Exemplo completo: Fetch com tags parametrizadas

```typescript
// http/get-members.ts
interface GetMembersRequest {
  org: string
}

export async function getMembers({ org }: GetMembersRequest) {
  const response = await api.get(`organizations/${org}/members`, {
    next: {
      tags: [`${org}/members`],
    },
  })

  return response.data
}
```

## Exemplo completo: Componente com botao de remocao

```tsx
// app/(app)/org/[slug]/members/member-list.tsx
import { UserMinus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { removeMemberAction } from './actions'
import { ability } from '@/auth'
import { getMembership, getOrganization } from '@/http'

export async function MemberList() {
  const permissions = await ability()
  const { membership } = await getMembership()
  const { organization } = await getOrganization()
  const { members } = await getMembers({ org: organization.slug })

  return (
    <div>
      {members.map((member) => (
        <div key={member.id}>
          <span>{member.name}</span>

          {permissions?.can('delete', 'User') && (
            <form action={removeMemberAction.bind(null, member.id)}>
              <Button
                type="submit"
                size="sm"
                variant="destructive"
                disabled={
                  member.userId === membership.userId ||
                  member.userId === organization.ownerId
                }
              >
                <UserMinus className="mr-2 size-4" />
                Remove
              </Button>
            </form>
          )}
        </div>
      ))}
    </div>
  )
}
```

## Variacao: Multiplos parametros com .bind()

```tsx
// Se a action precisasse de org e memberId
export async function removeMemberAction(org: string, memberId: string) {
  await removeMember({ org, memberId })
  revalidateTag(`${org}/members`)
}

// No componente:
<form action={removeMemberAction.bind(null, organization.slug, member.id)}>
```

## Variacao: Com dialog de confirmacao (client component)

```tsx
'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { removeMemberAction } from './actions'

interface RemoveMemberButtonProps {
  memberId: string
  disabled?: boolean
}

export function RemoveMemberButton({ memberId, disabled }: RemoveMemberButtonProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="destructive" disabled={disabled}>
          <UserMinus className="mr-2 size-4" />
          Remove
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <p>Tem certeza que deseja remover este membro?</p>
        <AlertDialogCancel>Cancelar</AlertDialogCancel>
        <AlertDialogAction
          onClick={() => removeMemberAction(memberId)}
        >
          Confirmar
        </AlertDialogAction>
      </AlertDialogContent>
    </AlertDialog>
  )
}
```
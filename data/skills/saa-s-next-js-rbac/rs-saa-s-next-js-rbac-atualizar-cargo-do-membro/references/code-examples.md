# Code Examples: Atualizar Cargo do Membro

## Exemplo completo: UpdateMemberRoleSelect

```typescript
'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { type ComponentProps } from 'react'
import { updateMemberAction } from './actions'

interface UpdateMemberRoleSelectProps
  extends ComponentProps<typeof Select> {
  memberId: string
}

export function UpdateMemberRoleSelect({
  memberId,
  ...props
}: UpdateMemberRoleSelectProps) {
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

## Server action completa

```typescript
'use server'

import { revalidateTag } from 'next/cache'
import { updateMember } from '@/http/update-member'
import { getCurrentOrg } from '@/auth'

export async function updateMemberAction({
  memberId,
  role,
}: {
  memberId: string
  role: string
}) {
  const org = getCurrentOrg()

  await updateMember({ org, memberId, role })

  revalidateTag(`${org}/members`)
}
```

## HTTP client function

```typescript
import { api } from './api-client'

export async function updateMember({
  org,
  memberId,
  role,
}: {
  org: string
  memberId: string
  role: string
}) {
  await api.put(`/organizations/${org}/members/${memberId}`, {
    json: { role },
  })
}
```

## Uso na MemberList com permission guards

```tsx
import { ability } from '@/auth'
import { UpdateMemberRoleSelect } from './update-member-role-select'

export async function MemberList() {
  const permissions = await ability()
  const { members, currentUserId } = await getMembers()

  return (
    <div>
      {members.map((member) => (
        <div key={member.id} className="flex items-center justify-between">
          <div>
            <span>{member.name}</span>
            <span>{member.email}</span>
          </div>

          <div className="flex items-center gap-2">
            <UpdateMemberRoleSelect
              memberId={member.id}
              value={member.role}
              disabled={
                member.role === 'OWNER' ||
                member.userId === currentUserId ||
                permissions?.cannot('update', 'User')
              }
            />

            {/* Botao de remover membro (separado) */}
          </div>
        </div>
      ))}
    </div>
  )
}
```

## Instalacao do Shadcn Select (passo que o Diego executa)

```bash
npx shadcn@latest add select
```

Isso instala o componente Select do Radix UI com os wrappers do Shadcn, gerando os arquivos em `components/ui/select.tsx`.

## Pattern: estender ComponentProps de componente Shadcn

```typescript
// Pattern generico reutilizavel para qualquer componente Shadcn
import { type ComponentProps } from 'react'
import { Select } from '@/components/ui/select'

// Estende todas as props nativas + adiciona as suas
interface MySelectProps extends ComponentProps<typeof Select> {
  customProp: string
}

export function MySelect({ customProp, ...props }: MySelectProps) {
  return <Select {...props}>{/* ... */}</Select>
}
```

## Fluxo completo da mutacao

```
1. Usuario seleciona nova role no dropdown
2. onValueChange dispara updateMemberRole(role)
3. updateMemberRole chama updateMemberAction (server action)
4. Server action:
   a. Pega org atual do cookie/session
   b. Faz PUT /organizations/:org/members/:memberId com { role }
   c. Chama revalidateTag('org/members')
5. Next.js invalida o cache da lista de membros
6. Lista re-renderiza no servidor com nova ordenacao
7. UI atualiza automaticamente (sem refresh manual)
```
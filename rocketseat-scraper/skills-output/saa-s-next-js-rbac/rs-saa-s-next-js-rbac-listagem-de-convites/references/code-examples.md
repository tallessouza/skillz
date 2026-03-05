# Code Examples: Listagem e Revogacao de Convites

## Exemplo Completo: API Helper getInvites

```typescript
// http/get-invites.ts
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
      next: {
        tags: [`${org}/invites`],
      },
    })
    .json<GetInvitesResponse>()

  return result
}
```

## Exemplo Completo: revokeInvite API

```typescript
// http/revoke-invite.ts
import { api } from './api-client'

export async function revokeInvite(org: string, inviteId: string) {
  // Importante: usar DELETE, nao POST — semantica HTTP correta
  await api.delete(`organizations/${org}/invites/${inviteId}`)
}
```

## Exemplo Completo: Server Action

```typescript
// app/(app)/org/[slug]/members/actions.ts
'use server'

import { revalidateTag } from 'next/cache'
import { getCurrentOrg } from '@/auth/auth'
import { revokeInvite } from '@/http/revoke-invite'

export async function revokeInviteAction(inviteId: string) {
  const currentOrg = getCurrentOrg()
  await revokeInvite(currentOrg!, inviteId)
  revalidateTag(`${currentOrg}/invites`)
}
```

## Exemplo Completo: RevokeInviteButton

```tsx
// app/(app)/org/[slug]/members/invites/revoke-invite-button.tsx
import { XOctagon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { revokeInviteAction } from '../actions'

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

## Exemplo Completo: Pagina de Invites

```tsx
// app/(app)/org/[slug]/members/invites/page.tsx
import { ability } from '@/auth/auth'
import { getCurrentOrg } from '@/auth/auth'
import { getInvites } from '@/http/get-invites'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@/components/ui/table'
import { RevokeInviteButton } from './revoke-invite-button'

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
          <CardContent>
            {/* Formulario de criacao — implementado em aula separada */}
          </CardContent>
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
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">
                      {invite.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  {invite.role}
                </TableCell>
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

## Padrao: Copiar e Adaptar API Helper

O Diego parte de um helper existente e adapta. Sequencia:

```
1. Copiar getProjects → getInvites
2. Trocar endpoint: organizations/${org}/projects → organizations/${org}/invites
3. Adaptar interface de retorno (invites[] ao inves de projects[])
4. Adaptar tags de cache
```

## Padrao: Copiar e Adaptar Listagem

```
1. Copiar estrutura da MemberList (Table, TableBody, TableRow, TableCell)
2. Trocar .map(member => ...) → .map(invite => ...)
3. Adaptar celulas (email ao inves de nome+avatar, role, botao revoke)
4. Adicionar estado vazio
```

## Inserindo Dados de Teste via Prisma Studio

```bash
# No diretorio apps/api/
pnpm run db-studio

# No Prisma Studio:
# 1. Copiar ID da organizacao desejada
# 2. Ir na tabela invites
# 3. Criar registro: email, role, organizationId
# 4. Salvar e testar no frontend
```
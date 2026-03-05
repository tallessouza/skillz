# Code Examples: Listagem de Membros com RBAC

## HTTP Client: getMembers

Funcao que busca membros da organizacao via API:

```typescript
import { api } from './api-client'
import type { Role } from '@saas/auth'

interface GetMembersResponse {
  members: {
    id: string
    userId: string
    role: Role
    name: string | null
    email: string
    avatarUrl: string | null
  }[]
}

export async function getMembers(org: string) {
  const response = await api.get(`organizations/${org}/members`)
  const result = await response.json<GetMembersResponse>()
  return result
}
```

Pontos importantes:
- O tipo `Role` vem do pacote `@saas/auth` (schema Zod), garantindo que nunca fique desatualizado
- A rota segue o padrao REST: `organizations/{slug}/members`
- Retorna array com `members` contendo id, userId, role, name, email, avatarUrl

## Pagina principal com permissoes

```typescript
import { ability } from '@/auth/auth'
import { Invites } from './invites'
import { MemberList } from './member-list'

export default async function MembersPage() {
  const permissions = await ability()

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Members</h1>
      <div className="space-y-4">
        {permissions?.can('get', 'Invite') && <Invites />}
        {permissions?.can('get', 'User') && <MemberList />}
      </div>
    </div>
  )
}
```

## MemberList completo

```typescript
import { Crown, ArrowLeftRight } from 'lucide-react'
import Image from 'next/image'
import { organizationSchema } from '@saas/auth'

import { ability } from '@/auth/auth'
import { getCurrentOrg } from '@/auth/auth'
import { getMembership } from '@/http/get-membership'
import { getMembers } from '@/http/get-members'
import { getOrganization } from '@/http/get-organization'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'

export async function MemberList() {
  const currentOrg = await getCurrentOrg()
  const permissions = await ability()

  const [{ membership }, { members }, { organization }] = await Promise.all([
    getMembership(currentOrg!),
    getMembers(currentOrg!),
    getOrganization(currentOrg!),
  ])

  const authOrganization = organizationSchema.parse(organization)

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">Members</h2>
      <div className="rounded border">
        <Table>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                {/* Avatar */}
                <TableCell className="py-2.5" style={{ width: 48 }}>
                  <Avatar>
                    <AvatarFallback />
                    {member.avatarUrl && (
                      <Image
                        src={member.avatarUrl}
                        width={32}
                        height={32}
                        className="aspect-square size-full"
                        alt=""
                      />
                    )}
                  </Avatar>
                </TableCell>

                {/* Nome + Email + Indicadores */}
                <TableCell className="py-2.5">
                  <div className="flex flex-col">
                    <span className="inline-flex items-center gap-2 font-medium">
                      {member.name}
                      {member.userId === membership.userId && ' (me)'}
                    </span>
                    {organization.ownerId === member.userId && (
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Crown size={13} />
                        owner
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {member.email}
                    </span>
                  </div>
                </TableCell>

                {/* Acoes */}
                <TableCell className="py-2.5">
                  <div className="flex items-center justify-end gap-2">
                    {permissions?.can(
                      'transfer_ownership',
                      authOrganization,
                    ) && (
                      <Button size="sm" variant="ghost">
                        <ArrowLeftRight className="mr-2 size-4" />
                        Transfer ownership
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
```

## Configuracao de imagens remotas

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'avatars.githubusercontent.com' },
      // adicione outros hostnames conforme necessario
    ],
  },
}

module.exports = nextConfig
```

## Variacao: Table sem TableHead

Neste caso, a tabela nao usa `<TableHead>` — apenas `<TableBody>`. Isso e intencional para listas simples onde os dados sao auto-explicativos (avatar + nome + email). O header da secao (`<h2>Members</h2>`) ja fornece contexto suficiente.

## Variacao: Checagem de permissao com subject vs tipo

```typescript
// ERRADO — checa permissao generica (sempre true para admin)
permissions?.can('transfer_ownership', 'Organization')

// CORRETO — checa contra a instancia especifica
const authOrganization = organizationSchema.parse(organization)
permissions?.can('transfer_ownership', authOrganization)
// O CASL avalia: o usuario e owner DESTA organizacao?
```
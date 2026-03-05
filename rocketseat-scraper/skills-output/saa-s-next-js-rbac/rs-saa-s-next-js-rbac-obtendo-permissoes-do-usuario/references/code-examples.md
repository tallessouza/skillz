# Code Examples: Obtendo Permissoes do Usuario

## Funcao getCurrentOrg completa

```typescript
// src/auth/auth.ts
import { cookies } from 'next/headers'

export function getCurrentOrg() {
  return cookies().get('org')?.value ?? null
}
```

Note: nao e async porque `cookies().get()` e sincrono no Next.js server components.

## Funcao getCurrentMembership completa

```typescript
// src/auth/auth.ts
import { getMembership } from '@/http/get-membership'

export async function getCurrentMembership() {
  const org = getCurrentOrg()

  if (!org) {
    return null
  }

  const { membership } = await getMembership(org)

  return membership
}
```

## Rota HTTP getMembership

```typescript
// src/http/get-membership.ts
import type { Role } from '@saas/auth'
import { api } from './api-client'

interface GetMembershipResponse {
  membership: {
    id: string
    role: Role
    userId: string
    organizationId: string
  }
}

export async function getMembership(org: string) {
  const result = await api
    .get(`organizations/${org}/membership`)
    .json<GetMembershipResponse>()

  return result
}
```

## Funcao ability completa

```typescript
// src/auth/auth.ts
import { defineAbilityFor } from '@saas/auth'

export async function ability() {
  const membership = await getCurrentMembership()

  if (!membership) {
    return null
  }

  const ability = defineAbilityFor({
    id: membership.userId,
    role: membership.role,
  })

  return ability
}
```

## Uso no Header (server component)

```typescript
// src/components/header.tsx
import { ability } from '@/auth/auth'

export async function Header() {
  const permissions = await ability()

  return (
    <div className="...">
      {/* Organization Switcher sempre visivel */}
      <OrganizationSwitcher />

      {/* Project Switcher so aparece se tem permissao */}
      {permissions?.can('get', 'Project') && (
        <ProjectSwitcher />
      )}
    </div>
  )
}
```

## Refatoracao do OrganizationSwitcher

Antes (inline):
```typescript
// Antes - acessava cookies diretamente
const currentOrg = cookies().get('org')?.value
```

Depois (usando funcao centralizada):
```typescript
// Depois - usa funcao reutilizavel
import { getCurrentOrg } from '@/auth/auth'

const currentOrg = await getCurrentOrg()
```

## Alteracao no backend para incluir userId

```typescript
// Backend - rota de membership (antes)
return reply.send({
  membership: {
    id: membership.id,
    role: membership.role,
    organizationId: membership.organizationId,
  }
})

// Backend - rota de membership (depois)
return reply.send({
  membership: {
    id: membership.id,
    role: membership.role,
    userId: membership.userId,  // Adicionado para o frontend
    organizationId: membership.organizationId,
  }
})
```

## Padrao de conditional rendering com permissoes

```typescript
// Padrao geral para qualquer server component
const permissions = await ability()

// Renderizacao condicional segura
{permissions?.can('create', 'Project') && <CreateProjectButton />}
{permissions?.can('delete', 'Organization') && <DeleteOrgButton />}
{permissions?.can('update', 'Member') && <ManageMembersSection />}
```
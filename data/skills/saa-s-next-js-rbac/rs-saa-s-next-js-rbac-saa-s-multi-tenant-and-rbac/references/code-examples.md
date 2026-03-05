# Code Examples: SaaS Multi-Tenant & RBAC

## Modelo de banco tradicional (o que NAO fazer para SaaS simples)

O instrutor mostra o modelo que a maioria dos desenvolvedores cria por padrao:

```
┌──────────┐     ┌──────────┐     ┌──────────────┐
│  Users   │────>│  Roles   │────>│ Permissions  │
│          │     │          │     │              │
│ id       │     │ id       │     │ id           │
│ name     │     │ name     │     │ name         │
│ roleId   │     │          │     │ roleId       │
└──────────┘     └──────────┘     └──────────────┘
```

Problema: se o usuario nao pode criar roles nem permissoes, essas tabelas so ocupam espaco e adicionam queries desnecessarias.

## Modelo proposto (permissoes no codigo)

```
┌──────────────┐     ┌──────────┐     ┌──────────┐
│ Organization │────>│  Member  │<────│   User   │
│              │     │          │     │          │
│ id           │     │ id       │     │ id       │
│ name         │     │ orgId    │     │ name     │
│              │     │ userId   │     │ email    │
│              │     │ role     │     │          │
└──────────────┘     └──────────┘     └──────────┘
```

E no codigo:

```typescript
// src/config/permissions.ts
export const rolePermissions = {
  ADMIN: [
    'create:project',
    'delete:project',
    'update:project',
    'list:projects',
    'manage:billing',
    'invite:member',
    'remove:member',
    'transfer:ownership',
  ],
  MEMBER: [
    'create:project',
    'list:projects',
    'update:own:project',
    'delete:own:project',
  ],
  BILLING: [
    'manage:billing',
    'list:invoices',
    'download:invoices',
  ],
} as const

export type Role = keyof typeof rolePermissions
export type Permission = typeof rolePermissions[Role][number]
```

## Verificacao RBAC simples

```typescript
// src/lib/authorization.ts
import { rolePermissions, type Permission, type Role } from '@/config/permissions'

export function hasPermission(role: Role, permission: Permission): boolean {
  return rolePermissions[role].includes(permission)
}

// Uso em API route
export async function POST(request: Request) {
  const member = await getCurrentMember() // pega membership do usuario logado

  if (!hasPermission(member.role, 'create:project')) {
    return Response.json({ error: 'Forbidden' }, { status: 403 })
  }

  // criar projeto...
}
```

## Verificacao ABAC (baseada em atributos)

```typescript
// src/lib/authorization.ts
interface Project {
  id: string
  ownerId: string
  organizationId: string
}

interface Member {
  userId: string
  role: Role
  organizationId: string
}

export function canEditProject(member: Member, project: Project): boolean {
  // RBAC: admin pode tudo
  if (member.role === 'ADMIN') return true

  // ABAC: membro so pode editar projeto que criou
  if (member.role === 'MEMBER') {
    return project.ownerId === member.userId
  }

  return false
}

export function canDeleteProject(member: Member, project: Project): boolean {
  if (member.role === 'ADMIN') return true
  if (member.role === 'MEMBER') {
    return project.ownerId === member.userId
  }
  return false
}
```

## Membership com multiplas roles

```typescript
// Schema com array de roles
model Member {
  id             String   @id @default(cuid())
  roles          Role[]   // array — usuario pode ser BILLING + MEMBER
  organizationId String
  userId         String
  organization   Organization @relation(fields: [organizationId])
  user           User         @relation(fields: [userId])

  @@unique([organizationId, userId])
}

// Verificacao com multiplas roles
export function hasPermission(roles: Role[], permission: Permission): boolean {
  return roles.some(role => rolePermissions[role].includes(permission))
}
```

## Exemplo real: alternando entre organizacoes (como Stripe)

```typescript
// O usuario nao precisa de subdominio — basta selecionar a organizacao
async function switchOrganization(userId: string, organizationId: string) {
  const membership = await db.member.findUnique({
    where: {
      organizationId_userId: {
        organizationId,
        userId,
      },
    },
  })

  if (!membership) {
    throw new Error('User is not a member of this organization')
  }

  // Salvar organizacao ativa na sessao/cookie
  await setActiveOrganization(userId, organizationId)

  return membership
}

// Listar organizacoes do usuario
async function getUserOrganizations(userId: string) {
  return db.member.findMany({
    where: { userId },
    include: { organization: true },
  })
}
```

## Quando subdominio faz sentido (plataforma de membros)

```typescript
// middleware.ts — apenas para SaaS com paginas publicas por empresa
import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const subdomain = hostname.split('.')[0]

  // Apenas se o SaaS tem paginas publicas por empresa
  if (subdomain && subdomain !== 'www' && subdomain !== 'app') {
    const organization = await db.organization.findUnique({
      where: { slug: subdomain },
    })

    if (!organization) {
      return NextResponse.redirect(new URL('/404', request.url))
    }

    // Rewrite para a rota da organizacao
    return NextResponse.rewrite(
      new URL(`/${subdomain}${request.nextUrl.pathname}`, request.url)
    )
  }
}
```
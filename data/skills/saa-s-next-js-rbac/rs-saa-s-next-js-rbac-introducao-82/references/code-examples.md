# Code Examples: Arquitetura SaaS Full-Stack

## Nota

Esta aula e introdutoria e nao contem exemplos de codigo. Os exemplos abaixo ilustram os conceitos mencionados pelo instrutor para dar contexto pratico.

## Estrutura de monorepo com TurboRepo

```
apps/
├── api/                    # Back-end Fastify
│   ├── src/
│   │   ├── http/
│   │   │   └── routes/
│   │   ├── use-cases/
│   │   └── server.ts
│   └── package.json
├── web/                    # Front-end Next.js 14
│   ├── src/
│   │   ├── app/            # App Router
│   │   └── components/
│   └── package.json
└── packages/
    ├── auth/               # Pacote de permissionamento (RBAC/ABAC)
    │   ├── src/
    │   │   ├── roles.ts
    │   │   ├── permissions.ts
    │   │   └── index.ts
    │   └── package.json
    ├── env/                # Validacao de env vars compartilhada
    └── tsconfig/           # Configs TypeScript compartilhadas
```

## Exemplo conceitual: RBAC basico

```typescript
// packages/auth/src/roles.ts
export const roles = {
  ADMIN: 'ADMIN',
  MEMBER: 'MEMBER',
  BILLING: 'BILLING',
} as const

export type Role = keyof typeof roles
```

```typescript
// packages/auth/src/permissions.ts
import { Role } from './roles'

type Permission = 'create:project' | 'delete:project' | 'manage:billing' | 'invite:member'

const rolePermissions: Record<Role, Permission[]> = {
  ADMIN: ['create:project', 'delete:project', 'manage:billing', 'invite:member'],
  MEMBER: ['create:project'],
  BILLING: ['manage:billing'],
}

export function hasPermission(role: Role, permission: Permission): boolean {
  return rolePermissions[role].includes(permission)
}
```

## Exemplo conceitual: multi-tenancy com tenant_id

```typescript
// Toda query no back-end filtra por organizationId (tenant)
async function getProjects(organizationId: string, userId: string) {
  const projects = await prisma.project.findMany({
    where: {
      organizationId, // tenant isolation
    },
  })
  return projects
}
```

## Exemplo conceitual: permissao compartilhada entre front e back

```typescript
// No back-end (apps/api) — protege a rota
import { hasPermission } from '@saas/auth'

app.delete('/projects/:id', async (request, reply) => {
  const userRole = await getUserRole(request.userId, request.organizationId)
  
  if (!hasPermission(userRole, 'delete:project')) {
    return reply.status(403).send({ message: 'Not allowed' })
  }
  
  // ... delete project
})
```

```tsx
// No front-end (apps/web) — esconde o botao
import { hasPermission } from '@saas/auth'

export function ProjectCard({ project, userRole }) {
  return (
    <div>
      <h2>{project.name}</h2>
      {hasPermission(userRole, 'delete:project') && (
        <button>Delete</button>
      )}
    </div>
  )
}
```

## turbo.json — configuracao basica do TurboRepo

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {},
    "typecheck": {
      "dependsOn": ["^build"]
    }
  }
}
```
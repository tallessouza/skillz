# Code Examples: Permissoes Condicionais com CASL

## Exemplo 1: Modelo User basico

```typescript
// models/user.ts
import { z } from 'zod'

export const userSchema = z.object({
  id: z.string(),
  role: z.enum(['ADMIN', 'MEMBER', 'BILLING']),
})

export type User = z.infer<typeof userSchema>
```

## Exemplo 2: Modelo Project com __typename

```typescript
// models/project.ts
import { z } from 'zod'

export const projectSchema = z.object({
  __typename: z.literal('Project').default('Project'),
  id: z.string(),
  ownerId: z.string(),
})

export type Project = z.infer<typeof projectSchema>
```

## Exemplo 3: Modelo Organization com __typename

```typescript
// models/organization.ts
import { z } from 'zod'

export const organizationSchema = z.object({
  __typename: z.literal('Organization').default('Organization'),
  id: z.string(),
  ownerId: z.string(),
})

export type Organization = z.infer<typeof organizationSchema>
```

## Exemplo 4: Definicao de subjects com union types

```typescript
// permissions/subjects.ts
import type { Project } from '../models/project'
import type { Organization } from '../models/organization'

type AppSubjects =
  | 'User'
  | 'Invite'
  | ('Project' | Project)
  | ('Organization' | Organization)
```

## Exemplo 5: Builder com detectSubjectType

```typescript
// permissions/index.ts
import { createMongoAbility, AbilityBuilder } from '@casl/ability'

type AppAbilities = [string, AppSubjects]

export function defineAbilitiesFor(user: User) {
  const builder = new AbilityBuilder<AppAbilities>(createMongoAbility)

  const { can, cannot, build } = builder

  // Permissoes de membro
  can(['create', 'get'], 'Project')
  can(['update', 'delete'], 'Project', { ownerId: { $eq: user.id } })

  can(['create', 'get'], 'Organization')
  can('delete', 'Organization', { ownerId: { $eq: user.id } })

  return build({
    detectSubjectType: (subject) => subject.__typename,
  })
}
```

## Exemplo 6: Agrupando acoes vs. condicionais separados

```typescript
// Acoes SEM condicional — podem ser agrupadas
can(['create', 'get'], 'Project')

// Acoes COM condicional — separadas das livres
can(['update', 'delete'], 'Project', { ownerId: { $eq: user.id } })
```

## Exemplo 7: Operadores MongoDB disponiveis nos condicionais

```typescript
// Igualdade
can('update', 'Project', { ownerId: { $eq: user.id } })

// Negacao
can('read', 'Project', { status: { $ne: 'archived' } })

// Lista de valores
can('manage', 'Project', { ownerId: { $in: [user.id, ...teamIds] } })

// Negacao de lista
cannot('delete', 'Project', { status: { $nin: ['draft'] } })
```

## Exemplo 8: Verificando permissao em runtime

```typescript
const ability = defineAbilitiesFor(currentUser)

// Com literal (sem condicional de ownership)
ability.can('create', 'Project') // true

// Com objeto real (verifica ownership via __typename)
const project = projectSchema.parse({
  id: 'proj-1',
  ownerId: 'user-123',
})

ability.can('update', project) // true se currentUser.id === 'user-123'
ability.can('delete', project) // true se currentUser.id === 'user-123'
```
# Code Examples: Tipagem de Permissoes com Zod

## Exemplo completo: Todos os subjects

```typescript
import { z } from 'zod'

// Roles centralizadas
export const rolesSchema = z.union([
  z.literal('ADMIN'),
  z.literal('MEMBER'),
  z.literal('BILLING'),
])
export type Role = z.infer<typeof rolesSchema>

// Project Subject
export const projectSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('get'),
    z.literal('create'),
    z.literal('update'),
    z.literal('delete'),
  ]),
  z.literal('Project'),
])
type ProjectSubject = z.infer<typeof projectSubject>

// User Subject
export const userSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('get'),
    z.literal('update'),
    z.literal('delete'),
  ]),
  z.literal('User'),
])
type UserSubject = z.infer<typeof userSubject>

// Organization Subject
export const organizationSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('create'),
    z.literal('update'),
    z.literal('delete'),
    z.literal('transfer_ownership'),
  ]),
  z.literal('Organization'),
])
type OrganizationSubject = z.infer<typeof organizationSubject>

// Invite Subject
export const inviteSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('get'),
    z.literal('create'),
    z.literal('delete'),
  ]),
  z.literal('Invite'),
])
type InviteSubject = z.infer<typeof inviteSubject>

// Billing Subject
export const billingSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('get'),
    z.literal('export'),
  ]),
  z.literal('Billing'),
])
type BillingSubject = z.infer<typeof billingSubject>

// App Abilities (agregacao de todos os subjects)
const appAbilitiesSchema = z.union([
  projectSubject,
  userSubject,
  organizationSubject,
  inviteSubject,
  billingSubject,
  z.tuple([z.literal('manage'), z.literal('all')]),
])
type AppAbilities = z.infer<typeof appAbilitiesSchema>
```

## User Model usando rolesSchema

```typescript
import { z } from 'zod'
import { rolesSchema } from './roles'

export const userSchema = z.object({
  id: z.string(),
  role: rolesSchema,
})

export type User = z.infer<typeof userSchema>
```

## Tipo resultante (o que z.infer gera)

```typescript
// ProjectSubject resulta em:
type ProjectSubject = ['manage' | 'get' | 'create' | 'update' | 'delete', 'Project']

// Role resulta em:
type Role = 'ADMIN' | 'MEMBER' | 'BILLING'

// AppAbilities resulta em:
type AppAbilities =
  | ['manage' | 'get' | 'create' | 'update' | 'delete', 'Project']
  | ['manage' | 'get' | 'update' | 'delete', 'User']
  | ['manage' | 'create' | 'update' | 'delete' | 'transfer_ownership', 'Organization']
  | ['manage' | 'get' | 'create' | 'delete', 'Invite']
  | ['manage' | 'get' | 'export', 'Billing']
  | ['manage', 'all']
```

## Autocomplete em acao

```typescript
// Com esse sistema, o TypeScript recusa combinacoes invalidas:
const perm1: AppAbilities = ['transfer_ownership', 'Organization'] // ✅
const perm2: AppAbilities = ['transfer_ownership', 'Billing']      // ❌ erro de tipo
const perm3: AppAbilities = ['create', 'User']                     // ❌ User nao tem create
```
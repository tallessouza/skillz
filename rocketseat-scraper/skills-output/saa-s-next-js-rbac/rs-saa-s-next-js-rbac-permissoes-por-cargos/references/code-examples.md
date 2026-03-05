# Code Examples: Permissoes por Cargos com CASL

## Estrutura de arquivos

```
src/
├── index.ts          # defineAbilityFor + tipos AppAbility
├── permissions.ts    # objeto permissions por role
└── models/
    └── user.ts       # interface User com role
```

## 1. Tipo Role

```typescript
// src/roles.ts (ou inline)
export type Role = 'ADMIN' | 'MEMBER'
```

## 2. Model User

```typescript
// src/models/user.ts
import { Role } from '../roles'

export interface User {
  role: Role
}
```

## 3. Tipos de Ability (index.ts - parte de tipagem)

```typescript
// src/index.ts
import { createMongoAbility, MongoAbility, AbilityBuilder } from '@casl/ability'

type Action = 'manage' | 'invite' | 'delete'
type Subject = 'User' | 'all'

export type AppAbility = MongoAbility<[Action, Subject]>
```

## 4. Arquivo permissions.ts completo

```typescript
// src/permissions.ts
import { AbilityBuilder } from '@casl/ability'
import { AppAbility } from '.'
import { User } from './models/user'
import { Role } from './roles'

type PermissionsByRole = Record<
  Role,
  (user: User, builder: AbilityBuilder<AppAbility>) => void
>

export const permissions: PermissionsByRole = {
  ADMIN(user, { can }) {
    // manage + all = pode tudo (super admin)
    can('manage', 'all')
  },
  MEMBER(user, { can }) {
    // membro so pode convidar outros usuarios
    can('invite', 'User')
    // nao precisa de cannot explicito —
    // CASL remove todas as permissoes por padrao
  },
}
```

## 5. defineAbilityFor completo

```typescript
// src/index.ts
import { createMongoAbility, AbilityBuilder } from '@casl/ability'
import { permissions } from './permissions'
import { User } from './models/user'

export function defineAbilityFor(user: User) {
  const builder = new AbilityBuilder<AppAbility>(createMongoAbility)

  if (typeof permissions[user.role] !== 'function') {
    throw new Error(`Permissions for role ${user.role} not found.`)
  }

  permissions[user.role](user, builder)

  const ability = builder.build()

  return ability
}
```

## 6. Uso e verificacao

```typescript
// Testando admin
const adminAbility = defineAbilityFor({ role: 'ADMIN' })
console.log(adminAbility.can('invite', 'User'))  // true
console.log(adminAbility.can('delete', 'User'))  // true
console.log(adminAbility.cannot('delete', 'User'))  // false (admin PODE deletar)

// Testando membro
const memberAbility = defineAbilityFor({ role: 'MEMBER' })
console.log(memberAbility.can('invite', 'User'))  // true
console.log(memberAbility.can('delete', 'User'))  // false
console.log(memberAbility.cannot('delete', 'User'))  // true (membro NAO pode deletar)
```

## 7. Adicionando nova role (extensao)

```typescript
// Para adicionar BILLING:

// 1. Atualizar o tipo Role
export type Role = 'ADMIN' | 'MEMBER' | 'BILLING'

// 2. TypeScript OBRIGA adicionar no objeto permissions
export const permissions: PermissionsByRole = {
  ADMIN(user, { can }) {
    can('manage', 'all')
  },
  MEMBER(user, { can }) {
    can('invite', 'User')
  },
  BILLING(user, { can }) {
    // permissoes especificas de billing
    can('read', 'Invoice')
  },
}
// Se nao adicionar BILLING, TypeScript da erro de compilacao
// porque Record<Role, ...> exige todas as chaves
```

## 8. Por que user e parametro (preview do futuro)

```typescript
// Mais adiante no curso, permissoes condicionais:
MEMBER(user, { can }) {
  can('invite', 'User')
  // Membro pode editar projeto SE for o dono
  can('update', 'Project', { ownerId: user.id })
},
```
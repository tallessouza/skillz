# Code Examples: Definindo Permissoes com CASL

## Exemplo completo de definicao de abilities

```typescript
import { AbilityBuilder } from '@casl/ability'

type Role = 'ADMIN' | 'MEMBER' | 'BILLING'

interface User {
  id: string
  role: Role
}

function defineAbilitiesFor(user: User) {
  const builder = new AbilityBuilder()
  const { can, cannot, build } = builder

  switch (user.role) {
    case 'ADMIN':
      // Passo 1: Pode tudo
      can('manage', 'all')

      // Passo 2: Nega completamente acoes especificas em Organization
      cannot(['transfer_ownership', 'update'], 'Organization')

      // Passo 3: Re-concede com condicional (somente orgs proprias)
      can(['transfer_ownership', 'update'], 'Organization', {
        ownerId: { $eq: user.id },
      })
      break

    case 'MEMBER':
      // Grants granulares — nunca manage all
      can('get', 'User')
      can(['create', 'get'], 'Project')
      can(['update', 'delete'], 'Project', {
        ownerId: { $eq: user.id },
      })
      // NAO inclui create Organization (permissao global, fora do RBAC)
      // NAO inclui invite (apenas admin pode convidar)
      break

    case 'BILLING':
      // Manage no subject especifico = todas as acoes de billing (get, export)
      can('manage', 'Billing')
      break
  }

  return build()
}
```

## Testando permissoes no console

```typescript
import { projectSchema } from './models'

// Setup
const ability = defineAbilitiesFor({ id: 'user1', role: 'MEMBER' })

// Teste 1: Member nao pode ver billing
console.log(ability.can('get', 'Billing'))
// → false

// Teste 2: Member nao pode convidar
console.log(ability.can('create', 'Invite'))
// → false

// Teste 3: Member pode deletar ALGUM projeto? (sem instancia)
console.log(ability.can('delete', 'Project'))
// → true (ele TEM permissao de deletar projetos — os dele)

// Teste 4: Member pode deletar ESTE projeto? (com instancia)
const ownProject = projectSchema.parse({ id: 'p1', ownerId: 'user1' })
console.log(ability.can('delete', ownProject))
// → true (mesmo owner)

const otherProject = projectSchema.parse({ id: 'p2', ownerId: 'user2' })
console.log(ability.can('delete', otherProject))
// → false (owner diferente)
```

## Erro comum: condicional no cannot

```typescript
// ERRADO — NAO FUNCIONA apos manage all
can('manage', 'all')
cannot('transfer_ownership', 'Organization', {
  ownerId: { $ne: userId },
})
// Resultado: usuario nao pode transferir NENHUMA org (condicional ignorada)

// CORRETO — deny completo + re-grant
can('manage', 'all')
cannot('transfer_ownership', 'Organization')
can('transfer_ownership', 'Organization', {
  ownerId: { $eq: userId },
})
// Resultado: usuario pode transferir apenas sua propria org
```

## Re-exportacao de models para imports limpos

```typescript
// src/auth/index.ts
export * from './models/organization'
export * from './models/project'
export * from './models/user'

// Permite importar tudo de um lugar:
import { projectSchema, userSchema } from '@/auth'
```
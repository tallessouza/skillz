# Code Examples: Permissoes com CASL

## Exemplo 1: Definicao completa do pacote de permissoes

```typescript
// packages/auth/src/index.ts
import { AbilityBuilder, createMongoAbility } from '@casl/ability'

type Actions = 'manage' | 'invite' | 'delete'
type Subjects = 'User' | 'all'

const createAppAbility = createMongoAbility<[Actions, Subjects]>

const builder = new AbilityBuilder(createAppAbility)
const { can, cannot, build } = builder

// Usuario pode convidar outros usuarios
can('invite', 'User')

// Usuario NAO pode deletar outros usuarios
// (redundante pois padrao e negar, mas explicito para clareza)
cannot('delete', 'User')

export const ability = build()
```

## Exemplo 2: Consumindo permissoes na API

```typescript
// apps/api/src/index.ts
import { ability } from '@saas/auth'

// Checagem positiva
const userCanInviteSomeoneElse = ability.can('invite', 'User')
console.log(userCanInviteSomeoneElse) // true

// Checagem positiva (permissao negada)
const userCanDeleteOtherUsers = ability.can('delete', 'User')
console.log(userCanDeleteOtherUsers) // false

// Checagem negativa (confirmar que NAO pode)
const userCannotDeleteOtherUsers = ability.cannot('delete', 'User')
console.log(userCannotDeleteOtherUsers) // true
```

## Exemplo 3: Admin com permissao total

```typescript
// Quando for implementar role de admin:
can('manage', 'all')
// Isso concede TODAS as acoes em TODAS as entidades
```

## Exemplo 4: Padrao can-geral + cannot-excecao

```typescript
// Todos podem convidar
can('invite', 'User')

// Exceto usuarios convidados ha menos de uma semana
// (condicoes serao exploradas em aulas futuras com conditions do CASL)
cannot('invite', 'User') // + conditions
```

## Exemplo 5: Setup do package.json da API

```json
{
  "name": "@saas/api",
  "version": "1.0.0",
  "scripts": {
    "dev": "tsx watch src/index.ts"
  },
  "devDependencies": {
    "@saas/prettier": "workspace:*",
    "@saas/eslint-config": "workspace:*",
    "@saas/ts-config": "workspace:*",
    "tsx": "latest",
    "@types/node": "latest"
  },
  "dependencies": {
    "@saas/auth": "workspace:*"
  }
}
```

## Exemplo 6: tsconfig.json da API

```json
{
  "extends": "@saas/ts-config/node.json",
  "include": ["src"]
}
```
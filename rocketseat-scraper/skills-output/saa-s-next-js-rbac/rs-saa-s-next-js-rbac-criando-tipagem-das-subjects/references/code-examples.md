# Code Examples: Tipagem de Subjects no CASL

## Estrutura de arquivos

```
src/
  permissions/
    subjects/
      user.ts
      project.ts
    index.ts
```

## Subject: Project

```typescript
// subjects/project.ts
export type ProjectSubject = [
  'create' | 'delete' | 'manage',
  'Project'
]
```

Apenas 3 acoes: criar, deletar e manage (coringa). Note que `invite` NAO esta aqui — nao faz sentido convidar um projeto.

## Subject: User

```typescript
// subjects/user.ts
export type UserSubject = [
  'invite' | 'create' | 'delete' | 'manage',
  'User'
]
```

4 acoes: invite (exclusiva de User), create, delete e manage. O `invite` vem primeiro por legibilidade (acoes exclusivas primeiro, manage por ultimo).

## Composicao no index

```typescript
// index.ts
import type { UserSubject } from './subjects/user'
import type { ProjectSubject } from './subjects/project'

// Union de todos os subjects + o coringa global
type AppAbility = UserSubject | ProjectSubject | ['manage', 'all']
```

### Antes (sem subjects tipados)

```typescript
// Tudo numa union global — sem vinculo acao-entidade
type Actions = 'create' | 'delete' | 'invite' | 'manage'
type Subjects = 'User' | 'Project' | 'all'

type AppAbility = [Actions, Subjects]

// Isso compila mas e um bug logico:
can('invite', 'Project') // Nenhum erro!
```

### Depois (com subjects tipados)

```typescript
type AppAbility = UserSubject | ProjectSubject | ['manage', 'all']

can('invite', 'Project') // ERRO: 'invite' nao existe em ProjectSubject
can('invite', 'User')    // OK
can('create', 'Project') // OK
can('create', 'User')    // OK
can('manage', 'all')     // OK — coringa global
```

## Adicionando uma nova entidade

Para adicionar `Organization` ao sistema:

```typescript
// subjects/organization.ts
export type OrganizationSubject = [
  'create' | 'update' | 'delete' | 'transfer_ownership' | 'manage',
  'Organization'
]
```

```typescript
// index.ts — adicionar na union
import type { OrganizationSubject } from './subjects/organization'

type AppAbility =
  | UserSubject
  | ProjectSubject
  | OrganizationSubject
  | ['manage', 'all']
```

## Usando com o AbilityBuilder do CASL

```typescript
import { AbilityBuilder, createMongoAbility } from '@casl/ability'

const builder = new AbilityBuilder<AppAbility>(createMongoAbility)

// TypeScript valida cada chamada:
builder.can('create', 'Project')  // OK
builder.can('invite', 'User')     // OK
builder.can('invite', 'Project')  // ERRO de compilacao
builder.can('manage', 'all')      // OK — admin total
```

## Definindo permissoes por role

```typescript
function definePermissionsFor(role: 'admin' | 'member') {
  const builder = new AbilityBuilder<AppAbility>(createMongoAbility)

  if (role === 'admin') {
    builder.can('manage', 'all')
  }

  if (role === 'member') {
    builder.can('create', 'Project')
    builder.can('invite', 'User')
    // builder.can('invite', 'Project') // Erro! TypeScript protege
  }

  return builder.build()
}
```
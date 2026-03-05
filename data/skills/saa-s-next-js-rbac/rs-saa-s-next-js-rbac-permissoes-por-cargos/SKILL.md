---
name: rs-saas-nextjs-rbac-permissoes-por-cargos
description: "Enforces role-based permission mapping with CASL AbilityBuilder in TypeScript SaaS projects. Use when user asks to 'define permissions per role', 'configure RBAC', 'set up role permissions', 'create permission system', or 'use CASL with roles'. Applies pattern: permissions object keyed by role, each value is a function receiving user and builder, with typed AppAbility generic. Make sure to use this skill whenever implementing role-based access control with CASL. Not for route protection, middleware guards, or UI permission checks."
---

# Permissoes por Cargos com CASL

> Defina permissoes como um objeto indexado por role, onde cada role mapeia para uma funcao que recebe o usuario e o AbilityBuilder tipado.

## Rules

1. **Crie um objeto `permissions` indexado por role** — cada chave e uma role, cada valor e uma funcao `(user, builder) => void`, porque isso permite lookup direto e extensibilidade por cargo
2. **Tipe o builder com `AbilityBuilder<AppAbility>`** — passe o generic `AppAbility` para que `can`/`cannot` conhecam as actions e subjects da aplicacao, porque sem o generic o CASL nao valida permissoes
3. **Valide roles desconhecidas com throw** — antes de chamar a funcao de permissoes, verifique se a role existe no objeto, porque roles nao mapeadas resultariam em usuario sem nenhuma permissao silenciosamente
4. **Exporte `defineAbilityFor(user)` em vez de uma ability global** — cada usuario gera seu proprio conjunto de permissoes, porque ability global ignora o cargo do usuario
5. **Desestruture `can` e `cannot` do builder** — facilita a leitura das definicoes de permissao dentro de cada role

## How to write

### Objeto de permissoes tipado

```typescript
import { AbilityBuilder } from '@casl/ability'
import { AppAbility } from '.'
import { User } from './models/user'
import { Role } from './roles'

type PermissionsByRole = Record<
  Role,
  (user: User, builder: AbilityBuilder<AppAbility>) => void
>

export const permissions: PermissionsByRole = {
  ADMIN(user, { can, cannot }) {
    can('manage', 'all')
  },
  MEMBER(user, { can, cannot }) {
    can('invite', 'User')
  },
}
```

### defineAbilityFor com validacao

```typescript
import { createMongoAbility, AbilityBuilder } from '@casl/ability'
import { permissions } from './permissions'
import { User } from './models/user'
import { AppAbility } from '.'

export function defineAbilityFor(user: User): AppAbility {
  const builder = new AbilityBuilder<AppAbility>(createMongoAbility)

  if (typeof permissions[user.role] !== 'function') {
    throw new Error(`Permissions for role ${user.role} not found.`)
  }

  permissions[user.role](user, builder)

  const ability = builder.build()

  return ability
}
```

### Model User com role obrigatoria

```typescript
import { Role } from '../roles'

export interface User {
  role: Role
}
```

## Example

**Before (ability global sem roles):**
```typescript
const { can } = new AbilityBuilder<AppAbility>(createMongoAbility)
can('invite', 'User')
export const ability = builder.build()
// Todos os usuarios tem as mesmas permissoes
```

**After (permissoes por cargo):**
```typescript
const ability = defineAbilityFor({ role: 'ADMIN' })
ability.can('delete', 'User')  // true

const memberAbility = defineAbilityFor({ role: 'MEMBER' })
memberAbility.can('delete', 'User')  // false
memberAbility.can('invite', 'User')  // true
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Nova role adicionada ao sistema | Adicione entrada no objeto `permissions` e no type `Role` |
| Role sem permissoes definidas | O `throw` captura antes de retornar ability vazia |
| Admin precisa de acesso total | Use `can('manage', 'all')` — convencao CASL |
| Permissao depende de dados do usuario | Use o parametro `user` recebido na funcao |
| CASL nao autocompleta actions/subjects | Verifique se passou o generic `AppAbility` ao `AbilityBuilder` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `export const ability = builder.build()` (global) | `export function defineAbilityFor(user)` |
| `AbilityBuilder` sem generic | `AbilityBuilder<AppAbility>` |
| `if/else` chain por role | Objeto `permissions` indexado por role |
| Ignorar role desconhecida silenciosamente | `throw new Error('Permissions for role ... not found')` |
| Tipar user como `any` | Criar interface `User` com `role: Role` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

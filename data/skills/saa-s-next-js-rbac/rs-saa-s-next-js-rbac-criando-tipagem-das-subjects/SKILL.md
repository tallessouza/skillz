---
name: rs-saas-nextjs-rbac-tipagem-subjects
description: "Enforces type-safe CASL subject definitions when building RBAC permission systems in TypeScript. Use when user asks to 'create permissions', 'define subjects', 'setup CASL', 'configure RBAC', or 'type abilities'. Applies tuple-based subject typing where each entity declares its own allowed actions, preventing invalid action-subject combinations at compile time. Make sure to use this skill whenever implementing authorization with CASL or defining permission subjects. Not for runtime permission checks, middleware guards, or database-level RLS policies."
---

# Tipagem de Subjects no CASL

> Cada entidade do sistema declara suas proprias acoes permitidas como um Subject type, garantindo que combinacoes invalidas (ex: invite + project) sejam erros de compilacao.

## Rules

1. **Uma subject por arquivo** — crie `subjects/user.ts`, `subjects/project.ts`, etc., porque organiza por dominio e facilita manutencao
2. **Subject e uma tupla [Action, Entity]** — `type ProjectSubject = ['create' | 'delete' | 'manage', 'Project']`, porque o CASL usa a posicao do array para inferir tipos
3. **Acoes especificas por entidade** — `invite` pertence apenas a `User`, nao a `Project`, porque o TypeScript so valida se cada subject declarar suas proprias acoes
4. **Sempre inclua `manage`** — e o coringa do CASL que representa todas as acoes, coloque por ultimo na union por convencao
5. **AppAbility e a uniao dos subjects** — `type AppAbility = UserSubject | ProjectSubject | ['manage', 'all']`, porque o CASL precisa de um tipo unico para o builder
6. **Declare `['manage', 'all']` separadamente** — nao misture com subjects especificos, porque `all` nao pertence a nenhuma entidade

## How to write

### Subject individual

```typescript
// subjects/project.ts
export type ProjectSubject = [
  'create' | 'delete' | 'manage',
  'Project'
]
```

### Subject com acoes exclusivas

```typescript
// subjects/user.ts
export type UserSubject = [
  'invite' | 'create' | 'delete' | 'manage',
  'User'
]
```

### Composicao no index

```typescript
// index.ts (ou permissions.ts)
import type { UserSubject } from './subjects/user'
import type { ProjectSubject } from './subjects/project'

type AppAbility = UserSubject | ProjectSubject | ['manage', 'all']
```

## Example

**Before (sem tipagem de subjects):**
```typescript
type Actions = 'create' | 'delete' | 'invite' | 'manage'
type Subjects = 'User' | 'Project' | 'all'

// Compila sem erro — mas invite + Project nao faz sentido
can('invite', 'Project') // BUG silencioso
```

**After (com subject typing):**
```typescript
type UserSubject = ['invite' | 'create' | 'delete' | 'manage', 'User']
type ProjectSubject = ['create' | 'delete' | 'manage', 'Project']
type AppAbility = UserSubject | ProjectSubject | ['manage', 'all']

can('invite', 'Project') // ERRO de compilacao
can('invite', 'User')    // OK
can('create', 'Project') // OK
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Nova entidade no sistema | Crie arquivo em `subjects/` com suas acoes especificas |
| Acao serve para multiplas entidades | Repita a acao em cada subject (ex: `create` em User e Project) |
| Acao e exclusiva de uma entidade | Declare apenas naquele subject (ex: `invite` so em User) |
| Precisa de permissao global | Use `['manage', 'all']` como subject separado |
| Autocomplete mostra acoes invalidas | Verifique a ordem: CASL infere pelo segundo parametro da tupla |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `type Actions = 'create' \| 'invite' \| ...` (union global) | Subject types individuais por entidade |
| `type Subjects = 'User' \| 'Project' \| 'all'` (union global) | Tuplas `[Action, Entity]` por entidade |
| `can('invite', 'Project')` (acao invalida para entidade) | Deixe o TypeScript bloquear via subject types |
| Todas as subjects num unico arquivo | Um arquivo por subject em `subjects/` |
| `'all'` dentro de um subject especifico | `['manage', 'all']` como tipo separado na union |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

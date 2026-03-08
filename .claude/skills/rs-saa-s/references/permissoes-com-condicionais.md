---
name: rs-saas-nextjs-rbac-permissoes-condicionais
description: "Enforces CASL conditional permissions pattern when building authorization systems in TypeScript. Use when user asks to 'create permissions', 'add authorization', 'implement RBAC', 'define access control', or 'use CASL'. Applies rules: define entity models with only permission-relevant fields, use __typename for subject detection, use Zod schemas with detectSubjectType, create ownership conditionals with ownerId equals userId. Make sure to use this skill whenever implementing permission conditionals or CASL subject typing. Not for authentication, login flows, or session management."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: saa-s-next-js-rbac
  module: permissoes
  tags: [saas, nextjs, casl, rbac, zod, permissions]
---

# Permissoes Condicionais com CASL

> Defina condicionais de permissao tipadas usando modelos de entidade com apenas os campos relevantes para autorizacao.

## Rules

1. **Modelos de entidade contem apenas campos de permissao** — nao replique todas as colunas do banco, apenas os campos usados em condicionais (id, ownerId), porque o modelo existe para permissionamento, nao para persistencia
2. **Use `__typename` para identificacao de subject** — cada entidade precisa de um campo `__typename` com `z.literal('NomeEntidade').default('NomeEntidade')` para que o CASL identifique o tipo do objeto
3. **Configure `detectSubjectType`** — no builder do CASL, implemente `detectSubjectType: (subject) => subject.__typename` para resolver subjects tipados
4. **Subjects com campos usam union type** — ao inves de literal simples `'Project'`, use `'Project' | ProjectSchema` para habilitar autocompletion nos condicionais
5. **Agrupe acoes na mesma subject** — quando multiplas acoes se aplicam a mesma entidade sem condicional, use array: `can(['create', 'get'], 'Project')`
6. **Condicionais de ownership usam o terceiro parametro** — `can(['update', 'delete'], 'Project', { ownerId: { $eq: userId } })` para restringir por dono

## How to write

### Modelo de entidade para permissao

```typescript
import { z } from 'zod'

export const projectSchema = z.object({
  __typename: z.literal('Project').default('Project'),
  id: z.string(),
  ownerId: z.string(),
})

export type Project = z.infer<typeof projectSchema>
```

### Subject com union type

```typescript
type AppSubjects =
  | 'User'
  | 'Project' | Project
  | 'Organization' | Organization
```

### Condicional de ownership

```typescript
// Acoes livres (sem condicional)
can(['create', 'get'], 'Project')

// Acoes restritas ao dono
can(['update', 'delete'], 'Project', { ownerId: { $eq: userId } })
```

### detectSubjectType no builder

```typescript
const builder = createMongoAbility<AppAbilities>({
  detectSubjectType: (subject) => subject.__typename,
})
```

## Example

**Before (sem condicionais, sem tipagem):**
```typescript
// Subject como literal simples — sem autocompletion nos campos
type Subjects = 'Project' | 'Organization'

// Sem condicional — qualquer membro pode deletar qualquer projeto
can('delete', 'Project')
```

**After (com condicionais tipadas):**
```typescript
const projectSchema = z.object({
  __typename: z.literal('Project').default('Project'),
  id: z.string(),
  ownerId: z.string(),
})

type Subjects = 'Project' | z.infer<typeof projectSchema>

// Somente o dono pode deletar
can(['update', 'delete'], 'Project', { ownerId: { $eq: userId } })
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Entidade tem condicional de permissao | Crie modelo Zod com `__typename` e os campos da condicional |
| Entidade so aparece como literal (sem condicional) | Mantenha como string literal simples |
| Multiplas acoes sem condicional na mesma subject | Agrupe em array: `can(['create', 'get'], 'Subject')` |
| Campo do banco nao e usado em permissao | Nao inclua no modelo de entidade |
| Operadores de comparacao complexos | Use sintaxe MongoDB: `$eq`, `$ne`, `$in`, `$all`, `$not` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Modelo de permissao com todas as colunas do banco | Modelo com apenas campos usados em condicionais |
| `can('update', 'Project')` sem condicional para acoes destrutivas | `can('update', 'Project', { ownerId: { $eq: userId } })` |
| Subject apenas como literal quando tem condicional | Union: `'Project' \| Project` |
| `as any` para forcar tipagem de condicionais | `detectSubjectType` + `__typename` |
| `can('create', 'Project'); can('get', 'Project')` separados | `can(['create', 'get'], 'Project')` agrupados |

## Troubleshooting

### Permissao retorna resultado inesperado
**Symptom:** `ability.can()` retorna valor incorreto
**Cause:** A role do usuario nao esta mapeada corretamente ou o subject nao tem __typename
**Fix:** Verifique que `defineAbilityFor` recebe o usuario com role correta e que objetos tem `__typename`

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

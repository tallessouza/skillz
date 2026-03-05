---
name: rs-saas-nextjs-rbac-tipagem-permissoes
description: "Enforces Zod-based permission typing patterns for RBAC systems when writing authorization code. Use when user asks to 'create permissions', 'define roles', 'type RBAC', 'setup authorization', or 'define subjects and abilities'. Applies Zod tuples for fixed-size arrays, unions for permission variants, literals for specific string values, and z.infer for type extraction. Make sure to use this skill whenever building permission or authorization systems in TypeScript. Not for runtime validation logic, API route guards, or middleware authorization checks."
---

# Tipagem de Permissoes com Zod para RBAC

> Permissoes sao tuplas tipadas com Zod: cada uma eh um par fixo [acao, recurso] onde acoes e recursos sao literals, nunca strings genericas.

## Rules

1. **Use tuplas, nao arrays** — `z.tuple([action, subject])` nao `z.array(z.string())`, porque permissoes sempre tem exatamente 2 posicoes (acao + recurso) e tuplas garantem isso em tempo de compilacao
2. **Use z.literal para valores especificos** — `z.literal('create')` nao `z.string()`, porque unions de literals geram autocomplete e impedem valores invalidos
3. **Use z.union para opcoes** — `z.union([z.literal('create'), z.literal('delete')])` para agrupar acoes permitidas por subject, porque isso gera o tipo exato da uniao
4. **Extraia tipos com z.infer** — `type Role = z.infer<typeof roleSchema>` nao `type Role = 'admin' | 'member'`, porque a fonte de verdade eh o schema Zod, nao o tipo manual
5. **Centralize roles como schema reutilizavel** — exporte `rolesSchema` e `type Role` de um unico lugar, porque roles sao usadas em permissoes E em models de usuario
6. **Agrupe abilities com z.union de subjects** — `z.union([projectSubject, userSubject, ...])` nao arrays manuais, porque o Zod valida e tipa todas as combinacoes possiveis

## How to write

### Subject com tupla e literals

```typescript
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
```

### Roles centralizadas

```typescript
export const rolesSchema = z.union([
  z.literal('ADMIN'),
  z.literal('MEMBER'),
  z.literal('BILLING'),
])

export type Role = z.infer<typeof rolesSchema>
```

### AppAbilities agregando todos os subjects

```typescript
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

## Example

**Before (tipos manuais frageis):**
```typescript
type Action = 'create' | 'delete' | 'manage'
type Subject = 'Project' | 'User'
type Permission = [Action, Subject]
type Role = 'ADMIN' | 'MEMBER'
```

**After (com Zod):**
```typescript
export const projectSubject = z.tuple([
  z.union([z.literal('manage'), z.literal('create'), z.literal('delete')]),
  z.literal('Project'),
])
type ProjectSubject = z.infer<typeof projectSubject>

export const rolesSchema = z.union([
  z.literal('ADMIN'),
  z.literal('MEMBER'),
])
export type Role = z.infer<typeof rolesSchema>
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Array sempre tem N posicoes fixas | Use `z.tuple()` |
| String so aceita valores especificos | Use `z.literal()` dentro de `z.union()` |
| Tipo duplicado entre permissoes e models | Extraia schema compartilhado (ex: rolesSchema) |
| Subject nao eh tabela no banco | Tudo bem — subject eh recurso gerenciavel, nao necessariamente entidade persistida |
| Permissao granular (ex: transfer_ownership vs update) | Crie literal separado, nao reutilize update |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `type Permission = [string, string]` | `z.tuple([z.union([...literals]), z.literal('Subject')])` |
| `type Role = string` | `z.union([z.literal('ADMIN'), z.literal('MEMBER')])` |
| Duplicar roles em permissoes e models | Exportar `rolesSchema` de arquivo central |
| `action: 'update'` para tudo | Criar literals granulares: `transfer_ownership`, `revoke` |
| `z.array(z.string())` para permissoes | `z.tuple()` com literals exatos |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

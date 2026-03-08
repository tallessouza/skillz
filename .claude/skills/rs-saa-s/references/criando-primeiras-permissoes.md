---
name: rs-saas-nextjs-rbac-primeiras-permissoes
description: "Applies CASL permission patterns when writing TypeScript RBAC code. Use when user asks to 'create permissions', 'define abilities', 'setup RBAC', 'configure authorization', or 'use CASL'. Enforces correct usage of manage/all reserved words, AbilityBuilder pattern, can/cannot API, and ability.can()/cannot() checks. Make sure to use this skill whenever implementing role-based access control or authorization logic in TypeScript/Node.js projects. Not for authentication, login flows, or session management."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: saa-s-next-js-rbac
  module: permissoes
  tags: [saas, nextjs, casl, rbac, permissions]
---

# Permissoes com CASL — Primeiros Passos

> Definir permissoes com CASL usando AbilityBuilder, reservando `manage` para todas as acoes e `all` para todas as entidades.

## Rules

1. **`manage` e `all` sao palavras reservadas do CASL** — `manage` significa todas as acoes, `all` significa todas as entidades, porque o CASL usa internamente para conceder permissao total
2. **Por padrao, usuario nao pode nada** — so use `cannot` para criar excecoes a permissoes ja concedidas com `can`, porque sem `can` explicito a permissao ja e negada
3. **Defina actions e subjects como union types** — `type Actions = 'manage' | 'invite' | 'delete'`, porque o TypeScript autocompleta e previne typos
4. **Use o padrao can-geral + cannot-excecao** — conceda permissao ampla com `can`, depois restrinja grupo especifico com `cannot`, porque e mais legivel que listar cada permissao individual
5. **Exporte o resultado de `build()`** — nunca exporte o builder diretamente, porque o ability finalizado e imutavel e seguro para consumo
6. **Cheque permissoes com `ability.can()` e `ability.cannot()`** — use `can` para verificar permissao positiva e `cannot` para verificar negacao explicita, porque ambos retornam boolean

## How to write

### Definindo Actions e Subjects

```typescript
import { AbilityBuilder, createMongoAbility } from '@casl/ability'

// Actions: verbos que representam operacoes
// 'manage' = TODAS as acoes (reservado CASL)
type Actions = 'manage' | 'invite' | 'delete'

// Subjects: entidades do sistema
// 'all' = TODAS as entidades (reservado CASL)
type Subjects = 'User' | 'Article' | 'all'

const createAppAbility = createMongoAbility<[Actions, Subjects]>
```

### Construindo permissoes com AbilityBuilder

```typescript
const builder = new AbilityBuilder(createAppAbility)
const { can, cannot, build } = builder

// Concede permissao
can('invite', 'User')

// Nega permissao (excecao a uma regra mais ampla)
cannot('delete', 'User')

// Exporta ability finalizado
export const ability = build()
```

### Checando permissoes

```typescript
ability.can('invite', 'User')    // true
ability.can('delete', 'User')    // false
ability.cannot('delete', 'User') // true
```

## Example

**Before (sem CASL, verificacao manual):**
```typescript
const permissions = { canInvite: true, canDelete: false }
if (permissions.canInvite) { /* ... */ }
```

**After (com CASL, tipado e extensivel):**
```typescript
import { AbilityBuilder, createMongoAbility } from '@casl/ability'

type Actions = 'manage' | 'invite' | 'delete'
type Subjects = 'User' | 'all'

const createAppAbility = createMongoAbility<[Actions, Subjects]>
const { can, cannot, build } = new AbilityBuilder(createAppAbility)

can('invite', 'User')
cannot('delete', 'User')

export const ability = build()

// Uso:
ability.can('invite', 'User')    // true
ability.can('delete', 'User')    // false
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Role de admin que pode tudo | `can('manage', 'all')` |
| Permissao ampla com excecao | `can('manage', 'User')` + `cannot('delete', 'User')` |
| Verificar se usuario NAO pode | Use `ability.cannot()` em vez de `!ability.can()` |
| Nova entidade no sistema | Adicione ao union type `Subjects` |
| Nova acao no sistema | Adicione ao union type `Actions` |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `cannot('delete', 'User')` sem nenhum `can` antes | Nao precisa — por padrao ja e negado |
| `can('invite', 'User'); can('delete', 'User'); can('manage', 'User')` | `can('manage', 'User')` — manage ja inclui tudo |
| Exportar o `builder` diretamente | Exportar `build()` — ability imutavel |
| `if (!ability.can('delete', 'User'))` | `if (ability.cannot('delete', 'User'))` |
| Strings livres sem union type | Union types tipados para actions e subjects |

## Troubleshooting

### Permissao retorna resultado inesperado
**Symptom:** `ability.can()` retorna valor incorreto
**Cause:** A role do usuario nao esta mapeada corretamente ou o subject nao tem __typename
**Fix:** Verifique que `defineAbilityFor` recebe o usuario com role correta e que objetos tem `__typename`

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

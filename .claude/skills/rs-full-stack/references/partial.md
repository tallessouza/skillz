---
name: rs-full-stack-partial
description: "Applies TypeScript Partial utility type when generating code that updates or patches objects. Use when user asks to 'update an object', 'patch entity', 'edit partial fields', 'make properties optional', or 'create update function'. Ensures Partial of T is used instead of duplicating interfaces or marking fields optional manually. Make sure to use this skill whenever generating update/patch logic for typed objects. Not for creating new entities from scratch, form validation schemas, or Zod/class-validator definitions."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: typescript
  tags: [typescript, partial, utility-types, update, tipagem]
---

# TypeScript Partial

> Ao atualizar objetos tipados, use `Partial<T>` para tornar propriedades opcionais sem duplicar interfaces.

## Rules

1. **Use `Partial<T>` para updates/patches** — `Partial<User>` nao `UpdateUser`, porque evita duplicacao de interfaces e mantém sincronia automatica com o tipo original
2. **Nunca duplique interfaces para cenarios de update** — se a interface original muda, a copia fica dessincronizada silenciosamente
3. **Nunca torne campos opcionais na interface original so para acomodar updates** — a interface original deve refletir os requisitos reais da entidade
4. **Preserve a interface original intacta** — `Partial` nao modifica o tipo original, apenas cria uma versao derivada com tudo opcional
5. **Combine com `Pick` quando apenas alguns campos sao atualizaveis** — `Partial<Pick<User, 'name' | 'email'>>` para restringir quais campos aceitam update

## How to write

### Update de entidade

```typescript
interface User {
  id: number
  name: string
  email: string
}

// Criacao: todos os campos obrigatorios
const newUser: User = { id: 1, name: "Rodrigo", email: "rodrigo@email.com" }

// Update: so os campos que mudaram
const updatedUser: Partial<User> = { name: "Rodrigo Gonçalves" }
```

### Funcao de update tipada

```typescript
function updateUser(id: number, fields: Partial<User>): User {
  const existing = findUserById(id)
  return { ...existing, ...fields }
}

// Qualquer combinacao de campos e valida
updateUser(1, { name: "Novo Nome" })
updateUser(1, { email: "novo@email.com" })
updateUser(1, { name: "Novo", email: "novo@email.com" })
```

## Example

**Before (interface duplicada):**
```typescript
interface User {
  id: number
  name: string
  email: string
}

// Duplicacao desnecessaria
interface UpdateUser {
  id?: number
  name?: string
  email?: string
}

function updateUser(id: number, fields: UpdateUser) { /* ... */ }
```

**After (com Partial):**
```typescript
interface User {
  id: number
  name: string
  email: string
}

function updateUser(id: number, fields: Partial<User>) { /* ... */ }
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Funcao recebe subset de campos para update | `Partial<T>` |
| Apenas alguns campos sao editaveis | `Partial<Pick<T, 'field1' \| 'field2'>>` |
| Todos os campos sao obrigatorios na criacao | Interface normal, sem `?` |
| Form de edicao que envia apenas campos alterados | `Partial<T>` no payload |
| Merge de objeto existente com campos novos | `{ ...existing, ...partial }` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `interface UpdateUser { name?: string; email?: string }` | `Partial<User>` |
| Tornar campos opcionais na interface original | Manter original intacta + usar `Partial` |
| `fields: any` em funcao de update | `fields: Partial<User>` |
| Criar tipo manualmente com todos `?` | `Partial<T>` automatiza isso |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| `Partial<User>` permite objeto completamente vazio | Partial torna TUDO opcional, incluindo campos obrigatorios | Use `Partial<Pick<User, 'name' \| 'email'>>` para restringir campos atualizaveis |
| Tipo original ficou com campos opcionais | Modificou a interface original ao inves de usar Partial | Mantenha a interface original intacta e use `Partial<T>` apenas no parametro |
| Spread nao sobrescreve propriedade | Ordem do spread esta invertida | `{ ...existing, ...partial }` — o partial deve vir por ultimo |
| Autocomplete nao mostra campos do Partial | IDE nao inferiu o tipo corretamente | Verifique se o tipo generico esta sendo passado: `Partial<User>` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-partial/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-partial/references/code-examples.md)

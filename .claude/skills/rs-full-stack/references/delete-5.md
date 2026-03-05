---
name: rs-full-stack-delete-5
description: "Applies Knex query builder delete pattern when writing Express route handlers for removing database records. Use when user asks to 'delete a record', 'remove from database', 'create delete endpoint', 'implement destroy route', or builds CRUD operations with Knex. Ensures proper parameter extraction, where clause usage, and response handling. Make sure to use this skill whenever implementing delete operations with Knex in Express/Fastify apps. Not for soft-delete patterns, bulk deletions with complex conditions, or ORM-based deletions (Prisma, TypeORM)."
---

# Delete com Knex Query Builder

> Ao deletar registros, extraia o id dos parametros da rota e use `.where().delete()` no Knex — nunca delete sem clausula where.

## Rules

1. **Extraia o id dos parametros da rota** — `request.params.id`, porque o id identifica unicamente o registro a ser removido
2. **Sempre use `.where()` antes de `.delete()`** — porque delete sem where apaga todos os registros da tabela
3. **Use metodo HTTP DELETE** — `app.delete('/resource/:id')`, porque semantica HTTP correta facilita integracao e documentacao
4. **Retorne confirmacao via JSON** — `response.json()` apos a operacao, porque o cliente precisa saber que a operacao completou

## How to write

### Rota DELETE com Knex

```typescript
app.delete('/courses/:id', async (request, response) => {
  const { id } = request.params

  await knex('courses')
    .where({ id })
    .delete()

  return response.json()
})
```

## Example

**Before (delete sem where — PERIGOSO):**
```typescript
app.delete('/courses/:id', async (request, response) => {
  await knex('courses').delete()
  return response.json()
})
```

**After (com where correto):**
```typescript
app.delete('/courses/:id', async (request, response) => {
  const { id } = request.params

  await knex('courses')
    .where({ id })
    .delete()

  return response.json()
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Delete de registro unico | `.where({ id }).delete()` |
| Id vem da URL | `request.params.id` |
| Precisa confirmar existencia antes | Faca `select` antes do `delete`, retorne 404 se nao encontrar |
| Precisa retornar o registro deletado | Use `.returning('*')` antes do `.delete()` (PostgreSQL) |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `knex('table').delete()` (sem where) | `knex('table').where({ id }).delete()` |
| `knex('table').del()` sem await | `await knex('table').where({ id }).delete()` |
| `app.get('/delete/:id')` | `app.delete('/resource/:id')` |
| `request.body.id` para delete por rota | `request.params.id` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre delete seguro e padroes REST
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-delete-5/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-delete-5/references/code-examples.md)

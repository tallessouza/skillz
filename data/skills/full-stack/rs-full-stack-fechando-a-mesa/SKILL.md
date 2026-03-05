---
name: rs-full-stack-fechando-a-mesa
description: "Applies table session closing pattern with Knex when building restaurant API endpoints. Use when user asks to 'close a session', 'update status to closed', 'implement checkout endpoint', or 'close a table'. Enforces existence check, already-closed guard, and filtered update with knex.fn.now(). Make sure to use this skill whenever implementing session/table closing logic in Node.js APIs with Knex. Not for opening sessions, listing sessions, or frontend table management UI."
---

# Fechando a Mesa (Session Close Endpoint)

> Ao fechar uma sessao, valide existencia e estado antes de atualizar, e filtre o update pelo ID para nao afetar outros registros.

## Rules

1. **Sempre verifique se o recurso existe antes de operar** — busque pelo ID com `.first()` e lance erro se nao encontrar, porque operacoes em registros inexistentes causam bugs silenciosos
2. **Valide o estado atual antes de mudar** — verifique `closedAt` antes de fechar, porque fechar uma sessao ja fechada sobrescreve o timestamp original
3. **Sempre filtre o update pelo ID** — nunca faca update sem `.where()`, porque sem filtro o Knex atualiza TODOS os registros da tabela
4. **Use `knex.fn.now()` para timestamps do banco** — porque garante consistencia com o timezone do servidor de banco, nao da aplicacao

## How to write

### Buscar e validar existencia

```typescript
const session = await knex<TablesSession>("tables_sessions")
  .where({ id })
  .first()

if (!session) {
  throw new AppError("Session table not found")
}
```

### Validar estado (guard clause)

```typescript
if (session.closedAt) {
  throw new AppError("This session table is already closed")
}
```

### Update filtrado com timestamp

```typescript
await knex<TablesSession>("tables_sessions")
  .update({ closedAt: knex.fn.now() })
  .where({ id })
```

## Example

**Before (sem validacoes):**
```typescript
app.patch("/sessions/:id/close", async (req, res) => {
  await knex("tables_sessions")
    .update({ closedAt: new Date() })
  return res.json()
})
```

**After (com este skill aplicado):**
```typescript
app.patch("/sessions/:id/close", async (req, res) => {
  const { id } = req.params

  const session = await knex<TablesSession>("tables_sessions")
    .where({ id })
    .first()

  if (!session) {
    throw new AppError("Session table not found")
  }

  if (session.closedAt) {
    throw new AppError("This session table is already closed")
  }

  await knex<TablesSession>("tables_sessions")
    .update({ closedAt: knex.fn.now() })
    .where({ id })

  return res.status(200).json()
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Endpoint que muda estado de um registro | Valide existencia + estado atual antes |
| Precisa de timestamp de "quando aconteceu" | Use `knex.fn.now()` no banco |
| Update em tabela | Sempre inclua `.where()` com ID |
| Registro ja processado | Lance erro, nao reprocesse silenciosamente |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|------------------|
| `await knex("table").update({...})` sem where | `await knex("table").update({...}).where({ id })` |
| `new Date()` para closedAt no banco | `knex.fn.now()` |
| Update sem verificar existencia | `.first()` + check + update |
| Permitir fechar sessao ja fechada | Guard clause com `session.closedAt` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre validacoes e ordenacao por closedAt
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
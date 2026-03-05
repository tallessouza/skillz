# Code Examples: Fechando a Mesa

## Exemplo completo do endpoint (como mostrado na aula)

```typescript
import { Knex } from "knex"

interface TablesSession {
  id: number
  tableId: number
  closedAt: string | null
  createdAt: string
  updatedAt: string
}

// PATCH /sessions/:id/close
app.patch("/sessions/:id/close", async (request, response) => {
  const { id } = request.params

  // 1. Buscar sessao
  const session = await knex<TablesSession>("tables_sessions")
    .where({ id })
    .first()

  // 2. Validar existencia
  if (!session) {
    throw new AppError("Session table not found")
  }

  // 3. Validar estado
  if (session.closedAt) {
    throw new AppError("This session table is already closed")
  }

  // 4. Fechar sessao
  await knex<TablesSession>("tables_sessions")
    .update({ closedAt: knex.fn.now() })
    .where({ id })

  return response.status(200).json()
})
```

## Variacao: Retornando a sessao atualizada

```typescript
await knex<TablesSession>("tables_sessions")
  .update({ closedAt: knex.fn.now() })
  .where({ id })

const updatedSession = await knex<TablesSession>("tables_sessions")
  .where({ id })
  .first()

return response.json(updatedSession)
```

## Variacao: Com returning (PostgreSQL)

```typescript
const [closedSession] = await knex<TablesSession>("tables_sessions")
  .update({ closedAt: knex.fn.now() })
  .where({ id })
  .returning("*")

return response.json(closedSession)
```

## Cenarios de teste mencionados na aula

### Sessao inexistente
```
PATCH /sessions/3/close
→ 400 "Session table not found"
```

### Sessao aberta (sucesso)
```
PATCH /sessions/1/close
→ 200 OK
```

### Sessao ja fechada (guard)
```
PATCH /sessions/1/close  (segunda vez)
→ 400 "This session table is already closed"
```

## Listagem com ordenacao por closedAt

O instrutor mostra que apos fechar, a sessao vai para o final da lista:

```typescript
// GET /sessions (index)
const sessions = await knex<TablesSession>("tables_sessions")
  .orderBy("closedAt", "asc") // NULLs first = abertas no topo
```

## Padrao generico reutilizavel: fetch-validate-update

```typescript
async function closeResource(
  knex: Knex,
  table: string,
  id: string,
  closedField: string = "closedAt"
) {
  const resource = await knex(table).where({ id }).first()

  if (!resource) {
    throw new AppError(`${table} not found`)
  }

  if (resource[closedField]) {
    throw new AppError(`This ${table} is already closed`)
  }

  await knex(table)
    .update({ [closedField]: knex.fn.now() })
    .where({ id })
}
```
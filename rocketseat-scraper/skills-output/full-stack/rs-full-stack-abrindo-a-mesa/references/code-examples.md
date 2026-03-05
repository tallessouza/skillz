# Code Examples: Abrindo Sessao de Mesa

## Exemplo 1: Rota completa de abertura de sessao

```typescript
import { z } from "zod"
import { knex } from "@/database/knex"

// Tipagem da tabela (em database/types/tables-sessions-repository.d.ts)
type TablesSessionsRepository = {
  id: number
  table_id: number
  opened_at: number
  closed_at: number
}

app.post("/table-sessions", async (request, response) => {
  const bodySchema = z.object({
    table_id: z.number(),
  })

  const { table_id } = bodySchema.parse(request.body)

  await knex<TablesSessionsRepository>("tables_sessions").insert({
    table_id,
    opened_at: knex.fn.now(),
  })

  return response.status(201).json()
})
```

## Exemplo 2: Testando no Insomnia

### Request sem body (falha no Zod):
```
POST /table-sessions
Body: (vazio)
→ Resposta: erro de validacao Zod (table_id required)
```

### Request com tipo errado (falha no Zod):
```json
POST /table-sessions
Body: { "table_id": "texto qualquer" }
// → Resposta: erro de validacao (expected number, received string)
```

### Request com mesa valida (sucesso):
```json
POST /table-sessions
Body: { "table_id": 2 }
// → Resposta: 201 Created
```

### Request com mesa inexistente (falha na FK):
```json
POST /table-sessions
Body: { "table_id": 114 }
// → Resposta: erro de restricao de chave estrangeira
```

## Exemplo 3: Verificando o registro no banco

```sql
SELECT * FROM tables_sessions;
-- Resultado:
-- id | table_id | opened_at           | closed_at
-- 1  | 2        | 2024-01-15 10:30:00 | NULL
```

O `closed_at` fica `NULL` porque a sessao esta aberta. Sera atualizado quando a mesa for fechada.

## Exemplo 4: Shorthand de propriedade no insert

```typescript
// Redundante — repete o nome:
await knex("tables_sessions").insert({
  table_id: table_id,
})

// Correto — shorthand quando variavel tem mesmo nome da coluna:
await knex("tables_sessions").insert({
  table_id,
})
```

## Exemplo 5: Arquivo de tipagem dedicado

```typescript
// database/types/tables-sessions-repository.d.ts
type TablesSessionsRepository = {
  id: number
  table_id: number
  opened_at: number
  closed_at: number
}
```

Pattern: um arquivo `.d.ts` por tabela, nomeado como `{tabela}-repository.d.ts`.

## Variacao: Insert com retorno do ID

```typescript
const [sessionId] = await knex<TablesSessionsRepository>("tables_sessions")
  .insert({
    table_id,
    opened_at: knex.fn.now(),
  })
  .returning("id")

return response.status(201).json({ session_id: sessionId })
```

## Variacao: Tratando erro de FK explicitamente

```typescript
try {
  await knex<TablesSessionsRepository>("tables_sessions").insert({
    table_id,
    opened_at: knex.fn.now(),
  })
  return response.status(201).json()
} catch (error) {
  if (error.message.includes("FOREIGN KEY constraint failed")) {
    return response.status(404).json({ message: "Table not found" })
  }
  throw error
}
```
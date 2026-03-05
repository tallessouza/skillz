# Code Examples: Listando Sessoes Das Mesas

## Exemplo completo do controller

```typescript
import { Request, Response, NextFunction } from "express"
import { knex } from "@/database/knex"

class TableSessionsController {
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      // ... metodo create ja existente (recolhido na aula)
    } catch (error) {
      next(error)
    }
  }

  async index(request: Request, response: Response, next: NextFunction) {
    try {
      const sessions = await knex("table_sessions").orderBy("closed_at")

      return response.json(sessions)
    } catch (error) {
      next(error)
    }
  }
}

export { TableSessionsController }
```

## Arquivo de rotas

```typescript
import { Router } from "express"
import { TableSessionsController } from "@/controllers/TableSessionsController"

const tableSessionRoutes = Router()
const tableSessionController = new TableSessionsController()

tableSessionRoutes.post("/", tableSessionController.create)
tableSessionRoutes.get("/", tableSessionController.index)

export { tableSessionRoutes }
```

## Variacoes com select

### Todas as colunas (padrao)

```typescript
const sessions = await knex("table_sessions").orderBy("closed_at")
// SQL: SELECT * FROM table_sessions ORDER BY closed_at
```

### Colunas especificas

```typescript
const sessions = await knex("table_sessions")
  .select("id", "table_id")
  .orderBy("closed_at")
// SQL: SELECT id, table_id FROM table_sessions ORDER BY closed_at
```

### Multiplas colunas selecionadas

```typescript
const sessions = await knex("table_sessions")
  .select("id", "table_id", "closed_at", "created_at")
  .orderBy("closed_at")
```

## Variacoes de orderBy

### Ordem descendente

```typescript
const sessions = await knex("table_sessions").orderBy("closed_at", "desc")
```

### Multiplas colunas de ordenacao

```typescript
const sessions = await knex("table_sessions")
  .orderBy("closed_at", "desc")
  .orderBy("created_at", "asc")
```

## Teste no Insomnia

### Request de listagem

```
GET {{base_url}}/table-sessions
```

### Response esperado (todas as colunas)

```json
[
  {
    "id": "uuid-1",
    "table_id": "uuid-mesa-1",
    "closed_at": null,
    "created_at": "2024-01-01T10:00:00.000Z",
    "updated_at": "2024-01-01T10:00:00.000Z"
  }
]
```

### Response com select("id", "table_id")

```json
[
  {
    "id": "uuid-1",
    "table_id": "uuid-mesa-1"
  }
]
```

## Erro comum: typo no nome da tabela

```typescript
// ERRADO — vai causar erro em runtime
const sessions = await knex("table_session").orderBy("closed_at")

// CORRETO — nome da tabela no plural
const sessions = await knex("table_sessions").orderBy("closed_at")
```

Dica: considere usar constantes para evitar typos:

```typescript
const TABLES = {
  TABLE_SESSIONS: "table_sessions",
  TABLES: "tables",
} as const

const sessions = await knex(TABLES.TABLE_SESSIONS).orderBy("closed_at")
```
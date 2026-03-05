# Code Examples: Metodo de Insert com Query Builder

## 1. Setup completo do modulo de conexao

```typescript
// src/database/connect.ts
import knect from "knex"
import config from "../../knexfile"

// Exporta instancia unica de conexao
export const knex = knect(config)
```

```typescript
// knexfile.ts (referencia — criado na aula de migrations)
import type { Knex } from "knex"

const config: Knex.Config = {
  client: "sqlite3",
  connection: {
    filename: "./db/app.db",
  },
  useNullAsDefault: true,
}

export default config
```

## 2. Rota POST basica (exatamente como na aula)

```typescript
// src/server.ts
import fastify from "fastify"
import { knex } from "./database/connect"

const app = fastify()

app.post("/courses", async (request, reply) => {
  const { name } = request.body

  await knex("courses").insert({ name })

  return reply.status(201).send()
})
```

## 3. Testando com Insomnia/HTTP client

```http
POST http://localhost:3333/courses
Content-Type: application/json

{
  "name": "javascript"
}
```

Resposta esperada: `201 Created` com body vazio.

## 4. Verificando no banco (como o instrutor mostrou)

```sql
SELECT * FROM courses;
```

Resultado:
| id | name | created_at | updated_at |
|----|------|------------|------------|
| 1 | javascript | 2024-01-01 12:00:00 | 2024-01-01 12:00:00 |

## 5. Variacoes uteis

### Insert com multiplas colunas

```typescript
app.post("/courses", async (request, reply) => {
  const { name, description, durationInHours } = request.body

  await knex("courses").insert({
    name,
    description,
    duration_in_hours: durationInHours,
  })

  return reply.status(201).send()
})
```

### Insert retornando o ID criado (PostgreSQL)

```typescript
const [{ id }] = await knex("courses")
  .insert({ name })
  .returning("id")

return reply.status(201).send({ id })
```

### Insert de multiplos registros

```typescript
await knex("courses").insert([
  { name: "javascript" },
  { name: "typescript" },
  { name: "react" },
])
```

### Insert com tratamento de erro

```typescript
app.post("/courses", async (request, reply) => {
  const { name } = request.body

  try {
    await knex("courses").insert({ name })
    return reply.status(201).send()
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return reply.status(409).send({ error: "Course already exists" })
    }
    throw error
  }
})
```
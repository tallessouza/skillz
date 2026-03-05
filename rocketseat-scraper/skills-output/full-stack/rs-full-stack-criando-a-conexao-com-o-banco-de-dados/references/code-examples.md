# Code Examples: Conexao com Banco de Dados via Knex

## Exemplo da aula — arquivo completo

```typescript
// src/database/knex.ts
import knexConfig from "knex"
import { config } from "../../knexfile"

export const knex = knexConfig(config)
```

## Variacao: com tipagem explicita

```typescript
// src/database/knex.ts
import knexConfig, { Knex } from "knex"
import { config } from "../../knexfile"

export const knex: Knex = knexConfig(config)
```

## Variacao: knexfile com multiplos ambientes

```typescript
// knexfile.ts
export const config = {
  client: "sqlite3",
  connection: {
    filename: "./db/app.db",
  },
  useNullAsDefault: true,
  migrations: {
    directory: "./src/database/migrations",
  },
}
```

```typescript
// src/database/knex.ts
import knexConfig from "knex"
import { config } from "../../knexfile"

export const knex = knexConfig(config)
```

## Uso em rotas

```typescript
// src/routes/users.ts
import { knex } from "../database/knex"

export async function usersRoutes(app: FastifyInstance) {
  app.get("/users", async () => {
    const users = await knex("users").select("*")
    return { users }
  })

  app.post("/users", async (request, reply) => {
    const { name, email } = request.body as { name: string; email: string }
    await knex("users").insert({ name, email })
    return reply.status(201).send()
  })
}
```

## Uso com transacoes

```typescript
import { knex } from "../database/knex"

await knex.transaction(async (trx) => {
  await trx("orders").insert({ userId, total })
  await trx("inventory").decrement("quantity", 1).where("productId", productId)
})
```

## Pattern: query builder encadeado

```typescript
import { knex } from "../database/knex"

const activeUsers = await knex("users")
  .select("id", "name", "email")
  .where("active", true)
  .orderBy("created_at", "desc")
  .limit(10)
```
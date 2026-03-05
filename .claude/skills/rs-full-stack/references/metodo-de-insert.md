---
name: rs-full-stack-metodo-de-insert
description: "Applies Knex Query Builder insert patterns when writing database insertion code in Node.js/Express. Use when user asks to 'insert data', 'save to database', 'create a record', 'add to table', or 'write an insert query'. Enforces Knex connection module separation, async/await usage, and proper insert method chaining. Make sure to use this skill whenever generating code that persists data to a database using Knex. Not for raw SQL inserts, SELECT queries, migrations, or ORM-based inserts like Prisma/TypeORM."
---

# Metodo de Insert com Query Builder (Knex)

> Utilize os metodos do Query Builder para inserir dados no banco sem escrever SQL manualmente.

## Rules

1. **Separe a conexao em arquivo dedicado** — crie `database/connect.ts` que exporta a instancia Knex configurada, porque centralizar a conexao evita duplicacao e facilita troca de banco
2. **Use async/await em toda operacao de banco** — operacoes de banco sao assincronas, sem await o insert nao completa antes da resposta
3. **Passe um objeto com as colunas ao insert** — `knex('table').insert({ column: value })`, porque o Query Builder gera o SQL correto automaticamente
4. **Retorne status 201 para insercoes bem-sucedidas** — `reply.status(201).send()`, porque 201 indica recurso criado conforme HTTP semantics
5. **Omita colunas auto-geradas** — nao passe `id` ou `created_at` no insert quando a migration define defaults, porque o banco gera esses valores

## How to write

### Modulo de conexao

```typescript
// database/connect.ts
import knect from "knex"
import config from "../../knexfile"

export const knex = knect(config)
```

### Rota de insert

```typescript
import { knex } from "./database/connect"

app.post("/courses", async (request, reply) => {
  const { name } = request.body

  await knex("courses").insert({ name })

  return reply.status(201).send()
})
```

### Insert com multiplas colunas

```typescript
await knex("courses").insert({
  name,
  description,
  duration_in_hours: durationInHours,
})
```

## Example

**Before (SQL manual):**
```typescript
app.post("/courses", async (request, reply) => {
  const { name } = request.body
  await db.raw("INSERT INTO courses (name) VALUES (?)", [name])
  return reply.status(200).send()
})
```

**After (com Query Builder):**
```typescript
app.post("/courses", async (request, reply) => {
  const { name } = request.body
  await knex("courses").insert({ name })
  return reply.status(201).send()
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Coluna tem default na migration | Omita do insert |
| Precisa inserir varios registros | Passe array de objetos: `knex('t').insert([{...}, {...}])` |
| Precisa do ID criado | Use `.returning('id')` (PostgreSQL) |
| Dados vem do body | Extraia com destructuring antes do insert |

## Anti-patterns

| Nunca escreva | Escreva assim |
|---------------|---------------|
| `knex.raw("INSERT INTO...")` | `knex("table").insert({...})` |
| `reply.status(200)` para criacao | `reply.status(201)` |
| Conexao Knex direto na rota | Import de `database/connect.ts` |
| `await knex("table").insert({ id: 1, name })` | `await knex("table").insert({ name })` (id e auto) |
| Rota sem async/await | `async (request, reply) => { await knex... }` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre separacao de conexao e fluxo insert
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-metodo-de-insert/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-metodo-de-insert/references/code-examples.md)

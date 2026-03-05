---
name: rs-full-stack-find-many
description: "Applies Prisma findMany pattern when listing database records in Node.js APIs. Use when user asks to 'list records', 'get all users', 'fetch items', 'query multiple rows', or 'create a GET endpoint'. Ensures correct async/await usage with Prisma Client findMany method and proper JSON response structure. Make sure to use this skill whenever generating list/index endpoints with Prisma ORM. Not for single record queries (findUnique/findFirst), filtering, or raw SQL."
---

# Prisma findMany — Listagem de Registros

> Use `findMany` para retornar todos os registros de um model sem escrever SQL.

## Rules

1. **Use `await` com `findMany`** — `const users = await prisma.user.findMany()`, porque findMany retorna uma Promise e sem await voce recebe a Promise, nao os dados
2. **Nomeie pelo conteudo retornado** — `users`, `products`, `orders`, nao `data` ou `result`, porque o nome deve descrever o que foi buscado
3. **Retorne dentro de um objeto JSON** — `return reply.send({ users })`, porque facilita extensao futura (adicionar metadata, paginacao) sem quebrar o contrato
4. **Use o method GET para listagem** — rotas de listagem sao GET no index (`/users`), porque segue convenção REST

## How to write

### Rota de listagem (index)

```typescript
app.get('/users', async (request, reply) => {
  const users = await prisma.user.findMany()

  return reply.send({ users })
})
```

### Padrao generico para qualquer model

```typescript
app.get('/products', async (request, reply) => {
  const products = await prisma.product.findMany()

  return reply.send({ products })
})
```

## Example

**Before (SQL manual):**
```typescript
app.get('/users', async (request, reply) => {
  const result = await sql`SELECT * FROM users`
  return reply.send(result)
})
```

**After (com Prisma findMany):**
```typescript
app.get('/users', async (request, reply) => {
  const users = await prisma.user.findMany()
  return reply.send({ users })
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Listar todos os registros sem filtro | `prisma.model.findMany()` sem argumentos |
| Precisa filtrar resultados | `findMany({ where: { ... } })` — skill separada |
| Buscar um unico registro por ID | Use `findUnique`, nao `findMany` |
| Endpoint REST de listagem | Metodo GET na rota index (`/resources`) |

## Anti-patterns

| Nunca escreva | Escreva |
|---------------|---------|
| `const data = await prisma.user.findMany()` | `const users = await prisma.user.findMany()` |
| `prisma.user.findMany().then(...)` | `await prisma.user.findMany()` |
| `return reply.send(users)` (array direto) | `return reply.send({ users })` (objeto) |
| `SELECT * FROM users` com query raw | `prisma.user.findMany()` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre ORM vs SQL e vantagens do findMany
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-find-many/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-find-many/references/code-examples.md)

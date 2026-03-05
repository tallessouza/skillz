---
name: rs-api-com-bun-rota-cadastro-restaurante
description: "Applies Elysia route creation patterns when building REST API endpoints with Bun. Use when user asks to 'create a route', 'add an endpoint', 'handle POST request', 'insert with Drizzle', or 'return status code in Elysia'. Covers request context destructuring (body, set, params, query, cookie, store), Drizzle insert with returning, and multi-entity creation in single route. Make sure to use this skill whenever writing Elysia handlers or Drizzle insert operations. Not for frontend code, database schema design, or validation/typing (see dedicated typing skill)."
---

# Rotas no Elysia com Drizzle ORM

> Ao criar rotas no Elysia, desestruture o contexto para acessar body e set, use Drizzle insert com returning para encadear inserções dependentes, e retorne status codes semânticos via set.status.

## Rules

1. **Desestruture o contexto nos parâmetros do handler** — `({ body, set })` não `(ctx)`, porque acesso direto é mais legível e deixa explícito o que a rota usa
2. **Use set.status para definir o código de resposta** — `set.status = 204` não `return new Response(null, { status: 204 })`, porque Elysia usa set como mecanismo de resposta (não tem req/res separados)
3. **Use returning() no Drizzle quando precisa do ID inserido** — `db.insert(users).values({...}).returning({ id: users.id })`, porque evita query extra para buscar o registro
4. **Desestruture o array do returning** — `const [manager] = await db.insert(...)`, porque Drizzle sempre retorna array mesmo com insert único
5. **Cadastros dependentes: insira o pai primeiro** — manager antes de restaurant, porque o filho precisa do `managerId` que vem do returning do pai
6. **204 para sucesso sem corpo** — quando a rota não precisa retornar dados, use `set.status = 204` sem return

## How to write

### Rota POST com insert encadeado

```typescript
app.post('/restaurants', async ({ body, set }) => {
  const { restaurantName, managerName, email, phone } = body as any

  const [manager] = await db.insert(users).values({
    name: managerName,
    email,
    phone,
    role: 'manager',
  }).returning({ id: users.id })

  await db.insert(restaurants).values({
    name: restaurantName,
    managerId: manager.id,
  })

  set.status = 204
})
```

### Contexto disponível no handler Elysia

```typescript
app.get('/example', async ({ body, cookie, headers, params, path, query, request, set, store }) => {
  // body     → corpo da requisição (POST/PUT)
  // params   → parâmetros de rota (/users/:id → params.id)
  // query    → search params (?page=1 → query.page)
  // set      → define resposta (set.status, set.headers, set.redirect)
  // store    → estado compartilhado entre middlewares
  // cookie   → cookies da requisição
  // headers  → cabeçalhos da requisição
  // request  → objeto Request nativo (ip, etc.)
  // path     → caminho da requisição
})
```

## Example

**Before (padrão Express mental model):**
```typescript
app.post('/restaurants', async (req, res) => {
  const body = req.body
  await db.insert(users).values({ name: body.name })
  const user = await db.select().from(users).where(eq(users.email, body.email))
  await db.insert(restaurants).values({ managerId: user[0].id })
  res.status(204).send()
})
```

**After (Elysia + Drizzle idiomático):**
```typescript
app.post('/restaurants', async ({ body, set }) => {
  const { restaurantName, managerName, email, phone } = body as any

  const [manager] = await db.insert(users).values({
    name: managerName, email, phone, role: 'manager',
  }).returning({ id: users.id })

  await db.insert(restaurants).values({
    name: restaurantName,
    managerId: manager.id,
  })

  set.status = 204
})
```

## Heuristics

| Situação | Faça |
|----------|------|
| Rota que cria recurso sem retornar dados | `set.status = 204` |
| Rota que cria recurso e retorna ele | `set.status = 201` e retorne o objeto |
| Precisa do ID do registro inserido | Use `.returning({ id: table.id })` |
| Dois registros dependentes (pai-filho) | Insira pai com returning, depois filho com o ID |
| Body ainda sem tipagem | Use `as any` temporariamente, tipe depois com Elysia schema |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `(req, res) =>` no Elysia | `({ body, set }) =>` |
| `res.status(204).send()` | `set.status = 204` |
| Query extra para buscar ID após insert | `.returning({ id: table.id })` |
| `const result = await db.insert(...)` sem desestruturar | `const [record] = await db.insert(...).returning(...)` |
| Inserir filho antes do pai | Sempre insira o pai primeiro, use o ID no filho |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/api-com/rs-api-com-bun-rota-cadastro-de-restaurante/references/deep-explanation.md)
- [Code examples](../../../data/skills/api-com/rs-api-com-bun-rota-cadastro-de-restaurante/references/code-examples.md)

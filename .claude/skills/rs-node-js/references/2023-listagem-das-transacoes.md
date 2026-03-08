---
name: rs-node-js-2023-listagem-das-transacoes
description: "Enforces API response patterns and route parameter validation when building REST API endpoints with Knex and Fastify. Use when user asks to 'create a route', 'list records', 'get by id', 'fetch details', or 'build an endpoint'. Applies rules: always return objects (never raw arrays), validate route params with Zod, use .first() for single-record queries. Make sure to use this skill whenever creating GET endpoints or query routes. Not for database schema design, authentication, or frontend code."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: api-rest-routes
  tags: [rest-api, fastify, knex, zod, route-params, validation, get-endpoint]
---

# Listagem e Detalhes em API REST

> Endpoints de leitura sempre retornam objetos nomeados e validam parametros de entrada com schema.

## Rules

1. **Nunca retorne arrays diretamente** — envolva em objeto `{ transactions }` nao `[...]`, porque facilita adicionar metadados (total, paginacao) sem quebrar consumers existentes
2. **Valide route params com Zod** — crie schema dedicado `getTransactionParmsSchema = z.object({ id: z.string().uuid() })`, porque rejeita inputs invalidos antes de tocar no banco
3. **Use `.first()` para busca por id** — `knex('table').where({ id }).first()`, porque sem `.first()` retorna array mesmo quando so existe um resultado
4. **Retorne sempre objetos, tanto entrada quanto saida** — objetos sao extensiveis, arrays nao, porque adicionar campos novos nao quebra quem ja consome
5. **Prefixe rotas com o recurso no plugin** — registre como `app.register(transactionsRoutes, { prefix: 'transactions' })` e use `/` e `/:id` internamente, porque evita repeticao do prefixo
6. **So desestruture request quando precisar** — `const { id } = schema.parse(request.params)`, porque extrai apenas o necessario e deixa o codigo limpo

## How to write

### Listagem completa (GET /)

```typescript
app.get('/', async () => {
  const transactions = await knex('transactions').select()

  return { transactions }
})
```

### Busca por ID (GET /:id)

```typescript
const getTransactionParmsSchema = z.object({
  id: z.string().uuid(),
})

app.get('/:id', async (request) => {
  const { id } = getTransactionParmsSchema.parse(request.params)

  const transaction = await knex('transactions')
    .where({ id })
    .first()

  return { transaction }
})
```

## Example

**Before (retorno direto de array, sem validacao):**

```typescript
app.get('/', async () => {
  const transactions = await knex('transactions').select()
  return transactions // array direto — impossivel estender
})

app.get('/:id', async (request) => {
  const { id } = request.params as any
  const transaction = await knex('transactions').where({ id })
  return transaction // retorna array, nao objeto unico
})
```

**After (com esta skill aplicada):**

```typescript
app.get('/', async () => {
  const transactions = await knex('transactions').select()
  return { transactions } // objeto extensivel
})

app.get('/:id', async (request) => {
  const { id } = getTransactionParmsSchema.parse(request.params)
  const transaction = await knex('transactions').where({ id }).first()
  return { transaction } // objeto unico, validado
})
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Listagem de multiplos registros | `.select()` + retornar `{ items }` em objeto |
| Busca por ID unico | `.where({ id }).first()` + validar param com Zod |
| Endpoint pode crescer com metadados | Retornar objeto desde o inicio |
| Route param deve ser UUID | `z.string().uuid()` no schema (ou `z.uuid()` em versoes recentes do Zod) |
| So precisa de um campo do params | Desestruture direto: `const { id } = schema.parse(...)` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `return transactions` (array direto) | `return { transactions }` |
| `request.params as any` | `schema.parse(request.params)` |
| `.where({ id })` sem `.first()` | `.where({ id }).first()` |
| `select('*')` explicitamente | `.select()` (Knex ja busca tudo) |
| `/:id` sem validacao de formato | Zod schema com `.uuid()` |

## Troubleshooting

### Busca por ID retorna array com um elemento ao inves de objeto unico
**Symptom:** `GET /transactions/:id` retorna `[{ id: "..." }]` em vez de `{ id: "..." }`
**Cause:** Query com `.where({ id })` sem `.first()` retorna array por padrao no Knex
**Fix:** Adicione `.first()` apos `.where({ id })`: `knex('transactions').where({ id }).first()`

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

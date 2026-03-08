---
name: rs-full-stack-listando-sessoes-das-mesas
description: "Applies REST API listing endpoint patterns when building index/list routes in Node.js with Knex. Use when user asks to 'list records', 'create index endpoint', 'add GET route', 'fetch all items', or 'query database with ordering'. Enforces controller index method structure, route registration, orderBy usage, and selective column queries with Knex select. Make sure to use this skill whenever implementing list/index API endpoints. Not for create, update, delete endpoints or frontend data fetching."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: api-express
  tags: [express, knex, rest-api, index, controller, orderBy]
---

# Listando Registros via API (Index Endpoint)

> Todo endpoint de listagem segue o padrao: controller index method com orderBy, rota GET na raiz do resource, e select opcional para colunas especificas.

## Rules

1. **Nomeie o metodo de listagem como `index`** — `index` e a convencao REST para listar recursos, porque frameworks e desenvolvedores esperam esse nome
2. **Sempre ordene os resultados com `orderBy`** — nunca retorne dados sem ordenacao, porque a ordem varia entre execucoes e causa inconsistencia no frontend
3. **Use `select()` apenas quando precisar limitar colunas** — omitir `select` retorna todas as colunas automaticamente, porque o Knex entende como SELECT * quando omitido
4. **Registre a rota como GET na raiz do resource** — `router.get("/", controller.index)`, porque GET na raiz e o padrao REST para listagem
5. **Mantenha try/catch com next(error)** — delegue erros ao middleware de erro, porque centraliza tratamento e evita respostas inconsistentes
6. **Verifique nomes de tabelas e colunas com cuidado** — um typo como `table_session` em vez de `table_sessions` causa erro silencioso, porque o banco simplesmente nao encontra a tabela

## How to write

### Controller index method

```typescript
async index(request: Request, response: Response, next: NextFunction) {
  try {
    const sessions = await knex("table_sessions").orderBy("closed_at")

    return response.json(sessions)
  } catch (error) {
    next(error)
  }
}
```

### Rota GET

```typescript
tableSessionRoutes.get("/", tableSessionController.index)
```

### Select para colunas especificas

```typescript
// Apenas id e table_id
const sessions = await knex("table_sessions")
  .select("id", "table_id")
  .orderBy("closed_at")

// Todas as colunas (omitir select)
const sessions = await knex("table_sessions").orderBy("closed_at")
```

## Example

**Before (sem ordenacao, sem tratamento de erro):**

```typescript
async index(req: Request, res: Response) {
  const data = await knex("table_sessions")
  res.json(data)
}
```

**After (com this skill applied):**

```typescript
async index(request: Request, response: Response, next: NextFunction) {
  try {
    const sessions = await knex("table_sessions").orderBy("closed_at")

    return response.json(sessions)
  } catch (error) {
    next(error)
  }
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Listar todos os registros | Omitir `select`, usar apenas `orderBy` |
| Listar para dropdown/select | Usar `select("id", "name")` para performance |
| Endpoint retorna dados inconsistentes | Verificar se `orderBy` esta presente |
| Erro 500 na listagem | Verificar nome exato da tabela (plural, underscores) |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `knex("table_sessions")` sem orderBy | `knex("table_sessions").orderBy("closed_at")` |
| `res.send(data)` para JSON | `response.json(sessions)` |
| try/catch com `res.status(500)` inline | try/catch com `next(error)` |
| `router.get("/list", ...)` | `router.get("/", ...)` |
| `const data = await knex(...)` | `const sessions = await knex(...)` (nome descritivo) |

## Troubleshooting

| Problema | Causa | Solucao |
|----------|-------|---------|
| Erro 500 na listagem | Typo no nome da tabela (ex: `table_session` vs `table_sessions`) | Verifique nome exato com underscores e plural |
| Dados retornados em ordem inconsistente | Falta `orderBy` na query | Adicione `.orderBy("coluna")` |
| Resposta com todas as colunas quando so precisa de algumas | `select()` omitido retorna tudo | Use `.select("id", "table_id")` para colunas especificas |
| Erro nao tratado causa crash do servidor | catch sem `next(error)` | Use `try/catch` com `next(error)` para delegar ao middleware |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
---
name: rs-full-stack-query-params-2
description: "Applies Express.js query parameter patterns when building REST API routes. Use when user asks to 'add pagination', 'filter results', 'parse query string', 'get query params', or 'create a GET endpoint with parameters'. Enforces req.query destructuring, optional parameter handling, and pagination patterns. Make sure to use this skill whenever implementing list endpoints or search routes in Express. Not for route params (req.params), request body parsing, or non-Express frameworks."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: express-api
  tags:
    - express
    - query-params
    - pagination
    - api
    - rest
---

# Query Parameters no Express

> Recupere query parameters via `req.query` com destructuring direto — sem parsing manual, sem regex.

## Rules

1. **Use `req.query` para parametros nomeados** — `const { page, limit } = req.query`, porque o Express ja faz o parsing automaticamente, diferente do Node puro onde voce precisaria de regex e parsing manual
2. **Query params sao sempre opcionais** — a rota funciona com ou sem eles, diferente de route params (`:id`) que fazem parte da rota e sao obrigatorios
3. **Desestruture direto do request** — `const { query } = req` ou direto `req.query.page`, porque evita criar variaveis intermediarias desnecessarias
4. **Converta tipos explicitamente** — query params sempre chegam como `string`, converta com `Number()` antes de usar em calculos
5. **Defina defaults para paginacao** — `page = '1'` e `limit = '10'` como fallback, porque o cliente pode omitir parametros

## How to write

### Paginacao basica

```typescript
app.get('/products', (req, res) => {
  const { page = '1', limit = '10' } = req.query

  const pageNumber = Number(page)
  const limitNumber = Number(limit)

  // Use pageNumber e limitNumber para query no banco
  res.json({ page: pageNumber, limit: limitNumber, data: [] })
})
```

### Multiplos filtros opcionais

```typescript
app.get('/products', (req, res) => {
  const { page = '1', limit = '10', search, category } = req.query

  // Todos opcionais — a rota funciona sem nenhum parametro
  // GET /products
  // GET /products?page=2&limit=20
  // GET /products?search=notebook&category=electronics
})
```

## Example

**Before (parsing manual como no Node puro):**

```typescript
// Extraindo query params manualmente com regex e URL parsing
const url = new URL(req.url, `http://${req.headers.host}`)
const page = url.searchParams.get('page')
const limit = url.searchParams.get('limit')
```

**After (com Express):**

```typescript
// Express ja disponibiliza req.query parseado
const { page, limit } = req.query
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Endpoint lista recursos | Adicione `page` e `limit` como query params |
| Parametro faz parte da identidade do recurso | Use route param (`:id`), nao query param |
| Parametro e opcional/filtro | Use query param |
| URL: `/products?page=1&limit=10` | `req.query` → `{ page: '1', limit: '10' }` |
| Precisa de numero | `Number(req.query.page)` — nunca use direto como string em calculos |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `req.url.split('?')[1]` para extrair params | `req.query` direto |
| `new URL(req.url).searchParams` no Express | `req.query.paramName` |
| Route param para filtros opcionais: `/products/:page` | Query param: `/products?page=1` |
| Usar query param sem converter tipo | `Number(req.query.limit)` |
| Assumir que query param existe | Default: `const { page = '1' } = req.query` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre query params vs route params e parsing automatico do Express
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Query param retorna `undefined` | Nome do parametro na URL diferente do destructuring | Verifique que `?page=1` corresponde a `req.query.page` (case-sensitive) |
| Calculo com query param retorna NaN | Query params sempre chegam como string | Converta com `Number(req.query.page)` antes de calcular |
| Rota funciona sem params mas falha com params | Middleware de parsing nao configurado | Verifique que `express.urlencoded()` ou `express.json()` esta ativo |

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-query-params-2/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-query-params-2/references/code-examples.md)

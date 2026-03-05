---
name: rs-node-js-2023-query-parameters
description: "Enforces query parameter extraction patterns when building Node.js HTTP servers from scratch. Use when user asks to 'parse query string', 'extract query params', 'filter API results', 'add search to endpoint', or 'build route matching with regex'. Applies regex-based query capture, manual query string parsing with split/reduce, and proper defaults for missing params. Make sure to use this skill whenever implementing raw HTTP query parameter handling without frameworks. Not for Express/Fastify/Hapi query parsing or frontend URL manipulation."
---

# Capturando Query Parameters

> Extraia query parameters da URL usando regex e transforme a query string em um objeto utilizavel com split e reduce.

## Rules

1. **Query parameters sao opcionais** — o grupo regex que captura query params deve usar `?` no final, porque rotas funcionam com ou sem query string
2. **Escape do `?` na regex** — como `?` e metacaractere de regex, use `\\?` para capturar o literal ponto de interrogacao que inicia query strings
3. **Use grupo nomeado na regex** — `(?<query>...)` permite acessar via `groups.query`, separando query params dos route params
4. **Termine a regex com `$`** — garanta que nada alem da query string exista no final da URL
5. **Retorne objeto vazio quando query for vazia** — nunca retorne `undefined` para `req.query`, porque e mais dificil de lidar no codigo consumidor
6. **Separe query e route params na desestruturacao** — extraia `query` e use spread `...params` para manter route params limpos

## How to write

### Regex para capturar query string

```javascript
// Adicione ao final da regex de rota, ANTES do $ final
// O grupo inteiro e opcional (? no final dos parenteses)
const routeRegex = /^\/users\/(?<id>[a-z0-9-]+)(?<query>\?(.*))?$/
```

### Funcao extractQueryParams

```javascript
function extractQueryParams(query) {
  return query
    .substr(1)                    // remove o '?' inicial
    .split('&')                   // separa cada param: ['search=Diego', 'page=2']
    .reduce((queryParams, param) => {
      const [key, value] = param.split('=')
      queryParams[key] = value
      return queryParams
    }, {})
}
```

### Separacao de query e route params no middleware

```javascript
const { query, ...params } = route.params.groups

req.params = params
req.query = query
  ? extractQueryParams(query)
  : {}
```

## Example

**Before (query params inacessiveis):**
```javascript
// Regex sem grupo query
const routeRegex = /^\/users\/(?<id>[a-z0-9-]+)$/

// Impossivel acessar ?search=Diego
// req.query = undefined
```

**After (com captura de query params):**
```javascript
// Regex com grupo query opcional
const routeRegex = /^\/users\/(?<id>[a-z0-9-]+)(?<query>\?(.*))?$/

// URL: /users?search=Diego&page=2
// req.query = { search: 'Diego', page: '2' }
// req.params = { id: 'abc-123' }
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Rota precisa de filtragem | Adicione query params (search, filter) |
| Rota precisa de paginacao | Adicione query params (page, limit) |
| Parametro e obrigatorio para identificar recurso | Use route params, nao query params |
| Query string pode nao existir | Sempre retorne `{}` como fallback |
| Multiplos query params | `split('&')` separa cada par key=value |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `req.query = extractQueryParams(query)` sem checar null | `req.query = query ? extractQueryParams(query) : {}` |
| Regex sem `$` no final | Regex terminando com `$` para validar fim da URL |
| `query.split('&')` sem remover o `?` | `query.substr(1).split('&')` |
| Route params e query params misturados no mesmo objeto | Desestruture: `const { query, ...params }` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---
name: rs-node-js-2023-route-query-parameters
description: "Enforces correct usage of Query Parameters, Route Parameters, and Request Body when designing or implementing HTTP API routes in Node.js. Use when user asks to 'create an endpoint', 'add a route', 'build an API', 'handle request parameters', or 'design REST routes'. Applies rules: query params for filters/pagination, route params for resource identification, request body for sensitive/form data. Make sure to use this skill whenever designing API routes or handling HTTP parameters. Not for frontend routing, URL parsing libraries, or WebSocket protocols."
---

# Route e Query Parameters

> Cada tipo de parametro HTTP tem um proposito especifico: query parameters filtram, route parameters identificam, request body transporta dados sensiveis.

## Rules

1. **Query Parameters para filtros e paginacao** — `?search=diego&page=2`, porque tornam a URL stateful e compartilhavel (copiar e colar preserva o estado da busca)
2. **Route Parameters para identificacao de recurso** — `/users/:id`, porque o metodo HTTP ja explica a intencao (GET = buscar, DELETE = remover aquele recurso)
3. **Request Body para dados sensiveis e formularios** — nunca envie senhas ou dados extensos na URL, porque parametros na URL nao sao criptografados mesmo com HTTPS
4. **Route parameters sao nao-nomeados** — o valor faz parte do path (`/users/1`), diferente de query params que tem chave=valor, porque o metodo HTTP + recurso ja dao o contexto
5. **Query parameters nao sao obrigatorios** — a rota deve funcionar sem eles, retornando dados sem filtro, porque sao modificadores opcionais da resposta
6. **Nunca envie informacoes sensiveis na URL** — nem query nem route params, porque a URL e facilmente interceptavel independente de HTTPS

## How to write

### Route com parametro dinamico

```typescript
// Route parameter para identificar recurso — :id e dinamico
{ method: 'DELETE', path: '/users/:id', handler: (req, res) => { /* ... */ } }
{ method: 'GET', path: '/users/:id', handler: (req, res) => { /* ... */ } }
{ method: 'PUT', path: '/users/:id', handler: (req, res) => { /* ... */ } }
```

### Query parameters para listagem

```typescript
// Query params modificam a resposta — todos opcionais
// GET /users?search=diego&page=1
{ method: 'GET', path: '/users', handler: (req, res) => {
  const { search, page } = queryParams(req.url)
  // filtrar e paginar usuarios
}}
```

### Request body para criacao

```typescript
// Body para dados extensos ou sensiveis — nao aparece na URL
// POST /users (body: { name, email, password })
{ method: 'POST', path: '/users', handler: (req, res) => {
  const { name, email, password } = req.body
}}
```

## Example

**Before (parametros misturados incorretamente):**
```typescript
// Senha na URL — ERRADO
// DELETE com dados no query param — confuso
{ method: 'DELETE', path: '/users?id=1', handler: deleteUser }
{ method: 'POST', path: '/users?name=Diego&email=d@d.com&password=123', handler: createUser }
```

**After (cada parametro no lugar certo):**
```typescript
// Route param identifica o recurso a deletar
{ method: 'DELETE', path: '/users/:id', handler: deleteUser }
// Body transporta dados do formulario
{ method: 'POST', path: '/users', handler: createUser } // body: { name, email, password }
// Query params filtram a listagem
{ method: 'GET', path: '/users', handler: listUsers } // ?search=diego&page=1
```

## Heuristics

| Situacao | Tipo de parametro |
|----------|-------------------|
| Identificar UM recurso especifico | Route parameter (`:id`) |
| Filtrar, buscar, paginar listagem | Query parameters (`?key=value`) |
| Enviar formulario ou dados sensiveis | Request body |
| Informacao que deve sobreviver ao compartilhar URL | Query parameters |
| Dados extensos (muitos campos) | Request body |
| Combinar metodo + recurso ja explica a acao | Route parameter |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `DELETE /users?id=1` | `DELETE /users/:id` |
| `POST /users?name=X&email=Y` | `POST /users` com body |
| `GET /users/:search` | `GET /users?search=termo` |
| Senha em query param `?password=123` | Senha no request body |
| 20 campos como query params | Request body com JSON |
| Route param para filtro opcional | Query param para filtro |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

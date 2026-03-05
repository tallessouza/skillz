---
name: rs-node-js-2023-http-status-codes
description: "Enforces correct HTTP status code usage when building Node.js APIs or any backend route handler. Use when user asks to 'create an endpoint', 'return a response', 'handle errors in API', 'build a REST route', or 'set status code'. Applies semantic status codes: 201 for creation, 204 for no-content, 400 for client errors, 404 for not found, 500 for server errors. Make sure to use this skill whenever generating API route handlers or response logic. Not for frontend code, database queries, or authentication flows."
---

# HTTP Status Codes

> Retorne status codes semanticamente corretos — o front-end depende do codigo numerico, nao do corpo da resposta, para saber o que aconteceu.

## Rules

1. **Use 201 para criacao** — `res.writeHead(201)` apos POST/PUT que cria recurso, porque 200 nao comunica que algo foi criado
2. **Use 200 para leitura com dados** — GET que retorna lista ou objeto, porque e o padrao e comunica sucesso com corpo
3. **Use 204 para sucesso sem corpo** — DELETE ou PUT que nao precisa retornar dados, porque comunica sucesso sem body
4. **Use 400 para erro do cliente** — dados faltando, formato invalido, validacao falhou, porque o erro foi causado por quem fez a requisicao
5. **Use 404 para rota/recurso inexistente** — rota nao mapeada ou registro nao encontrado no banco, porque comunica ausencia
6. **Use 500 apenas para erros inesperados** — banco fora do ar, excecao nao tratada, porque indica problema no servidor, nao no cliente
7. **Nunca retorne 200 com erro no body** — anti-pattern classico em empresas grandes, porque o front-end confia no status code antes de ler o corpo

## Faixas semanticas

| Faixa | Significado | Uso comum |
|-------|-------------|-----------|
| 1xx (100-199) | Informativo | Raro em APIs REST |
| 2xx (200-299) | Sucesso | 200 OK, 201 Created, 204 No Content |
| 3xx (300-399) | Redirecionamento | 301 Moved Permanently, 302 Found |
| 4xx (400-499) | Erro do cliente | 400 Bad Request, 404 Not Found, 409 Conflict |
| 5xx (500-599) | Erro do servidor | 500 Internal Server Error, 502 Bad Gateway |

## How to write

### Rota de criacao (POST)
```typescript
// 201 — recurso criado com sucesso, body opcional
if (method === 'POST' && url === '/users') {
  // ... criar usuario
  return res.writeHead(201).end()
}
```

### Rota de listagem (GET)
```typescript
// 200 — sucesso com dados no body (padrao)
if (method === 'GET' && url === '/users') {
  return res.writeHead(200, { 'Content-Type': 'application/json' })
    .end(JSON.stringify(users))
}
```

### Rota nao encontrada (fallback)
```typescript
// 404 — nenhuma rota correspondeu
return res.writeHead(404).end('Not found')
```

## Example

**Before (status codes incorretos):**
```typescript
if (method === 'POST' && url === '/users') {
  users.push({ name, email })
  return res.end('Criação de usuário')  // 200 implicito, sem semantica
}

// fallback
return res.end('Hello World')  // 200 para rota inexistente!
```

**After (com status codes semanticos):**
```typescript
if (method === 'POST' && url === '/users') {
  users.push({ name, email })
  return res.writeHead(201).end()  // 201 Created, sem body desnecessario
}

// fallback
return res.writeHead(404).end()  // 404 Not Found
```

## Heuristics

| Situacao | Status code |
|----------|-------------|
| POST criou recurso | 201 |
| GET retornou dados | 200 |
| DELETE removeu com sucesso | 204 |
| PUT/PATCH atualizou | 200 (com body) ou 204 (sem body) |
| Validacao de input falhou | 400 |
| Recurso nao existe | 404 |
| Recurso ja existe (conflito) | 409 |
| Erro inesperado no servidor | 500 |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|------------|
| `res.end(JSON.stringify({ error: 'not found' }))` com 200 | `res.writeHead(404).end()` |
| 200 para criacao de recurso | 201 para POST que cria |
| 500 para dados invalidos do cliente | 400 para erro de validacao |
| Texto generico sem status code | Status code semantico + body opcional |
| 200 como fallback para rotas inexistentes | 404 no fallback |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

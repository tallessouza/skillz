---
name: rs-full-stack-identificando-metodo-http
description: "Applies HTTP method identification patterns when building Node.js HTTP servers. Use when user asks to 'create a server', 'handle requests', 'build an API', 'route requests', or 'identify HTTP method'. Enforces destructuring of request object to access method property. Make sure to use this skill whenever writing raw Node.js HTTP server code that needs to distinguish between GET, POST, PUT, PATCH, DELETE. Not for Express/Fastify route handlers or frontend HTTP clients."
---

# Identificando o Método HTTP

> Ao trabalhar com servidores HTTP nativos do Node.js, sempre identifique e desestruture o método da requisição para roteamento correto.

## Rules

1. **Acesse o método via `req.method`** — toda requisição HTTP possui a propriedade `method` no objeto request, porque é o identificador primário para roteamento
2. **Prefira destructuring** — `const { method } = req` ao invés de `req.method` repetido, porque reduz acoplamento e melhora legibilidade
3. **Conheça os 5 métodos principais** — GET (obter), POST (criar), PUT (substituir), PATCH (atualizar parcial), DELETE (remover), porque cada um tem semântica distinta

## How to write

### Acesso direto (básico)

```javascript
const server = http.createServer((req, res) => {
  res.write(`Método: ${req.method}`)
  res.end()
})
```

### Com destructuring (preferido)

```javascript
const server = http.createServer((req, res) => {
  const { method } = req

  res.write(`Método: ${method}`)
  res.end()
})
```

### Roteamento por método

```javascript
const server = http.createServer((req, res) => {
  const { method, url } = req

  if (method === 'GET' && url === '/users') {
    // listar usuarios
  } else if (method === 'POST' && url === '/users') {
    // criar usuario
  }

  res.end()
})
```

## Example

**Before (sem identificação de método):**
```javascript
const server = http.createServer((req, res) => {
  res.write('Hello World')
  res.end()
})
```

**After (com identificação e destructuring):**
```javascript
const server = http.createServer((req, res) => {
  const { method, url } = req

  res.write(`Método: ${method}`)
  res.end()
})
```

## Heuristics

| Situação | Faça |
|----------|------|
| Servidor HTTP nativo simples | Destructure `{ method }` do request |
| Precisa de método + URL | Destructure `{ method, url }` juntos |
| Múltiplas rotas | Use `method` em condicionais de roteamento |
| Logging de requisições | Inclua `method` no log: `${method} ${url}` |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|------------------|
| `request.method` repetido 3+ vezes | `const { method } = request` |
| Ignorar o método e tratar tudo igual | Verificar `method` para roteamento |
| `if (req.method == 'get')` | `if (method === 'GET')` (sempre uppercase) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre métodos HTTP e semântica REST
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
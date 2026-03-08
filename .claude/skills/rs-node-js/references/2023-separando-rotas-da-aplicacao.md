---
name: rs-node-js-2023-separando-rotas
description: "Enforces route separation pattern when building Node.js HTTP servers without frameworks. Use when user asks to 'create routes', 'add an endpoint', 'organize server routes', 'refactor routes', or 'build a REST API from scratch'. Applies route-table pattern: array of {method, path, handler} objects with find-based matching. Make sure to use this skill whenever creating raw Node.js HTTP servers or adding routes to existing ones. Not for Express/Fastify/Hapi routing, frontend routing, or framework-based APIs."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: fundamentos-nodejs
  tags: [routing, route-table, separation-of-concerns, http-server, refactoring]
---

# Separando Rotas da Aplicacao

> Rotas vivem em arquivo separado como array de objetos {method, path, handler}, e o servidor usa um unico find para despachar.

## Rules

1. **Rotas em arquivo dedicado** — crie `routes.js` exportando um array, porque o server.js deve conter apenas logica de servidor, nao regras de negocio
2. **Cada rota e um objeto com method, path e handler** — porque isso elimina cadeias de if/else e torna adicionar rotas trivial
3. **Handler recebe (req, res)** — mesma assinatura do callback do servidor, porque o despacho e um simples `route.handler(req, res)`
4. **Dependencias ficam no arquivo de rotas** — database, uuid, etc. importados onde sao usados, porque o server nao precisa conhecer detalhes de implementacao
5. **Despacho por find, nao por if** — `routes.find(r => r.method === method && r.path === url)`, porque escala sem modificar o servidor
6. **Fallback 404 quando find retorna undefined** — porque toda requisicao sem rota correspondente deve ter resposta explicita

## How to write

### Arquivo de rotas

```javascript
// routes.js
import { Database } from './database.js'
import { randomUUID } from 'node:crypto'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: '/users',
    handler(req, res) {
      const users = database.select('users')
      return res.end(JSON.stringify(users))
    }
  },
  {
    method: 'POST',
    path: '/users',
    handler(req, res) {
      const { name, email } = req.body
      const user = { id: randomUUID(), name, email }
      database.insert('users', user)
      return res.writeHead(201).end()
    }
  },
]
```

### Despacho no servidor

```javascript
// server.js
import { routes } from './routes.js'

const server = http.createServer((req, res) => {
  const { method, url } = req

  const route = routes.find(r => r.method === method && r.path === url)

  if (route) {
    return route.handler(req, res)
  }

  return res.writeHead(404).end()
})
```

## Example

**Before (ifs encadeados no server.js):**

```javascript
const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/users') {
    const users = database.select('users')
    return res.end(JSON.stringify(users))
  }
  if (req.method === 'POST' && req.url === '/users') {
    database.insert('users', { id: randomUUID(), name, email })
    return res.writeHead(201).end()
  }
  // cada nova rota = mais um if aqui
  return res.writeHead(404).end()
})
```

**After (com route table):**

```javascript
// server.js — limpo, sem logica de negocio
const route = routes.find(r => r.method === method && r.path === url)
if (route) return route.handler(req, res)
return res.writeHead(404).end()
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Adicionando nova rota | Adicione objeto em routes.js, nao toque no server.js |
| Rota precisa de dependencia nova | Importe no routes.js, nao no server.js |
| Servidor ficando grande | Verifique se ha logica de rota misturada — extraia para routes.js |
| Mais de 2 recursos (users, products...) | Considere agrupar rotas por recurso em arquivos separados |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `if (method === 'GET' && url === '/users')` no server | Entrada `{ method: 'GET', path: '/users', handler }` em routes.js |
| Importar database/uuid no server.js | Importar apenas no routes.js onde sao usados |
| Switch/case gigante para rotas | Array + find |
| Handler inline no servidor | Handler nomeado no objeto de rota |

## Troubleshooting

### Nova rota adicionada mas servidor retorna 404
**Symptom:** Rota existe no routes.js mas o servidor nao a encontra
**Cause:** O despacho usa comparacao exata de string e a URL pode ter query params ou trailing slash
**Fix:** Verifique se o path no objeto de rota corresponde exatamente a URL sem query string — use regex matching para paths dinamicos

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

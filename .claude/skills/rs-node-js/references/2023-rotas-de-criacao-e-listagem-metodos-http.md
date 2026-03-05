---
name: rs-node-js-2023-rotas-metodos-http
description: "Applies HTTP route and method patterns when building Node.js APIs. Use when user asks to 'create a route', 'add an endpoint', 'handle HTTP requests', 'build a REST API', or 'set up Express/Fastify routes'. Enforces correct method semantics (GET=read, POST=create, PUT=full update, PATCH=partial update, DELETE=remove) and route differentiation by method+URL pair. Make sure to use this skill whenever creating backend routes in Node.js. Not for frontend fetch calls, WebSocket handlers, or GraphQL resolvers."
---

# Rotas HTTP e Metodos HTTP no Node.js

> Cada rota e identificada unicamente pela combinacao de metodo HTTP + URL — nunca por apenas um dos dois.

## Rules

1. **Diferencie rotas por metodo + URL** — `GET /users` e `POST /users` sao rotas distintas, porque a identidade da rota e a soma dos dois
2. **Use metodos semanticamente** — GET busca, POST cria, PUT atualiza tudo, PATCH atualiza campo especifico, DELETE remove, porque sao semanticos (significado) mais do que funcionais
3. **PUT vs PATCH: escopo da atualizacao** — PUT para formularios que atualizam varios campos ao mesmo tempo (nome, email, bio, avatar), PATCH para toggle ou campo unico (aceitar notificacoes sim/nao), porque confundir os dois quebra a semantica REST
4. **Extraia method e url do request** — sao os dois recursos fundamentais de qualquer requisicao HTTP, toda logica de roteamento parte deles
5. **Use early return por rota** — cada if retorna cedo, sem else encadeado, porque deixa a sintaxe mais limpa e legivel
6. **Tenha rota de fallback** — se nenhuma rota capturar a requisicao, retorne uma resposta padrao, porque requisicoes nao tratadas precisam de resposta

## How to write

### Roteamento basico com Node.js puro

```javascript
import http from 'node:http'

const server = http.createServer((req, res) => {
  const { method, url } = req

  if (method === 'GET' && url === '/users') {
    return res.end('Listagem de usuarios')
  }

  if (method === 'POST' && url === '/users') {
    return res.end('Criacao de usuario')
  }

  // Fallback para rotas nao tratadas
  return res.end('Not found')
})

server.listen(3333)
```

### Padrao de 5 rotas CRUD para um recurso

```javascript
// GET    /users       → listar usuarios
// POST   /users       → criar usuario
// PUT    /users/:id   → atualizar usuario (completo)
// PATCH  /users/:id   → atualizar campo especifico
// DELETE /users/:id   → remover usuario
```

## Example

**Before (sem semantica de metodos):**
```javascript
if (url === '/create-user') {
  return res.end('Criou')
}
if (url === '/list-users') {
  return res.end('Listou')
}
```

**After (metodo + URL semanticos):**
```javascript
if (method === 'GET' && url === '/users') {
  return res.end('Listagem de usuarios')
}
if (method === 'POST' && url === '/users') {
  return res.end('Criacao de usuario')
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Frontend quer ler dados | `GET /recurso` |
| Frontend quer criar dados | `POST /recurso` |
| Formulario de edicao com muitos campos | `PUT /recurso/:id` |
| Toggle ou campo unico | `PATCH /recurso/:id` |
| Remover recurso | `DELETE /recurso/:id` |
| Mesma URL, operacoes diferentes | Diferencie pelo metodo HTTP |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `GET /create-user` | `POST /users` |
| `POST /get-users` | `GET /users` |
| `if (url === '/delete-user')` sem checar metodo | `if (method === 'DELETE' && url === '/users')` |
| Else encadeado para cada rota | Early return com ifs independentes |
| Roteamento sem fallback | Sempre tenha resposta padrao no final |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-rotas-de-criacao-e-listagem-metodos-http/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-rotas-de-criacao-e-listagem-metodos-http/references/code-examples.md)

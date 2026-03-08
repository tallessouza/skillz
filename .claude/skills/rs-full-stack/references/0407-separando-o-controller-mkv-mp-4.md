---
name: rs-full-stack-separando-controller
description: "Enforces controller separation pattern when structuring Node.js routes and handlers. Use when user asks to 'create a route', 'add an endpoint', 'organize routes', 'separate controllers', or 'structure an API'. Applies rules: one controller per file, group by domain, destructured request/response objects, route files only list routes. Make sure to use this skill whenever creating or refactoring Node.js API routes. Not for frontend components, database models, or middleware logic."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [node, controller, routes, separation, crud, architecture]
---

# Separando Controllers

> Rotas listam endpoints, controllers executam a logica — cada um em seu arquivo.

## Rules

1. **Um controller por arquivo** — cada acao (create, update, delete) vive em seu proprio arquivo, porque facilita navegacao e manutencao
2. **Agrupe controllers por dominio** — `controllers/tickets/create.js`, `controllers/users/update.js`, porque permite escalar sem bagunca
3. **Arquivo de rotas so lista rotas** — nenhuma logica de negocio no arquivo de rotas, porque manter enxuto facilita visualizar todos os endpoints
4. **Receba request/response como objeto desestruturado** — `{ request, response }` ao inves de parametros posicionais, porque ordem nao importa e previne bugs silenciosos
5. **Propague o objeto consistentemente** — se o router recebe como objeto, passe como objeto para o controller, porque quebra de contrato causa erros dificeis de rastrear

## How to write

### Estrutura de pastas

```
src/
├── routes/
│   └── tickets.js          # So lista rotas
└── controllers/
    └── tickets/
        ├── create.js        # Uma acao por arquivo
        ├── update.js
        └── list.js
```

### Controller separado

```javascript
// src/controllers/tickets/create.js
export async function create({ request, response }) {
  const body = await request.body()
  response.writeHead(201, { "Content-Type": "application/json" })
  return response.end(JSON.stringify({ message: "Criado com sucesso", body }))
}
```

### Arquivo de rotas (enxuto)

```javascript
// src/routes/tickets.js
import { create } from "../controllers/tickets/create.js"

export function ticketRoutes(router) {
  router.post("/tickets", ({ request, response }) => {
    create({ request, response })
  })
}
```

## Example

**Before (tudo junto no arquivo de rotas):**
```javascript
// src/routes/tickets.js
export function ticketRoutes(router) {
  router.post("/tickets", (request, response) => {
    const body = request.body()
    response.writeHead(201, { "Content-Type": "application/json" })
    response.end(JSON.stringify({ message: "Criado com sucesso", body }))
  })
  // + 20 rotas com logica inline...
}
```

**After (controller separado):**
```javascript
// src/routes/tickets.js
import { create } from "../controllers/tickets/create.js"

export function ticketRoutes(router) {
  router.post("/tickets", ({ request, response }) => {
    create({ request, response })
  })
}
```

```javascript
// src/controllers/tickets/create.js
export async function create({ request, response }) {
  const body = await request.body()
  response.writeHead(201, { "Content-Type": "application/json" })
  return response.end(JSON.stringify({ message: "Criado com sucesso", body }))
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Rota com mais de 3 linhas de logica | Extraia para controller |
| Novo dominio (users, equipments) | Crie subpasta em controllers/ |
| Controller cresce demais | Extraia helpers, mantenha controller como orquestrador |
| Parametros posicionais em callback | Converta para objeto desestruturado |

## Anti-patterns

| Nunca escreva | Escreva ao inves |
|---------------|-----------------|
| Logica de negocio inline na rota | Controller em arquivo separado |
| `function create(request, response)` posicional | `function create({ request, response })` desestruturado |
| `controllers/create.js` (sem dominio) | `controllers/tickets/create.js` (agrupado) |
| Um arquivo com todos os controllers | Um arquivo por acao (`create.js`, `update.js`) |
| Rota que importa dependencias de banco | Controller que importa dependencias de banco |

## Troubleshooting

| Problema | Causa provável | Solução |
|----------|---------------|---------|
| `request` ou `response` é `undefined` no controller | Passando como parâmetros posicionais em vez de objeto | Use `{ request, response }` desestruturado |
| Controller não é encontrado no import | Caminho relativo errado ou falta extensão `.js` | Confira o path e adicione `.js` |
| Rota não executa a lógica esperada | Arquivo de rotas contém lógica em vez de delegar | Mova a lógica para `controllers/{domínio}/ação.js` |
| Novo controller não funciona | Servidor não reiniciado após criar arquivo | Reinicie o servidor Node.js |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre separacao de responsabilidades e propagacao de objetos
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
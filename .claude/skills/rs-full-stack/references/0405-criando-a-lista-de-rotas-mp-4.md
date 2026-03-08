---
name: rs-full-stack-criando-lista-de-rotas
description: "Enforces route organization patterns when building Node.js APIs with manual routing. Use when user asks to 'create routes', 'organize API endpoints', 'add a new route', 'structure a Node.js server', or 'separate routes by resource'. Applies rules: one file per resource domain, index.js aggregates all route files, each route is an object with method/path/controller, export as named arrays. Make sure to use this skill whenever creating or refactoring routes in vanilla Node.js APIs without frameworks. Not for Express/Fastify/Hapi router configuration or frontend routing."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [node, routes, api, organization, esm]
---

# Criando Lista de Rotas

> Organize rotas da API separando por dominio de recurso, um arquivo por recurso, com um index.js que agrega todas as rotas.

## Rules

1. **Um arquivo por dominio de recurso** — `tickets.js`, `equipments.js`, etc., porque facilita manutencao e permite que cada recurso evolua independentemente
2. **Cada rota e um objeto com method, path e controller** — estrutura uniforme que permite o servidor iterar e registrar rotas genericamente
3. **Exporte arrays nomeados** — `export const tickets = [...]`, porque permite importacao seletiva e spread no aggregador
4. **Crie um index.js aggregador na pasta routes** — importa todos os arquivos de rota e exporta um unico array com spread, porque o servidor so precisa conhecer um ponto de entrada
5. **Controller recebe request e response** — a funcao handler segue a assinatura padrao do Node.js HTTP
6. **Sempre inclua a extensao .js nos imports** — Node.js ESM exige extensao explicita, omitir causa erro silencioso

## How to write

### Arquivo de rota por recurso

```javascript
// src/routes/tickets.js
export const tickets = [
  {
    method: "POST",
    path: "/tickets",
    controller: (request, response) => {
      return response.end("Criado com sucesso")
    },
  },
]
```

### Aggregador de rotas

```javascript
// src/routes/index.js
import { tickets } from "./tickets.js"

export const routes = [...tickets]
```

### Adicionando novo dominio

```javascript
// src/routes/index.js
import { tickets } from "./tickets.js"
import { equipments } from "./equipments.js"

export const routes = [...tickets, ...equipments]
```

## Example

**Before (todas as rotas inline no servidor):**
```javascript
// server.js
const server = http.createServer((request, response) => {
  if (request.url === "/tickets" && request.method === "POST") {
    return response.end("Criado com sucesso")
  }
  if (request.url === "/equipments" && request.method === "GET") {
    return response.end("Lista de equipamentos")
  }
})
```

**After (com esta skill aplicada):**
```javascript
// src/routes/tickets.js
export const tickets = [
  { method: "POST", path: "/tickets", controller: (req, res) => res.end("Criado com sucesso") },
]

// src/routes/index.js
import { tickets } from "./tickets.js"
export const routes = [...tickets]

// server.js
import { routes } from "./src/routes/index.js"
const server = http.createServer((request, response) => {
  const route = routes.find(r => r.method === request.method && r.path === request.url)
  if (route) return route.controller(request, response)
  return response.writeHead(404).end("Not Found")
})
```

## Heuristics

| Situation | Do |
|-----------|-----|
| API tem apenas um recurso | Mesmo assim crie arquivo separado e index.js — o habito escala |
| Novo recurso adicionado | Crie novo arquivo em routes/, importe e spread no index.js |
| Rota precisa de middleware | Adicione campo extra no objeto de rota (ex: `middlewares: []`) |
| Muitas rotas no mesmo recurso | Mantenha no mesmo arquivo, agrupe por method com comentarios |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| Todas as rotas inline no createServer | Arquivo separado por recurso + aggregador |
| `import { tickets } from "./tickets"` (sem extensao) | `import { tickets } from "./tickets.js"` |
| `module.exports = [...]` em projeto ESM | `export const tickets = [...]` |
| Um unico arquivo routes.js com todos os dominios | Um arquivo por dominio + index.js aggregador |

## Troubleshooting

| Problema | Causa provável | Solução |
|----------|---------------|---------|
| `ERR_MODULE_NOT_FOUND` | Import sem extensão `.js` em projeto ESM | Adicione `.js` em todos os imports |
| Rota retorna 404 | Rota não foi adicionada ao array ou não foi spread no index.js | Verifique se a rota está no array e se o spread foi adicionado no aggregador |
| Controller não executa | Propriedade `controller` com nome errado no objeto de rota | Confira se o objeto tem `method`, `path` e `controller` |
| Nova rota não aparece | Servidor não foi reiniciado após adicionar arquivo | Reinicie o servidor com `node --watch` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre separacao por dominio e escalabilidade
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
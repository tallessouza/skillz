# Code Examples: Separando Controllers

## Exemplo 1: Estrutura de pastas criada na aula

```
src/
├── controllers/
│   └── tickets/
│       └── create.js
└── routes/
    └── tickets.js
```

O instrutor menciona que no futuro poderia ter:
```
src/
├── controllers/
│   ├── tickets/
│   │   └── create.js
│   ├── equipamentos/
│   │   └── ...
│   └── users/
│       └── ...
```

## Exemplo 2: Controller create.js (como criado na aula)

```javascript
// src/controllers/tickets/create.js
export function create({ request, response }) {
  // Logica movida do arquivo de rotas
  const { body } = request

  response.writeHead(201, { "Content-Type": "application/json" })
  return response.end(
    JSON.stringify({ message: "Criado com sucesso", body })
  )
}
```

## Exemplo 3: Arquivo de rotas antes da separacao

```javascript
// src/routes/tickets.js — ANTES
export function ticketRoutes(router) {
  router.post("/tickets", (request, response) => {
    const { body } = request
    response.writeHead(201, { "Content-Type": "application/json" })
    response.end(JSON.stringify({ message: "Criado com sucesso", body }))
  })
}
```

## Exemplo 4: Arquivo de rotas depois da separacao

```javascript
// src/routes/tickets.js — DEPOIS
import { create } from "../controllers/tickets/create.js"

export function ticketRoutes(router) {
  router.post("/tickets", ({ request, response }) => {
    create({ request, response })
  })
}
```

Note a mudanca: `(request, response)` virou `({ request, response })` — chaves adicionadas para manter consistencia com o controller.

## Exemplo 5: Parametros posicionais vs objeto (comparacao)

```javascript
// POSICIONAL — ordem importa, bug silencioso se inverter
function create(request, response) {
  // Se alguem chamar create(response, request) — bug silencioso
}

// OBJETO — ordem nao importa
function create({ request, response }) {
  // create({ response, request }) funciona igual
}
```

## Exemplo 6: Cadeia de propagacao completa

```javascript
// 1. Server recebe a requisicao
server.on("request", (request, response) => {
  // 2. Passa para o middleware como objeto
  middleware({ request, response })
})

// 3. Middleware processa e passa para a rota
function middleware({ request, response }) {
  const route = findRoute(request.url)
  route.handler({ request, response })
}

// 4. Rota chama o controller
router.post("/tickets", ({ request, response }) => {
  create({ request, response })
})

// 5. Controller executa a logica
export function create({ request, response }) {
  response.writeHead(201)
  return response.end(JSON.stringify({ message: "Criado" }))
}
```

## Exemplo 7: Variacao — multiplos controllers por dominio

```javascript
// src/controllers/tickets/create.js
export function create({ request, response }) { /* ... */ }

// src/controllers/tickets/list.js
export function list({ request, response }) { /* ... */ }

// src/controllers/tickets/update.js
export function update({ request, response }) { /* ... */ }

// src/controllers/tickets/remove.js
export function remove({ request, response }) { /* ... */ }

// src/routes/tickets.js — todas as rotas enxutas
import { create } from "../controllers/tickets/create.js"
import { list } from "../controllers/tickets/list.js"
import { update } from "../controllers/tickets/update.js"
import { remove } from "../controllers/tickets/remove.js"

export function ticketRoutes(router) {
  router.post("/tickets", ({ request, response }) => create({ request, response }))
  router.get("/tickets", ({ request, response }) => list({ request, response }))
  router.put("/tickets/:id", ({ request, response }) => update({ request, response }))
  router.delete("/tickets/:id", ({ request, response }) => remove({ request, response }))
}
```

## Teste pratico demonstrado na aula

O instrutor testa via Insomnia:
1. Muda de GET para POST em `/tickets`
2. Envia request → recebe "Criado com sucesso"
3. Altera o body para "teste!" → resposta reflete o conteudo
4. Confirma que o controller separado funciona identicamente ao inline
# Code Examples: Criando Lista de Rotas

## Exemplo 1: Arquivo de rotas de tickets (da aula)

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

## Exemplo 2: Index aggregador (da aula)

```javascript
// src/routes/index.js
import { tickets } from "./tickets.js"

export const routes = [...tickets]
```

## Exemplo 3: Multiplos recursos

```javascript
// src/routes/equipments.js
export const equipments = [
  {
    method: "GET",
    path: "/equipments",
    controller: (request, response) => {
      return response.end("Lista de equipamentos")
    },
  },
]
```

```javascript
// src/routes/index.js
import { tickets } from "./tickets.js"
import { equipments } from "./equipments.js"

export const routes = [...tickets, ...equipments]
```

## Exemplo 4: Multiplas rotas no mesmo recurso

```javascript
// src/routes/tickets.js
export const tickets = [
  {
    method: "POST",
    path: "/tickets",
    controller: (request, response) => {
      return response.end("Ticket criado")
    },
  },
  {
    method: "GET",
    path: "/tickets",
    controller: (request, response) => {
      return response.end("Lista de tickets")
    },
  },
  {
    method: "PUT",
    path: "/tickets",
    controller: (request, response) => {
      return response.end("Ticket atualizado")
    },
  },
  {
    method: "DELETE",
    path: "/tickets",
    controller: (request, response) => {
      return response.end("Ticket deletado")
    },
  },
]
```

## Exemplo 5: Servidor consumindo as rotas

```javascript
// src/server.js
import http from "node:http"
import { routes } from "./routes/index.js"

const server = http.createServer((request, response) => {
  const route = routes.find(
    (route) => route.method === request.method && route.path === request.url
  )

  if (route) {
    return route.controller(request, response)
  }

  return response.writeHead(404).end("Not Found")
})

server.listen(3000, () => {
  console.log("Server running on port 3000")
})
```

## Estrutura de pastas resultante

```
src/
├── routes/
│   ├── index.js        # Aggregador — importa e exporta todas as rotas
│   ├── tickets.js      # Rotas do dominio tickets
│   └── equipments.js   # Rotas do dominio equipamentos (futuro)
└── server.js           # Servidor HTTP que consome routes
```
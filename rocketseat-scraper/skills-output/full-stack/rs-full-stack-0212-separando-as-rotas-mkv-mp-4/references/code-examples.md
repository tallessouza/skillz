# Code Examples: Separando Rotas

## Estrutura de pastas final

```
src/
├── server.js
├── routes.js
└── middlewares/
    ├── bodyParser.js        # middleware anterior (ja existia)
    └── routeHandler.js      # novo middleware desta aula
```

## routes.js completo

```javascript
export const routes = [
  {
    method: "GET",
    path: "/products",
    controller: (request, response) => {
      return response.end("Lista de produtos")
    },
  },
  {
    method: "POST",
    path: "/products",
    controller: (request, response) => {
      response.writeHead(201)
      return response.end(request.body)
    },
  },
]
```

## middlewares/routeHandler.js completo

```javascript
import { routes } from "../routes.js"

export function routeHandler(request, response) {
  const route = routes.find(
    (route) => route.method === request.method && route.path === request.url
  )

  if (route) {
    return route.controller(request, response)
  }

  response.writeHead(404)
  return response.end("Rota nao encontrada")
}
```

## server.js apos refatoracao

```javascript
import http from "node:http"
import { bodyParser } from "./middlewares/bodyParser.js"
import { routeHandler } from "./middlewares/routeHandler.js"

const server = http.createServer(async (request, response) => {
  await bodyParser(request)
  routeHandler(request, response)
})

server.listen(3333, () => {
  console.log("Server is running on port 3333")
})
```

## Variacao: extraindo controllers para arquivos separados

Quando os controllers crescem, extraia para pasta dedicada:

```
src/
├── controllers/
│   └── productsController.js
├── routes.js
└── ...
```

```javascript
// controllers/productsController.js
export function listProducts(request, response) {
  return response.end("Lista de produtos")
}

export function createProduct(request, response) {
  response.writeHead(201)
  return response.end(request.body)
}
```

```javascript
// routes.js
import { listProducts, createProduct } from "./controllers/productsController.js"

export const routes = [
  { method: "GET", path: "/products", controller: listProducts },
  { method: "POST", path: "/products", controller: createProduct },
]
```

## Variacao: adicionando mais rotas

```javascript
export const routes = [
  { method: "GET", path: "/products", controller: listProducts },
  { method: "POST", path: "/products", controller: createProduct },
  { method: "GET", path: "/users", controller: listUsers },
  { method: "POST", path: "/users", controller: createUser },
  { method: "DELETE", path: "/users", controller: deleteUser },
]
```

Perceba que adicionar rotas e simplesmente adicionar objetos ao array — nenhum outro arquivo precisa mudar.

## Teste manual no terminal (como o instrutor fez)

```bash
# GET — lista produtos
curl http://localhost:3333/products
# Resposta: Lista de produtos

# POST — cria produto
curl -X POST http://localhost:3333/products -d '{"name":"Teclado"}' -H "Content-Type: application/json"
# Resposta: {"name":"Teclado"}

# Rota inexistente — 404
curl http://localhost:3333/xxx
# Resposta: Rota nao encontrada (status 404)
```
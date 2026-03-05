# Code Examples: Rotas GET com Express

## Exemplo 1: Rota basica na raiz (da aula)

```typescript
import express from "express"

const app = express()
const PORT = 3333

app.get("/", (request, response) => {
  response.send("Hello World Express")
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
```

**O que acontece:**
- `app = express()` inicializa a aplicacao
- `app.get("/", callback)` registra handler para GET na raiz
- `response.send("Hello World Express")` envia texto como resposta
- `app.listen(PORT)` inicia o servidor

## Exemplo 2: Multiplas rotas GET

```typescript
app.get("/", (request, response) => {
  response.send("Home page")
})

app.get("/products", (request, response) => {
  response.json([
    { id: 1, name: "Keyboard", priceInCents: 15000 },
    { id: 2, name: "Mouse", priceInCents: 8000 },
  ])
})

app.get("/users", (request, response) => {
  response.json([
    { id: 1, name: "John", email: "john@example.com" },
  ])
})
```

## Exemplo 3: Comparacao direta Node puro vs Express

### Node puro (verbose)

```typescript
import http from "node:http"

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain" })
    res.end("Hello World")
  } else if (req.method === "GET" && req.url === "/products") {
    res.writeHead(200, { "Content-Type": "application/json" })
    res.end(JSON.stringify([{ id: 1, name: "Keyboard" }]))
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" })
    res.end("Not Found")
  }
})

server.listen(3333)
```

### Express (declarativo)

```typescript
import express from "express"

const app = express()

app.get("/", (request, response) => {
  response.send("Hello World")
})

app.get("/products", (request, response) => {
  response.json([{ id: 1, name: "Keyboard" }])
})

// 404 automatico — nao precisa de codigo

app.listen(3333)
```

## Exemplo 4: Usando status codes explicitamente

```typescript
app.get("/health", (request, response) => {
  response.status(200).json({ status: "ok" })
})

app.get("/not-implemented", (request, response) => {
  response.status(501).send("Feature not implemented yet")
})
```

## Variacao: response.send() com diferentes tipos

```typescript
// String — Content-Type: text/html
response.send("Hello World")

// Objeto/Array — Content-Type: application/json (automatico)
response.send({ message: "Hello" })

// Buffer — Content-Type: application/octet-stream
response.send(Buffer.from("Hello"))
```

`response.json()` e preferivel para APIs porque e explicito sobre a intencao, mesmo que `response.send({})` tambem funcione para objetos.
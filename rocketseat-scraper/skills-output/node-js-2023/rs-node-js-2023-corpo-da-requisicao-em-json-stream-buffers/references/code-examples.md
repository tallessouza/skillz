# Code Examples: Corpo da Requisicao em JSON (Stream & Buffers)

## Exemplo 1: Servidor completo da aula

O codigo final do servidor conforme demonstrado na aula:

```javascript
import http from 'node:http'
import { randomUUID } from 'node:crypto'

const database = []

const server = http.createServer(async (req, res) => {
  // Leitura completa da stream do body
  const buffers = []
  for await (const chunk of req) {
    buffers.push(chunk)
  }

  try {
    req.body = JSON.parse(Buffer.concat(buffers).toString())
  } catch {
    req.body = null
  }

  // POST /users — Criar usuario
  if (req.method === 'POST' && req.url === '/users') {
    const { name, email } = req.body

    database.push({
      id: randomUUID(),
      name,
      email,
    })

    return res.writeHead(201).end()
  }

  // GET /users — Listar usuarios
  if (req.method === 'GET' && req.url === '/users') {
    return res
      .writeHead(200, { 'Content-Type': 'application/json' })
      .end(JSON.stringify(database))
  }

  return res.writeHead(404).end()
})

server.listen(3333)
```

## Exemplo 2: Evolucao do pattern — sem body parsing

O estado anterior do servidor (dados hardcoded):

```javascript
// ANTES: dados fixos, ignora o corpo da requisicao
if (req.method === 'POST' && req.url === '/users') {
  database.push({
    id: randomUUID(),
    name: 'John Doe',
    email: 'johndoe@example.com',
  })
  return res.writeHead(201).end()
}
```

## Exemplo 3: O que acontece sem JSON.parse

```javascript
// O body chega como string, NAO como objeto
const buffers = []
for await (const chunk of req) {
  buffers.push(chunk)
}
const body = Buffer.concat(buffers).toString()

console.log(body)
// '{"name":"Diego Fernandes","email":"diego@rocketseat.com.br"}'
// ^ isso e uma STRING, nao um objeto

console.log(body.name)
// undefined — string nao tem propriedade .name

// Apos JSON.parse:
const parsed = JSON.parse(body)
console.log(parsed.name)
// 'Diego Fernandes' — agora sim e um objeto
```

## Exemplo 4: O erro sem try/catch

```javascript
// Quando GET /users e chamado (sem body):
const buffers = [] // array vazio, nenhum chunk chega
const body = Buffer.concat(buffers).toString() // ""

JSON.parse("") // SyntaxError: Unexpected end of JSON input
// ^ servidor QUEBRA aqui
```

## Exemplo 5: Extraindo como middleware reutilizavel

Pattern avancado para quando o servidor crescer:

```javascript
async function parseBodyAsJson(req) {
  const buffers = []
  for await (const chunk of req) {
    buffers.push(chunk)
  }

  try {
    req.body = JSON.parse(Buffer.concat(buffers).toString())
  } catch {
    req.body = null
  }
}

const server = http.createServer(async (req, res) => {
  await parseBodyAsJson(req)

  // Rotas agora acessam req.body diretamente
  if (req.method === 'POST' && req.url === '/users') {
    const { name, email } = req.body
    // ...
  }
})
```

## Exemplo 6: Testando com Insomnia/curl

```bash
# Criar usuario
curl -X POST http://localhost:3333/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Diego Fernandes", "email": "diego@rocketseat.com.br"}'

# Listar usuarios
curl http://localhost:3333/users
```

No Insomnia:
- Metodo: POST
- URL: `http://localhost:3333/users`
- Body: JSON
- Conteudo: `{"name": "Diego Fernandes", "email": "diego@rocketseat.com.br"}`
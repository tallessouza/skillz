# Code Examples: Middleware de JSON no Node.js

## Exemplo 1: Estrutura de pastas

```
project/
├── package.json          # "type": "module"
├── server.js             # Servidor HTTP principal
└── middlewares/
    └── json.js           # Middleware de parsing JSON
```

## Exemplo 2: Middleware json.js completo

```javascript
// middlewares/json.js
export async function json(req, res) {
  const buffers = []

  // Consome o readable stream da requisicao chunk por chunk
  for await (const chunk of req) {
    buffers.push(chunk)
  }

  // Tenta parsear o body como JSON
  try {
    req.body = JSON.parse(Buffer.concat(buffers).toString())
  } catch {
    // Se o body nao for JSON valido (ou estiver vazio), define como null
    req.body = null
  }

  // Configura todas as respostas para serem JSON
  res.setHeader('Content-Type', 'application/json')
}
```

## Exemplo 3: Server.js usando o middleware

```javascript
// server.js
import http from 'node:http'
import { json } from './middlewares/json.js' // Extensao .js obrigatoria com ES Modules

const server = http.createServer(async (req, res) => {
  // Middleware intercepta a requisicao primeiro
  await json(req, res)

  if (req.method === 'GET' && req.url === '/users') {
    return res.end(JSON.stringify(users))
  }

  if (req.method === 'POST' && req.url === '/users') {
    const { name, email } = req.body // req.body ja e um objeto JS
    users.push({ id: randomUUID(), name, email })
    return res.writeHead(201).end()
  }

  return res.writeHead(404).end()
})

server.listen(3333)
```

## Exemplo 4: Erro comum — import sem extensao

```javascript
// ERRO: Cannot find module
import { json } from './middlewares/json'

// CORRETO: Com extensao .js
import { json } from './middlewares/json.js'
```

Esse erro so acontece com ES Modules (`"type": "module"` no package.json). Com CommonJS (`require`), a extensao seria opcional.

## Exemplo 5: Erro comum — sem await

```javascript
// ERRADO: body nao estara pronto quando o handler executar
const server = http.createServer(async (req, res) => {
  json(req, res) // Falta await!
  console.log(req.body) // undefined — stream ainda nao foi consumida
})

// CORRETO: await garante que o body foi completamente lido
const server = http.createServer(async (req, res) => {
  await json(req, res)
  console.log(req.body) // { name: "John", email: "john@example.com" }
})
```

## Exemplo 6: Multiplos middlewares em sequencia

```javascript
// Padrao para adicionar mais middlewares no futuro
import { json } from './middlewares/json.js'
import { auth } from './middlewares/auth.js'
import { logger } from './middlewares/logger.js'

const server = http.createServer(async (req, res) => {
  await logger(req, res)  // Log da requisicao
  await json(req, res)    // Parse do body
  await auth(req, res)    // Verificacao de autenticacao

  // Handler principal — todos os middlewares ja executaram
})
```

Cada middleware segue o mesmo padrao: funcao async que recebe (req, res) e transforma esses objetos.
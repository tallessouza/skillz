# Code Examples: Conhecendo o Express

> Nota: a aula e conceitual e nao mostra codigo. Os exemplos abaixo ilustram os conceitos apresentados pelo instrutor.

## Setup basico do Express

```javascript
import express from 'express'

const app = express()

// Middleware para parsear JSON do body (substitui o trabalho manual com chunks)
app.use(express.json())

app.listen(3333, () => {
  console.log('Server is running on port 3333')
})
```

## Comparacao: Node puro vs Express

### Parsear body — Node puro (o "trabalhinho")

```javascript
import http from 'node:http'

const server = http.createServer(async (req, res) => {
  const buffers = []

  for await (const chunk of req) {
    buffers.push(chunk)
  }

  const body = Buffer.concat(buffers).toString()
  const parsedBody = JSON.parse(body)

  // Agora sim voce pode usar parsedBody...
})
```

### Parsear body — Express

```javascript
app.use(express.json())

app.post('/users', (req, res) => {
  const { name, email } = req.body // Pronto. Sem chunks, sem concat, sem parse.
  // ...
})
```

## Extrair parametros — Node puro vs Express

### Route params — Node puro (regex manual)

```javascript
// No modulo de fundamentos, foi necessario criar regex para extrair :id da URL
const routeParamRegex = /:([a-zA-Z]+)/g

function extractRouteParams(path) {
  // ... logica complexa com regex
}
```

### Route params — Express

```javascript
app.get('/users/:id', (req, res) => {
  const { id } = req.params // Pronto.
  // ...
})
```

### Query params — Express

```javascript
app.get('/users', (req, res) => {
  const { search, page } = req.query // Pronto.
  // ...
})
```

## Roteamento com metodos HTTP

```javascript
// Express espelha os verbos HTTP como metodos
app.get('/users', (req, res) => {
  // Listar usuarios
})

app.post('/users', (req, res) => {
  // Criar usuario
})

app.put('/users/:id', (req, res) => {
  // Atualizar usuario
})

app.delete('/users/:id', (req, res) => {
  // Deletar usuario
})
```

## Middleware pattern

```javascript
// Middleware customizado — extensao do Express
function logRequests(req, res, next) {
  console.log(`[${req.method}] ${req.url}`)
  next() // Passa para o proximo middleware ou rota
}

app.use(logRequests)

// Middleware em rota especifica
app.get('/admin', authenticate, (req, res) => {
  // So chega aqui se authenticate chamar next()
})
```

## Organizacao com Router

```javascript
import express from 'express'

const usersRouter = express.Router()

usersRouter.get('/', listUsers)
usersRouter.post('/', createUser)
usersRouter.put('/:id', updateUser)
usersRouter.delete('/:id', deleteUser)

// No app principal
app.use('/users', usersRouter)
```
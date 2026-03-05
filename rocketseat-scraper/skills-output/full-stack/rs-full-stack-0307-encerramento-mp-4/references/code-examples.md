# Code Examples: Fundamentos do Node.js

## 1. Criar servidor HTTP básico

```javascript
import http from 'node:http'

const server = http.createServer((request, response) => {
  const { method, url } = request

  response.writeHead(200, { 'Content-Type': 'application/json' })
  response.end(JSON.stringify({ message: 'Hello World' }))
})

server.listen(3333, () => {
  console.log('Server running on port 3333')
})
```

## 2. Parsear body da requisição

```javascript
async function parseRequestBody(request) {
  const buffers = []

  for await (const chunk of request) {
    buffers.push(chunk)
  }

  try {
    return JSON.parse(Buffer.concat(buffers).toString())
  } catch {
    return null
  }
}

// Uso no servidor
const server = http.createServer(async (request, response) => {
  const body = await parseRequestBody(request)
  // body agora contém o JSON parseado
})
```

## 3. Extrair route params

```javascript
// URL: /users/123
// Pattern: /users/:id

function extractRouteParams(pattern, url) {
  const patternParts = pattern.split('/')
  const urlParts = url.split('/')

  const params = {}

  patternParts.forEach((part, index) => {
    if (part.startsWith(':')) {
      const paramName = part.substring(1)
      params[paramName] = urlParts[index]
    }
  })

  return params
}
```

## 4. Extrair query params

```javascript
// URL: /users?search=john&page=2

function extractQueryParams(url) {
  const urlObject = new URL(url, 'http://localhost')
  const params = Object.fromEntries(urlObject.searchParams)
  return params
  // { search: 'john', page: '2' }
}
```

## 5. Dados em memória

```javascript
const database = {
  users: [],
}

// CREATE
database.users.push({ id: crypto.randomUUID(), name: 'John', email: 'john@email.com' })

// READ (all)
const users = database.users

// READ (filtered)
const filtered = database.users.filter(user => user.name.includes('John'))

// UPDATE
const userIndex = database.users.findIndex(user => user.id === id)
if (userIndex >= 0) {
  database.users[userIndex] = { ...database.users[userIndex], name: 'Jane' }
}

// DELETE
database.users = database.users.filter(user => user.id !== id)
```

## 6. Persistência em arquivo

```javascript
import fs from 'node:fs/promises'

const DATABASE_PATH = new URL('../db.json', import.meta.url)

class Database {
  #database = {}

  constructor() {
    fs.readFile(DATABASE_PATH, 'utf8')
      .then(data => { this.#database = JSON.parse(data) })
      .catch(() => { this.#persist() })
  }

  #persist() {
    fs.writeFile(DATABASE_PATH, JSON.stringify(this.#database, null, 2))
  }

  select(table, search) {
    let data = this.#database[table] ?? []

    if (search) {
      data = data.filter(row =>
        Object.entries(search).some(([key, value]) =>
          row[key]?.toLowerCase().includes(value.toLowerCase())
        )
      )
    }

    return data
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }

    this.#persist()
    return data
  }

  update(table, id, data) {
    const rowIndex = this.#database[table]?.findIndex(row => row.id === id)

    if (rowIndex > -1) {
      this.#database[table][rowIndex] = { id, ...data }
      this.#persist()
    }
  }

  delete(table, id) {
    const rowIndex = this.#database[table]?.findIndex(row => row.id === id)

    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1)
      this.#persist()
    }
  }
}
```

## 7. Combinando tudo: servidor com rotas e persistência

```javascript
import http from 'node:http'
import { Database } from './database.js'
import { extractRouteParams } from './utils/extract-route-params.js'
import { extractQueryParams } from './utils/extract-query-params.js'
import { parseRequestBody } from './utils/parse-request-body.js'

const database = new Database()

const routes = [
  {
    method: 'GET',
    pattern: '/users',
    handler: (request, response) => {
      const search = extractQueryParams(request.url)
      const users = database.select('users', search)
      return response.end(JSON.stringify(users))
    },
  },
  {
    method: 'POST',
    pattern: '/users',
    handler: (request, response) => {
      const { name, email } = request.body
      const user = database.insert('users', {
        id: crypto.randomUUID(),
        name,
        email,
      })
      return response.writeHead(201).end(JSON.stringify(user))
    },
  },
  {
    method: 'PUT',
    pattern: '/users/:id',
    handler: (request, response) => {
      const { id } = request.params
      const { name, email } = request.body
      database.update('users', id, { name, email })
      return response.writeHead(204).end()
    },
  },
  {
    method: 'DELETE',
    pattern: '/users/:id',
    handler: (request, response) => {
      const { id } = request.params
      database.delete('users', id)
      return response.writeHead(204).end()
    },
  },
]

const server = http.createServer(async (request, response) => {
  request.body = await parseRequestBody(request)

  const route = routes.find(
    route => route.method === request.method && matchPattern(route.pattern, request.url)
  )

  if (route) {
    request.params = extractRouteParams(route.pattern, request.url)
    return route.handler(request, response)
  }

  return response.writeHead(404).end(JSON.stringify({ error: 'Route not found' }))
})

server.listen(3333)
```
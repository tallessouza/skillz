# Code Examples: Banco de Dados JSON em Node.js

## Exemplo completo: database.js

```javascript
// database.js
export class Database {
  #database = {}

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }

    return data
  }

  select(table) {
    const data = this.#database[table] ?? []
    return data
  }
}
```

## Exemplo completo: integracao no servidor

```javascript
// server.js
import http from 'node:http'
import { Database } from './database.js'

const database = new Database()

const server = http.createServer((req, res) => {
  const { method, url } = req

  // POST /users — criar usuario
  if (method === 'POST' && url === '/users') {
    let body = ''
    req.on('data', chunk => { body += chunk })
    req.on('end', () => {
      const { name, email } = JSON.parse(body)

      const user = database.insert('users', {
        id: crypto.randomUUID(),
        name,
        email,
      })

      return res
        .writeHead(201)
        .end(JSON.stringify(user))
    })
    return
  }

  // GET /users — listar usuarios
  if (method === 'GET' && url === '/users') {
    const users = database.select('users')

    return res
      .writeHead(200)
      .end(JSON.stringify(users))
  }

  res.writeHead(404).end()
})

server.listen(3333)
```

## Evolucao: antes e depois

### Antes (array em memoria)

```javascript
const users = []

// No POST:
users.push({ id, name, email })

// No GET:
return users
```

### Depois (classe Database)

```javascript
const database = new Database()

// No POST:
const user = database.insert('users', { id, name, email })

// No GET:
const users = database.select('users')
```

## Demonstracao: propriedade privada

```javascript
const db = new Database()

// Funciona — atraves dos metodos publicos
db.insert('users', { name: 'Diego' })
db.select('users') // [{ name: 'Diego' }]

// NAO funciona — propriedade privada
db.#database // SyntaxError: Private field '#database' must be declared in an enclosing class
db.database  // undefined
```

## Variacao: usando para multiplas tabelas

```javascript
const database = new Database()

// Tabela de usuarios
database.insert('users', { id: '1', name: 'Diego' })
database.insert('users', { id: '2', name: 'Mayk' })

// Tabela de posts (mesmo banco!)
database.insert('posts', { id: '1', title: 'Hello World', userId: '1' })

// Selects independentes
database.select('users') // [{ id: '1', ... }, { id: '2', ... }]
database.select('posts') // [{ id: '1', title: 'Hello World', ... }]
database.select('comments') // [] — tabela nao existe, retorna array vazio
```

## O que falta (proxima aula)

A classe ainda nao persiste em arquivo. O proximo passo e:
1. Ao inserir/atualizar/deletar → escrever o objeto `#database` em um arquivo JSON
2. Ao iniciar a aplicacao → ler o arquivo JSON e popular `#database`

```javascript
// Preview do que vem a seguir:
import fs from 'node:fs/promises'

export class Database {
  #database = {}
  #path = new URL('../db.json', import.meta.url)

  constructor() {
    fs.readFile(this.#path, 'utf8')
      .then(data => { this.#database = JSON.parse(data) })
      .catch(() => { this.#persist() })
  }

  #persist() {
    fs.writeFile(this.#path, JSON.stringify(this.#database))
  }
}
```
# Code Examples: Banco de Dados em Memória

## Exemplo 1: Classe Database completa

```javascript
// src/database.js
export class Database {
  #database = {}

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }
  }

  select(table) {
    return this.#database[table] ?? []
  }
}
```

### Visualização do estado interno

```javascript
// Estado inicial
this.#database = {}

// Após database.insert('products', { name: 'Computador', price: 5000 })
this.#database = {
  products: [
    { name: 'Computador', price: 5000 }
  ]
}

// Após database.insert('products', { name: 'Mouse', price: 20 })
this.#database = {
  products: [
    { name: 'Computador', price: 5000 },
    { name: 'Mouse', price: 20 }
  ]
}

// Após database.insert('users', { name: 'Diego', email: 'diego@rs.com' })
this.#database = {
  products: [
    { name: 'Computador', price: 5000 },
    { name: 'Mouse', price: 20 }
  ],
  users: [
    { name: 'Diego', email: 'diego@rs.com' }
  ]
}
```

## Exemplo 2: Integração com o servidor

```javascript
// src/server.js
import { Database } from './database.js'

const database = new Database()

// Na rota POST /products
const { name, price } = JSON.parse(requestBody)
database.insert('products', { name, price })
return response.writeHead(201).end()

// Na rota GET /products
const products = database.select('products')
return response.end(JSON.stringify(products))
```

## Exemplo 3: Passando database para controllers

```javascript
// ERRADO — parâmetros posicionais
function handleRoute(request, response, database) {
  // Se alguém trocar a ordem na chamada, bug silencioso
}
handleRoute(request, response, database)

// CORRETO — objeto desestruturado
function handleRoute({ request, response, database }) {
  // Ordem não importa na desestruturação
}
handleRoute({ request, response, database })
// Ou mesmo:
handleRoute({ database, response, request }) // Funciona igual
```

## Exemplo 4: Demonstração da perda de dados

```bash
# Terminal rodando com --watch

# 1. Cadastrar produto
# POST /products → { name: "Computador", price: 5000 }
# Resposta: 201

# 2. Listar produtos
# GET /products
# Resposta: [{ name: "Computador", price: 5000 }]

# 3. Qualquer alteração no código → servidor reinicia automaticamente

# 4. Listar produtos novamente
# GET /products
# Resposta: [] ← dados perdidos!
```

## Variação: Database com métodos adicionais

```javascript
// Extensão natural da classe para aulas futuras
export class Database {
  #database = {}

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }
  }

  select(table) {
    return this.#database[table] ?? []
  }

  delete(table, id) {
    const index = this.#database[table]?.findIndex(row => row.id === id)
    if (index > -1) {
      this.#database[table].splice(index, 1)
    }
  }

  update(table, id, data) {
    const index = this.#database[table]?.findIndex(row => row.id === id)
    if (index > -1) {
      this.#database[table][index] = { id, ...data }
    }
  }
}
```
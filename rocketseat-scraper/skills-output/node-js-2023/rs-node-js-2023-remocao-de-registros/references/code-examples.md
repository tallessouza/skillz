# Code Examples: Remocao de Registros

## Exemplo completo: Database class com metodo delete

```javascript
import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
  #database = {}

  constructor() {
    fs.readFile(databasePath, 'utf8')
      .then(data => {
        this.#database = JSON.parse(data)
      })
      .catch(() => {
        this.#persist()
      })
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  select(table) {
    return this.#database[table] ?? []
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

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1)
      this.#persist()
    }
  }
}
```

## Exemplo completo: Extracao de params no server

```javascript
// No loop de matching de rotas no server
const route = routes.find(route => {
  return route.method === method && route.path.test(url)
})

if (route) {
  const routeParams = url.match(route.path)

  // Spread remove o null prototype do regex groups
  req.params = { ...routeParams.groups }

  return route.handler(req, res)
}
```

## Exemplo completo: Rota DELETE

```javascript
{
  method: 'DELETE',
  path: buildRoutePath('/users/:id'),
  handler: (req, res) => {
    const { id } = req.params

    database.delete('users', id)

    return res.writeHead(204).end()
  }
}
```

## Fluxo completo de teste (como o instrutor testou)

```
1. GET /users → listar usuarios, copiar um ID
2. DELETE /users/{id} → enviar request
3. Resposta: 204 No Content
4. GET /users → verificar que o usuario foi removido
```

## Variacao: desestruturacao de params

```javascript
// Ambas formas funcionam:

// Forma 1: acesso direto
const id = req.params.id

// Forma 2: desestruturacao (preferida pelo instrutor)
const { id } = req.params
```
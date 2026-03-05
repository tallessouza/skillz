# Code Examples: Filtrando Resultados por Query Parameters

## Exemplo 1: Rota com extração de query params

```javascript
// routes.js
const routes = [
  {
    method: 'GET',
    path: '/tickets',
    handler: (req, res) => {
      const { searchParams } = new URL(req.url, 'http://localhost')
      const status = searchParams.get('status')

      // Constroi objeto de filtros apenas se o param existe
      const filters = status ? { status } : null

      const tickets = database.select('tickets', filters)

      return res
        .writeHead(200)
        .end(JSON.stringify(tickets))
    }
  }
]
```

## Exemplo 2: Metodo select com filtragem

```javascript
// database.js
class Database {
  #database = {}

  select(table, filters) {
    let data = this.#database[table] ?? []

    if (filters) {
      data = data.filter(row => {
        return Object.entries(filters).some(([key, value]) => {
          return row[key].toLowerCase().includes(value.toLowerCase())
        })
      })
    }

    return data
  }
}
```

## Exemplo 3: Multiplos filtros

```javascript
// Adicionando mais filtros na rota
const status = searchParams.get('status')
const priority = searchParams.get('priority')

const filters = {}
if (status) filters.status = status
if (priority) filters.priority = priority

const hasFilters = Object.keys(filters).length > 0

const tickets = database.select('tickets', hasFilters ? filters : null)
```

## Exemplo 4: Dados do banco (db.json)

```json
{
  "tickets": [
    {
      "id": "1",
      "title": "Ticket do usuario",
      "status": "closed"
    },
    {
      "id": "2",
      "title": "Ticket do Joao",
      "status": "open"
    }
  ]
}
```

## Exemplo 5: Teste passo a passo (como o instrutor fez)

```javascript
// Passo 1: Verificar Object.entries
const filters = { status: 'open' }
console.log(Object.entries(filters))
// Output: [['status', 'open']]

// Passo 2: Verificar matching
const row = { id: '1', title: 'Ticket', status: 'open' }
const result = Object.entries(filters).some(([key, value]) => {
  return row[key].toLowerCase().includes(value.toLowerCase())
})
console.log(result) // true

// Passo 3: Com valor que nao bate
const filters2 = { status: 'closed' }
const result2 = Object.entries(filters2).some(([key, value]) => {
  return row[key].toLowerCase().includes(value.toLowerCase())
})
console.log(result2) // false
```

## Exemplo 6: Variacao com matching exato (===)

```javascript
// Se voce precisa de matching exato em vez de parcial
select(table, filters) {
  let data = this.#database[table] ?? []

  if (filters) {
    data = data.filter(row => {
      return Object.entries(filters).some(([key, value]) => {
        return row[key].toLowerCase() === value.toLowerCase()
      })
    })
  }

  return data
}
```

## Exemplo 7: Variacao com todos os filtros devem bater (every)

```javascript
// Se TODOS os filtros devem bater (AND logico em vez de OR)
select(table, filters) {
  let data = this.#database[table] ?? []

  if (filters) {
    data = data.filter(row => {
      return Object.entries(filters).every(([key, value]) => {
        return row[key].toLowerCase().includes(value.toLowerCase())
      })
    })
  }

  return data
}
// .some() = OR (pelo menos um filtro bate)
// .every() = AND (todos os filtros devem bater)
```
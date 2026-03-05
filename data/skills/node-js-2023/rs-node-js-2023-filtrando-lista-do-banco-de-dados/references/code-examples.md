# Code Examples: Filtrando Listas do Banco de Dados

## Exemplo 1: Metodo select completo da classe Database

```javascript
class Database {
  #database = {}

  select(table, search) {
    let data = this.#database[table] ?? []

    if (search) {
      data = data.filter(row => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].toLowerCase().includes(value.toLowerCase())
        })
      })
    }

    return data
  }
}
```

## Exemplo 2: Rota GET com query params

```javascript
// Antes (com bug — search vazio retorna lista vazia)
{
  method: 'GET',
  path: '/users',
  handler: (req, res) => {
    const { search } = req.query

    const users = database.select('users', {
      name: search,
      email: search
    })

    return res.end(JSON.stringify(users))
  }
}
```

```javascript
// Depois (corrigido — search vazio retorna todos)
{
  method: 'GET',
  path: '/users',
  handler: (req, res) => {
    const { search } = req.query

    const users = database.select('users', search
      ? { name: search, email: search }
      : null
    )

    return res.end(JSON.stringify(users))
  }
}
```

## Exemplo 3: Object.entries em acao

```javascript
const search = { name: "Diego", email: "Diego" }

// Object.entries transforma em:
const entries = Object.entries(search)
// [["name", "Diego"], ["email", "Diego"]]

// Desestruturando no some:
entries.some(([key, value]) => {
  console.log(key, value)
  // Primeira iteracao: "name", "Diego"
  // Segunda iteracao: "email", "Diego"
})
```

## Exemplo 4: Filtro case-insensitive passo a passo

```javascript
const users = [
  { id: 1, name: "Diego Fernandes", email: "diego@email.com" },
  { id: 2, name: "John Doe", email: "john@email.com" },
  { id: 3, name: "Diego Shell", email: "shell@email.com" }
]

const search = { name: "fernandes", email: "fernandes" }

const result = users.filter(row => {
  return Object.entries(search).some(([key, value]) => {
    // row = { id: 1, name: "Diego Fernandes", ... }
    // key = "name", value = "fernandes"
    // row["name"] = "Diego Fernandes"
    // "Diego Fernandes".toLowerCase() = "diego fernandes"
    // "diego fernandes".includes("fernandes") = true ✓
    return row[key].toLowerCase().includes(value.toLowerCase())
  })
})

// result: [{ id: 1, name: "Diego Fernandes", ... }]
```

## Exemplo 5: Variacao — busca em campos diferentes

```javascript
// Buscar tarefas por titulo OU descricao
const tasks = database.select('tasks', search
  ? { title: search, description: search }
  : null
)

// Buscar produtos so por nome
const products = database.select('products', search
  ? { name: search }
  : null
)

// Buscar por campos diferentes com termos diferentes
// (caso avancado, nao coberto na aula mas o pattern suporta)
const filtered = database.select('users', {
  name: "Diego",
  email: "skillz"
})
// Retorna usuarios cujo name contem "Diego" OU email contem "skillz"
```
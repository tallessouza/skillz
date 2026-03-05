# Code Examples: Salvando Dados no Arquivo

## Exemplo completo da classe Database

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
        this.#database = {}
      })
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database, null, 2))
  }

  select(table) {
    const data = this.#database[table] ?? []
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
}
```

## Exemplo do fluxo demonstrado no Insomnia

### Primeira requisicao — cadastrar mouse
```http
POST /products
Content-Type: application/json

{
  "name": "mouse",
  "price": 200
}
```

Resultado no `db.json`:
```json
{
  "products": [
    {
      "name": "mouse",
      "price": 200
    }
  ]
}
```

### Segunda requisicao — cadastrar teclado
```http
POST /products
Content-Type: application/json

{
  "name": "teclado",
  "price": 500
}
```

Resultado no `db.json`:
```json
{
  "products": [
    {
      "name": "mouse",
      "price": 200
    },
    {
      "name": "teclado",
      "price": 500
    }
  ]
}
```

## Variacao: persist sincrono (como mostrado na aula)

```javascript
import fs from 'node:fs'

#persist() {
  fs.writeFileSync(
    this.#databasePath,
    JSON.stringify(this.#database, null, 2)
  )
}
```

## Variacao: adicionando persist ao update e delete

```javascript
update(table, id, data) {
  const rowIndex = this.#database[table].findIndex(row => row.id === id)

  if (rowIndex > -1) {
    this.#database[table][rowIndex] = { id, ...data }
    this.#persist()
  }
}

delete(table, id) {
  const rowIndex = this.#database[table].findIndex(row => row.id === id)

  if (rowIndex > -1) {
    this.#database[table].splice(rowIndex, 1)
    this.#persist()
  }
}
```

## Variacao: inicializacao robusta com arquivo existente

```javascript
constructor() {
  fs.readFile(databasePath, 'utf8')
    .then(data => {
      this.#database = JSON.parse(data)
    })
    .catch(() => {
      // Arquivo nao existe ainda — comeca com objeto vazio
      this.#database = {}
    })
}
```
# Code Examples: Banco de Dados JSON com Persistencia

## Exemplo completo da aula — database.js

```javascript
import fs from 'node:fs/promises'

const databasePath = new URL('db.json', import.meta.url)

export class Database {
  #database = {}

  constructor() {
    fs.readFile(databasePath, 'utf-8')
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
}
```

## Instanciacao no route handler

```javascript
import { Database } from './database/database.js'

const database = new Database()

// Passando para o handler de rotas
export function routeHandler({ request, response, database }) {
  // todas as rotas tem acesso ao mesmo banco
}
```

## Evolucao: adicionando metodos insert e select

```javascript
export class Database {
  #database = {}

  constructor() {
    fs.readFile(databasePath, 'utf-8')
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

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }

    this.#persist()
    return data
  }

  select(table) {
    return this.#database[table] ?? []
  }
}
```

## Estrutura de pastas resultante

```
src/
├── database/
│   ├── database.js    # Classe Database
│   └── db.json        # Arquivo gerado automaticamente
├── middlewares/
│   └── route-handler.js
└── server.js
```

## Variacao: Database com delete e update

```javascript
delete(table, id) {
  const rowIndex = this.#database[table].findIndex(row => row.id === id)

  if (rowIndex > -1) {
    this.#database[table].splice(rowIndex, 1)
    this.#persist()
  }
}

update(table, id, data) {
  const rowIndex = this.#database[table].findIndex(row => row.id === id)

  if (rowIndex > -1) {
    this.#database[table][rowIndex] = { id, ...data }
    this.#persist()
  }
}
```

## Variacao: select com filtro (search)

```javascript
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
```

## Teste manual: verificando auto-criacao

1. Delete `db.json` manualmente
2. Reinicie o servidor: `node src/server.js`
3. Verifique: `db.json` reaparece com `{}`
4. Faca um POST para inserir dados
5. Reinicie o servidor novamente
6. Faca um GET — dados persistiram
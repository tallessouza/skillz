# Code Examples: Propriedade e Método Privado

## Exemplo completo da aula — Database.js

### Antes (tudo público)

```javascript
import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
  database = {}

  constructor() {
    fs.readFile(databasePath, 'utf8')
      .then(data => {
        this.database = JSON.parse(data)
      })
      .catch(() => {
        this.database = {}
      })
  }

  persist() {
    fs.writeFile(databasePath, JSON.stringify(this.database))
  }

  insert(table, data) {
    if (Array.isArray(this.database[table])) {
      this.database[table].push(data)
    } else {
      this.database[table] = [data]
    }
    this.persist()
    return data
  }

  select(table) {
    const data = this.database[table]
    return data ?? []
  }
}
```

### Depois (encapsulado com #)

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
    const data = this.#database[table]
    return data ?? []
  }
}
```

## Verificação no route handler

```javascript
// Antes: autocomplete mostra database, persist, insert, select
const database = new Database()
database.          // database, persist, insert, select — TUDO exposto

// Depois: autocomplete mostra apenas insert e select
const database = new Database()
database.          // insert, select — apenas a API pública
database.#database // SyntaxError — não acessível fora da classe
database.#persist() // SyntaxError — não acessível fora da classe
```

## Padrão: retorno seguro para estado vazio

```javascript
// Problema: retorna undefined quando tabela não existe
select(table) {
  return this.#database[table]  // undefined se não existir
}

// Solução: sempre retorna array
select(table) {
  return this.#database[table] ?? []  // [] se não existir
}
```

## Variação: classe com getter público para dados read-only

```javascript
class UserRepository {
  #users = []
  #lastUpdated = null

  // Getter público — read-only, sem expor o array interno
  get count() {
    return this.#users.length
  }

  get lastUpdated() {
    return this.#lastUpdated
  }

  #persist() {
    // salvar em arquivo/banco
  }

  insert(user) {
    this.#users.push(user)
    this.#lastUpdated = new Date()
    this.#persist()
  }

  select() {
    return [...this.#users]  // retorna cópia, não referência
  }
}
```

## Variação: múltiplos métodos privados auxiliares

```javascript
class Database {
  #database = {}
  #databasePath

  constructor(databasePath) {
    this.#databasePath = databasePath
    this.#load()
  }

  #load() {
    // privado — só chamado internamente
    try {
      const data = fs.readFileSync(this.#databasePath, 'utf8')
      this.#database = JSON.parse(data)
    } catch {
      this.#database = {}
    }
  }

  #persist() {
    // privado — só chamado após mutações
    fs.writeFileSync(this.#databasePath, JSON.stringify(this.#database))
  }

  #ensureTable(table) {
    // privado — garante que a tabela existe
    if (!this.#database[table]) {
      this.#database[table] = []
    }
  }

  // Apenas insert, select, delete são públicos
  insert(table, data) {
    this.#ensureTable(table)
    this.#database[table].push(data)
    this.#persist()
  }

  select(table) {
    return this.#database[table] ?? []
  }

  delete(table, id) {
    this.#database[table] = this.#database[table]?.filter(row => row.id !== id) ?? []
    this.#persist()
  }
}
```
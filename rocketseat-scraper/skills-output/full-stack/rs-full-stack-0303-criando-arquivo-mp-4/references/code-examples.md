# Code Examples: Criando Arquivo com Node.js

## Exemplo 1: Demonstrando o constructor

```javascript
// O instrutor primeiro mostra que o constructor executa automaticamente
export class Database {
  constructor() {
    console.log('construtor') // Aparece ao instanciar com new
  }
}

// No middleware:
const database = new Database() // Output: "construtor"
```

## Exemplo 2: import.meta.url para descobrir o path

```javascript
console.log(import.meta.url)
// Output: file:///home/user/project/src/database.js
```

## Exemplo 3: Construindo o database path

```javascript
// Fora da classe, no topo do modulo
const databasePath = new URL('db.json', import.meta.url)
// Resultado: file:///home/user/project/src/db.json
```

## Exemplo 4: Implementacao completa da aula

```javascript
import fs from 'node:fs/promises'

const databasePath = new URL('db.json', import.meta.url)

export class Database {
  #database = {}

  constructor() {
    this.#persist()
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }
}
```

## Exemplo 5: Variacao com await no persist

```javascript
import fs from 'node:fs/promises'

const databasePath = new URL('db.json', import.meta.url)

export class Database {
  #database = {}

  constructor() {
    // Constructor nao pode ser async, entao persist roda sem await aqui
    this.#persist()
  }

  async #persist() {
    await fs.writeFile(databasePath, JSON.stringify(this.#database))
  }
}
```

## Exemplo 6: Com formatacao legivel no JSON

```javascript
async #persist() {
  // Adiciona indentacao de 2 espacos para facilitar debug
  await fs.writeFile(databasePath, JSON.stringify(this.#database, null, 2))
}
```

## Exemplo 7: Uso no contexto do servidor (middleware)

```javascript
// middleware.js
import { Database } from './database.js'

// Ao instanciar, o constructor chama #persist automaticamente
// e o arquivo db.json e criado
const database = new Database()

export function routeHandler(request, response) {
  // database ja esta pronto para uso
}
```

## Exemplo 8: Pattern completo com metodos de CRUD

```javascript
import fs from 'node:fs/promises'

const databasePath = new URL('db.json', import.meta.url)

export class Database {
  #database = {}

  constructor() {
    this.#persist()
  }

  async #persist() {
    await fs.writeFile(databasePath, JSON.stringify(this.#database, null, 2))
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
}
```
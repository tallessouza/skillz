# Code Examples: Lendo Dados de Arquivo no Node.js

## Exemplo 1: Construtor com hidratacao (da aula)

```javascript
import fs from 'node:fs/promises'

class Database {
  #database = {}
  #databasePath = new URL('../db.json', import.meta.url)

  constructor() {
    fs.readFile(this.#databasePath, 'utf8')
      .then(data => {
        this.#database = JSON.parse(data)
      })
      .catch(() => {
        this.#persist()
      })
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

  #persist() {
    fs.writeFile(this.#databasePath, JSON.stringify(this.#database))
  }
}
```

## Exemplo 2: Console.log para debug (passo intermediario da aula)

O instrutor primeiro fez um console.log para ver o conteudo cru do arquivo:

```javascript
constructor() {
  fs.readFile(this.#databasePath, 'utf8')
    .then(data => {
      console.log(data) // mostra texto: '{"users":[...]}'
    })
}
```

Depois aplicou `JSON.parse`:

```javascript
constructor() {
  fs.readFile(this.#databasePath, 'utf8')
    .then(data => {
      console.log(JSON.parse(data)) // mostra objeto: { users: [...] }
    })
}
```

A diferenca visual: sem parse e uma string com aspas, com parse e um objeto formatado.

## Exemplo 3: Versao com arrow function de uma linha

O instrutor mencionou que como e apenas uma linha, poderia ser escrito assim:

```javascript
fs.readFile(this.#databasePath, 'utf8')
  .then(data => this.#database = JSON.parse(data))
  .catch(() => this.#persist())
```

Mas preferiu manter com chaves para extensibilidade futura.

## Exemplo 4: Variacao com delete e update

Mesma classe estendida com operacoes que tambem chamam `#persist()`:

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

Cada operacao de escrita chama `#persist()` para manter o arquivo sincronizado.

## Exemplo 5: Teste de persistencia entre restarts

```bash
# Terminal 1: inicia servidor
node --watch src/server.js

# Terminal 2: insere dados
curl -X POST http://localhost:3333/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com"}'

# Terminal 1: Ctrl+C para parar

# Terminal 1: reinicia
node --watch src/server.js

# Terminal 2: verifica que dados persistiram
curl http://localhost:3333/users
# Retorna: [{"name":"John","email":"john@example.com"}]
```
# Code Examples: Persistindo Banco de Dados

## Exemplo completo da aula — Classe Database

```javascript
import fs from 'node:fs/promises'

// Caminho relativo ao arquivo database.js, sobe uma pasta
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

## Explorando import.meta.url

```javascript
// Retorna o caminho completo do arquivo como URL
console.log(import.meta.url)
// file:///home/user/project/src/database.js
```

## Construtor URL — navegacao de caminhos

```javascript
// Mesmo diretorio do arquivo
const sameDirPath = new URL('db.json', import.meta.url)
// → /home/user/project/src/db.json

// Uma pasta acima
const parentDirPath = new URL('../db.json', import.meta.url)
// → /home/user/project/db.json

// Duas pastas acima
const grandparentPath = new URL('../../db.json', import.meta.url)
// → /home/user/db.json

// O objeto URL tem pathname com o caminho absoluto
console.log(parentDirPath.pathname)
// /home/user/project/db.json
```

## Diferenca entre fs e fs/promises

```javascript
// fs/promises — moderno, usa async/await
import fs from 'node:fs/promises'
const data = await fs.readFile('file.txt', 'utf8')

// fs tradicional — callbacks
import fs from 'node:fs'
fs.readFile('file.txt', 'utf8', (err, data) => {
  if (err) throw err
  console.log(data)
})

// fs tradicional — tem streaming (fs/promises NAO tem)
import fs from 'node:fs'
const stream = fs.createReadStream('bigfile.txt')
```

## Padrao de inicializacao segura

```javascript
constructor() {
  fs.readFile(databasePath, 'utf8')
    .then(data => {
      // Arquivo existe — carrega os dados
      this.#database = JSON.parse(data)
    })
    .catch(() => {
      // Arquivo nao existe — cria vazio
      this.#persist()
    })
}
```

Fluxo:
1. Aplicacao inicia → constructor executa
2. Tenta ler `db.json`
3. Se existe: carrega dados com `JSON.parse`
4. Se nao existe: `persist()` cria o arquivo com `{}` (objeto vazio stringificado)
5. Resultado: arquivo sempre existe apos inicializacao

## Serialize e Deserialize

```javascript
const database = { users: [{ name: 'John' }] }

// Objeto → String (para salvar em arquivo)
const json = JSON.stringify(database)
// '{"users":[{"name":"John"}]}'

// String → Objeto (para usar no codigo)
const parsed = JSON.parse(json)
// { users: [{ name: 'John' }] }
```
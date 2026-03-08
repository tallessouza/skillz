---
name: rs-node-js-2023-persistindo-banco-de-dados
description: "Applies JSON file persistence patterns when writing Node.js database layers or local storage. Use when user asks to 'persist data', 'save to file', 'create a JSON database', 'read/write files in Node', or 'use fs module'. Enforces fs/promises over callbacks, correct ESM path resolution with import.meta.url and URL constructor, and JSON serialize/deserialize patterns. Make sure to use this skill whenever implementing file-based persistence in Node.js. Not for real databases (PostgreSQL, MongoDB), streaming file operations, or browser localStorage."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: node-fundamentals
  tags: [fs-promises, json-database, file-persistence, import-meta-url, esm, node-fs, serialization]
---

# Persistindo Banco de Dados com Arquivos JSON

> Ao persistir dados em arquivos no Node.js, use fs/promises com caminhos relativos ao arquivo fonte via import.meta.url, nunca relativos ao diretorio de execucao.

## Rules

1. **Use fs/promises, nunca fs com callbacks** — `import fs from 'node:fs/promises'`, porque promises permitem async/await e codigo mais legivel
2. **Resolva caminhos com import.meta.url** — nunca use caminhos relativos simples como `'db.json'`, porque o Node resolve relativo ao CWD de execucao, nao ao arquivo fonte
3. **Use o construtor URL para montar caminhos** — `new URL('db.json', import.meta.url)` retorna o caminho relativo ao arquivo, independente de onde o script foi executado
4. **Serialize com JSON.stringify, deserialize com JSON.parse** — writeFile aceita apenas strings, entao objetos devem ser convertidos
5. **Persista apos cada mutacao** — chame persist() depois de cada insert/update/delete para garantir que o arquivo reflete o estado atual
6. **Inicialize lendo o arquivo no constructor** — use readFile no constructor com .catch para criar o arquivo vazio se nao existir
7. **__dirname e __filename nao existem em ESM** — quando o projeto usa `"type": "module"`, essas variaveis nao estao disponiveis

## How to write

### Classe Database com persistencia

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

### Resolucao de caminhos com URL

```javascript
// '../db.json' relativo ao arquivo atual — como um "cd .." no shell
const databasePath = new URL('../db.json', import.meta.url)

// import.meta.url retorna o caminho completo do arquivo atual
// Ex: file:///home/user/project/src/database.js

// O construtor URL navega a partir desse caminho
// '../db.json' = sobe uma pasta e aponta para db.json
```

## Example

**Before (caminho relativo ao CWD — bug silencioso):**
```javascript
import fs from 'node:fs/promises'

export class Database {
  #database = {}

  #persist() {
    // BUG: cria db.json onde o terminal esta, nao onde o arquivo esta
    fs.writeFile('db.json', JSON.stringify(this.#database))
  }
}
```

**After (caminho relativo ao arquivo fonte):**
```javascript
import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
  #database = {}

  constructor() {
    fs.readFile(databasePath, 'utf8')
      .then(data => { this.#database = JSON.parse(data) })
      .catch(() => { this.#persist() })
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Projeto usa `"type": "module"` | Use `import.meta.url` + `new URL()` para caminhos |
| Projeto usa CommonJS | Use `__dirname` + `path.join()` para caminhos |
| Precisa de streaming (ler/escrever por partes) | Use `fs` (nao fs/promises), pois createReadStream nao existe em promises |
| Arquivo pode nao existir na inicializacao | Leia com readFile e trate com .catch criando o arquivo vazio |
| Dados mutaram | Chame persist() imediatamente apos a mutacao |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `fs.writeFile('db.json', ...)` | `fs.writeFile(new URL('../db.json', import.meta.url), ...)` |
| `import fs from 'fs'` | `import fs from 'node:fs/promises'` |
| `fs.writeFile(path, this.#database)` | `fs.writeFile(path, JSON.stringify(this.#database))` |
| `const data = fs.readFileSync(...)` | `fs.readFile(..., 'utf8').then(...)` |
| `const __dirname = ...` (hack em ESM) | `new URL('./', import.meta.url)` |

## Troubleshooting

### Arquivo db.json e criado no diretorio errado
**Symptom:** O arquivo JSON aparece na raiz do projeto ou onde o terminal foi aberto, nao junto ao arquivo fonte
**Cause:** Caminho relativo simples como `'db.json'` resolve relativo ao CWD de execucao, nao ao arquivo
**Fix:** Use `new URL('../db.json', import.meta.url)` para resolver o caminho relativo ao arquivo fonte

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

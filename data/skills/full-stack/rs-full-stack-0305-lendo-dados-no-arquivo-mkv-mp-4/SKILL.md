---
name: rs-full-stack-0305-lendo-dados-arquivo
description: "Applies file-based data persistence pattern when reading JSON data from files in Node.js. Use when user asks to 'read a file', 'load data from disk', 'persist data', 'restore state', 'in-memory database with file backup', or 'fs readFile'. Ensures proper UTF-8 encoding, JSON.parse for deserialization, error handling with catch for file read failures, and constructor-based hydration of in-memory state. Make sure to use this skill whenever implementing file-based persistence or data recovery in Node.js. Not for database ORMs, streaming large files, or CSV/binary file parsing."
---

# Lendo Dados de Arquivo no Node.js

> Ao implementar persistencia baseada em arquivo, sempre hidrate o estado em memoria a partir do arquivo no construtor, com fallback para estado vazio em caso de erro.

## Rules

1. **Use `fs.readFile` com UTF-8** — passe `'utf8'` como encoding para receber string legivel, porque sem encoding voce recebe um Buffer raw
2. **Deserialize com `JSON.parse`** — o arquivo contem texto (via `JSON.stringify` na escrita), entao o caminho inverso e `JSON.parse` na leitura
3. **Hidrate no construtor** — carregue o arquivo e popule o estado em memoria antes de qualquer operacao, porque o `select` le da memoria, nao do arquivo
4. **Trate erro com catch** — se o arquivo nao existe ou esta corrompido, recrie o banco vazio, porque a aplicacao deve funcionar mesmo sem dados previos
5. **Mantenha simetria persist/load** — `stringify` na escrita, `parse` na leitura, sempre no mesmo path

## How to write

### Padrao construtor com hidratacao

```javascript
constructor() {
  this.#database = {}
  this.#databasePath = new URL('../db.json', import.meta.url)

  fs.readFile(this.#databasePath, 'utf8')
    .then(data => {
      this.#database = JSON.parse(data)
    })
    .catch(() => {
      this.#persist()
    })
}
```

### Simetria escrita/leitura

```javascript
// ESCRITA (persist): objeto → texto
fs.writeFile(this.#databasePath, JSON.stringify(this.#database))

// LEITURA (load): texto → objeto
fs.readFile(this.#databasePath, 'utf8')
  .then(data => { this.#database = JSON.parse(data) })
```

## Example

**Before (dados perdidos ao reiniciar):**
```javascript
class Database {
  #database = {}

  select(table) {
    return this.#database[table] ?? []
  }
}
```

**After (dados recuperados do arquivo):**
```javascript
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

  #persist() {
    fs.writeFile(this.#databasePath, JSON.stringify(this.#database))
  }
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| App inicia pela primeira vez (sem arquivo) | Catch recria banco vazio com `#persist()` |
| Arquivo existe com dados | `JSON.parse` popula `#database` |
| Dados corrompidos no arquivo | Catch trata igual arquivo inexistente |
| Precisa exibir dados apos restart | `select` le da memoria, que foi hidratada do arquivo |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `fs.readFile(path)` sem encoding | `fs.readFile(path, 'utf8')` |
| Ler arquivo a cada `select` | Ler uma vez no construtor, servir da memoria |
| `JSON.parse` sem try/catch ou `.catch` | Sempre tratar erro de parse/leitura |
| Confiar que o arquivo sempre existe | Fallback para estado vazio no catch |
| `readFileSync` no construtor | `readFile` assincrono com `.then` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre persistencia em arquivo, ciclo de vida dos dados
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
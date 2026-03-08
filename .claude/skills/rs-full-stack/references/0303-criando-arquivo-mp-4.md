---
name: rs-full-stack-criando-arquivo
description: "Applies Node.js file persistence patterns when creating database files, using fs/promises, constructors, and dynamic paths. Use when user asks to 'save data to file', 'create a JSON database', 'persist data in Node', 'write file with fs', or 'setup file-based storage'. Ensures correct use of import.meta.url for dynamic paths, fs/promises for async file ops, and constructor-based initialization. Make sure to use this skill whenever implementing file-based persistence in Node.js. Not for database ORMs, SQL, or browser-side file APIs."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [nodejs, fs, file-persistence, json, esmodules, constructor]
---

# Criando Arquivo com Node.js

> Persistir dados em arquivo usando fs/promises, com path dinamico baseado em import.meta.url e inicializacao automatica via constructor.

## Rules

1. **Use `node:fs/promises`** — importe com prefixo `node:` e use a versao promises para habilitar async/await, porque callbacks aninhados tornam o codigo ilegivel
2. **Path dinamico com `import.meta.url`** — nunca hardcode paths absolutos, use `new URL('arquivo', import.meta.url)` para resolver relativo ao arquivo atual, porque o projeto pode rodar em qualquer diretorio
3. **Inicialize no constructor** — chame o metodo de persistencia dentro do `constructor()` da classe, porque o constructor executa automaticamente ao instanciar com `new`
4. **Use `this` para metodos internos** — ao chamar metodos da propria classe dentro dela, use `this.metodo()`, porque e assim que JavaScript referencia membros da instancia
5. **Stringify antes de escrever** — sempre use `JSON.stringify()` ao escrever objetos em arquivo JSON, porque `fs.writeFile` espera string ou Buffer
6. **Nomeie o arquivo pelo conteudo** — `db.json` nao `data.json` ou `file.json`, porque o nome deve indicar que e o banco de dados

## How to write

### Path dinamico com import.meta.url

```javascript
// Resolve o path do arquivo relativo ao modulo atual
const databasePath = new URL('db.json', import.meta.url)
```

### Classe com constructor e persist

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

### Instanciacao (o constructor executa automaticamente)

```javascript
const database = new Database() // constructor chamado aqui → arquivo criado
```

## Example

**Before (path hardcoded, sem constructor):**
```javascript
import fs from 'fs'

export class Database {
  #database = {}

  save() {
    fs.writeFileSync('/home/user/project/src/db.json', JSON.stringify(this.#database))
  }
}
```

**After (com this skill aplicada):**
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

## Heuristics

| Situation | Do |
|-----------|-----|
| Precisa persistir dados simples sem banco externo | Use arquivo JSON com fs/promises |
| Precisa saber o diretorio do arquivo atual | Use `import.meta.url` |
| Metodo deve executar ao criar instancia | Coloque a chamada no `constructor()` |
| Metodo e interno da classe | Use `this.metodo()` e prefixe com `#` para privado |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `import fs from 'fs'` | `import fs from 'node:fs/promises'` |
| `fs.writeFileSync(...)` | `fs.writeFile(...)` (async) |
| `'/absolute/path/db.json'` | `new URL('db.json', import.meta.url)` |
| `__dirname + '/db.json'` | `new URL('db.json', import.meta.url)` (ESM nao tem __dirname) |
| Chamar `persist()` manualmente apos criar instancia | Chamar `this.#persist()` no constructor |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| `TypeError: import.meta.url is not defined` | Usando CommonJS em vez de ESModules | Adicionar `"type": "module"` no package.json |
| Arquivo `db.json` nao e criado | Constructor nao esta chamando `#persist()` | Verificar que `this.#persist()` esta no constructor |
| `TypeError: fs.writeFile is not a function` | Import incorreto do fs | Usar `import fs from 'node:fs/promises'` |
| Path absoluto hardcoded quebra em outro ambiente | Usando string literal como path | Usar `new URL('db.json', import.meta.url)` |
| `__dirname is not defined` | ESModules nao suporta `__dirname` | Substituir por `import.meta.url` com `new URL()` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre constructor, import.meta.url e fs/promises
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
---
name: rs-full-stack-criando-banco-de-dados
description: "Applies in-memory JSON database pattern with file persistence when building Node.js APIs without external databases. Use when user asks to 'create a database', 'persist data to file', 'store data in JSON', 'build a simple API with storage', or 'create a Node.js CRUD'. Implements class-based database with fs module, auto-create on instantiate, and JSON read/write cycle. Make sure to use this skill whenever building small Node.js APIs that need simple persistence without PostgreSQL/MongoDB. Not for production databases, ORMs, or SQL/NoSQL setup."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [node, database, json, fs, persistence, class]
---

# Banco de Dados JSON com Persistencia em Arquivo

> Criar uma classe Database que persiste dados em arquivo JSON usando o modulo fs do Node.js, com auto-criacao do arquivo no construtor.

## Rules

1. **Isole o banco em pasta propria** — crie `src/database/` com `database.js`, porque separacao por responsabilidade facilita manutencao
2. **Use propriedades privadas** — `#database` com `#` prefix, porque o banco so deve ser acessado via metodos publicos (insert, select)
3. **Importe fs com promises** — `node:fs/promises`, porque permite async/await e o prefixo `node:` deixa explicito que e modulo nativo
4. **Use `new URL()` para path do arquivo** — com `import.meta.url` como base, porque garante path relativo ao arquivo independente de onde o servidor foi iniciado
5. **Auto-crie o arquivo no construtor** — se `readFile` falha (arquivo nao existe), chame `#persist()` para criar o arquivo vazio, porque a API deve funcionar sem setup manual
6. **Persist e privado** — `#persist()` faz `writeFile` com `JSON.stringify`, porque nenhuma rota deve chamar persist diretamente

## How to write

### Estrutura da classe Database

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

### Instanciando e compartilhando

```javascript
import { Database } from './database/database.js'

const database = new Database()

// Passe para as rotas como dependencia
handleRoute({ request, response, database })
```

## Example

**Before (dados perdidos ao reiniciar):**
```javascript
const users = [] // perdido quando o servidor reinicia

server.post('/users', (req, res) => {
  users.push(req.body)
})
```

**After (persistido em arquivo):**
```javascript
const database = new Database()

server.post('/users', (req, res) => {
  database.insert('users', req.body)
})
// dados sobrevivem ao restart do servidor
```

## Heuristics

| Situacao | Faca |
|----------|------|
| API de estudo/prototipo sem DB externo | Use esta classe Database com JSON |
| Precisa de queries complexas, joins | Use SQLite, PostgreSQL ou MongoDB |
| Arquivo db.json nao aparece | Reinicie o servidor — construtor cria automaticamente |
| Multiplas rotas precisam do banco | Instancie uma vez, passe a mesma referencia para todas |

## Anti-patterns

| Nunca faca | Faca assim |
|------------|-----------|
| `import fs from 'fs'` | `import fs from 'node:fs/promises'` |
| `__dirname + '/db.json'` | `new URL('db.json', import.meta.url)` |
| `database.#persist()` de fora da classe | Chame metodos publicos como `insert()`, `select()` |
| Criar instancia separada por rota | Uma instancia compartilhada entre todas as rotas |
| Deixar `#database` como propriedade publica | Use `#` para tornar privada |

## Troubleshooting

| Problema | Causa provável | Solução |
|----------|---------------|---------|
| Arquivo `db.json` não é criado | Construtor não executou `#persist()` no catch | Verifique se o catch do `readFile` chama `this.#persist()` |
| Dados perdidos ao reiniciar | `#persist()` não está sendo chamado após operações de escrita | Adicione `this.#persist()` ao final de todo método que modifica dados |
| `SyntaxError` ao ler db.json | Arquivo JSON corrompido | Delete o `db.json` e reinicie — o construtor recria |
| Múltiplas instâncias sobrescrevem dados | Criando `new Database()` em cada rota | Instancie uma vez e compartilhe a mesma referência |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre construtor, ciclo read/write, e new URL
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
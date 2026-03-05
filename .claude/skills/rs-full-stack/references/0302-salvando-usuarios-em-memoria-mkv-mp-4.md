---
name: rs-full-stack-salvando-usuarios-em-memoria
description: "Applies in-memory database pattern when building Node.js APIs with class-based data storage. Use when user asks to 'create a database class', 'store data in memory', 'build an in-memory store', 'share state between routes', or 'prototype an API without a real database'. Enforces single-instance sharing, proper insert/select methods, and object-based table structure. Make sure to use this skill whenever prototyping Node.js APIs that need temporary data persistence. Not for production database setup, SQL queries, or ORM configuration."
---

# Banco de Dados em Memória com Classes

> Ao prototipar APIs Node.js, use uma classe Database com instância única compartilhada entre todas as rotas para garantir consistência dos dados em memória.

## Rules

1. **Crie uma classe Database com objeto interno como armazenamento** — `this.#database = {}` onde cada chave representa uma tabela e o valor é um array de registros, porque isso simula a estrutura tabela/coleção de bancos reais
2. **Compartilhe uma única instância entre todas as rotas** — `const database = new Database()` uma vez, passado para todos os controllers, porque múltiplas instâncias alocam espaços diferentes na memória e os dados ficam inconsistentes
3. **Verifique se a tabela existe antes de inserir** — use `Array.isArray()` para checar se a coleção já foi criada, porque a primeira inserção precisa criar o array da tabela
4. **Passe dependências como objeto desestruturado** — `{ request, response, database }` em vez de parâmetros posicionais, porque evita erros de ordem nos argumentos
5. **Retorne status 201 sem corpo na criação** — `return response.writeHead(201).end()`, porque o status code já comunica sucesso na inserção
6. **Entenda que dados em memória são temporários** — qualquer reinício do servidor apaga tudo, porque o objeto vive apenas no processo Node.js atual

## How to write

### Classe Database

```javascript
// src/database.js
export class Database {
  #database = {}

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }
  }

  select(table) {
    return this.#database[table] ?? []
  }
}
```

### Instância única compartilhada

```javascript
// src/server.js
import { Database } from './database.js'

const database = new Database()

// Passar para TODAS as rotas a mesma instância
routeHandler({ request, response, database })
```

### Controller usando o banco

```javascript
// POST - criar registro
const { name, price } = requestBody
database.insert('products', { name, price })
return response.writeHead(201).end()

// GET - listar registros
const products = database.select('products')
return response.end(JSON.stringify(products))
```

## Example

**Before (instância separada por rota — bug):**
```javascript
// Cada rota cria sua própria instância
function createRoute(req, res) {
  const db = new Database() // Nova instância!
  db.insert('products', data)
}

function listRoute(req, res) {
  const db = new Database() // Outra instância — dados diferentes!
  const products = db.select('products') // Sempre vazio
}
```

**After (instância compartilhada — correto):**
```javascript
const database = new Database() // Uma instância

function createRoute({ request, response, database }) {
  database.insert('products', data)
  return response.writeHead(201).end()
}

function listRoute({ request, response, database }) {
  const products = database.select('products') // Mesmos dados
  return response.end(JSON.stringify(products))
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Prototipando API sem banco real | Use classe Database em memória |
| Precisa de persistência entre reinícios | Salve em arquivo (próximo passo) ou use banco real |
| Múltiplas rotas precisam dos mesmos dados | Compartilhe uma única instância |
| Primeiro insert numa tabela nova | Verifique com `Array.isArray` e crie o array |
| Passando dependências para controllers | Use objeto desestruturado `{ request, response, database }` |

## Anti-patterns

| Nunca faça | Faça ao invés |
|------------|---------------|
| `new Database()` dentro de cada rota | Uma instância compartilhada entre todas |
| `handler(req, res, db)` posicional | `handler({ request, response, database })` desestruturado |
| Retornar corpo na criação | `response.writeHead(201).end()` sem corpo |
| Assumir que dados sobrevivem ao reinício | Documentar que memória é temporária |
| `this.database = {}` (público) | `this.#database = {}` (campo privado) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre instância única, alocação em memória e ciclo de vida dos dados
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-0302-salvando-usuarios-em-memoria-mkv-mp-4/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-0302-salvando-usuarios-em-memoria-mkv-mp-4/references/code-examples.md)

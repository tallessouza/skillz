---
name: rs-node-js-2023-criando-banco-de-dados-json
description: "Applies JSON file-based database pattern when building Node.js applications without a real database. Use when user asks to 'persist data without database', 'create a simple database', 'store data in JSON file', 'build in-memory database with persistence', or 'avoid losing data on restart'. Enforces class-based DB with private properties, generic table structure, and insert/select methods. Make sure to use this skill whenever creating local persistence layers in Node.js learning projects. Not for production databases, ORMs, SQL/NoSQL setup, or migration workflows."
---

# Banco de Dados JSON em Node.js

> Persista dados em arquivo JSON usando uma classe genérica com propriedades privadas e métodos de acesso controlado.

## Rules

1. **Crie uma classe Database genérica** — use um objeto interno como storage, nao um array especifico, porque permite multiplas "tabelas" no mesmo banco
2. **Use propriedades privadas (#)** — `#database` nao `database`, porque metodos insert/select sao a porta de entrada, ninguem externo deve acessar o storage diretamente
3. **Organize por tabelas (chaves do objeto)** — cada chave do objeto e uma "tabela" com um array de registros, porque isso permite reusar o mesmo banco para users, posts, etc
4. **Select retorna array vazio se tabela nao existe** — nunca retorne `undefined`, porque o consumidor espera sempre um array iteravel
5. **Insert verifica se tabela ja existe** — use `Array.isArray()` antes de fazer push, porque a tabela pode nao ter sido criada ainda
6. **Retorne o item inserido no insert** — porque permite encadear operacoes e confirmar o que foi salvo

## How to write

### Classe Database com propriedade privada

```javascript
export class Database {
  #database = {}

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }

    return data
  }

  select(table) {
    const data = this.#database[table] ?? []
    return data
  }
}
```

### Uso no servidor

```javascript
import { Database } from './database.js'

const database = new Database()

// Insert
const user = database.insert('users', { id, name, email })

// Select
const users = database.select('users')
```

## Example

**Before (dados em memoria, sem classe):**
```javascript
const users = []

// POST
users.push({ id, name, email })

// GET
return users
// Problema: reiniciou o servidor, perdeu tudo
```

**After (classe Database generica):**
```javascript
import { Database } from './database.js'
const database = new Database()

// POST
const user = database.insert('users', { id, name, email })

// GET
const users = database.select('users')
// Proximo passo: persistir em arquivo fisico
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Projeto de estudo sem banco real | Use classe Database com JSON |
| Precisa de multiplas "tabelas" | Use objeto com chaves dinamicas |
| Propriedade interna da classe | Sempre `#private` |
| Tabela pode nao existir ainda | Retorne `[]` no select, crie array no insert |
| Precisa confirmar insercao | Retorne `data` no final do insert |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `const users = []` (variavel global) | `class Database { #database = {} }` |
| `this.database` (propriedade publica) | `this.#database` (propriedade privada) |
| `return this.#database[table]` (pode ser undefined) | `return this.#database[table] ?? []` |
| `this.#database[table].push(data)` (sem verificar) | `if (Array.isArray(...)) { push } else { create }` |
| Classe especifica `UserDatabase` | Classe generica `Database` com parametro `table` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/node-js/rs-node-js-2023-criando-banco-de-dados-json/references/deep-explanation.md)
- [Code examples](../../../data/skills/node-js/rs-node-js-2023-criando-banco-de-dados-json/references/code-examples.md)

---
name: 2023-criando-banco-de-dados-json
description: "Applies JSON file-based database pattern using a generic class with private properties in Node.js. Use when user asks to 'create a database class', 'persist data in json', 'store data in memory', 'implement select and insert', or 'build a simple database'. Enforces private properties, array fallback on select, table existence check on insert. Make sure to use this skill whenever building lightweight persistence layers in Node.js without external databases. Not for production databases, ORMs, or SQL-based storage."
category: coding-lens
tags: [json-database, persistence, class, private-properties, node-js]
mind_lenses: [LT_01, LT_02, MF_01, GB_01, TH_04]
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: persistence
  tags: [json-database, persistence, class, private-properties, node-js, in-memory]
---

# Banco de Dados JSON em Node.js

> Persista dados em arquivo JSON usando uma classe generica com propriedades privadas e metodos de acesso controlado.

## Rules

1. **Crie uma classe Database generica** — use um objeto interno como storage, porque permite multiplas "tabelas" no mesmo banco
2. **Use propriedades privadas (#)** — `#database` nao `database`, porque metodos insert/select sao a porta de entrada controlada
3. **Organize por tabelas (chaves do objeto)** — cada chave e uma "tabela" com array de registros
4. **Select retorna array vazio se tabela nao existe** — nunca retorne `undefined`, porque o consumidor espera sempre um array iteravel
5. **Insert verifica se tabela ja existe** — use `Array.isArray()` antes de push
6. **Retorne o item inserido no insert** — porque permite encadear operacoes

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
    return this.#database[table] ?? []
  }
}
```

### Uso no servidor

```javascript
import { Database } from './database.js'
const database = new Database()

const user = database.insert('users', { id, name, email })
const users = database.select('users')
```

## Example

**Before (dados em memoria, sem classe):**
```javascript
const users = []
users.push({ id, name, email })
return users
```

**After (classe Database generica):**
```javascript
import { Database } from './database.js'
const database = new Database()
const user = database.insert('users', { id, name, email })
const users = database.select('users')
```

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `const users = []` (variavel global) | `class Database { #database = {} }` |
| `this.database` (propriedade publica) | `this.#database` (propriedade privada) |
| `return this.#database[table]` (pode ser undefined) | `return this.#database[table] ?? []` |
| `this.#database[table].push(data)` (sem verificar) | `if (Array.isArray(...)) { push } else { create }` |

## Troubleshooting

### Select retorna undefined em vez de array vazio
**Symptom:** Erro ao iterar resultado de `select` quando tabela nao existe
**Cause:** Retorno direto sem fallback para array vazio
**Fix:** Use `this.#database[table] ?? []` no select

## Deep reference library

- [deep-explanation.md](mdc:data/skills/node-js-2023/rs-node-js-2023-criando-banco-de-dados-json/references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](mdc:data/skills/node-js-2023/rs-node-js-2023-criando-banco-de-dados-json/references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

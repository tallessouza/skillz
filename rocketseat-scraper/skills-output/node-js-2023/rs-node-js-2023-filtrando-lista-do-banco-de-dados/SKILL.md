---
name: rs-node-js-2023-filtrando-lista-db
description: "Applies in-memory filtering patterns for JavaScript/Node.js database lists using Object.entries, Array.some, and Array.filter. Use when user asks to 'filter a list', 'add search to an endpoint', 'implement query params filtering', 'search across multiple fields', or 'case-insensitive search'. Make sure to use this skill whenever implementing search/filter logic over in-memory collections or simple databases. Not for SQL queries, ORM filters, or full-text search engines like Elasticsearch."
---

# Filtrando Listas do Banco de Dados

> Implemente filtros em listas in-memory usando Object.entries + Array.some + Array.filter para busca multi-campo case-insensitive.

## Rules

1. **Receba search como objeto chave-valor** — `{ name: "Diego", email: "Diego" }`, porque permite buscar o mesmo termo em multiplos campos simultaneamente
2. **Converta objetos para arrays com Object.entries** — porque objetos nao tem forEach/filter/some, arrays sim
3. **Use Array.some para busca OR** — se pelo menos UM campo contem o valor, o item e incluido, porque busca em multiplos campos deve ser inclusiva
4. **Normalize com toLowerCase antes de comparar** — `row[key].toLowerCase().includes(value.toLowerCase())`, porque busca case-sensitive frustra o usuario
5. **Retorne tudo quando search estiver vazio** — se search e null/undefined, nao filtre, porque listar sem filtro deve retornar todos os registros
6. **Use let quando o valor sera reatribuido** — `let data = ...` quando data pode ser filtrada depois, porque const impede reatribuicao

## How to write

### Metodo select com filtro opcional

```javascript
select(table, search) {
  let data = this.#database[table] ?? []

  if (search) {
    data = data.filter(row => {
      return Object.entries(search).some(([key, value]) => {
        return row[key].toLowerCase().includes(value.toLowerCase())
      })
    })
  }

  return data
}
```

### Passando search da rota para o database

```javascript
// Na rota GET, extraia search dos query params
const { search } = req.query

// Envie objeto de busca apenas se search existir
database.select('users', search
  ? { name: search, email: search }
  : null
)
```

## Example

**Before (busca quebrada, case-sensitive, sem fallback):**

```javascript
select(table) {
  return this.#database[table] ?? []
}

// Na rota:
const { search } = req.query
const users = database.select('users')
const filtered = users.filter(u => u.name === search) // case-sensitive, campo unico
```

**After (multi-campo, case-insensitive, fallback para todos):**

```javascript
select(table, search) {
  let data = this.#database[table] ?? []

  if (search) {
    data = data.filter(row => {
      return Object.entries(search).some(([key, value]) => {
        return row[key].toLowerCase().includes(value.toLowerCase())
      })
    })
  }

  return data
}

// Na rota:
const { search } = req.query
const users = database.select('users', search
  ? { name: search, email: search }
  : null
)
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Busca em 1 campo apenas | Simplifique: `data.filter(row => row.name.includes(value))` |
| Busca em multiplos campos | Use Object.entries + some pattern |
| Search vazio ou undefined | Retorne todos os registros (nao filtre) |
| Dados case-sensitive no DB | Normalize com toLowerCase em ambos os lados |
| Precisa de busca parcial | Use `.includes()`, nao `===` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `row.name === search` (exact match) | `row.name.toLowerCase().includes(search.toLowerCase())` |
| `if (!search) return []` (vazio = nada) | `if (!search) return data` (vazio = tudo) |
| `const data = ...` quando vai reatribuir | `let data = ...` |
| Iterar objeto com `for...in` para filtro | `Object.entries(search).some(...)` |
| Passar campos hardcoded no database | Passar objeto search generico do controller |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

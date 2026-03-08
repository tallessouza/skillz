---
name: rs-full-stack-filtrando-pelo-status
description: "Applies query parameter filtering patterns when building Node.js API endpoints with in-memory or JSON-based databases. Use when user asks to 'filter results', 'add query params', 'filter by status', 'search by field', or 'add filters to endpoint'. Implements optional filter objects, Array.filter with Object.entries, and .some() for multi-key matching. Make sure to use this skill whenever implementing list endpoints with optional filtering. Not for SQL/ORM queries, pagination, or full-text search."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: fundamentos
  tags: [node, filter, query-params, array, object-entries, includes]
---

# Filtrando Resultados por Query Parameters

> Construa filtros opcionais como objetos, passe-os para a camada de dados, e use `filter` + `Object.entries` + `some` + `includes` para matching flexivel.

## Rules

1. **Encapsule filtros em um objeto** — `{ status: 'open' }` nao parametros soltos, porque permite adicionar novos filtros sem mudar a assinatura da funcao
2. **Trate filtros ausentes como nulo** — se o query param nao existe, passe `null` em vez de objeto vazio, porque isso evita filtragem desnecessaria
3. **Normalize para minusculo antes de comparar** — `toLowerCase()` tanto na chave quanto no valor, porque dados podem vir com casing inconsistente da API
4. **Use `some` + `includes` para matching flexivel** — `Object.entries(filters).some(([key, value]) => row[key].toLowerCase().includes(value.toLowerCase()))`, porque permite multiplos filtros e matching parcial
5. **Retorne todos os registros quando nao ha filtro** — se `filters` e nulo, retorne o array completo sem chamar `.filter()`, porque evita processamento desnecessario

## How to write

### Construindo o objeto de filtros na rota

```javascript
// Na rota, construa o objeto de filtros a partir dos query params
const status = searchParams.get('status')
const filters = status ? { status } : null

const items = database.select('tickets', filters)
```

### Aplicando filtros na camada de dados

```javascript
select(table, filters) {
  let data = this.#database[table] ?? []

  if (filters) {
    data = data.filter(row => {
      return Object.entries(filters).some(([key, value]) => {
        return row[key].toLowerCase().includes(value.toLowerCase())
      })
    })
  }

  return data
}
```

## Example

**Before (sem filtro, retorna tudo):**
```javascript
// Rota
const items = database.select('tickets')

// Database
select(table) {
  return this.#database[table] ?? []
}
```

**After (com filtro opcional por query param):**
```javascript
// Rota
const status = searchParams.get('status')
const filters = status ? { status } : null
const items = database.select('tickets', filters)

// Database
select(table, filters) {
  let data = this.#database[table] ?? []

  if (filters) {
    data = data.filter(row => {
      return Object.entries(filters).some(([key, value]) => {
        return row[key].toLowerCase().includes(value.toLowerCase())
      })
    })
  }

  return data
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Query param pode nao existir | Ternario: `param ? { param } : null` |
| Multiplos filtros possiveis | Adicione mais chaves ao objeto: `{ status, priority }` |
| Dados vem de arquivo JSON | Use `let` para o array, reatribua apos filtrar |
| Comparacao case-sensitive causando bugs | `toLowerCase()` em ambos os lados |
| Filtro parcial (busca por substring) | `includes()` em vez de `===` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `select(table, status, priority, ...)` | `select(table, filters)` com objeto |
| `if (status !== undefined && status !== null)` | `status ? { status } : null` |
| `row.status === value` sem normalizar | `row[key].toLowerCase().includes(value.toLowerCase())` |
| `data = data.filter(...)` sem checar se filtro existe | `if (filters) { data = data.filter(...) }` |
| Filtros hardcoded por campo | `Object.entries(filters).some(...)` generico |

## Troubleshooting

| Problema | Causa provável | Solução |
|----------|---------------|---------|
| Filtro não encontra registros | Comparação case-sensitive | Aplique `toLowerCase()` em ambos os lados da comparação |
| `TypeError: row[key].toLowerCase is not a function` | Valor do campo não é string (número, boolean) | Converta com `String(row[key])` antes do `toLowerCase()` |
| Filtro retorna todos os registros | Objeto de filtros é `null` e select não filtra | Verifique se o query param está sendo capturado corretamente |
| Múltiplos filtros não funcionam juntos | Usando `some` quando deveria usar `every` | `some` = OR (qualquer filtro bate), `every` = AND (todos devem bater) |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre Object.entries, some e includes
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
---
name: rs-full-stack-select-4
description: "Applies Knex.js query builder SELECT patterns when writing database queries in Node.js. Use when user asks to 'list records', 'fetch data', 'query database', 'select from table', 'order results', or any read operation with Knex. Covers raw SQL vs method chaining, select(), orderBy() with asc/desc. Make sure to use this skill whenever generating Knex select queries or listing endpoints. Not for insert, update, delete operations, or non-Knex ORMs."
---

# Select com Query Builder (Knex.js)

> Ao buscar dados com Knex, prefira method chaining sobre raw SQL — é composável, legível e permite encadear ordenação, filtros e seleção de colunas.

## Rules

1. **Prefira method chaining sobre raw** — `knex("tabela").select()` não `knex.raw("SELECT * FROM tabela")`, porque method chaining é composável e permite encadear `.orderBy()`, `.where()`, etc.
2. **Use raw apenas para queries complexas sem equivalente no builder** — subqueries avançadas, CTEs, porque o builder cobre 90% dos casos
3. **Sempre use async/await** — rotas que acessam banco são assíncronas, porque o knex retorna Promises
4. **orderBy explicita a direção** — `orderBy("name", "asc")` não `orderBy("name")`, porque torna a intenção clara mesmo quando asc é o padrão
5. **select() vazio = SELECT \*** — chamar `.select()` sem argumentos retorna todas as colunas, porque é equivalente a `SELECT *`

## How to write

### Rota de listagem com method chaining

```javascript
app.get("/courses", async (request, response) => {
  const courses = await knex("courses").select().orderBy("name", "asc")
  return response.json(courses)
})
```

### Alternativa com raw SQL (quando necessário)

```javascript
const courses = await knex.raw("SELECT * FROM courses")
return response.json(courses)
```

### orderBy com direção

```javascript
// Ascendente (A-Z, menor para maior) — padrão
.orderBy("name", "asc")

// Descendente (Z-A, maior para menor)
.orderBy("name", "desc")

// Por coluna numérica
.orderBy("id", "asc")
```

## Example

**Before (raw SQL inline):**
```javascript
app.get("/courses", async (req, res) => {
  const courses = await knex.raw("SELECT * FROM courses ORDER BY name ASC")
  return res.json(courses)
})
```

**After (method chaining):**
```javascript
app.get("/courses", async (request, response) => {
  const courses = await knex("courses").select().orderBy("name", "asc")
  return response.json(courses)
})
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Listar todos os registros | `knex("tabela").select()` |
| Ordenar por texto (nome) | `.orderBy("name", "asc")` — A a Z |
| Ordenar por número (id) | `.orderBy("id", "asc")` — menor para maior |
| Inverter ordenação | Trocar `"asc"` por `"desc"` |
| Query SQL complexa sem equivalente builder | Usar `knex.raw()` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `knex.raw("SELECT * FROM courses")` para queries simples | `knex("courses").select()` |
| `.orderBy("name")` sem direção explícita | `.orderBy("name", "asc")` |
| Callback síncrono em rota com banco | `async (request, response) => {}` |
| `response.send(courses)` para dados estruturados | `response.json(courses)` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre raw vs method chaining, composabilidade
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
---
name: rs-full-stack-select-com-join
description: "Applies SQL JOIN patterns when writing queries with Knex.js query builder. Use when user asks to 'join tables', 'connect tables', 'list related data', 'query with relationships', or 'select from multiple tables'. Covers join syntax, column selection, aliasing with .as() to avoid ambiguity, and foreign key connections. Make sure to use this skill whenever generating Knex queries that involve more than one table. Not for raw SQL, ORM relations like Prisma includes, or database schema creation."
---

# Select com Join (Query Builder)

> Ao consultar dados relacionados, use join para conectar tabelas pela chave primaria e estrangeira, e renomeie colunas ambiguas com alias.

## Rules

1. **Use .join() apos .select()** — `knex("tabela").select().join(...)`, porque o encadeamento segue a ordem logica da query SQL
2. **Especifique chave primaria e estrangeira no join** — `join("tabela_relacionada", "tabela.id", "tabela_relacionada.tabela_id")`, porque o Knex precisa saber exatamente quais colunas conectam as tabelas
3. **Selecione colunas explicitas em queries com join** — `select("tabela.coluna")`, porque colunas com mesmo nome em tabelas diferentes causam ambiguidade
4. **Renomeie colunas ambiguas com .as()** — `select("courses.name as curso")`, porque sem alias o resultado tera dois campos "name" indistinguiveis
5. **Confira singular/plural nos nomes de tabela** — erros de digitacao como `curse` vs `curses` causam "table not found" silenciosamente

## How to write

### Join basico entre duas tabelas

```typescript
app.get("/courses/:id/modules", async (request, response) => {
  const courses = await knex("courses")
    .select()
    .join("course_modules", "courses.id", "course_modules.course_id")

  return response.json(courses)
})
```

### Join com colunas especificas e alias

```typescript
const modules = await knex("courses")
  .select(
    "course_modules.id as module_id",
    "course_modules.name as module",
    "courses.id as course_id",
    "courses.name as course"
  )
  .join("course_modules", "courses.id", "course_modules.course_id")
```

### Select filtrando colunas sem join

```typescript
// Passar cada coluna como argumento separado (nao na mesma string)
const courses = await knex("courses").select("id", "name")
// ERRADO: .select("id, name") — isso e uma unica string, nao dois argumentos
```

## Example

**Before (sem join, dados desconectados):**
```typescript
app.get("/courses/:id/modules", async (req, res) => {
  const modules = await knex("course_modules").select()
  // Retorna course_id mas nao sabemos o nome do curso
  return res.json(modules)
})
```

**After (com join e alias):**
```typescript
app.get("/courses/:id/modules", async (req, res) => {
  const { id } = req.params

  const modules = await knex("courses")
    .select(
      "course_modules.id as module_id",
      "course_modules.name as module",
      "courses.name as course"
    )
    .join("course_modules", "courses.id", "course_modules.course_id")
    .where("courses.id", id)

  return res.json(modules)
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Duas tabelas tem coluna com mesmo nome | Use alias com `.as()` ou `"tabela.coluna as apelido"` |
| Select sem argumentos | Retorna todas as colunas (cuidado com ambiguidade em joins) |
| Erro "table not found" | Verifique singular/plural e underscores no nome da tabela |
| Precisa mostrar dados da tabela pai junto com filhos | Use join conectando PK da pai com FK da filha |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `.select("id, name")` (uma string so) | `.select("id", "name")` (argumentos separados) |
| `.join("modules", "id", "course_id")` (sem prefixo de tabela) | `.join("modules", "courses.id", "modules.course_id")` |
| Dois campos "name" sem alias num join | `"courses.name as course"`, `"modules.name as module"` |
| Query em tabela filha sem join quando precisa dados da pai | Join a partir da tabela pai conectando com a filha |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre joins, chaves e ambiguidade
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo da aula com variacoes
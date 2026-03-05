# Code Examples: Insert com Knex Raw

## Exemplo da aula — Insert com raw

```typescript
// Setup da conexao (knex ja configurado)
const knex = require("./database")

// Insert usando query builder (preferido)
await knex("courses").insert({ name: "JavaScript" })

// Mesmo insert usando raw SQL com placeholder
await knex.raw("INSERT INTO courses (name) VALUES(?)", ["HTML"])
```

## Variacoes

### Multiplas colunas

```typescript
// Query builder
await knex("courses").insert({
  name: "TypeScript",
  duration: 40,
  category: "programming"
})

// Raw equivalente
await knex.raw(
  "INSERT INTO courses (name, duration, category) VALUES(?, ?, ?)",
  ["TypeScript", 40, "programming"]
)
```

### Insert multiplo (batch)

```typescript
// Query builder
await knex("courses").insert([
  { name: "HTML" },
  { name: "CSS" },
  { name: "JavaScript" }
])

// Raw equivalente
await knex.raw(
  "INSERT INTO courses (name) VALUES(?), (?), (?)",
  ["HTML", "CSS", "JavaScript"]
)
```

### Insert com retorno (PostgreSQL)

```typescript
// Query builder
const [course] = await knex("courses")
  .insert({ name: "React" })
  .returning("*")

// Raw equivalente
const result = await knex.raw(
  "INSERT INTO courses (name) VALUES(?) RETURNING *",
  ["React"]
)
const course = result.rows[0]
```

### Select com raw

```typescript
// O instrutor menciona que raw funciona para todos os comandos
const users = await knex.raw("SELECT * FROM users WHERE age > ?", [18])
```

### Update com raw

```typescript
await knex.raw(
  "UPDATE courses SET name = ? WHERE id = ?",
  ["TypeScript Avançado", 1]
)
```

### Delete com raw

```typescript
await knex.raw("DELETE FROM courses WHERE id = ?", [5])
```

### Named bindings (alternativa aos placeholders ?)

```typescript
// Knex tambem suporta named bindings com :nome:
await knex.raw(
  "INSERT INTO courses (name) VALUES(:courseName)",
  { courseName: "Vue.js" }
)
```

### Misturando raw com query builder

```typescript
// Raw dentro de uma query builder
const courses = await knex("courses")
  .select("*")
  .whereRaw("name LIKE ?", ["%Script%"])
  .orderByRaw("created_at DESC")
```
---
name: rs-full-stack-insert-com-knex-raw
description: "Applies Knex raw SQL patterns when writing database queries with Knex.js query builder. Use when user asks to 'write raw SQL with Knex', 'use knex.raw', 'insert with raw query', 'execute SQL directly', or 'bypass query builder'. Ensures parameterized queries with ? placeholders to prevent SQL injection. Make sure to use this skill whenever combining raw SQL with Knex query builder. Not for Prisma, TypeORM, Drizzle, or pure SQL without Knex."
---

# Insert com Knex Raw

> Ao usar SQL direto no Knex, sempre use `knex.raw()` com placeholders `?` para parametrizar valores — nunca interpole strings.

## Rules

1. **Use `knex.raw()` para SQL direto** — `await knex.raw("INSERT INTO ...")` nao template literals com SQL, porque o metodo raw gerencia conexao, escaping e logging automaticamente
2. **Sempre use `?` como placeholder** — `VALUES(?)` nao `VALUES('${value}')`, porque placeholders previnem SQL injection e o Knex faz o binding automatico
3. **Passe valores como array no segundo argumento** — `knex.raw("... VALUES(?)", ["valor"])`, porque mantem SQL e dados separados
4. **Prefira query builder quando possivel** — raw e para cenarios onde o query builder nao atende, porque query builder e mais portavel entre bancos

## How to write

### Insert com raw SQL parametrizado

```typescript
// SQL direto com placeholder ? e valores no array
await knex.raw("INSERT INTO courses (name) VALUES(?)", ["HTML"])
```

### Equivalente com query builder (preferido)

```typescript
// Query builder — mais legivel e portavel
await knex("courses").insert({ name: "HTML" })
```

## Example

**Before (SQL injection vulneravel):**
```typescript
const courseName = "TypeScript"
await knex.raw(`INSERT INTO courses (name) VALUES('${courseName}')`)
```

**After (com esta skill aplicada):**
```typescript
const courseName = "TypeScript"
await knex.raw("INSERT INTO courses (name) VALUES(?)", [courseName])
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Insert/update/delete simples | Use query builder (`knex("table").insert(...)`) |
| SQL complexo que o builder nao suporta | Use `knex.raw()` com placeholders |
| Multiplos valores para concatenar | Passe todos no array: `knex.raw("... (?, ?)", [v1, v2])` |
| Precisa de SQL especifico do banco | `knex.raw()` e a escolha certa |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `` knex.raw(`INSERT ... '${val}'`) `` | `knex.raw("INSERT ... ?", [val])` |
| `knex.raw("INSERT ... '" + val + "'")` | `knex.raw("INSERT ... ?", [val])` |
| SQL direto sem `knex.raw()` | Sempre passe pelo `knex.raw()` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre quando usar raw vs query builder
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-insert-com-knex-raw/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-insert-com-knex-raw/references/code-examples.md)

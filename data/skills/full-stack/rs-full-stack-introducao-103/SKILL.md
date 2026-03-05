---
name: rs-full-stack-introducao-103
description: "Applies Query Builder patterns when writing database access code in Node.js/TypeScript. Use when user asks to 'query database', 'insert data', 'create migration', 'seed database', or replace raw SQL with a query builder. Enforces method-chaining over raw SQL, migrations for schema versioning, and seeds for test data. Make sure to use this skill whenever generating database interaction code that could use a query builder instead of raw SQL. Not for ORM entity modeling, raw SQL optimization, or database administration tasks."
---

# Query Builder — Fundamentos

> Utilize Query Builders para manipular o banco de dados atraves de metodos encadeados, nunca SQL direto no codigo da aplicacao.

## Rules

1. **Abstraia o SQL com Query Builder** — use metodos como `.insert()`, `.select()`, `.update()` em vez de strings SQL, porque o Query Builder gera SQL correto para o banco de dados em uso e evita erros de sintaxe entre bancos diferentes
2. **Versione o schema com Migrations** — toda alteracao de estrutura do banco deve ser uma migration, porque permite rastrear a evolucao do banco e reverter mudancas
3. **Popule dados com Seeds** — use Seeds para dados iniciais ou de teste, porque garante reproducibilidade entre ambientes
4. **Prefira legibilidade com method chaining** — encadeie metodos do Query Builder de forma declarativa, porque a leitura do codigo revela a intencao sem traduzir SQL mentalmente

## How to write

### Select com Query Builder
```typescript
const users = await db('users')
  .select('id', 'name', 'email')
  .where('active', true)
  .orderBy('name')
```

### Insert com Query Builder
```typescript
await db('users').insert({
  name: 'João',
  email: 'joao@email.com',
  active: true,
})
```

### Update com Query Builder
```typescript
await db('users')
  .where('id', userId)
  .update({ active: false })
```

## Example

**Before (SQL direto no codigo):**
```typescript
const result = await connection.raw(
  `SELECT id, name FROM users WHERE active = true ORDER BY name`
)
```

**After (com Query Builder):**
```typescript
const activeUsers = await db('users')
  .select('id', 'name')
  .where('active', true)
  .orderBy('name')
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Precisa ler/escrever no banco | Use Query Builder, nunca SQL inline |
| Schema do banco mudou | Crie uma Migration |
| Precisa de dados iniciais ou de teste | Crie um Seed |
| Query muito complexa (joins, subqueries) | Query Builder ainda e preferivel; use `.raw()` apenas como ultimo recurso |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `connection.query("SELECT * FROM users")` | `db('users').select('*')` |
| Alterar banco manualmente no cliente SQL | Criar uma Migration |
| Inserir dados de teste manualmente | Criar um Seed |
| SQL diferente por banco de dados | Query Builder gera SQL correto automaticamente |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre vantagens do Query Builder e quando usar
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
---
name: rs-full-stack-cadastrando-modulos
description: "Applies SQLite foreign key enforcement and Knex module registration patterns when building Node.js APIs with SQLite. Use when user asks to 'create a route', 'register modules', 'add foreign key constraint', 'configure knex pool', or 'fix SQLite relationships'. Ensures PRAGMA foreign_keys is enabled and NOT NULL constraints are set. Make sure to use this skill whenever working with SQLite foreign keys or Knex pool configuration. Not for PostgreSQL, MySQL, or non-relational database work."
---

# Cadastrando Módulos com Knex e SQLite

> Ao trabalhar com SQLite e Knex, ative explicitamente foreign keys via PRAGMA e garanta NOT NULL em colunas de relacionamento.

## Rules

1. **Ative PRAGMA foreign_keys no pool do Knex** — SQLite desabilita restrições de chave estrangeira por padrão, permitindo inserções órfãs silenciosamente
2. **Use NOT NULL em colunas de chave estrangeira** — `table.integer('course_id').notNullable()` porque sem isso o SQLite aceita NULL mesmo com references definido
3. **Desfaça migrations antes de alterar** — use `knex migrate:down` com o nome completo do arquivo (incluindo `.ts`) para desfazer uma migration específica
4. **Retorne status 201 para criação** — `response.status(201).json()` porque POST que cria recurso deve sinalizar criação, não apenas sucesso
5. **Teste restrições com dados inválidos** — tente inserir foreign keys que não existem para validar que a constraint está funcionando

## How to configure

### Pool com PRAGMA foreign_keys

```typescript
// knexfile.ts
export default {
  client: 'sqlite3',
  connection: {
    filename: './src/database/database.db',
  },
  pool: {
    afterCreate: (connection: any, done: Function) => {
      connection.run('PRAGMA foreign_keys = ON', done)
    },
  },
  // ...
}
```

### Rota de cadastro de módulos

```typescript
app.post('/modules', async (request, response) => {
  const { name, course_id } = request.body

  await knex('course_modules').insert({ name, course_id })

  return response.status(201).json()
})

app.get('/modules', async (request, response) => {
  const modules = await knex('course_modules').select()

  return response.json(modules)
})
```

### Migration com NOT NULL

```typescript
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('course_modules', (table) => {
    table.increments('id').primary()
    table.text('name').notNullable()
    table.integer('course_id').notNullable().references('id').inTable('courses')
  })
}
```

## Example

**Before (SQLite aceita dados órfãos):**
```typescript
// Sem pool.afterCreate → SQLite ignora foreign keys
// INSERT com course_id = 54 (não existe) → sucesso silencioso
// INSERT com course_id = NULL → sucesso silencioso
```

**After (restrições ativas):**
```typescript
// Com PRAGMA foreign_keys = ON
// INSERT com course_id = 54 → SQLITE_CONSTRAINT: FOREIGN KEY constraint failed
// INSERT com course_id = NULL → NOT NULL constraint failed
```

## Heuristics

| Situação | Faça |
|----------|------|
| Precisa alterar migration recém-criada | `migrate:down` específico, edite, `migrate` novamente |
| Foreign key aceita valor inexistente | Verifique se PRAGMA foreign_keys está ON no pool |
| Coluna aceita NULL inesperadamente | Adicione `.notNullable()` na migration |
| Migration down falha com "not found" | Inclua extensão `.ts` no nome do arquivo |
| Servidor crasha após constraint error | Adicione try/catch (tratamento de exceção) |

## Anti-patterns

| Nunca faça | Faça em vez disso |
|------------|-------------------|
| Confiar que SQLite valida foreign keys por padrão | Configurar `PRAGMA foreign_keys = ON` no pool |
| Deixar course_id nullable em tabela de módulos | Usar `.notNullable()` na migration |
| Criar nova migration só para adicionar NOT NULL em tabela nova | Desfazer migration, editar, rodar novamente |
| Ignorar teste com dados inválidos | Testar com IDs inexistentes para validar constraints |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre PRAGMA foreign_keys e comportamento padrão do SQLite
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-cadastrando-modulos/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-cadastrando-modulos/references/code-examples.md)

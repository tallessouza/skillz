---
name: rs-full-stack-tabela-sessao-mesa
description: "Applies Knex migration patterns for session/status tracking tables with foreign keys, timestamps, and nullable columns. Use when user asks to 'create a migration', 'add a session table', 'track table status', 'create foreign key', or 'control open/close status'. Ensures correct foreign key references, nullable timestamps for state control, and proper rollback methods. Make sure to use this skill whenever creating migrations that track temporal state (open/close, start/end). Not for query building, seed files, or application logic."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: knex-migrations
  tags: [knex, migrations, foreign-key, timestamps, session-tracking]
---

# Migrations com Tabelas de Sessão e Controle de Estado

> Ao criar tabelas que controlam estado temporal (abertura/fechamento), use timestamps nulláveis como indicador de estado e foreign keys com tipo idêntico à chave primária referenciada.

## Rules

1. **Foreign key deve ter o mesmo tipo da chave primária referenciada** — se a PK é `increments()` (integer), a FK deve ser `integer()`, porque tipos diferentes quebram a referência silenciosamente
2. **FK nunca aceita nulo em relação obrigatória** — use `.notNullable()` quando toda sessão DEVE pertencer a uma entidade pai
3. **Use timestamp nullable como indicador de estado** — `closedAt: null` significa "ainda aberto", eliminando necessidade de coluna booleana separada, porque a ausência de data já carrega o significado
4. **Timestamp de criação deve ter default automático** — use `knex.fn.now()` como default para `openedAt`/`createdAt`, porque evita dependência do código da aplicação
5. **Sempre implemente o método `down`** — use `dropTable` para desfazer a migration, porque rollback quebrado bloqueia todo o pipeline de deploy
6. **Nomeie timestamps pelo significado de negócio** — `openedAt`/`closedAt` em vez de `createdAt`/`updatedAt`, porque nomes genéricos não comunicam a semântica de sessão

## How to write

### Migration de tabela de sessão com FK e timestamps

```typescript
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("tables_sessions", (table) => {
    table.increments("id").primary()
    table.integer("table_id").notNullable().references("id").inTable("tables")
    table.timestamp("opened_at").defaultTo(knex.fn.now())
    table.timestamp("closed_at").nullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("tables_sessions")
}
```

## Example

**Before (erros comuns):**
```typescript
// FK com tipo errado, sem .notNullable(), sem default no timestamp
await knex.schema.createTable("tables_sessions", (table) => {
  table.increments("id")
  table.string("table_id").references("id").inTable("tables") // string != integer
  table.timestamp("created_at")  // nome genérico, sem default
  table.boolean("is_open")       // coluna extra desnecessária
})
```

**After (com esta skill aplicada):**
```typescript
await knex.schema.createTable("tables_sessions", (table) => {
  table.increments("id").primary()
  table.integer("table_id").notNullable().references("id").inTable("tables")
  table.timestamp("opened_at").defaultTo(knex.fn.now())
  table.timestamp("closed_at").nullable() // null = mesa ainda aberta
})
```

## Heuristics

| Situação | Faça |
|----------|------|
| Tabela rastreia início/fim de algo | Dois timestamps: `opened_at` + `closed_at` (nullable) |
| Precisa saber se está "ativo/aberto" | Verifique `closed_at IS NULL` — sem coluna booleana extra |
| FK para tabela com `increments()` | Use `integer()` na FK |
| Relacionamento obrigatório | `.notNullable()` na FK |
| Relacionamento opcional | `.nullable()` na FK |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `table.string("table_id").references(...)` quando PK é integer | `table.integer("table_id").references(...)` |
| `table.boolean("is_open")` + `table.timestamp("closed_at")` | Apenas `table.timestamp("closed_at").nullable()` |
| `table.timestamp("created_at")` em tabela de sessão | `table.timestamp("opened_at").defaultTo(knex.fn.now())` |
| Migration sem método `down` | `down` com `dropTable` correspondente |
| FK sem `.notNullable()` em relação obrigatória | `.notNullable().references("id").inTable("tabela")` |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| FK rejeita insercao com erro de constraint | ID referenciado nao existe na tabela pai | Insira o registro na tabela pai antes de referenciar |
| `closed_at` nunca e null | Coluna definida sem `.nullable()` | Adicione `.nullable()` na definicao da coluna |
| `opened_at` sem data automatica | Falta `.defaultTo(knex.fn.now())` | Adicione o default de timestamp na definicao |
| Rollback falha na migration | Metodo `down` nao implementado | Adicione `knex.schema.dropTable("tables_sessions")` no down |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre timestamps como indicador de estado e padrões de FK
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
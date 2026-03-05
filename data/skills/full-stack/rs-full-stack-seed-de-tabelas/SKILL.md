---
name: rs-full-stack-seed-de-tabelas
description: "Generates database seed files to populate tables with example data using Drizzle ORM. Use when user asks to 'create a seed', 'populate tables', 'insert example data', 'seed the database', or 'add test data'. Follows the pattern: create seed file, define insert values with only required fields, run seed command. Make sure to use this skill whenever generating seed scripts for Drizzle ORM projects. Not for migrations, schema changes, or production data imports."
---

# Seed de Tabelas com Drizzle ORM

> Ao criar seeds, insira apenas os campos obrigatorios e deixe defaults do banco preencher o resto.

## Prerequisites

- Drizzle ORM configurado no projeto
- Schema da tabela ja definido
- Comando `npm run connect-seed` disponivel (ou equivalente configurado no `drizzle.config`)

## Steps

### Step 1: Criar o arquivo de seed

```bash
npm run connect-seed 2.make insert-tables
```

Isso gera o arquivo de seed com template padrao.

### Step 2: Definir os inserts

```typescript
import { tables } from "./schema"

export default async function seed(db) {
  await db.insert(tables).values([
    { tableNumber: 1 },
    { tableNumber: 2 },
    { tableNumber: 3 },
    { tableNumber: 4 },
    { tableNumber: 5 },
  ])
}
```

### Step 3: Executar o seed

```bash
npm run connect-seed 2.run
```

## Rules

1. **Informe apenas campos obrigatorios** — `id`, `createdAt` e outros com default nao precisam ser enviados, porque o banco gera automaticamente
2. **Use array de objetos no `.values()`** — permite inserir multiplos registros em um unico insert, porque e mais eficiente e legivel
3. **Nomeie o seed pelo conteudo** — `insert-tables`, `insert-users`, `insert-products`, porque facilita identificar o que cada seed faz

## Heuristics

| Situacao | Faca |
|----------|------|
| Tabela tem poucos campos obrigatorios | Liste apenas esses campos no values |
| Precisa de 5-10 registros de exemplo | Seed e suficiente, nao precisa de mais |
| Dados dependem de outra tabela | Crie seeds separados, execute na ordem correta |
| Ambiente de producao | Nunca use seeds — use migrations ou scripts dedicados |

## Anti-patterns

| Nunca faca | Faca isto |
|------------|-----------|
| Informar `id` manualmente quando e auto-increment | Omitir `id`, deixar o banco gerar |
| Informar `createdAt` quando tem `defaultNow()` | Omitir, deixar o default funcionar |
| Colocar 100 registros no seed de desenvolvimento | 5-10 registros e suficiente para testar |
| Misturar inserts de tabelas diferentes no mesmo seed | Um seed por tabela, nomeado claramente |

## Verification

- Apos executar o seed, consulte a tabela no banco para confirmar que os registros foram inseridos
- Verifique que campos com default (`id`, `createdAt`) foram preenchidos automaticamente

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre seeds e quando usar
- [code-examples.md](references/code-examples.md) — Exemplos de codigo expandidos com variacoes
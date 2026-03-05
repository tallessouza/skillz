---
name: rs-full-stack-seed-de-produtos
description: "Generates Knex.js seed files for populating database tables with sample or batch data. Use when user asks to 'seed the database', 'populate table', 'insert sample data', 'create test data', or 'bulk insert records'. Applies Knex seed:make and seed:run commands with table cleanup before insertion. Make sure to use this skill whenever creating seed files or populating tables with initial data in Knex projects. Not for migrations, schema changes, or single-record inserts via API."
---

# Seed de Produtos com Knex.js

> Ao popular tabelas com dados iniciais ou de exemplo, use seeds do Knex com limpeza prévia da tabela para evitar duplicação.

## Prerequisites

- Knex.js configurado no projeto com `knexfile` ou config inline
- Diretório de seeds definido na configuração do Knex (ex: `./src/database/seeds`)
- Tabela alvo já criada via migration

## Steps

### Step 1: Criar o arquivo de seed

```bash
npx knex seed:make insert_products
```

Gera um arquivo em `database/seeds/` com timestamp e nome fornecido.

### Step 2: Estruturar o seed com limpeza + inserção

```typescript
import { Knex } from "knex"

export async function seed(knex: Knex): Promise<void> {
  // Limpa a tabela antes de inserir para evitar duplicatas
  await knex("products").del()

  // Insere múltiplos registros de uma vez
  await knex("products").insert([
    { name: "Bruschetta de Tomate", price: 2590 },
    { name: "Carpaccio de Salmão", price: 3490 },
    { name: "Risoto de Funghi", price: 4290 },
  ])
}
```

### Step 3: Executar o seed

```bash
npx knex seed:run
```

## Output format

Tabela populada com todos os registros definidos no array de insert. Registros anteriores são removidos pelo `del()`.

## Heuristics

| Situação | Ação |
|----------|------|
| Dados de teste/desenvolvimento | Seed com `del()` antes do insert |
| Dados de produção (lookup tables) | Seed com `onConflict().ignore()` em vez de `del()` |
| Muitos registros | Extrair array para arquivo separado ou JSON |
| Seed precisa de IDs específicos | Definir IDs explicitamente no insert |

## Anti-patterns

| Nunca faça | Faça isto |
|------------|-----------|
| Inserir sem limpar antes (duplica dados) | `await knex("table").del()` antes do insert |
| Hardcodar dados no controller/route | Criar seed file dedicado |
| Rodar seed em produção sem proteção | Verificar `NODE_ENV` antes de executar `del()` |
| Criar registros um a um em loop | Passar array completo para `.insert([...])` |

## Verification

- Executar `seed:run` e verificar via API GET ou query direta que os registros existem
- Executar `seed:run` duas vezes seguidas e confirmar que não há duplicatas

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre seeds, configuração do Knex e estratégias de limpeza
- [code-examples.md](references/code-examples.md) — Exemplos completos de seeds com variações

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-seed-de-produtos/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-seed-de-produtos/references/code-examples.md)

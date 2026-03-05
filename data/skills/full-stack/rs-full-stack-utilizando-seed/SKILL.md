---
name: rs-full-stack-utilizando-seed
description: "Generates Knex seed files for populating database tables with initial or example data. Use when user asks to 'seed database', 'populate table', 'insert initial data', 'create seed file', or 'bulk insert records' with Knex. Covers knexfile seed configuration, seed creation, and execution commands. Make sure to use this skill whenever working with Knex seeds or bulk data insertion. Not for migrations, schema changes, or non-Knex ORMs."
---

# Utilizando Seed com Knex

> Configure, crie e execute seeds no Knex para popular tabelas com multiplos registros de uma vez.

## Prerequisites

- Knex configurado no projeto com `knexfile.ts`
- Tabela destino ja criada via migration
- Se pasta `database/seeds` nao existir: sera criada automaticamente no primeiro `seed:make`

## Steps

### Step 1: Configurar seeds no knexfile

Adicionar configuracao de seeds ao lado da configuracao de migrations, porque o Knex precisa saber onde salvar e buscar os arquivos de seed.

```typescript
// knexfile.ts
export default {
  // ... connection config
  migrations: {
    directory: "./database/migrations",
    extension: "ts",
  },
  seeds: {
    directory: "./database/seeds",
    extension: "ts",
  },
};
```

### Step 2: Criar arquivo de seed

```bash
npm run knex -- seed:make insert-courses
```

Isso cria `database/seeds/insert-courses.ts` com template padrao.

### Step 3: Implementar o seed

Remover o `del()` do template padrao (so usar se quiser limpar a tabela antes). Inserir multiplos registros via array de objetos.

```typescript
import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("courses").insert([
    { name: "CSS" },
    { name: "JavaScript" },
    { name: "React" },
    { name: "Node.js" },
    { name: "Git" },
    { name: "GitHub" },
    { name: "TypeScript" },
    { name: "Express.js" },
    { name: "Banco de Dados" },
  ]);
}
```

### Step 4: Executar o seed

```bash
npm run knex -- seed:run
```

## Output format

Todos os registros do array sao inseridos na tabela de uma vez. Verificar com uma consulta SELECT na tabela.

## Heuristics

| Situacao | Faca |
|----------|------|
| Dados iniciais obrigatorios (roles, categorias) | Seed sem `del()` — preserva dados existentes |
| Dados de exemplo para desenvolvimento | Seed com `del()` antes do insert — reseta a cada execucao |
| Coluna com auto-increment (id) | Nao inclua no objeto do insert — o banco gera automaticamente |
| Multiplas tabelas para popular | Crie um seed separado por tabela, nomeando com prefixo numerico para ordem |

## Error handling

- Se seed falhar por registro duplicado: adicione `del()` antes do insert ou use `onConflict().ignore()`
- Se pasta seeds nao existir no knexfile: o comando `seed:make` falha silenciosamente — verificar configuracao

## Anti-patterns

| Nunca faca | Faca instead |
|------------|--------------|
| Incluir `id` no insert quando e auto-increment | Omitir o id, deixar o banco gerar |
| Um seed gigante para todas as tabelas | Um arquivo de seed por tabela |
| Usar seed para alterar schema | Usar migration para schema, seed so para dados |
| Esquecer de configurar `seeds` no knexfile | Configurar `seeds.directory` e `seeds.extension` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes
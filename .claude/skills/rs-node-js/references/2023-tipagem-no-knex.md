---
name: rs-node-js-2023-tipagem-no-knex
description: "Enforces Knex TypeScript table typing setup when working with Knex query builder in Node.js projects. Use when user asks to 'setup knex', 'add knex types', 'knex autocomplete', 'type knex tables', or 'configure knex typescript'. Applies the declare module pattern for knex/types/tables to enable column autocomplete and type safety. Make sure to use this skill whenever creating or modifying Knex configurations in TypeScript projects. Not for Prisma, TypeORM, Drizzle, or other ORMs."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: knex-e-tipagem
  tags: [knex, typescript, types, autocomplete, declare-module, database]
---

# Tipagem no Knex

> Declare as tabelas e colunas do banco no modulo knex/types/tables para que o TypeScript sugira campos e valide inserts automaticamente.

## Rules

1. **Crie um arquivo de definicao `.d.ts`** — use `src/@types/knex.d.ts` (extensao `.d.ts`, nao `.ts`), porque arquivos de definicao contem somente tipos TypeScript, sem codigo JavaScript
2. **Importe o Knex antes de declarar** — `import { Knex } from 'knex'` no topo do arquivo, porque o TypeScript precisa da referencia original para estender os tipos
3. **Ignore o eslint na linha do import** — adicione `// eslint-disable-next-line` antes do import nao utilizado, porque o import serve apenas para referenciar os tipos existentes
4. **Declare o modulo `knex/types/tables`** — este e o modulo especifico que o Knex expoe com a interface `Tables` vazia para ser sobrescrita
5. **Exporte a interface `Tables` com todas as tabelas** — cada propriedade e o nome da tabela no banco, e o valor e um objeto com as colunas tipadas
6. **Marque colunas opcionais com `?`** — colunas que nao tem `notNullable()` na migration devem ser opcionais na interface, porque o banco aceita null

## How to write

### Arquivo de definicao de tipos

```typescript
// src/@types/knex.d.ts
// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    transactions: {
      id: string
      title: string
      amount: number
      created_at: string
      session_id?: string
    }
  }
}
```

### Usando o autocomplete nas rotas

```typescript
// Agora o Knex sugere tabelas e valida campos
await knex('transactions').insert({
  id: crypto.randomUUID(),
  title: 'Salario',
  amount: 5000,
  // session_id e opcional — pode omitir sem erro
})
```

## Example

**Before (sem tipagem — zero autocomplete):**
```typescript
// knex('transactions') — nenhuma sugestao de campos
// .insert({ titulo: 'x' }) — campo errado passa sem erro
await knex('transactions').insert({
  titulo: 'Salario', // campo errado, sem erro do TS
  valor: 5000,       // campo errado, sem erro do TS
})
```

**After (com tipagem — autocomplete completo):**
```typescript
// knex('transactions') — sugere 'transactions' como tabela
// .insert({}) — Ctrl+Space mostra id, title, amount, created_at, session_id
await knex('transactions').insert({
  id: crypto.randomUUID(),
  title: 'Salario',
  amount: 5000,
  // TS erro se tentar campo inexistente: 'titulo' does not exist
})
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Nova tabela criada na migration | Adicionar entrada correspondente na interface Tables |
| Coluna sem `notNullable()` | Marcar com `?` na interface |
| Coluna com default no banco | Marcar com `?` (opcional no insert) |
| Tipo `timestamp` no banco | Usar `string` na interface (Knex serializa como string) |
| Tipo `decimal`/`integer` no banco | Usar `number` na interface |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `knex.d.ts` com extensao `.ts` | `knex.d.ts` com extensao `.d.ts` |
| Tipos inline sem declare module | `declare module 'knex/types/tables'` |
| Todas as colunas obrigatorias | Colunas nullable com `?` |
| `any` como tipo da tabela | Objeto com cada coluna tipada |
| Modulo errado `knex/tables` | Modulo correto `knex/types/tables` |

## Troubleshooting

### Autocomplete do Knex nao funciona apos criar o arquivo .d.ts
**Symptom:** `knex('transactions')` nao sugere colunas no VS Code, apesar de ter criado o `knex.d.ts`
**Cause:** O arquivo foi criado com extensao `.ts` em vez de `.d.ts`, ou o import do Knex esta faltando no topo do arquivo de definicao
**Fix:** Renomeie para `knex.d.ts` e adicione `import { Knex } from 'knex'` antes do `declare module 'knex/types/tables'`

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

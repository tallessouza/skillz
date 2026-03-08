---
name: rs-full-stack-script-de-execucao
description: "Generates Knex CLI execution scripts for TypeScript projects. Use when user asks to 'setup knex', 'configure knex with typescript', 'create migration script', 'run knex with tsx', or 'knex CLI not working with typescript'. Applies the tsx+node --import pattern to bridge Knex CLI with TypeScript configs. Make sure to use this skill whenever setting up Knex in a TypeScript project. Not for writing migration content, query building, or database schema design."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: "Knex CLI Setup"
  tags: ['knex', 'typescript', 'cli', 'migrations', 'tsx']
---

# Script de Execução Knex com TypeScript

> Configurar um script npm que permite ao Knex CLI processar arquivos TypeScript via tsx antes de executar comandos.

## Problema

O Knex CLI por padrao so entende arquivos JavaScript. Ao executar `npx knex migrate:make` em um projeto TypeScript, o erro ocorre porque o Knex nao consegue processar o `knexfile.ts`.

## Steps

### Step 1: Criar o script no package.json

```json
{
  "scripts": {
    "knex": "node --import tsx ./node_modules/.bin/knex"
  }
}
```

**Por que esse formato:** O `node --import tsx` registra o tsx como loader antes de executar o binario do Knex, permitindo que ele processe o `knexfile.ts`.

### Step 2: Executar comandos Knex via npm run

```bash
# Criar uma migration
npm run knex -- migrate:make create-courses

# O -- (double dash) passa argumentos diretamente ao comando knex
```

**Por que `--`:** O operador `--` indica ao npm que todos os argumentos seguintes devem ser repassados diretamente ao comando sendo executado, nao interpretados pelo npm.

## Example

**Antes (falha):**
```bash
npx knex migrate:make create-courses
# Error: Cannot process TypeScript file
```

**Depois (funciona):**
```bash
npm run knex -- migrate:make create-courses
# Created Migration: database/migrations/20240101_create-courses.ts
```

## Heuristics

| Situacao | Acao |
|----------|------|
| Projeto TypeScript com Knex | Sempre criar o script `knex` no package.json |
| Precisa criar migration | `npm run knex -- migrate:make nome-da-tabela` |
| Precisa executar migrations | `npm run knex -- migrate:latest` |
| Precisa fazer rollback | `npm run knex -- migrate:rollback` |
| Erro de TypeScript no Knex CLI | Verificar se o script usa `node --import tsx` |

## Anti-patterns

| Nunca faca | Faca isto |
|------------|-----------|
| `npx knex migrate:make` (em projeto TS) | `npm run knex -- migrate:make` |
| Converter knexfile para .js manualmente | Usar tsx como loader via `--import` |
| Instalar ts-node so para o Knex CLI | Usar tsx que ja esta no projeto |

## Verification

- Apos criar o script, executar `npm run knex -- migrate:make test` e verificar se o arquivo foi criado em `database/migrations/`
- Se falhar, verificar se `tsx` esta instalado como dependencia

## Troubleshooting

| Sintoma | Causa provavel | Solucao |
|---------|---------------|---------|
| Knex CLI nao processa arquivo TypeScript | Executando `npx knex` diretamente sem loader | Use o script `npm run knex` com `node --import tsx` |
| Argumentos nao passados ao Knex | Falta `--` antes dos argumentos | Use `npm run knex -- migrate:make nome` com double dash |
| Erro "tsx not found" | tsx nao instalado como dependencia | Instale com `npm i -D tsx` |
| Migration criada em diretorio errado | Diretorio de migrations nao configurado no knexfile | Configure `migrations.directory` no `knexfile.ts` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo sobre o problema TypeScript/Knex e o pattern node --import
- [code-examples.md](references/code-examples.md) — Todos os comandos Knex CLI com variacoes e cenarios

---

## Deep dive
- [Deep explanation](../../../data/skills/full-stack/rs-full-stack-script-de-execucao/references/deep-explanation.md)
- [Code examples](../../../data/skills/full-stack/rs-full-stack-script-de-execucao/references/code-examples.md)

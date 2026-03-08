---
name: rs-full-stack-configurando-o-knex-js
description: "Generates Knex.js configuration files for Node.js projects using SQLite3. Use when user asks to 'setup knex', 'configure database', 'create knexfile', 'setup sqlite with knex', or 'initialize knex project'. Applies correct knexfile structure with client, connection, useNullAsDefault, and migrations directory. Make sure to use this skill whenever setting up Knex.js in a new project or configuring database connections with Knex. Not for Prisma, TypeORM, Drizzle, or other ORMs."
metadata:
  author: Rocketseat
  version: 1.0.0
  course: full-stack
  module: database
  tags: [knex, sqlite3, knexfile, migrations, database-config, query-builder]
---

# Configurando o Knex.js

> Gerar o arquivo knexfile na raiz do projeto com client, connection, useNullAsDefault e migrations configurados corretamente.

## Rules

1. **Arquivo na raiz do projeto** — `knexfile.ts` (ou `.js`) sempre na raiz, porque o Knex CLI espera encontrá-lo lá por padrão
2. **Export default um objeto** — `export default { ... }`, porque o Knex consome a config como objeto único
3. **Sempre definir `useNullAsDefault: true`** — porque SQLite3 ignora valores `undefined` em insert/update, causando bugs silenciosos de compatibilidade
4. **Migrations com extensão explícita** — definir `extension: 'ts'` quando usar TypeScript, porque o Knex precisa saber qual extensão gerar
5. **Banco e migrations na mesma pasta `database/`** — organizar `src/database/database.db` e `src/database/migrations/` juntos, porque mantém tudo relacionado a dados coeso
6. **Não criar pastas/arquivos manualmente** — o Knex cria o arquivo `.db` e a pasta `migrations/` automaticamente na primeira execução

## Steps

### Step 1: Criar o arquivo knexfile.ts na raiz

```typescript
// knexfile.ts
export default {
  client: 'sqlite3',
  connection: {
    filename: './src/database/database.db',
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './src/database/migrations',
  },
}
```

### Step 2: Garantir que a pasta database existe

```bash
mkdir -p src/database
```

### Step 3: Verificar dependências instaladas

```bash
npm install knex better-sqlite3
# ou para o driver clássico:
npm install knex sqlite3
```

## Output format

```
project-root/
├── knexfile.ts          # Configuração do Knex
└── src/
    └── database/        # Criada automaticamente ou manualmente
        ├── database.db  # Criado pelo Knex na primeira execução
        └── migrations/  # Criada pelo Knex ao rodar migrate:make
```

## Error handling

- Se o Knex não encontrar o knexfile: verificar se está na raiz e se o nome é exatamente `knexfile.ts`
- Se migrations não geram em TypeScript: verificar se `extension: 'ts'` está definido dentro de `migrations`
- Se valores `undefined` causam erro no SQLite: verificar se `useNullAsDefault: true` está presente

## Verification

- Rodar `npx knex migrate:make create-example` e verificar se o arquivo `.ts` aparece em `src/database/migrations/`
- Verificar que `database.db` é criado em `src/database/` após a primeira migration

## Heuristics

| Situation | Do |
|-----------|-----|
| Projeto com TypeScript | `extension: 'ts'` nas migrations |
| SQLite3 como banco | Sempre adicionar `useNullAsDefault: true` |
| Banco de dados relacional externo (Postgres, MySQL) | Trocar `client` e usar `host/port/user/password` em `connection` |
| Múltiplos ambientes (dev/prod) | Exportar objeto com chaves `development`, `production` |

## Anti-patterns

| Nunca faça | Faça assim |
|------------|------------|
| Colocar knexfile dentro de `src/` | Manter na raiz do projeto |
| Esquecer `useNullAsDefault` com SQLite | Sempre incluir `useNullAsDefault: true` |
| Criar manualmente o `.db` ou pasta `migrations/` | Deixar o Knex criar automaticamente |
| Hardcodar path absoluto no filename | Usar path relativo `./src/database/database.db` |

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Knex nao encontra o knexfile | Arquivo fora da raiz ou nome incorreto | Mover para raiz do projeto com nome exato `knexfile.ts` |
| Migrations geram em `.js` em vez de `.ts` | `extension: 'ts'` ausente na config | Adicionar `extension: 'ts'` dentro de `migrations` no knexfile |
| Erro `SQLITE_CANTOPEN` | Diretorio `src/database/` nao existe | Criar com `mkdir -p src/database` |
| Valores undefined causam erro no SQLite | `useNullAsDefault` nao configurado | Adicionar `useNullAsDefault: true` no knexfile |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo sobre cada propriedade e analogias do instrutor
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações
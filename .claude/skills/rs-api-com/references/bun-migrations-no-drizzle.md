---
name: rs-api-com-bun-migrations-no-drizzle
description: "Generates Drizzle ORM migration setup files and scripts when working with PostgreSQL databases. Use when user asks to 'setup drizzle migrations', 'create migrate file', 'run database migrations with drizzle', 'configure drizzle with postgres', or 'setup drizzle studio'. Follows pattern: programmatic migration file with single connection, proper cleanup, and npm script. Make sure to use this skill whenever setting up Drizzle ORM migration infrastructure in a Bun/Node project. Not for Prisma migrations, raw SQL migrations, or Drizzle schema definition."
---

# Migrations no Drizzle

> Drizzle executa migrations programaticamente via arquivo TypeScript, nao via CLI — crie um migrate.ts que abre conexao unica, executa migrations e encerra o processo.

## Rules

1. **Crie um arquivo migrate.ts dedicado** — Drizzle nao tem comando CLI para migrations, porque o Drizzle repassa SQL diretamente ao driver nativo sem intermediarios
2. **Use conexao com max: 1** — migrations devem abrir uma unica conexao, executar tudo e fechar, porque pooling e desnecessario e desperdicaria recursos
3. **Encerre conexao E processo** — chame `connection.end()` seguido de `process.exit()`, porque sem isso o processo fica pendurado
4. **Pasta de migrations deve refletir drizzle.config.ts** — o `migrationsFolder` no migrate.ts deve ser identico ao `out` do drizzle.config.ts
5. **Crie script no package.json** — `"migrate": "bun src/db/migrate.ts"`, porque facilita execucao recorrente
6. **Use top-level await** — Bun suporta nativamente, garanta `target: "esnext"` e `module: "esnext"` no tsconfig

## Steps

### Step 1: Criar arquivo migrate.ts

```typescript
// src/db/migrate.ts
import postgres from "postgres"
import { drizzle } from "drizzle-orm/postgres-js"
import { migrate } from "drizzle-orm/postgres-js/migrator"

const connection = postgres(
  "postgresql://docker:docker@localhost:5432/pizzashop",
  { max: 1 }
)

const db = drizzle(connection)

await migrate(db, { migrationsFolder: "drizzle" })

await connection.end()
process.exit()
```

### Step 2: Adicionar script no package.json

```json
{
  "scripts": {
    "migrate": "bun src/db/migrate.ts"
  }
}
```

### Step 3: Executar migrations

```bash
bun migrate
```

### Step 4: Verificar com Drizzle Studio (opcional)

```bash
# Instalar pg como devDependency (necessario para o studio)
bun add -D pg

# Iniciar Drizzle Studio
npx drizzle-kit studio --config drizzle.config.ts
```

## Output format

Arquivo `src/db/migrate.ts` funcional que ao ser executado aplica todas migrations da pasta `drizzle/` ao banco PostgreSQL.

## Error handling

- Se erro "column already exists" — banco esta sujo de execucao anterior; recrie o container Docker com volume novo
- Se Drizzle Studio pede `pg` — instale como devDependency: `bun add -D pg`
- Se top-level await falha — verifique `target` e `module` como `esnext` no tsconfig.json

## Verification

- Execute `bun migrate` sem erros
- Abra Drizzle Studio e confirme que tabelas existem com colunas corretas
- Use a aba Query do Studio para testar: `db.select().from(tableName)`

## Heuristics

| Situacao | Faca |
|----------|------|
| Projeto usa Bun + Drizzle + Postgres | Siga este workflow exato |
| Volume Docker compartilhado com outro projeto | Renomeie o volume para evitar conflito de dados |
| Precisa visualizar banco | Use Drizzle Studio (tem Query Builder integrado) |
| Ambiente de producao | Mova a connection string para variavel de ambiente |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Pooling de conexoes no migrate | `{ max: 1 }` para conexao unica |
| Esquecer `connection.end()` | Sempre encerrar conexao apos migrations |
| Esquecer `process.exit()` | Sempre encerrar processo apos migrations |
| Compartilhar volume Docker entre projetos | Volume unico por projeto: `pizzashop_pg_data` |
| Instalar `pg` como producao dependency | `bun add -D pg` — so necessario para Studio |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/api-com/rs-api-com-bun-migrations-no-drizzle/references/deep-explanation.md)
- [Code examples](../../../data/skills/api-com/rs-api-com-bun-migrations-no-drizzle/references/code-examples.md)

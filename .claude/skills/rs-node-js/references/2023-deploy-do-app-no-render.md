---
name: 2023-deploy-do-app-no-render
description: "Configures a Node.js application for deployment on Render.com with dual-database support (SQLite dev, PostgreSQL production) using Knex and Zod environment validation. Use when user asks to 'deploy to Render', 'configure dual database', 'set up production PostgreSQL', or 'prepare Node app for deployment'. Make sure to use this skill whenever deploying a Fastify/Node.js app to Render or configuring environment-based database switching. Not for AWS/Vercel/Docker deployments, frontend hosting, or non-Knex ORMs."
category: workflow
tags: [deploy, docker, error-handling, fastify, knex, migrations]
mind_lenses: [LT_01, LT_02, MF_01, GB_01, TH_04]
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: deploy
  tags: [deploy, render, postgresql, sqlite, knex, dual-database, production]
---

# Deploy de App Node.js no Render

> Configure uma aplicacao Node.js para suportar SQLite em desenvolvimento e PostgreSQL em producao, e faca deploy no Render.com.

## Prerequisites

- Repositorio no GitHub com codigo commitado
- Conta no Render.com
- Knex configurado como query builder
- Zod para validacao de variaveis ambiente

## Steps

### Step 1: Criar banco PostgreSQL no Render

1. No dashboard do Render, clique em "New PostgreSQL"
2. Nomeie o banco (ex: `ignite-nodejs-02-db`)
3. Selecione a regiao (mesma que o web service usara)
4. Selecione o plano Free (1GB storage, expira em 90 dias)
5. Copie a **Internal Database URL** (para uso entre servicos Render)

### Step 2: Adicionar variavel DATABASE_CLIENT no env schema

```typescript
// src/env/index.ts
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  DATABASE_CLIENT: z.enum(['sqlite', 'pg']),
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(3333),
})
```

`z.coerce.number()` converte string para numero, porque o Render envia PORT como string.

### Step 3: Instalar driver do PostgreSQL

```bash
npm install pg
npm install -D better-sqlite3  # mover sqlite para devDependencies
```

### Step 4: Configurar Knex para dual-database

```typescript
// src/database.ts
import { knex as setupKnex, Knex } from 'knex'
import { env } from './env'

export const config: Knex.Config = {
  client: env.DATABASE_CLIENT,
  connection:
    env.DATABASE_CLIENT === 'sqlite'
      ? { filename: env.DATABASE_URL }
      : env.DATABASE_URL,
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
}

export const knex = setupKnex(config)
```

### Step 5: Configurar listen para Render

```typescript
// src/server.ts
app.listen({
  port: env.PORT,
  host: ('RENDER' in process.env) ? '0.0.0.0' : 'localhost',
})
```

### Step 6: Fixar versao do Node no package.json

```json
{
  "engines": {
    "node": "18"
  }
}
```

Usar `"18"` exato, nao `">=18"`, porque versoes mais recentes podem causar incompatibilidades.

### Step 7: Configurar .env para desenvolvimento

```env
DATABASE_CLIENT=sqlite
DATABASE_URL=./db/app.db
PORT=3333
```

### Step 8: Criar Web Service no Render

1. Dashboard > New Web Service > conectar repositorio GitHub
2. **Build Command:** `npm install && npm run knex -- migrate:latest && npm run build`
3. **Start Command:** `node build/server.js`
4. Em Advanced > Environment Variables:
   - `DATABASE_CLIENT` = `pg`
   - `DATABASE_URL` = (Internal Database URL copiada do banco)
   - NAO definir `PORT` — o Render injeta automaticamente

## Heuristics

| Situacao | Acao |
|----------|------|
| Banco local para dev | SQLite via `DATABASE_CLIENT=sqlite` |
| Banco em producao | PostgreSQL via `DATABASE_CLIENT=pg` |
| Porta vem como string | `z.coerce.number()` no Zod |
| Acessar banco do Render externamente | Usar External Database URL |
| Acessar banco entre servicos Render | Usar Internal Database URL |
| Deploy automatico desejado | Manter Auto-Deploy ligado (default) |

## Error handling

- Se build falha com `tsup not found`: verificar que `npm install` roda antes de `npm run build`
- Se migrations falham: verificar que `DATABASE_URL` aponta para o banco correto
- Se porta da erro: confirmar que usa `z.coerce.number()` e NAO definiu PORT manualmente no Render
- Se app nao responde: verificar `host: '0.0.0.0'` no listen quando em Render

## Verification

- Acessar a URL fornecida pelo Render no browser
- Testar endpoints via Insomnia/Postman usando a URL de producao
- Verificar logs no painel do Render para confirmar "HTTP server running"

## Troubleshooting

### Resultado inesperado ao aplicar o padrao
**Symptom:** Comportamento nao corresponde ao esperado apos seguir os passos
**Cause:** Dependencias ou configuracoes previas podem estar faltando
**Fix:** Verifique os prerequisites e confirme que todas as versoes estao compativeis

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

---
name: rs-saas-nextjs-rbac-deploy-backend
description: "Guides backend deployment to Render for Node.js/TypeScript monorepo applications. Use when user asks to 'deploy backend', 'deploy to Render', 'host Node API', 'configure Render', or 'deploy monorepo backend'. Covers tsup bundling, Prisma migrations, environment variables, monorepo root directory, build filters, and host binding. Make sure to use this skill whenever deploying a Node.js API to Render from a monorepo. Not for frontend deployment, Docker deployment, or non-Render hosting providers."
---

# Deploy do Back-end no Render

> Configure o build, start, variaveis de ambiente e host para deployar uma API Node.js/TypeScript de um monorepo no Render.

## Rules

1. **Use a variavel `PORT` em vez de nomes customizados** — o Render seta `PORT` automaticamente para todos os servicos, porque ele controla a porta onde o servico roda
2. **Configure o root directory para o path do backend no monorepo** — `apps/api` (ou equivalente), porque o Render precisa saber onde esta a aplicacao dentro do monorepo
3. **Use build filters para ignorar mudancas no frontend** — adicione `apps/web/**` como ignored path, porque alteracoes no frontend nao devem triggerar rebuild do backend
4. **Rode Prisma migrate deploy e generate no start command** — porque o ambiente de deploy nao tem a pasta do Prisma Client gerada nem as migrations aplicadas
5. **Bind o host em `0.0.0.0`** — o Render exige isso para detectar que a porta esta ativa, porque `localhost`/`127.0.0.1` nao e acessivel externamente
6. **Deploy na mesma regiao do banco de dados** — se o banco esta em US East (Ohio), o servico tambem deve estar, porque latencia cross-region degrada performance

## Steps

### Step 1: Configurar variavel PORT

Substituir qualquer variavel customizada (ex: `SERVER_PORT`) por `PORT` no codigo e no schema de env.

```typescript
// env/index.ts
const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  // ... outras variaveis
})
```

### Step 2: Configurar tsup para build

Instalar tsup e criar configuracao que inclua pacotes internos do monorepo no bundle:

```bash
pnpm add -D tsup
```

```typescript
// tsup.config.ts
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src'],
  splitting: false,
  sourcemap: true,
  clean: true,
  noExternal: ['@saas/auth', '@saas/env'], // pacotes internos do monorepo
})
```

### Step 3: Criar scripts de build e start

```json
{
  "scripts": {
    "build": "tsup",
    "start": "node dist/http/server.js"
  }
}
```

### Step 4: Configurar host 0.0.0.0

```typescript
app.listen({ port: env.PORT, host: '0.0.0.0' })
```

### Step 5: Configurar no Render

| Campo | Valor |
|-------|-------|
| Root Directory | `apps/api` |
| Build Command | `pnpm install --frozen-lockfile; pnpm run build` |
| Start Command | `pnpm prisma migrate deploy; pnpm prisma generate; pnpm run start` |
| Ignored Paths | `apps/web/**` |
| Region | Mesma do banco de dados |

### Step 6: Variaveis de ambiente no Render

Configurar todas as variaveis que o schema de env exige:
- `DATABASE_URL` — connection string do banco (Neon, etc)
- `JWT_SECRET` — hash seguro
- `GITHUB_OAUTH_CLIENT_ID`, `GITHUB_OAUTH_CLIENT_SECRET`, `GITHUB_OAUTH_CLIENT_REDIRECT_URI`
- Qualquer variavel compartilhada entre front e back (ex: `NEXT_PUBLIC_API_URL`)

## Error handling

| Erro | Causa | Solucao |
|------|-------|---------|
| Build falha com `tsc` | Script de build usa `tsc` em vez de `tsup` | Verificar que o script `build` aponta para `tsup` |
| Prisma Client not found | `prisma generate` nao foi executado | Adicionar `pnpm prisma generate` no start command |
| Migrations pendentes | `prisma migrate deploy` nao foi executado | Adicionar `pnpm prisma migrate deploy` no start command |
| Porta nao detectada pelo Render | Host bound em `localhost` | Usar `host: '0.0.0.0'` no `app.listen` |
| Import de pacote interno falha | Pacote nao incluido no bundle | Adicionar ao `noExternal` do tsup.config.ts |
| Env validation falha no deploy | Variavel faltando ou tipo errado | Verificar todas as variaveis no painel do Render |

## Verification

- Acessar a URL fornecida pelo Render — deve retornar resposta (mesmo que "not found" na rota raiz)
- Verificar no painel do banco (Neon) se as tabelas foram criadas pelas migrations
- Confirmar nos logs do Render que "HTTP server running" aparece sem erros

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações


---

## Deep dive
- [Deep explanation](../../../data/skills/saa-s/rs-saa-s-next-js-rbac-deploy-do-back-end/references/deep-explanation.md)
- [Code examples](../../../data/skills/saa-s/rs-saa-s-next-js-rbac-deploy-do-back-end/references/code-examples.md)

# Code Examples: Deploy do Back-end no Render

## Configuracao completa do env schema

**Antes (variavel customizada):**
```typescript
// packages/env/index.ts
const envSchema = z.object({
  SERVER_PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  GITHUB_OAUTH_CLIENT_ID: z.string(),
  GITHUB_OAUTH_CLIENT_SECRET: z.string(),
  GITHUB_OAUTH_CLIENT_REDIRECT_URI: z.string(),
  NEXT_PUBLIC_API_URL: z.string(),
})
```

**Depois (variavel padrao PORT):**
```typescript
// packages/env/index.ts
const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  GITHUB_OAUTH_CLIENT_ID: z.string(),
  GITHUB_OAUTH_CLIENT_SECRET: z.string(),
  GITHUB_OAUTH_CLIENT_REDIRECT_URI: z.string(),
  NEXT_PUBLIC_API_URL: z.string(),
})
```

## Configuracao do servidor com host

**Antes:**
```typescript
app.listen({ port: env.PORT })
```

**Depois (compativel com Render):**
```typescript
app.listen({ port: env.PORT, host: '0.0.0.0' })
```

## tsup.config.ts completo

```typescript
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src'],
  splitting: false,
  sourcemap: true,
  clean: true,
  noExternal: ['@saas/auth', '@saas/env'],
})
```

### O que cada opcao faz:

| Opcao | Valor | Efeito |
|-------|-------|--------|
| `entry` | `['src']` | Compila todos os arquivos da pasta src |
| `splitting` | `false` | Nao faz code splitting (irrelevante para backend) |
| `sourcemap` | `true` | Gera .map para debugging em producao |
| `clean` | `true` | Apaga dist/ antes de cada build |
| `noExternal` | `['@saas/auth', '@saas/env']` | Inclui pacotes internos no bundle |

## package.json scripts

```json
{
  "scripts": {
    "dev": "tsx watch src/http/server.ts",
    "build": "tsup",
    "start": "node dist/http/server.js"
  }
}
```

## Teste local do build

```bash
# Rodar build
pnpm run build

# Verificar que dist/ foi criada
ls dist/

# Testar execucao (vai falhar se env vars nao estiverem setadas)
node dist/http/server.js
```

## Configuracao no painel do Render

### Variaveis de ambiente

```
DATABASE_URL=postgresql://user:pass@host/dbname?sslmode=require
JWT_SECRET=<hash-seguro-gerado>
GITHUB_OAUTH_CLIENT_ID=<valor-real>
GITHUB_OAUTH_CLIENT_SECRET=<valor-real>
GITHUB_OAUTH_CLIENT_REDIRECT_URI=https://next-saas.example.dev/api/auth/callback
NEXT_PUBLIC_API_URL=https://next-saas-api.example.dev
```

### Comandos

```
Build Command:  pnpm install --frozen-lockfile; pnpm run build
Start Command:  pnpm prisma migrate deploy; pnpm prisma generate; pnpm run start
Root Directory: apps/api
```

### Build filters (ignored paths)

```
apps/web/**
```

## Sequencia de erros e resolucoes do deploy

O instrutor mostrou uma sequencia iterativa de erros durante o deploy, cada um revelando uma configuracao faltante:

### Erro 1: tsc em vez de tsup
```
# Script errado
"build": "tsc"

# Correcao
"build": "tsup"
```

### Erro 2: Prisma Client nao encontrado
```
Error: @prisma/client did not initialize yet
```
Solucao: adicionar `pnpm prisma migrate deploy; pnpm prisma generate` ao start command.

### Erro 3: Generate nao executado
Mesmo apos migrate deploy, o Prisma Client nao foi gerado. O migrate deploy NAO roda generate automaticamente.
Solucao: adicionar `pnpm prisma generate` explicitamente.

### Erro 4: Porta nao detectada
O Render ficava em loop sem detectar que o servico estava rodando.
Solucao: adicionar `host: '0.0.0.0'` no `app.listen`.
# Code Examples: Deploy de Frontend Next.js

## 1. Deploy na Vercel

### Via CLI
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy de preview
vercel

# Deploy de producao
vercel --prod
```

### Via Git integration (mais comum)
A Vercel conecta diretamente ao repositorio Git. Cada push para a branch principal faz deploy automatico de producao. Branches de feature criam deployments de preview.

Nao requer configuracao adicional para projetos Next.js — a Vercel detecta automaticamente.

## 2. Cloudflare Pages

### Configuracao basica
O Cloudflare Pages suporta Next.js full stack atraves do adapter `@cloudflare/next-on-pages`.

Features suportadas (App Router):
- Server Components
- Server Actions
- Route Handlers
- Middleware
- ISR (Incremental Static Regeneration)
- Image Optimization

Feature NAO suportada:
- Partial Pre-Rendering (experimental no Next.js)

## 3. OpenNext + SST na AWS

### Arquivo de configuracao SST
```typescript
// sst.config.ts
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "meu-saas",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {
    new sst.aws.Nextjs("MeuApp", {
      path: "./apps/web", // pasta do projeto Next.js no monorepo
    });
  },
});
```

### Deploy
```bash
# Configurar credenciais AWS (variaveis de ambiente)
export AWS_ACCESS_KEY_ID=xxx
export AWS_SECRET_ACCESS_KEY=xxx
export AWS_REGION=us-east-1

# Deploy
npx sst deploy --stage production
```

### O que o SST cria na AWS
- **Lambda functions** — Server Components, API Routes, middleware
- **CloudFront distribution** — CDN para arquivos estaticos e cache
- **S3 bucket** — Assets estaticos (JS, CSS, imagens)
- **DynamoDB** (se ISR) — Cache de paginas regeneradas

## 4. Next.js como aplicacao Node generica

### Build e start padrao
```bash
# Build
npm run build

# Start (modo producao)
npm start
# ou
node .next/standalone/server.js
```

### Dockerfile para hosting generico
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
```

### next.config.js para standalone output
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // gera server.js independente
}

module.exports = nextConfig
```

## 5. Static Export

### Configuracao
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // gera apenas HTML/JS/CSS
}

module.exports = nextConfig
```

### Build
```bash
npm run build
# Arquivos estaticos gerados em ./out/
```

### Limitacoes do Static Export
- Sem Server Components dinâmicos
- Sem API Routes
- Sem middleware
- Sem ISR
- Sem Image Optimization (server-side)
- Sem Server Actions

### Casos de uso ideais para Static Export
- Landing pages
- Blogs com conteudo pre-gerado
- Documentacao
- Sites institucionais
- Dashboards com dados client-side only

## 6. Comparativo de comandos de deploy

| Provider | Comando | Complexidade |
|----------|---------|-------------|
| Vercel | `vercel --prod` | Zero config |
| Cloudflare | `npx wrangler pages deploy` | Baixa |
| AWS (SST) | `npx sst deploy` | Media (precisa AWS credentials) |
| Node generico | `docker build && docker push` | Media-alta |
| Static | `npm run build` + upload de `./out/` | Baixa |
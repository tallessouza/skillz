# Code Examples: Testando Build

## Exemplo 1: Teste manual da build

```bash
# Primeiro, gerar a build
npm run build

# Tentar executar sem env (vai falhar)
node build/server.js
# ZodError: DATABASE_URL is required

# Executar com env local (Node 20.6+)
node --env-file=.env build/server.js
# Server running on port 3333

# Alternativa para Node < 20.6
node -r dotenv/config build/server.js
```

## Exemplo 2: package.json com scripts de build e start

```json
{
  "name": "my-api",
  "version": "1.0.0",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsup src/server.ts -d build",
    "start": "node build/server.js"
  },
  "dependencies": {
    "fastify": "^4.0.0",
    "zod": "^3.0.0"
  },
  "devDependencies": {
    "tsup": "^8.0.0",
    "tsx": "^4.0.0",
    "typescript": "^5.0.0"
  }
}
```

## Exemplo 3: Validação de env com Zod (o que causa o erro)

```typescript
// src/env.ts
import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(1),
  PORT: z.coerce.number().default(3333),
})

export const env = envSchema.parse(process.env)
```

Sem as variáveis definidas, `envSchema.parse(process.env)` lança um `ZodError` e a aplicação não inicia.

## Exemplo 4: Fluxo completo de build e teste

```bash
# 1. Desenvolvimento (com hot reload)
npm run dev

# 2. Gerar build de produção
npm run build

# 3. Verificar o conteúdo da build
ls build/
# server.js  (JavaScript puro, sem .ts)

# 4. Testar localmente com env
node --env-file=.env build/server.js
# Server running on port 3333

# 5. Testar via script
npm start
# (em outro terminal, precisa ter env vars no ambiente)

# 6. Testar endpoint
curl http://localhost:3333/health
# {"status":"ok"}
```

## Exemplo 5: Dockerfile usando o script start

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY build/ ./build/

# ENV vars são passadas pelo docker run ou docker-compose
# NÃO copie .env para o container

EXPOSE 3333
CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
services:
  api:
    build: .
    ports:
      - "3333:3333"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/mydb
      - JWT_SECRET=my-production-secret
```

## Exemplo 6: Diferença entre lifecycle e custom scripts

```json
{
  "scripts": {
    "start": "node build/server.js",
    "test": "vitest",
    "stop": "kill $(lsof -t -i:3333)",

    "dev": "tsx watch src/server.ts",
    "build": "tsup src/server.ts",
    "lint": "eslint src/"
  }
}
```

```bash
# Lifecycle scripts (sem run)
npm start       # ✅
npm test        # ✅
npm stop        # ✅

# Custom scripts (precisam de run)
npm run dev     # ✅
npm run build   # ✅
npm run lint    # ✅
npm dev         # ❌ erro
npm build       # ❌ erro (npm build é outro comando)
```
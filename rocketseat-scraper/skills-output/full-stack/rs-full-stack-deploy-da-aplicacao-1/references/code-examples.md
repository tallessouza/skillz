# Code Examples: Deploy de Aplicação Backend no Render

## package.json — Scripts necessários para deploy

```json
{
  "name": "rocket-log",
  "version": "1.0.0",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node build/server.js"
  },
  "dependencies": {
    "@prisma/client": "^5.x",
    "express": "^4.x",
    "jsonwebtoken": "^9.x"
  },
  "devDependencies": {
    "prisma": "^5.x",
    "tsx": "^4.x",
    "typescript": "^5.x"
  }
}
```

**Explicação dos scripts:**
- `dev`: Roda em desenvolvimento com hot-reload via `tsx watch`
- `build`: Compila TypeScript para JavaScript usando `tsc`
- `start`: Executa o JavaScript compilado em produção

## .gitignore — O que não vai para o GitHub

```gitignore
node_modules/
build/
.env
```

**Por que cada item:**
- `node_modules/` — Regenerado com `npm install` (pesado, ~centenas de MB)
- `build/` — Regenerado com `npm run build` (artefato de compilação)
- `.env` — Contém secrets (DATABASE_URL, JWT_SECRET)

## .env — Variáveis de ambiente (desenvolvimento)

```env
DATABASE_URL="postgresql://user:password@localhost:5432/rocketlog?schema=public"
JWT_SECRET=rodrigo
PORT=3333
```

## .env.example — Template de variáveis (commitado no repo)

```env
DATABASE_URL=
JWT_SECRET=
PORT=
```

## Configuração no Render

### Build Command
```bash
npm install && npm run build && npx prisma migrate deploy
```

### Start Command
```bash
npm start
```

### Variáveis de ambiente no Render

| Key | Value | Observação |
|-----|-------|------------|
| `PORT` | `3000` | Porta padrão para produção |
| `DATABASE_URL` | `postgresql://user:pass@host/db` | Copiar Internal Database URL do banco no Render |
| `JWT_SECRET` | `acbd18db4cc2f85cedef654fccc4a4d8` | Hash MD5 gerado a partir de palavra-chave |

## server.ts — Exemplo de uso das variáveis

```typescript
import express from "express"

const app = express()
const PORT = process.env.PORT || 3333

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
```

**Em desenvolvimento:** `PORT` vem do `.env` (3333)
**Em produção:** `PORT` vem das variáveis do Render (3000)

## Gerando JWT_SECRET via terminal

```bash
# Usando md5sum (Linux/WSL)
echo -n "sua-palavra-secreta" | md5sum | awk '{print $1}'

# Usando openssl (alternativa mais segura)
openssl rand -hex 32

# Usando Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## prisma/schema.prisma — Exemplo de schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id       String @id @default(uuid())
  name     String
  email    String @unique
  password String

  @@map("users")
}
```

O `env("DATABASE_URL")` lê a variável de ambiente — funciona tanto com `.env` local quanto com variáveis configuradas no Render.

## Fluxo de deploy automático

Após o primeiro deploy, o Render configura um webhook no GitHub. Cada `git push` na branch `main` dispara automaticamente:

```bash
# No terminal local
git add .
git commit -m "feat: add new endpoint"
git push origin main
# → Render detecta o push e executa o deploy automaticamente
```
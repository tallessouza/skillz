# Code Examples: Deploy de Aplicação Node no Render

## Configuração do package.json para deploy

```json
{
  "name": "minha-api",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "migrate": "knex migrate:latest"
  }
}
```

## Build Command — variações

### Com Knex
```bash
npm install && npm run build && npx knex migrate:latest
```

### Com Prisma
```bash
npm install && npx prisma generate && npm run build && npx prisma migrate deploy
```

### Com TypeORM
```bash
npm install && npm run build && npx typeorm migration:run
```

## Variáveis de ambiente no Render

### Configuração mínima
```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
NODE_ENV=production
```

### Configuração completa
```env
DATABASE_URL=postgresql://user:password@host:5432/dbname
NODE_ENV=production
PORT=3333
JWT_SECRET=super-secret-production-key
APP_URL=https://minha-api.onrender.com
```

## Exemplo de connection string do Render PostgreSQL

```env
# Formato típico do Render
DATABASE_URL=postgresql://mydb_user:randompassword123@dpg-abc123xyz-a.oregon-postgres.render.com/mydb
```

## Start Command — variações

### Aplicação TypeScript compilada
```bash
node dist/server.js
```

### Com Node.js ES Modules
```bash
node --experimental-specifier-resolution=node dist/server.js
```

### Com variável PORT do Render
```typescript
// src/server.ts
const port = process.env.PORT || 3333

app.listen({ port: Number(port), host: '0.0.0.0' }, () => {
  console.log(`Server running on port ${port}`)
})
```

O `host: '0.0.0.0'` é importante no Render — sem ele, a aplicação pode escutar apenas em `localhost` e o Render não consegue rotear o tráfego.

## Verificação pós-deploy

```bash
# Testar se a API está respondendo
curl -I https://minha-api.onrender.com

# Testar endpoint específico
curl https://minha-api.onrender.com/api/users

# Verificar health check
curl https://minha-api.onrender.com/health
```

## Knexfile configurado para produção

```typescript
// knexfile.ts
import type { Knex } from 'knex'

const config: Record<string, Knex.Config> = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './db/app.db',
    },
    useNullAsDefault: true,
    migrations: {
      directory: './db/migrations',
    },
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: './db/migrations',
    },
  },
}

export default config
```

## .env.example para documentar variáveis necessárias

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/mydb

# Application
NODE_ENV=development
PORT=3333

# Authentication
JWT_SECRET=change-me-in-production
```
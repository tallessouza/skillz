# Code Examples: Deploy de Aplicações Node.js

## Configuração típica de package.json para deploy

```json
{
  "name": "minha-api",
  "scripts": {
    "start": "node src/server.js",
    "dev": "node --watch src/server.js",
    "migrate": "knex migrate:latest"
  }
}
```

## Variáveis de ambiente em produção

```bash
# .env.example (referência — nunca commitar .env real)
PORT=3333
DATABASE_URL=postgresql://user:password@host:5432/dbname
NODE_ENV=production
```

## Leitura de variáveis no código

```javascript
// src/server.js
const port = process.env.PORT || 3333

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
```

## Configuração de conexão com banco em produção

```javascript
// src/database/knex.js
const knex = require('knex')

const connection = knex({
  client: 'pg',
  connection: process.env.DATABASE_URL,
  pool: { min: 2, max: 10 }
})

module.exports = connection
```

## Verificação pós-deploy com curl

```bash
# Verificar se a API está respondendo
curl -I https://minha-app.onrender.com/api/health

# Testar um endpoint específico
curl https://minha-app.onrender.com/api/users
```

## Script de deploy típico

```bash
#!/bin/bash
# deploy.sh

echo "Running migrations..."
npm run migrate

echo "Starting application..."
npm start
```

## Render / Railway — Configuração típica

```yaml
# render.yaml (exemplo para Render)
services:
  - type: web
    name: minha-api
    env: node
    buildCommand: npm install
    startCommand: npm run migrate && npm start
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: minha-db
          property: connectionString
      - key: NODE_ENV
        value: production

databases:
  - name: minha-db
    plan: free
```
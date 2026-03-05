# Code Examples: Variáveis de Ambiente no Node.js

## 1. Arquivo .env

```env
DATABASE_URL="./db/app.db"
```

O instrutor menciona que poderia ter mais variáveis:
```env
DATABASE_URL="./db/app.db"
DATABASE_CLIENT="sqlite"
```

E que em produção, `DATABASE_CLIENT` poderia ser `pg` (PostgreSQL) ou `mysql`.

## 2. Instalação do dotenv

```bash
npm install dotenv
```

## 3. Importação e uso básico

```typescript
import 'dotenv/config'

// dotenv/config lê automaticamente o .env da raiz do projeto
// e popula process.env com as variáveis

console.log(process.env)
// { ... várias variáveis do SO ..., DATABASE_URL: './db/app.db' }
```

## 4. Uso no arquivo de configuração do banco (database.ts)

**Antes (hardcoded):**
```typescript
import { knex as setupKnex } from 'knex'

export const knex = setupKnex({
  client: 'sqlite',
  connection: {
    filename: './db/app.db',
  },
})
```

**Depois (com variáveis de ambiente):**
```typescript
import 'dotenv/config'
import { knex as setupKnex } from 'knex'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL env not found.')
}

export const knex = setupKnex({
  client: 'sqlite',
  connection: {
    filename: process.env.DATABASE_URL,
  },
})
```

## 5. Arquivo .env.example

```env
DATABASE_URL=
```

Para variáveis não sensíveis, pode incluir valor padrão:
```env
DATABASE_URL="./db/app.db"
DATABASE_CLIENT="sqlite"
API_KEY=
STRIPE_SECRET=
```

## 6. Entrada no .gitignore

```gitignore
# Environment variables
.env
```

O `.env.example` NÃO entra no `.gitignore` — ele deve ser commitado.

## 7. Teste da validação

Se você comentar a variável no `.env` e iniciar a aplicação:

```
Error: DATABASE_URL env not found.
```

A aplicação falha imediatamente no boot, antes de qualquer request — esse é o comportamento desejado (fail fast).
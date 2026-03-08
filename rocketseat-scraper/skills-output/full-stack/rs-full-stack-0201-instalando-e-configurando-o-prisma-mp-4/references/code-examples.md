# Code Examples: Instalando e Configurando o Prisma

## Instalacao completa (comandos exatos da aula)

```bash
# 1. Instalar Prisma CLI como devDependency
npm i prisma@6.2.1 -D

# 2. Instalar Prisma Client como dependencia de producao
npm i @prisma/client@6.2.1

# 3. Inicializar Prisma com SQLite
npx prisma init --datasource-provider sqlite
```

## Schema gerado pelo `prisma init`

Apos rodar `npx prisma init --datasource-provider sqlite`, o arquivo `prisma/schema.prisma` contem:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

## Arquivo `.env` gerado

```env
DATABASE_URL="file:./dev.db"
```

## Modulo de conexao: `src/database/prisma.ts`

### Versao com log (usada na aula)

```typescript
import { PrismaClient } from "@prisma/client"

export const prisma = new PrismaClient({
  log: ["query"],
})
```

### Versao silenciosa (sem log)

```typescript
import { PrismaClient } from "@prisma/client"

export const prisma = new PrismaClient()
```

## Variacoes para diferentes cenarios

### Com multiplos niveis de log

```typescript
import { PrismaClient } from "@prisma/client"

export const prisma = new PrismaClient({
  log: ["query", "warn", "error"],
})
```

### Com log condicional por ambiente

```typescript
import { PrismaClient } from "@prisma/client"

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query"] : ["error"],
})
```

### Inicializacao com PostgreSQL (alternativa)

```bash
npx prisma init --datasource-provider postgresql
```

Gera schema com:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

E `.env` com:

```env
DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"
```

### Inicializacao com MySQL

```bash
npx prisma init --datasource-provider mysql
```

## Uso do modulo em outros arquivos

```typescript
// Em qualquer arquivo da aplicacao
import { prisma } from "../database/prisma"

// Exemplo: buscar todos os usuarios
const users = await prisma.user.findMany()

// Exemplo: criar um registro
const newUser = await prisma.user.create({
  data: {
    name: "João",
    email: "joao@email.com",
  },
})
```

## Estrutura final do projeto

```
project/
├── node_modules/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── database/
│   │   └── prisma.ts
│   └── server.ts
├── .env
├── package.json
├── package-lock.json
└── tsconfig.json
```

## package.json (dependencias relevantes)

```json
{
  "dependencies": {
    "@prisma/client": "6.2.1"
  },
  "devDependencies": {
    "prisma": "6.2.1"
  }
}
```
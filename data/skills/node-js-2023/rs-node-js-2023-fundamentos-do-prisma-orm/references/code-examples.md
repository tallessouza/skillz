# Code Examples: Fundamentos do Prisma ORM

## 1. Instalacao completa

```bash
# CLI como devDependency
npm install prisma -D

# Client como dependencia de producao
npm install @prisma/client

# Inicializar Prisma no projeto (cria pasta prisma/ e schema.prisma)
npx prisma init

# Gerar tipos TypeScript a partir do schema
npx prisma generate
```

## 2. Schema completo da aula

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id    String @id @default(uuid())
  name  String
  email String @unique

  @@map("users")
}
```

### Explicacao campo a campo:
- `id String @id @default(uuid())` — chave primaria, tipo string, valor default gerado como UUID
- `name String` — campo obrigatorio do tipo string (sem `?` = obrigatorio)
- `email String @unique` — campo obrigatorio, com constraint de unicidade
- `@@map("users")` — nome real da tabela no banco sera "users" (plural, lowercase)

## 3. Instanciando o PrismaClient

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
```

Apos instanciar, `prisma.user` expoe todos os metodos:
- `prisma.user.create()`
- `prisma.user.findUnique()`
- `prisma.user.findMany()`
- `prisma.user.update()`
- `prisma.user.delete()`
- `prisma.user.deleteMany()`
- `prisma.user.updateMany()`

## 4. Criando um usuario com tipagem automatica

```typescript
// TypeScript valida todos os campos em compile-time
const user = await prisma.user.create({
  data: {
    name: 'Diego Fernandes',
    email: 'diego@skillz.com.br',
    // id e opcional — gerado automaticamente via uuid()
  },
})
```

### O que o TypeScript valida automaticamente:
```typescript
// ERRO: number nao e assignavel a string
await prisma.user.create({
  data: {
    name: 123, // Type 'number' is not assignable to type 'string'
    email: 'test@test.com',
  },
})

// ERRO: campo inexistente
await prisma.user.create({
  data: {
    name: 'Test',
    email: 'test@test.com',
    age: 25, // Object literal may only specify known properties
  },
})
```

## 5. Comparacao entre ORMs (mencionados na aula)

### Sequelize
```javascript
const User = sequelize.define('User', {
  name: DataTypes.STRING,
  email: DataTypes.STRING,
})

const user = await User.create({ name: 'Test', email: 'test@test.com' })
```

### TypeORM
```typescript
@Entity()
class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  firstName: string

  @Column()
  lastName: string
}
```

### Prisma (mais conciso, tipagem automatica)
```prisma
model User {
  id    String @id @default(uuid())
  name  String
  email String @unique

  @@map("users")
}
```

## 6. Onde os tipos gerados ficam

Apos `npx prisma generate`, os tipos sao criados em:
```
node_modules/.prisma/client/index.d.ts
```

Conteudo gerado inclui:
```typescript
// Tipo do model
export type User = {
  id: string
  name: string
  email: string
}

// Metodos disponiveis (findUnique, create, update, delete, etc.)
// Documentacao inline
// Tipos para inputs (CreateInput, UpdateInput, WhereInput, etc.)
```

## 7. Configuracao VS Code para Prisma

```json
// .vscode/settings.json
{
  "[prisma]": {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "Prisma.prisma"
  }
}
```

Requer a extensao: **Prisma** (publisher: Prisma) no VS Code.
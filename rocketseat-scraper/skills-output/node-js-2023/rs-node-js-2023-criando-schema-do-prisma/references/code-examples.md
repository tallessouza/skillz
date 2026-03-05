# Code Examples: Criando Schema do Prisma

## Schema completo da aula

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String   @id @default(uuid())
  name          String
  email         String   @unique
  password_hash String
  created_at    DateTime @default(now())

  @@map("users")
}

model CheckIn {
  id           String    @id @default(uuid())
  created_at   DateTime  @default(now())
  validated_at DateTime?

  @@map("check_ins")
}

model Gym {
  id          String  @id @default(uuid())
  title       String
  description String?
  phone       String?
  latitude    Decimal
  longitude   Decimal

  @@map("gyms")
}
```

## Comandos utilizados

### Criar migration em desenvolvimento
```bash
npx prisma migrate dev
# Pergunta o nome da migration
# Ex: "create gyms and check-ins"
```

### Verificar tabelas criadas
```bash
npx prisma studio
# Abre interface web para visualizar tabelas e dados
```

### Comando de producao (mencionado, nao executado)
```bash
npx prisma migrate deploy
# Executa migrations existentes sem comparar schema
```

## Variacao: Boolean vs DateTime opcional

### Abordagem com Boolean (menos informacao)
```prisma
model CheckIn {
  id          String   @id @default(uuid())
  isValidated Boolean  @default(false)
  created_at  DateTime @default(now())

  @@map("check_ins")
}
```

### Abordagem com DateTime? (mais informacao — preferida)
```prisma
model CheckIn {
  id           String    @id @default(uuid())
  created_at   DateTime  @default(now())
  validated_at DateTime?

  @@map("check_ins")
}
```

### Consulta equivalente no Prisma Client
```typescript
// Com Boolean
const validatedCheckIns = await prisma.checkIn.findMany({
  where: { isValidated: true }
})

// Com DateTime? — mesmo resultado + info de quando
const validatedCheckIns = await prisma.checkIn.findMany({
  where: { validated_at: { not: null } }
})

// Bonus: filtrar por periodo de validacao
const recentlyValidated = await prisma.checkIn.findMany({
  where: {
    validated_at: {
      gte: new Date('2024-01-01')
    }
  }
})
```

## Variacao: campo required adicionado em tabela com dados

### Problema
```prisma
// Tabela User ja tem registros
// Adicionar campo required sem default causa erro
model User {
  password_hash String  // ERROR: coluna required sem default
}
```

### Solucao 1: campo opcional
```prisma
model User {
  password_hash String?  // Permite null para registros existentes
}
```

### Solucao 2: valor default
```prisma
model User {
  password_hash String @default("")  // String vazia como fallback
}
```

## Padrao de ID com UUID

```prisma
// Padrao usado em TODOS os models
id String @id @default(uuid())
```

O `@id` marca como primary key. O `@default(uuid())` gera automaticamente um UUID v4 ao criar o registro, eliminando a necessidade de gerar o ID na aplicacao.

## Padrao de created_at com now()

```prisma
// Padrao para campos de data de criacao
created_at DateTime @default(now())
```

O `@default(now())` captura o timestamp do momento da insercao no banco, sem precisar enviar pela aplicacao. Util para auditoria e ordenacao cronologica.
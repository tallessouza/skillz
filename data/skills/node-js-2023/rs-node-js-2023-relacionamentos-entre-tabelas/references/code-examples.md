# Code Examples: Relacionamentos entre Tabelas no Prisma

## Schema completo da aula

```prisma
model User {
  id            String   @id @default(uuid())
  name          String
  email         String   @unique
  password_hash String
  created_at    DateTime @default(now())

  // Relacionamento inverso — User tem muitos CheckIns
  checkIns CheckIn[]

  @@map("users")
}

model CheckIn {
  id           String    @id @default(uuid())
  created_at   DateTime  @default(now())
  validated_at DateTime?

  // Relacionamento com User (1:N)
  user    User   @relation(fields: [user_id], references: [id])
  user_id String

  // Relacionamento com Gym (1:N)
  gym    Gym    @relation(fields: [gym_id], references: [id])
  gym_id String

  @@map("check_ins")
}

model Gym {
  id          String  @id @default(uuid())
  title       String
  description String?
  phone       String?
  latitude    Decimal
  longitude   Decimal

  // Relacionamento inverso — Gym tem muitos CheckIns
  checkIns CheckIn[]

  @@map("gyms")
}
```

## Fluxo de criacao passo a passo

### Passo 1: Escrever apenas o campo de relacionamento

```prisma
model CheckIn {
  id         String   @id @default(uuid())
  created_at DateTime @default(now())

  // Apenas escreva isso e salve:
  user User
}
```

### Passo 2: Extensao gera automaticamente (apos salvar)

```prisma
model CheckIn {
  id         String   @id @default(uuid())
  created_at DateTime @default(now())

  user   User   @relation(fields: [userId], references: [id])
  userId String  // <-- gerado automaticamente
}

model User {
  // ... campos existentes
  CheckIn CheckIn[]  // <-- gerado automaticamente (inverso)
}
```

### Passo 3: Ajustar convencoes manualmente

```prisma
model CheckIn {
  id         String   @id @default(uuid())
  created_at DateTime @default(now())

  user    User   @relation(fields: [user_id], references: [id])
  user_id String  // snake_case para coluna real
}

model User {
  // ... campos existentes
  checkIns CheckIn[]  // camelCase + plural para campo de relacionamento
}
```

## Migration gerada (SQL resultante)

```sql
-- AlterTable: adicionar foreign keys
ALTER TABLE "check_ins" ADD COLUMN "gym_id" TEXT NOT NULL;
ALTER TABLE "check_ins" ADD COLUMN "user_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "check_ins" ADD CONSTRAINT "check_ins_user_id_fkey"
  FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "check_ins" ADD CONSTRAINT "check_ins_gym_id_fkey"
  FOREIGN KEY ("gym_id") REFERENCES "gyms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
```

## Comando para rodar a migration

```bash
npx prisma migrate dev --name create_relationships
```

## Verificacao visual

```bash
npx prisma studio
# Abre interface web para inspecionar tabelas e relacionamentos
```

## Variacao: Relacionamento 1:1

```prisma
model User {
  id      String   @id @default(uuid())
  profile Profile?  // Opcional, maximo 1
}

model Profile {
  id      String @id @default(uuid())
  bio     String

  user    User   @relation(fields: [user_id], references: [id])
  user_id String @unique  // @unique garante 1:1
}
```

## Variacao: Relacionamento N:N (implicito no Prisma)

```prisma
// Prisma cria tabela intermediaria automaticamente
model Student {
  id      String   @id @default(uuid())
  classes Class[]
}

model Class {
  id       String    @id @default(uuid())
  students Student[]
}
```
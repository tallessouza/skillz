# Code Examples: Criando Tabelas com Prisma

## Exemplo 1: Model basico da aula (Question)

```prisma
model Question {
  id        String   @id @default(uuid())
  title     String
  content   String
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  userId    String   @map("user_id")

  @@map("questions")
}
```

## Exemplo 2: Model User (referenciado na aula)

```prisma
model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("users")
}
```

## Exemplo 3: Variacao com relacao entre User e Question

```prisma
model User {
  id        String     @id @default(uuid())
  name      String
  email     String     @unique
  createdAt DateTime   @default(now()) @map("created_at")
  updatedAt DateTime   @updatedAt @map("updated_at")
  questions Question[]

  @@map("users")
}

model Question {
  id        String   @id @default(uuid())
  title     String
  content   String
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  userId    String   @map("user_id")
  user      User     @relation(fields: [userId], references: [id])

  @@map("questions")
}
```

## Exemplo 4: Comandos do terminal

```bash
# Criar migracao
npx prisma migrate dev --name create-table-questions

# Abrir Prisma Studio (interface visual)
npx prisma studio

# Se Prisma Studio nao mostrar nova tabela: parar e reiniciar
# Ctrl+C → npx prisma studio
```

## Exemplo 5: Padrao completo para qualquer nova entidade

```prisma
model NomeDaEntidade {
  id        String   @id @default(uuid())
  // ... campos especificos da entidade ...
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("nome_da_tabela_no_plural")
}
```

### Checklist para nova tabela:
1. Model em PascalCase singular (`Question`, nao `questions`)
2. `id String @id @default(uuid())` como primeiro campo
3. Campos de negocio em camelCase
4. `createdAt` com `@default(now())` e `@map("created_at")`
5. `updatedAt` com `@updatedAt` e `@map("updated_at")`
6. Foreign keys com `@map` para snake_case
7. `@@map("tabela_plural")` no final
8. Rodar `npx prisma migrate dev --name descricao`
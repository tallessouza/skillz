# Code Examples: Cascades no Banco de Dados

## Schema Prisma completo com cascades

### Model Invite
```prisma
model Invite {
  id             String       @id @default(uuid())
  email          String
  role           Role         @default(MEMBER)
  createdAt      DateTime     @default(now()) @map("created_at")

  authorId       String?      @map("author_id")
  author         User?        @relation(fields: [authorId], references: [id], onDelete: SetNull)

  organizationId String       @map("organization_id")
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)

  @@unique([email, organizationId])
  @@map("invites")
}
```

**Pontos-chave:**
- `organization`: Cascade — convite morre com a organizacao
- `author`: SetNull — convite sobrevive se o autor for deletado
- `authorId` e `String?` (opcional) — necessario para SetNull funcionar

### Model Member
```prisma
model Member {
  id             String       @id @default(uuid())
  role           Role         @default(MEMBER)

  organizationId String       @map("organization_id")
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)

  userId         String       @map("user_id")
  user           User         @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([organizationId, userId])
  @@map("members")
}
```

**Pontos-chave:**
- Ambas as relacoes sao Cascade — membro nao existe sem organizacao nem sem usuario

### Model Project
```prisma
model Project {
  id             String       @id @default(uuid())
  name           String
  description    String
  slug           String       @unique
  avatarUrl      String?      @map("avatar_url")
  createdAt      DateTime     @default(now()) @map("created_at")
  updatedAt      DateTime     @updatedAt @map("updated_at")

  organizationId String       @map("organization_id")
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)

  ownerId        String       @map("owner_id")
  owner          User         @relation(fields: [ownerId], references: [id])

  @@map("projects")
}
```

**Nota:** O instrutor menciona que `ownerId` poderia ser SetNull (com campo opcional), mas manteve como esta por pragmatismo.

### Model Account
```prisma
model Account {
  id                String  @id @default(uuid())
  provider          AccountProvider
  providerAccountId String  @unique @map("provider_account_id")

  userId            String  @map("user_id")
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, userId])
  @@map("accounts")
}
```

## Transaction para reset de senha

### Antes (sem deletar o token)
```typescript
// PROBLEMA: token continua valido apos reset
await prisma.user.update({
  where: { id: user.id },
  data: { password: hashedPassword },
})
```

### Depois (com transaction)
```typescript
await prisma.$transaction([
  prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  }),
  prisma.token.delete({
    where: { id: tokenFromCode.id },
  }),
])
```

## Rodando a migration

```bash
npx prisma migrate dev --name add-cascade-delete-rules
```

Saida esperada: ALTER TABLE statements nas foreign keys existentes, adicionando `ON DELETE CASCADE` ou `ON DELETE SET NULL` conforme configurado no schema.

## Resumo visual das estrategias

```
Organization --[delete]--> Cascade --> Invites (deletados)
                                   --> Members (deletados)
                                   --> Projects (deletados)

User --[delete]--> Cascade  --> Accounts (deletados)
                            --> Members (deletados)
               --> SetNull  --> Invites.authorId (setado null)
```
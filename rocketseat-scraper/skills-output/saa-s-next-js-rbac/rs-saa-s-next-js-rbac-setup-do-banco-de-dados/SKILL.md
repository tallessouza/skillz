---
name: rs-saas-nextjs-rbac-setup-banco
description: "Applies SaaS multi-tenant database schema patterns when designing Prisma schemas for multi-organization applications. Use when user asks to 'create a database schema', 'setup Prisma', 'design multi-tenant tables', 'add organizations to my app', or 'create membership tables'. Enforces pivot tables for N:N relationships, semantic relation naming, unique composite indexes, and account provider patterns. Make sure to use this skill whenever designing database schemas for SaaS applications with organizations, members, roles, or invites. Not for Prisma CLI usage, query optimization, or frontend components."
---

# Setup de Banco de Dados Multi-Tenant SaaS

> Ao projetar schemas para SaaS multi-tenant, modele organizacoes como entidade central com tabelas pivo para memberships e enums para roles e providers.

## Rules

1. **Use UUIDs como ID padrao** — `id String @id @default(uuid())` em todas as tabelas, porque garante unicidade entre ambientes e facilita merges de dados
2. **Mapeie nomes de tabelas para lowercase plural** — `@@map("users")`, porque o model fica PascalCase no Prisma mas snake_case plural no banco
3. **Mapeie campos compostos para snake_case** — `@map("password_hash")`, porque o banco segue convencao snake_case enquanto o Prisma usa camelCase
4. **Crie tabelas pivo para N:N com dados extras** — Member ao inves de relacao implicita, porque a relacao carrega role e potencialmente outros campos
5. **Use enums para valores finitos** — `enum Role`, `enum TokenType`, `enum AccountProvider`, porque garante integridade e extensibilidade sem quebrar schema
6. **Crie indices unicos compostos para regras de negocio** — `@@unique([organizationId, userId])`, porque a constraint de unicidade deve ser no banco, nao na aplicacao
7. **Nomeie relacionamentos inversos semanticamente** — `memberOn` ao inves de `members` no User, porque "usuario tem membros" nao faz sentido, mas "usuario e membro em" faz

## How to write

### Estrutura base de User com providers

```prisma
model User {
  id           String   @id @default(uuid())
  name         String?
  email        String   @unique
  passwordHash String?  @map("password_hash")
  avatarUrl    String?  @map("avatar_url")
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  tokens             Token[]
  accounts           Account[]
  invites            Invite[]
  memberOn           Member[]
  ownedOrganizations Organization[]
  ownedProjects      Project[]

  @@map("users")
}
```

### Tabela pivo Member (N:N com role)

```prisma
model Member {
  id             String       @id @default(uuid())
  role           Role         @default(MEMBER)
  organizationId String       @map("organization_id")
  organization   Organization @relation(fields: [organizationId], references: [id])
  userId         String       @map("user_id")
  user           User         @relation(fields: [userId], references: [id])

  @@unique([organizationId, userId])
  @@map("members")
}
```

### Invite com indice de busca por email

```prisma
model Invite {
  id             String       @id @default(uuid())
  email          String
  role           Role
  createdAt      DateTime     @default(now()) @map("created_at")
  authorId       String?      @map("user_id")
  author         User?        @relation(fields: [authorId], references: [id])
  organizationId String       @map("organization_id")
  organization   Organization @relation(fields: [organizationId], references: [id])

  @@unique([email, organizationId])
  @@index([email])
  @@map("invites")
}
```

## Example

**Before (schema ingenuuo):**
```prisma
model User {
  id    Int    @id @default(autoincrement())
  name  String
  orgs  Organization[]
}

model Organization {
  id      Int    @id @default(autoincrement())
  name    String
  users   User[]
}
```

**After (com este skill aplicado):**
```prisma
model User {
  id        String   @id @default(uuid())
  name      String?
  email     String   @unique
  createdAt DateTime @default(now()) @map("created_at")

  memberOn           Member[]
  ownedOrganizations Organization[]

  @@map("users")
}

model Organization {
  id      String   @id @default(uuid())
  name    String
  slug    String   @unique
  ownerId String   @map("user_id")
  owner   User     @relation(fields: [ownerId], references: [id])

  members Member[]

  @@map("organizations")
}

model Member {
  id             String       @id @default(uuid())
  role           Role         @default(MEMBER)
  organizationId String       @map("organization_id")
  organization   Organization @relation(fields: [organizationId], references: [id])
  userId         String       @map("user_id")
  user           User         @relation(fields: [userId], references: [id])

  @@unique([organizationId, userId])
  @@map("members")
}

enum Role {
  ADMIN
  MEMBER
  BILLING
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Relacionamento N:N precisa de dados extras (role, status) | Crie tabela pivo explicita (Member, não relacao implicita) |
| Campo pode nao existir por causa de provider externo (ex: nome do GitHub) | Marque como opcional com `?` |
| Usuario pode deletar conta mas dados devem persistir | Relacao opcional (`author User?`) |
| Busca frequente por campo nao-PK (ex: email em invites) | Crie `@@index([campo])` |
| Combinacao de campos deve ser unica (email+org, user+org) | Use `@@unique([campo1, campo2])` |
| SaaS com auto-join por dominio de email | Campo `domain String? @unique` + flag boolean `shouldAttachUsersByDomain` |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| `@id @default(autoincrement())` em SaaS | `@id @default(uuid())` — UUIDs sao seguros para multi-tenant |
| Relacao implicita N:N sem tabela pivo | Tabela `Member` explicita com `role` e `@@unique` |
| `members Member[]` no model User | `memberOn Member[]` — semantica: "usuario e membro em" |
| Guardar role diretamente no User | Role na tabela pivo Member — role e por organizacao |
| Deixar `passwordHash` obrigatorio | Opcional — usuario pode logar apenas via OAuth |
| Criar enum com valor unico | Crie enum mesmo com um valor — extensibilidade sem migration breaking |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

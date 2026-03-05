# Code Examples: Associacao Automatica via E-mail

## Exemplo completo da rota de create account

```typescript
// apps/api/src/http/routes/auth/create-account.ts

import { hash } from 'bcryptjs'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import { prisma } from '@/lib/prisma'

export async function createAccount(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/users',
    {
      schema: {
        body: z.object({
          name: z.string(),
          email: z.string().email(),
          password: z.string().min(6),
        }),
      },
    },
    async (request, reply) => {
      const { name, email, password } = request.body

      const userWithSameEmail = await prisma.user.findUnique({
        where: { email },
      })

      if (userWithSameEmail) {
        throw new BadRequestError('User with same e-mail already exists.')
      }

      // --- AUTO-JOIN LOGIC START ---
      const [, domain] = email.split('@')

      const autoJoinOrganization = await prisma.organization.findFirst({
        where: {
          domain,
          shouldAttachUsersByDomain: true,
        },
      })
      // --- AUTO-JOIN LOGIC END ---

      const passwordHash = await hash(password, 6)

      await prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
          // Creates encadeado: associa usuario a organizacao
          member_on: autoJoinOrganization
            ? {
                create: {
                  organizationId: autoJoinOrganization.id,
                },
              }
            : undefined,
        },
      })

      return reply.status(201).send()
    },
  )
}
```

## Schema Prisma relevante

```prisma
model Organization {
  id                        String   @id @default(uuid())
  name                      String
  slug                      String   @unique
  domain                    String?
  shouldAttachUsersByDomain Boolean  @default(false)
  members                   Member[]
  // ...
}

model Member {
  id             String       @id @default(uuid())
  role           Role         @default(MEMBER)
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])
  userId         String
  user           User         @relation(fields: [userId], references: [id])

  @@unique([organizationId, userId])
  @@map("members")
}

model User {
  id           String   @id @default(uuid())
  name         String?
  email        String   @unique
  passwordHash String?  @map("password_hash")
  member_on    Member[]
  // ...
}

enum Role {
  ADMIN
  MEMBER
  BILLING
}
```

## Seed que cria a organizacao para teste

```typescript
// prisma/seed.ts (trecho relevante)
await prisma.organization.create({
  data: {
    name: 'Acme Inc (Admin)',
    slug: 'acme-inc',
    domain: 'acme.com',
    shouldAttachUsersByDomain: true,
    ownerId: userAdmin.id,
    members: {
      create: {
        userId: userAdmin.id,
        role: 'ADMIN',
      },
    },
  },
})
```

## Variacao: auto-join com role customizada

```typescript
member_on: autoJoinOrganization
  ? {
      create: {
        organizationId: autoJoinOrganization.id,
        role: 'BILLING', // Role especifica ao inves do default
      },
    }
  : undefined,
```

## Variacao: multiplas organizacoes com mesmo dominio

```typescript
const autoJoinOrganizations = await prisma.organization.findMany({
  where: {
    domain,
    shouldAttachUsersByDomain: true,
  },
})

await prisma.user.create({
  data: {
    name,
    email,
    passwordHash,
    member_on: autoJoinOrganizations.length > 0
      ? {
          createMany: {
            data: autoJoinOrganizations.map((org) => ({
              organizationId: org.id,
            })),
          },
        }
      : undefined,
  },
})
```

## Teste HTTP para validar

```http
### Criar usuario com dominio que tem auto-join
POST http://localhost:3333/users
Content-Type: application/json

{
  "name": "Diego Acme",
  "email": "diego@acme.com",
  "password": "123456"
}

### Resposta esperada: 201 Created
### Verificar no Prisma Studio: usuario associado como MEMBER na org acme-inc
```
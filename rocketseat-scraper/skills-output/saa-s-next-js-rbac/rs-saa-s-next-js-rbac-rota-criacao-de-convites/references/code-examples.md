# Code Examples: Rota de Criacao de Convites

## Estrutura completa da rota

```typescript
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { auth } from '@/http/middlewares/auth'
import { getUserPermissions } from '@/utils/get-user-permissions'
import { UnauthorizedError } from '../_errors/unauthorized-error'
import { BadRequestError } from '../_errors/bad-request-error'
import { roleSchema } from '@saas/auth'

export async function createInvite(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/organizations/:slug/invites',
      {
        schema: {
          tags: ['Invites'],
          summary: 'Create a new invite',
          security: [{ bearerAuth: [] }],
          body: z.object({
            email: z.string().email(),
            role: roleSchema,
          }),
          params: z.object({
            slug: z.string(),
          }),
          response: {
            201: z.object({
              inviteId: z.string().uuid(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const userId = await request.getCurrentUserId()
        const { membership, organization } =
          await request.getUserMembership(slug)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('create', 'Invite')) {
          throw new UnauthorizedError(
            "You're not allowed to create new invites."
          )
        }

        const { email, role } = request.body

        // Barreira 1: dominio auto-join
        const [, domain] = email.split('@')

        if (
          organization.shouldAttachUsersByDomain &&
          organization.domain === domain
        ) {
          throw new BadRequestError(
            `Users with ${domain} domain will join your organization automatically on login.`
          )
        }

        // Barreira 2: convite duplicado
        const inviteWithSameEmail = await prisma.invite.findUnique({
          where: {
            email_organizationId: {
              email,
              organizationId: organization.id,
            },
          },
        })

        if (inviteWithSameEmail) {
          throw new BadRequestError(
            'Another invite with same e-mail already exists.'
          )
        }

        // Barreira 3: membro existente
        const memberWithSameEmail = await prisma.member.findFirst({
          where: {
            organizationId: organization.id,
            user: {
              email,
            },
          },
        })

        if (memberWithSameEmail) {
          throw new BadRequestError(
            'A member with this e-mail already belongs to your organization.'
          )
        }

        // Criacao
        const invite = await prisma.invite.create({
          data: {
            organizationId: organization.id,
            email,
            role,
            authorId: userId,
          },
        })

        return reply.status(201).send({
          inviteId: invite.id,
        })
      },
    )
}
```

## Migration: renomear userId para authorId

```bash
pnpm run db:migrate
# Nome sugerido: rename_user_id_to_author_id_on_invites
```

Schema Prisma (antes):
```prisma
model Invite {
  userId String?
  user   User?   @relation(fields: [userId], references: [id])
}
```

Schema Prisma (depois):
```prisma
model Invite {
  authorId String?
  author   User?   @relation(fields: [authorId], references: [id])
}
```

## Indice composto no Prisma

```prisma
model Invite {
  id             String   @id @default(uuid())
  email          String
  role           Role
  organizationId String
  authorId       String?

  organization Organization @relation(fields: [organizationId], references: [id])
  author       User?        @relation(fields: [authorId], references: [id])

  @@unique([email, organizationId])
}
```

O `@@unique([email, organizationId])` gera automaticamente o nome `email_organizationId` para uso no `findUnique`.

## Padroes de query Prisma demonstrados

### findUnique com indice composto
```typescript
// Quando existe @@unique([campo1, campo2])
await prisma.invite.findUnique({
  where: {
    email_organizationId: {    // nome gerado: campo1_campo2
      email,
      organizationId: organization.id,
    },
  },
})
```

### findFirst com relacao aninhada
```typescript
// Quando o filtro e em campo de tabela relacionada
await prisma.member.findFirst({
  where: {
    organizationId: organization.id,
    user: {          // relacao
      email,         // campo da tabela User
    },
  },
})
```

## Registrando a rota no servidor

```typescript
// No arquivo principal do servidor
import { createInvite } from './routes/invites/create-invite'

app.register(createInvite)
```
# Code Examples: Rota Encerrar Organizacao

## Exemplo completo da rota ShutdownOrganization

```typescript
import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'
import { UnauthorizedError } from '../_errors/unauthorized-error'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

export async function shutdownOrganization(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().register(auth).delete(
    '/organizations/:slug',
    {
      schema: {
        tags: ['Organizations'],
        summary: 'Shutdown organization',
        security: [{ bearerAuth: [] }],
        params: z.object({
          slug: z.string(),
        }),
        response: {
          204: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { slug } = request.params
      const userId = await request.getCurrentUserId()
      const { membership, organization } = await request.getUserMembership(slug)

      const { cannot } = getUserPermissions(userId, membership.role)

      if (cannot('delete', 'Organization')) {
        throw new UnauthorizedError(
          'You are not allowed to shutdown this organization.'
        )
      }

      await prisma.organization.delete({
        where: {
          id: organization.id,
        },
      })

      return reply.status(204).send()
    }
  )
}
```

## Comparacao: Update vs Shutdown (diferencas destacadas)

### Update Organization (referencia)

```typescript
// PUT /organizations/:slug
// TEM body no schema
schema: {
  body: z.object({
    name: z.string(),
    domain: z.string().nullish(),
    shouldAttachUsersByDomain: z.boolean().optional(),
  }),
  response: {
    204: z.null(),
  },
}

// Verifica permissao de 'update'
if (cannot('update', 'Organization')) {
  throw new UnauthorizedError('You are not allowed to update this organization.')
}

// Faz update com dados do body
await prisma.organization.update({
  where: { id: organization.id },
  data: { name, domain, shouldAttachUsersByDomain },
})
```

### Shutdown Organization

```typescript
// DELETE /organizations/:slug
// SEM body no schema
schema: {
  // apenas params e response
  response: {
    204: z.null(),
  },
}

// Verifica permissao de 'delete'
if (cannot('delete', 'Organization')) {
  throw new UnauthorizedError('You are not allowed to shutdown this organization.')
}

// Faz delete sem dados adicionais
await prisma.organization.delete({
  where: { id: organization.id },
})
```

## Fix do bind na funcao getUserPermissions

### Antes (com bug)

```typescript
export function getUserPermissions(userId: string, role: Role) {
  const ability = defineAbilityFor({ id: userId, role })
  // Retornar o objeto diretamente causa problema ao desestruturar
  return ability
}
```

### Depois (corrigido)

```typescript
export function getUserPermissions(userId: string, role: Role) {
  const ability = defineAbilityFor({ id: userId, role })

  return {
    can: ability.can.bind(ability),
    cannot: ability.cannot.bind(ability),
  }
}
```

## Registro da rota no servidor

```typescript
// Em server.ts ou app.ts
import { shutdownOrganization } from './routes/orgs/shutdown-organization'

app.register(shutdownOrganization)
```

## Teste via HTTP (exemplo com curl)

```bash
# Autenticar primeiro
TOKEN=$(curl -s -X POST http://localhost:3333/sessions/password \
  -H "Content-Type: application/json" \
  -d '{"email":"diego@acme.com","password":"54321"}' \
  | jq -r '.token')

# Shutdown organizacao (deve retornar 204)
curl -X DELETE http://localhost:3333/organizations/skillz \
  -H "Authorization: Bearer $TOKEN" \
  -w "\n%{http_code}"

# Tentar shutdown sem permissao (deve retornar 401)
curl -X DELETE http://localhost:3333/organizations/acme-admin \
  -H "Authorization: Bearer $TOKEN" \
  -w "\n%{http_code}"
```
# Code Examples: Rota de Perfil do Usuario Logado

## Exemplo 1: Documentando respostas no Swagger

Antes de criar a rota de perfil, o instrutor mostra como documentar respostas na rota de autenticacao:

```typescript
// Na rota de authenticate, adicionar response ao schema
{
  schema: {
    tags: ['auth'],
    summary: 'Authenticate with e-mail & password',
    body: z.object({
      email: z.string().email(),
      password: z.string(),
    }),
    response: {
      201: z.object({
        token: z.string(),
      }),
      400: z.object({
        message: z.string(),
      }),
    },
  },
}
```

O Swagger automaticamente gera a documentacao de Responses com os codigos e schemas.

## Exemplo 2: Rota completa de perfil

```typescript
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

export async function getProfile(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/profile',
    {
      schema: {
        tags: ['auth'],
        summary: 'Get authenticated user profile',
        response: {
          200: z.object({
            user: z.object({
              id: z.string().uuid(),
              name: z.string().nullable(),
              email: z.string().email(),
              avatarUrl: z.string().url().nullable(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      // Verificar JWT e extrair payload tipado
      const { sub } = await request.jwtVerify<{ sub: string }>()

      // Buscar usuario com select (apenas campos necessarios)
      const user = await prisma.user.findUnique({
        where: { id: sub },
        select: {
          id: true,
          name: true,
          email: true,
          avatarUrl: true,
        },
      })

      // Validar existencia
      if (!user) {
        throw new Error('User not found.')
      }

      // Retornar encapsulado em objeto
      return reply.send({ user })
    },
  )
}
```

## Exemplo 3: Registrando a rota no servidor

```typescript
// Em server.ts ou app.ts
import { getProfile } from './routes/auth/get-profile'

app.register(getProfile)
```

## Exemplo 4: Testando a rota

```bash
# 1. Autenticar para obter token
curl -X POST http://localhost:3333/sessions \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "123456"}'
# Response: { "token": "eyJhbGciOiJIUzI1NiIs..." }

# 2. Buscar perfil com o token
curl -X GET http://localhost:3333/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
# Response: { "user": { "id": "...", "name": "John", "email": "user@example.com", "avatarUrl": null } }
```

## Exemplo 5: Variacao — campos nullable no Zod

```typescript
// Quando o TypeScript aponta que um campo pode ser null,
// o schema Zod DEVE refletir isso com .nullable()

// ERRO de tipagem:
z.object({
  name: z.string(),        // Type 'string | null' is not assignable to type 'string'
  avatarUrl: z.string(),   // Type 'string | null' is not assignable to type 'string'
})

// CORRETO:
z.object({
  name: z.string().nullable(),
  avatarUrl: z.string().url().nullable(),
})
```

## Exemplo 6: Padrao de select para diferentes rotas

```typescript
// Perfil publico (menos campos)
const publicSelect = {
  id: true,
  name: true,
  avatarUrl: true,
}

// Perfil proprio (mais campos)
const privateSelect = {
  id: true,
  name: true,
  email: true,
  avatarUrl: true,
}

// Admin view (campos administrativos)
const adminSelect = {
  id: true,
  name: true,
  email: true,
  avatarUrl: true,
  createdAt: true,
  updatedAt: true,
}
```
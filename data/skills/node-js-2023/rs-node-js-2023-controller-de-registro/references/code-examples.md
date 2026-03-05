# Code Examples: Controller de Registro

## Exemplo 1: Antes — tudo no app.ts

Este e o estado inicial, com rota, validacao e banco no mesmo arquivo:

```typescript
// src/app.ts
import fastify from 'fastify'
import { z } from 'zod'
import { prisma } from './lib/prisma'

export const app = fastify()

app.post('/users', async (request, reply) => {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = registerBodySchema.parse(request.body)

  await prisma.user.create({
    data: {
      name,
      email,
      password_hash: password, // ainda sem hash real neste ponto
    },
  })

  return reply.status(201).send()
})
```

## Exemplo 2: Controller extraido

```typescript
// src/http/controllers/register.ts
import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = registerBodySchema.parse(request.body)

  await prisma.user.create({
    data: {
      name,
      email,
      password_hash: password,
    },
  })

  return reply.status(201).send()
}
```

**Nota:** Ao mover para outro arquivo, o TypeScript perde a inferencia de `request` e `reply`. Por isso importamos `FastifyRequest` e `FastifyReply` explicitamente.

## Exemplo 3: Rotas como plugin

```typescript
// src/http/routes.ts
import { FastifyInstance } from 'fastify'
import { register } from './controllers/register'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register)
}
```

**Detalhe critico:** a funcao DEVE ser `async`. Sem o `async`, o Fastify interpreta como plugin sincrono e pode ter comportamento inesperado.

## Exemplo 4: App registrando o plugin de rotas

```typescript
// src/app.ts
import fastify from 'fastify'
import { appRoutes } from './http/routes'

export const app = fastify()

app.register(appRoutes)
```

Compare com o Exemplo 1 — o `app.ts` agora tem 4 linhas uteis em vez de 20+.

## Exemplo 5: Estrutura de pastas final

```
src/
├── http/
│   ├── controllers/
│   │   └── register.ts        # export async function register(req, reply)
│   └── routes.ts               # export async function appRoutes(app)
├── lib/
│   └── prisma.ts               # instancia do Prisma
├── app.ts                       # fastify() + app.register(appRoutes)
└── server.ts                    # app.listen()
```

## Exemplo 6: Visualizacao das camadas (futuro)

O codigo atual do controller mistura camada HTTP e camada de negocio. Nas proximas aulas, ficara assim:

```typescript
// Controller (camada HTTP) — so lida com request/reply
export async function register(request: FastifyRequest, reply: FastifyReply) {
  const { name, email, password } = registerBodySchema.parse(request.body)

  // Delega para use case (camada de negocio)
  await registerUseCase.execute({ name, email, password })

  return reply.status(201).send()
}

// Use Case (camada de negocio) — independente de HTTP
class RegisterUseCase {
  async execute({ name, email, password }) {
    const passwordHash = await hash(password, 6)
    const emailExists = await this.usersRepository.findByEmail(email)
    if (emailExists) throw new UserAlreadyExistsError()
    await this.usersRepository.create({ name, email, password_hash: passwordHash })
  }
}
```

Este e o destino da separacao em camadas que comeca nesta aula.
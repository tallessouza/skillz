---
name: rs-node-js-2023-caso-de-uso-de-registro
description: "Enforces Use Case pattern separation when writing Node.js backend code. Use when user asks to 'create an endpoint', 'add a route', 'implement a feature', 'register user', or any server-side logic. Applies rules: business logic in use cases not controllers, no framework objects (reply/req/res) in use cases, throw errors instead of HTTP responses, controller wraps use case in try/catch. Make sure to use this skill whenever creating backend features, even simple CRUD. Not for frontend components, database schema design, or infrastructure setup."
---

# Use Case Pattern — Separacao de Logica de Negocio

> Logica de negocio vive em use cases, nunca em controllers. O controller e apenas um adaptador entre o meio de entrada (HTTP, mensageria, CLI) e a funcionalidade real.

## Rules

1. **Separe business logic do controller** — crie arquivos em `src/use-cases/`, porque a funcionalidade deve funcionar independente de ser chamada via HTTP, mensageria ou qualquer outro meio
2. **Nunca passe objetos do framework para o use case** — proibido receber `reply`, `req`, `res`, `context` do Fastify/Express, porque isso acopla o use case ao meio de transporte
3. **Use case recebe dados primitivos tipados** — crie uma interface/type com os parametros necessarios (`name`, `email`, `password`), porque o use case deve ser agnostico ao framework
4. **Erros no use case sao throw, nunca reply** — use `throw new Error('message')` no use case, porque quem decide o codigo HTTP e o controller, nao a logica de negocio
5. **Controller envolve use case em try/catch** — o controller chama o use case, captura erros, e traduz para respostas HTTP apropriadas
6. **Um use case = uma funcionalidade** — `registerUseCase` faz registro, `authenticateUseCase` faz login, porque cada use case representa uma acao do sistema

## How to write

### Estrutura do Use Case

```typescript
// src/use-cases/register.ts
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

export async function registerUseCase({
  name,
  email,
  password,
}: RegisterUseCaseRequest) {
  const password_hash = await hash(password, 6)

  const userWithSameEmail = await prisma.user.findUnique({
    where: { email },
  })

  if (userWithSameEmail) {
    throw new Error('E-mail already exists.')
  }

  await prisma.user.create({
    data: { name, email, password_hash },
  })
}
```

### Controller chamando Use Case

```typescript
// src/http/controllers/register.ts
import { registerUseCase } from '@/use-cases/register'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const { name, email, password } = registerBodySchema.parse(request.body)

  try {
    await registerUseCase({ name, email, password })
  } catch (err) {
    return reply.status(409).send()
  }

  return reply.status(201).send()
}
```

## Example

**Before (logica acoplada ao controller):**
```typescript
export async function register(request: FastifyRequest, reply: FastifyReply) {
  const { name, email, password } = request.body
  const password_hash = await hash(password, 6)

  const userExists = await prisma.user.findUnique({ where: { email } })

  if (userExists) {
    return reply.status(409).send() // framework leak na logica
  }

  await prisma.user.create({ data: { name, email, password_hash } })
  return reply.status(201).send()
}
```

**After (use case separado):**
```typescript
// use-cases/register.ts — logica pura
export async function registerUseCase({ name, email, password }: RegisterUseCaseRequest) {
  const password_hash = await hash(password, 6)
  const userExists = await prisma.user.findUnique({ where: { email } })

  if (userExists) {
    throw new Error('E-mail already exists.')
  }

  await prisma.user.create({ data: { name, email, password_hash } })
}

// controllers/register.ts — adaptador HTTP
export async function register(request: FastifyRequest, reply: FastifyReply) {
  const { name, email, password } = registerBodySchema.parse(request.body)

  try {
    await registerUseCase({ name, email, password })
  } catch (err) {
    return reply.status(409).send()
  }

  return reply.status(201).send()
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Criando nova funcionalidade backend | Crie use case primeiro, controller depois |
| Precisa de `reply`/`res` dentro da logica | PARE — mova a logica para um use case |
| Mesmo codigo usado em rota HTTP e worker | Use case compartilhado, dois adaptadores |
| Erro de negocio (email duplicado, saldo insuficiente) | `throw new Error()` no use case |
| Erro HTTP (400, 404, 409) | Traduza o erro no controller via try/catch |

## Anti-patterns

| Nunca escreva | Escreva em vez disso |
|---------------|----------------------|
| `reply.status(409)` dentro do use case | `throw new Error('E-mail already exists.')` |
| `request.body` dentro do use case | Receba dados via interface tipada |
| Toda logica no controller | Logica no use case, controller so adapta |
| Use case recebendo `FastifyReply` como parametro | Use case recebe apenas dados primitivos |
| Um arquivo gigante controller+logica | `use-cases/register.ts` + `controllers/register.ts` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

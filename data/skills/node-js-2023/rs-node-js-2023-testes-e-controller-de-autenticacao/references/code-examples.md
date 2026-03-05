# Code Examples: Testes e Controller de Autenticacao

## Arquivo de teste completo: authenticate.spec.ts

```typescript
import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(usersRepository)
  })

  it('should be able to authenticate', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    await expect(() =>
      sut.execute({
        email: 'johndoe@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
    })

    await expect(() =>
      sut.execute({
        email: 'johndoe@example.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
```

## Controller completo: authenticate.ts

```typescript
import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = authenticateBodySchema.parse(request.body)

  try {
    const authenticateUseCase = makeAuthenticateUseCase()

    await authenticateUseCase.execute({
      email,
      password,
    })
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: err.message })
    }

    throw err
  }

  return reply.status(200).send()
}
```

## Registro de rotas: routes.ts

```typescript
import { FastifyInstance } from 'fastify'
import { register } from './controllers/register'
import { authenticate } from './controllers/authenticate'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)
}
```

## Comparacao: teste com e sem SUT

### Sem SUT (propenso a erro ao copiar)

```typescript
let authenticateUseCase: AuthenticateUseCase

beforeEach(() => {
  const usersRepository = new InMemoryUsersRepository()
  authenticateUseCase = new AuthenticateUseCase(usersRepository)
})

it('should authenticate', async () => {
  // Se copiar para outro arquivo, facil esquecer de renomear authenticateUseCase
  const result = await authenticateUseCase.execute({ ... })
})
```

### Com SUT (seguro para copiar)

```typescript
let sut: AuthenticateUseCase

beforeEach(() => {
  const usersRepository = new InMemoryUsersRepository()
  sut = new AuthenticateUseCase(usersRepository)
})

it('should authenticate', async () => {
  // sut e valido em qualquer arquivo de teste
  const result = await sut.execute({ ... })
})
```

## Comparacao: setup com use case vs repositorio direto

### Errado: usando outro use case no setup

```typescript
it('should authenticate', async () => {
  const registerUseCase = new RegisterUseCase(usersRepository)

  // Problema: se RegisterUseCase quebrar, este teste falha
  // mas o bug nao e na autenticacao
  await registerUseCase.execute({
    name: 'John Doe',
    email: 'johndoe@example.com',
    password: '123456',
  })

  const { user } = await sut.execute({
    email: 'johndoe@example.com',
    password: '123456',
  })
})
```

### Correto: usando repositorio direto

```typescript
it('should authenticate', async () => {
  // Setup isolado — so depende do repositorio
  await usersRepository.create({
    name: 'John Doe',
    email: 'johndoe@example.com',
    password_hash: await hash('123456', 6),
  })

  const { user } = await sut.execute({
    email: 'johndoe@example.com',
    password: '123456',
  })
})
```

## Pattern de teste para erros esperados

```typescript
// Para testar que um erro especifico e lancado:
await expect(() =>
  sut.execute({
    email: 'wrong@email.com',
    password: '123456',
  }),
).rejects.toBeInstanceOf(InvalidCredentialsError)

// Note: passe uma arrow function para expect(),
// nao o resultado direto da promise
```
# Code Examples: Erros Personalizados em Use Cases

## Exemplo completo da aula

### 1. Classe de erro

```typescript
// src/use-cases/errors/user-already-exists-error.ts
export class UserAlreadyExistsError extends Error {
  constructor() {
    super('E-mail already exists.')
  }
}
```

### 2. Use case usando o erro tipado

```typescript
// src/use-cases/register.ts
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ name, email, password }: RegisterUseCaseRequest) {
    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    const password_hash = await hash(password, 6)

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
    })

    return { user }
  }
}
```

### 3. Controller com instanceof

```typescript
// src/http/controllers/register.ts
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const { name, email, password } = registerBodySchema.parse(request.body)

  try {
    const registerUseCase = makeRegisterUseCase()

    await registerUseCase.execute({ name, email, password })
  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }

    throw err
  }

  return reply.status(201).send()
}
```

## Variacao: multiplos erros no mesmo controller

```typescript
catch (err) {
  if (err instanceof UserAlreadyExistsError) {
    return reply.status(409).send({ message: err.message })
  }

  if (err instanceof InvalidCredentialsError) {
    return reply.status(401).send({ message: err.message })
  }

  if (err instanceof ResourceNotFoundError) {
    return reply.status(404).send({ message: err.message })
  }

  throw err // erro inesperado → error handler global
}
```

## Variacao: erro com dados adicionais

```typescript
export class ResourceNotFoundError extends Error {
  constructor(resource: string) {
    super(`${resource} not found.`)
  }
}

// uso
throw new ResourceNotFoundError('User')
// message: "User not found."
```

## Estrutura de pastas resultante

```
src/
├── use-cases/
│   ├── errors/
│   │   ├── user-already-exists-error.ts
│   │   ├── invalid-credentials-error.ts
│   │   └── resource-not-found-error.ts
│   ├── register.ts
│   └── authenticate.ts
├── http/
│   └── controllers/
│       └── register.ts
└── repositories/
    └── prisma/
        └── prisma-users-repository.ts
```
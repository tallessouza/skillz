# Code Examples: Primeiro Teste Unitario

## Exemplo 1: Teste inicial (ERRADO — usa Prisma real)

```typescript
import { describe, it } from 'vitest'
import { RegisterUseCase } from './register'
import { PrismaUsersRepository } from '../repositories/prisma/prisma-users-repository'

describe('Register Use Case', () => {
  it('should hash user password upon registration', async () => {
    const prismaUsersRepository = new PrismaUsersRepository()
    const registerUseCase = new RegisterUseCase(prismaUsersRepository)

    const { user } = await registerUseCase.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    console.log(user.password_hash)
  })
})
```

**Problema:** Roda uma vez, funciona. Roda de novo, falha com e-mail duplicado. Nao e teste unitario — e teste de integracao.

## Exemplo 2: Teste correto com fake repository

```typescript
import { describe, it, expect } from 'vitest'
import { compare } from 'bcryptjs'
import { RegisterUseCase } from './register'

describe('Register Use Case', () => {
  it('should hash user password upon registration', async () => {
    const usersRepository = {
      async create(data) {
        return {
          id: 'user-1',
          name: data.name,
          email: data.email,
          password_hash: data.password_hash,
          created_at: new Date(),
        }
      },
      async findByEmail() {
        return null
      },
    }

    const registerUseCase = new RegisterUseCase(usersRepository)

    const { user } = await registerUseCase.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })
})
```

**Resultado:** 20ms de execucao, sem banco de dados, sem conflitos, repetivel infinitamente.

## Exemplo 3: Alteracao no use case — retorno nomeado

### Antes (void):
```typescript
class RegisterUseCase {
  async execute({ name, email, password }: RegisterUseCaseRequest) {
    // ... logica de cadastro
    const user = await this.usersRepository.create({
      name,
      email,
      password_hash: passwordHash,
    })
    // nao retorna nada
  }
}
```

### Depois (retorno nomeado):
```typescript
interface RegisterUseCaseResponse {
  user: User
}

class RegisterUseCase {
  async execute({
    name,
    email,
    password,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    // ... logica de cadastro
    const user = await this.usersRepository.create({
      name,
      email,
      password_hash: passwordHash,
    })

    return { user }
  }
}
```

## Exemplo 4: Fake repository — metodos nao utilizados

Quando o teste nao exercita um metodo especifico da interface, implemente o minimo:

```typescript
const usersRepository = {
  async create(data) {
    return {
      id: 'user-1',
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
    }
  },
  // Nao usado neste teste, retorna null
  async findByEmail() {
    return null
  },
}
```

## Exemplo 5: Verificacao de hash com bcryptjs compare

```typescript
import { compare } from 'bcryptjs'

// compare(senhaPlainText, hashExistente) => boolean
const isPasswordCorrectlyHashed = await compare('123456', user.password_hash)

// Se a senha '123456' gerou o hash armazenado, retorna true
expect(isPasswordCorrectlyHashed).toBe(true)
```

**Nota:** Nao tente descriptografar o hash. Hashes sao one-way. Use `compare` para verificar correspondencia.
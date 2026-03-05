# Code Examples: Utilizando UI do Vitest

## Instalacao completa

```bash
npm install -D @vitest/ui
```

## package.json com scripts de teste

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:ui": "vitest --ui"
  }
}
```

## Exemplo de teste que aparece na UI

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { RegisterUseCase } from './register'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

describe('Register Use Case', () => {
  let usersRepository: InMemoryUsersRepository
  let sut: RegisterUseCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })

  it('should hash user password upon registration', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    // Na UI, se este expect falhar, mostra a linha exata
    // e a mensagem "expected false to be true"
    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })
})
```

## Module Graph gerado pela UI

Para o teste acima, o Vitest UI gera um grafico mostrando:

```
register.spec.ts
  ├── register.ts
  │     └── UserAlreadyExistsError
  └── InMemoryUsersRepository
```

## Console.log visivel na UI

```typescript
it('should register user', async () => {
  const { user } = await sut.execute({
    name: 'John Doe',
    email: 'johndoe@example.com',
    password: '123456',
  })

  // Este log aparece na aba "Console" da UI do Vitest
  console.log('User created:', user)

  expect(user.id).toEqual(expect.any(String))
})
```

## Executando

```bash
# Abre a UI no navegador
npm run test:ui

# Equivalente direto
npx vitest --ui
```
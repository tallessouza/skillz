# Code Examples: Isolamento de Testes com beforeEach

## Exemplo completo do Register Use Case (da aula)

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })

  it('should be able to register', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const { user } = await sut.execute({
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

  it('should not be able to register with same email twice', async () => {
    const email = 'johndoe@example.com'

    await sut.execute({
      name: 'John Doe',
      email,
      password: '123456',
    })

    await expect(() =>
      sut.execute({
        name: 'John Doe',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
```

## Exemplo completo do Authenticate Use Case (da aula)

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
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
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
```

## Caso com multiplas dependencias (projecao do instrutor)

```typescript
// Quando o use case cresce para 5-6 dependencias,
// o beforeEach evita repetir tudo isso em cada teste
let usersRepository: InMemoryUsersRepository
let gymsRepository: InMemoryGymsRepository
let checkInsRepository: InMemoryCheckInsRepository
let subscriptionsRepository: InMemorySubscriptionsRepository
let notificationsService: InMemoryNotificationsService
let sut: CheckInUseCase

describe('Check-in Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    gymsRepository = new InMemoryGymsRepository()
    checkInsRepository = new InMemoryCheckInsRepository()
    subscriptionsRepository = new InMemorySubscriptionsRepository()
    notificationsService = new InMemoryNotificationsService()
    sut = new CheckInUseCase(
      checkInsRepository,
      gymsRepository,
      subscriptionsRepository,
      notificationsService,
    )
  })

  it('should be able to check in', async () => {
    // cada teste comeca com todos os repositorios vazios
  })
})
```

## Padrao com beforeEach aninhado

```typescript
let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })

  describe('when user does not exist', () => {
    it('should register successfully', async () => {
      // repositorio ja esta limpo pelo beforeEach pai
    })
  })

  describe('when user already exists', () => {
    beforeEach(async () => {
      // beforeEach filho roda DEPOIS do pai
      await sut.execute({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456',
      })
    })

    it('should throw UserAlreadyExistsError', async () => {
      await expect(() =>
        sut.execute({
          name: 'John Doe',
          email: 'johndoe@example.com',
          password: '123456',
        }),
      ).rejects.toBeInstanceOf(UserAlreadyExistsError)
    })
  })
})
```
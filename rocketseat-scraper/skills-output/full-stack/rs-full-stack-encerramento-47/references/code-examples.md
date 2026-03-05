# Code Examples: Jest e SuperTest

## Setup completo do projeto

### package.json scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:unit": "jest --testPathPattern=tests/unit",
    "test:e2e": "jest --testPathPattern=tests/e2e",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

### Estrutura de pastas

```
src/
├── app.ts
├── routes/
├── services/
└── utils/
tests/
├── unit/
│   ├── services/
│   │   └── create-user.spec.ts
│   └── utils/
│       └── calculate-price.spec.ts
└── e2e/
    ├── create-user.spec.ts
    └── list-users.spec.ts
```

## Teste unitario completo

```typescript
// tests/unit/services/create-user.spec.ts
import { CreateUserService } from '../../../src/services/create-user'

describe('CreateUserService', () => {
  it('creates user with valid data', async () => {
    const mockRepository = {
      create: jest.fn().mockResolvedValue({ id: '1', name: 'John', email: 'john@test.com' }),
      findByEmail: jest.fn().mockResolvedValue(null),
    }

    const service = new CreateUserService(mockRepository)
    const user = await service.execute({ name: 'John', email: 'john@test.com' })

    expect(user).toHaveProperty('id')
    expect(mockRepository.create).toHaveBeenCalledTimes(1)
  })

  it('throws if email already exists', async () => {
    const mockRepository = {
      create: jest.fn(),
      findByEmail: jest.fn().mockResolvedValue({ id: '1', email: 'john@test.com' }),
    }

    const service = new CreateUserService(mockRepository)

    await expect(
      service.execute({ name: 'John', email: 'john@test.com' })
    ).rejects.toThrow('Email already in use')
  })
})
```

## Teste e2e completo com SuperTest

```typescript
// tests/e2e/create-user.spec.ts
import request from 'supertest'
import { app } from '../../src/app'

describe('Users E2E', () => {
  describe('POST /users', () => {
    it('creates a user and returns 201', async () => {
      const response = await request(app)
        .post('/users')
        .send({
          name: 'Maria Silva',
          email: 'maria@example.com',
          password: 'securepass123',
        })

      expect(response.status).toBe(201)
      expect(response.body.user).toEqual(
        expect.objectContaining({
          name: 'Maria Silva',
          email: 'maria@example.com',
        })
      )
      expect(response.body.user).not.toHaveProperty('password')
    })

    it('returns 400 for invalid email', async () => {
      const response = await request(app)
        .post('/users')
        .send({
          name: 'Maria',
          email: 'invalid-email',
          password: '123',
        })

      expect(response.status).toBe(400)
    })

    it('returns 409 for duplicate email', async () => {
      await request(app)
        .post('/users')
        .send({ name: 'First', email: 'dup@test.com', password: '123456' })

      const response = await request(app)
        .post('/users')
        .send({ name: 'Second', email: 'dup@test.com', password: '123456' })

      expect(response.status).toBe(409)
    })
  })

  describe('GET /users', () => {
    it('lists all users', async () => {
      const response = await request(app).get('/users')

      expect(response.status).toBe(200)
      expect(Array.isArray(response.body.users)).toBe(true)
    })
  })
})
```

## Variacoes: Setup e teardown para e2e

```typescript
// tests/e2e/setup.ts
import { prisma } from '../../src/lib/prisma'

beforeEach(async () => {
  await prisma.user.deleteMany()
})

afterAll(async () => {
  await prisma.$disconnect()
})
```

```typescript
// jest.config.ts — com setup global para e2e
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  projects: [
    {
      displayName: 'unit',
      testMatch: ['<rootDir>/tests/unit/**/*.spec.ts'],
    },
    {
      displayName: 'e2e',
      testMatch: ['<rootDir>/tests/e2e/**/*.spec.ts'],
      setupFilesAfterSetup: ['<rootDir>/tests/e2e/setup.ts'],
    },
  ],
}
```

## SuperTest com autenticacao

```typescript
// tests/e2e/authenticated-route.spec.ts
import request from 'supertest'
import { app } from '../../src/app'

describe('GET /profile (authenticated)', () => {
  it('returns user profile when authenticated', async () => {
    // Primeiro cria usuario e faz login
    await request(app)
      .post('/users')
      .send({ name: 'Auth User', email: 'auth@test.com', password: '123456' })

    const loginResponse = await request(app)
      .post('/sessions')
      .send({ email: 'auth@test.com', password: '123456' })

    const { token } = loginResponse.body

    // Usa token na requisicao autenticada
    const response = await request(app)
      .get('/profile')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body.user.email).toBe('auth@test.com')
  })

  it('returns 401 without token', async () => {
    const response = await request(app).get('/profile')
    expect(response.status).toBe(401)
  })
})
```
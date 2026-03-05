# Code Examples: Testes E2E de Usuarios no NestJS

## Exemplo completo: CreateAccountController E2E

```typescript
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { AppModule } from './../app.module'
import { PrismaService } from './../prisma/prisma.service'

describe('CreateAccount (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[POST] /accounts', async () => {
    const response = await request(app.getHttpServer())
      .post('/accounts')
      .send({
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456',
      })

    expect(response.statusCode).toBe(201)

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        email: 'johndoe@example.com',
      },
    })

    expect(userOnDatabase).toBeTruthy()
  })
})
```

## Exemplo completo: AuthenticateController E2E

```typescript
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { hash } from 'bcryptjs'
import { AppModule } from './../app.module'
import { PrismaService } from './../prisma/prisma.service'

describe('Authenticate (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[POST] /sessions', async () => {
    // Criar usuario diretamente no banco com senha hasheada
    await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: await hash('123456', 8),
      },
    })

    const response = await request(app.getHttpServer())
      .post('/sessions')
      .send({
        email: 'johndoe@example.com',
        password: '123456',
      })

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      access_token: expect.any(String),
    })
  })
})
```

## Instalacao dos pacotes necessarios

```bash
pnpm add -D supertest @types/supertest
```

## Padrao de acesso a servicos — comparacao main.ts vs teste

### No main.ts:
```typescript
const app = await NestFactory.create(AppModule)
const prisma = app.get(PrismaService)
```

### No teste:
```typescript
const moduleRef = await Test.createTestingModule({
  imports: [AppModule],
}).compile()

app = moduleRef.createNestApplication()
prisma = moduleRef.get(PrismaService)
```

## Variacao: teste com afterAll para cleanup

```typescript
afterAll(async () => {
  await app.close()
})
```

## Variacao: validacao mais detalhada do usuario no banco

```typescript
const userOnDatabase = await prisma.user.findUnique({
  where: { email: 'johndoe@example.com' },
})

expect(userOnDatabase).toBeTruthy()
expect(userOnDatabase?.name).toBe('John Doe')
// Senha deve estar hasheada, nao em texto puro
expect(userOnDatabase?.password).not.toBe('123456')
```
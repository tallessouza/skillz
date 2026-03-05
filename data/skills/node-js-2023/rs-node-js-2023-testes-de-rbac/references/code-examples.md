# Code Examples: Testes de RBAC

## Helper original (antes do RBAC)

```typescript
// utils/create-and-authenticate-user.ts (ANTES)
import request from 'supertest'
import { FastifyInstance } from 'fastify'

export async function createAndAuthenticateUser(app: FastifyInstance) {
  await request(app.server).post('/users').send({
    name: 'John Doe',
    email: 'johndoe@example.com',
    password: '123456',
  })

  const authResponse = await request(app.server).post('/sessions').send({
    email: 'johndoe@example.com',
    password: '123456',
  })

  const { token } = authResponse.body

  return { token }
}
```

## Helper corrigido (com suporte a RBAC)

```typescript
// utils/create-and-authenticate-user.ts (DEPOIS)
import request from 'supertest'
import { FastifyInstance } from 'fastify'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  isAdmin = false,
) {
  await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
      role: isAdmin ? 'ADMIN' : 'MEMBER',
    },
  })

  const authResponse = await request(app.server).post('/sessions').send({
    email: 'johndoe@example.com',
    password: '123456',
  })

  const { token } = authResponse.body

  return { token }
}
```

## Teste de validacao de check-in (exige admin)

```typescript
// controllers/check-ins/validate.spec.ts
it('should be able to validate a check-in', async () => {
  const { token } = await createAndAuthenticateUser(app, true) // admin!

  // ... criar usuario, academia, check-in ...

  const response = await request(app.server)
    .patch(`/check-ins/${checkIn.id}/validate`)
    .set('Authorization', `Bearer ${token}`)
    .send()

  expect(response.statusCode).toEqual(204)
})
```

## Teste de criacao de academia (exige admin)

```typescript
// controllers/gyms/create.spec.ts
it('should be able to create a gym', async () => {
  const { token } = await createAndAuthenticateUser(app, true) // admin!

  const response = await request(app.server)
    .post('/gyms')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: 'JavaScript Gym',
      description: 'Some description',
      phone: '1199999999',
      latitude: -27.2092052,
      longitude: -49.6401091,
    })

  expect(response.statusCode).toEqual(201)
})
```

## Teste de academias proximas (admin para criar, mas a rota em si nao exige)

```typescript
// controllers/gyms/nearby.spec.ts
it('should be able to list nearby gyms', async () => {
  const { token } = await createAndAuthenticateUser(app, true) // admin para criar gyms

  await request(app.server)
    .post('/gyms')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: 'Near Gym',
      latitude: -27.2092052,
      longitude: -49.6401091,
    })

  await request(app.server)
    .post('/gyms')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: 'Far Gym',
      latitude: -27.0610928,
      longitude: -49.5229501,
    })

  const response = await request(app.server)
    .get('/gyms/nearby')
    .query({ latitude: -27.2092052, longitude: -49.6401091 })
    .set('Authorization', `Bearer ${token}`)
    .send()

  expect(response.statusCode).toEqual(200)
  expect(response.body.gyms).toHaveLength(1)
  expect(response.body.gyms).toEqual([
    expect.objectContaining({ name: 'Near Gym' }),
  ])
})
```

## Teste de busca de academias (mesma situacao)

```typescript
// controllers/gyms/search.spec.ts
it('should be able to search gyms by name', async () => {
  const { token } = await createAndAuthenticateUser(app, true) // admin para criar gyms

  await request(app.server)
    .post('/gyms')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: 'JavaScript Gym',
      latitude: -27.2092052,
      longitude: -49.6401091,
    })

  await request(app.server)
    .post('/gyms')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: 'TypeScript Gym',
      latitude: -27.2092052,
      longitude: -49.6401091,
    })

  const response = await request(app.server)
    .get('/gyms/search')
    .query({ q: 'JavaScript' })
    .set('Authorization', `Bearer ${token}`)
    .send()

  expect(response.statusCode).toEqual(200)
  expect(response.body.gyms).toHaveLength(1)
  expect(response.body.gyms).toEqual([
    expect.objectContaining({ name: 'JavaScript Gym' }),
  ])
})
```

## Alternativa: criar recursos de teste via Prisma direto

O instrutor menciona que para nearby/search, uma alternativa seria criar academias direto no banco:

```typescript
// Alternativa: bypass total da rota admin
it('should be able to list nearby gyms', async () => {
  const { token } = await createAndAuthenticateUser(app) // NAO precisa ser admin

  // Cria academias direto no banco
  await prisma.gym.createMany({
    data: [
      {
        name: 'Near Gym',
        latitude: new Decimal(-27.2092052),
        longitude: new Decimal(-49.6401091),
      },
      {
        name: 'Far Gym',
        latitude: new Decimal(-27.0610928),
        longitude: new Decimal(-49.5229501),
      },
    ],
  })

  const response = await request(app.server)
    .get('/gyms/nearby')
    .query({ latitude: -27.2092052, longitude: -49.6401091 })
    .set('Authorization', `Bearer ${token}`)
    .send()

  expect(response.statusCode).toEqual(200)
})
```

Esta alternativa e valida quando voce quer testar especificamente a rota de busca sem depender da rota de criacao. A escolha depende do que voce quer validar no teste.
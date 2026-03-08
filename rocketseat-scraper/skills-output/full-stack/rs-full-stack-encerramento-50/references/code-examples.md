# Code Examples: Padrão Repetível de Testes em Controllers

## Padrão base: UserController (referência)

```typescript
describe('UserController', () => {
  it('should create a new user', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        password: '123456',
      })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
  })

  it('should not create user with duplicate email', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    }

    await request(app).post('/users').send(userData)
    const response = await request(app).post('/users').send(userData)

    expect(response.status).toBe(409)
  })
})
```

## Padrão base: SessionsController (referência)

```typescript
describe('SessionsController', () => {
  it('should authenticate a user', async () => {
    await request(app).post('/users').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    })

    const response = await request(app)
      .post('/sessions')
      .send({
        email: 'john@example.com',
        password: '123456',
      })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('token')
  })

  it('should not authenticate with wrong password', async () => {
    await request(app).post('/users').send({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    })

    const response = await request(app)
      .post('/sessions')
      .send({
        email: 'john@example.com',
        password: 'wrong-password',
      })

    expect(response.status).toBe(401)
  })
})
```

## Aplicando o mesmo padrão: DeliveryController

```typescript
describe('DeliveryController', () => {
  let token: string

  beforeAll(async () => {
    // Setup — reutiliza padrão de SessionsController
    await request(app).post('/users').send({
      name: 'Courier',
      email: 'courier@example.com',
      password: '123456',
    })

    const session = await request(app).post('/sessions').send({
      email: 'courier@example.com',
      password: '123456',
    })

    token = session.body.token
  })

  it('should create a delivery', async () => {
    const response = await request(app)
      .post('/deliveries')
      .set('Authorization', `Bearer ${token}`)
      .send({
        recipientName: 'Maria Silva',
        address: 'Rua das Flores, 123',
        city: 'São Paulo',
        zipCode: '01001-000',
      })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
    expect(response.body.status).toBe('pending')
  })

  it('should list all deliveries', async () => {
    const response = await request(app)
      .get('/deliveries')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body).toBeInstanceOf(Array)
  })

  it('should update delivery status', async () => {
    const createResponse = await request(app)
      .post('/deliveries')
      .set('Authorization', `Bearer ${token}`)
      .send({
        recipientName: 'João Santos',
        address: 'Av. Paulista, 1000',
        city: 'São Paulo',
        zipCode: '01310-100',
      })

    const deliveryId = createResponse.body.id

    const response = await request(app)
      .patch(`/deliveries/${deliveryId}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'delivered' })

    expect(response.status).toBe(200)
    expect(response.body.status).toBe('delivered')
  })

  it('should not create delivery without authentication', async () => {
    const response = await request(app)
      .post('/deliveries')
      .send({
        recipientName: 'Sem Auth',
        address: 'Rua X',
        city: 'SP',
        zipCode: '00000-000',
      })

    expect(response.status).toBe(401)
  })
})
```

## Extraindo factories para escalar

```typescript
// test/factories/make-user.ts
interface MakeUserInput {
  name?: string
  email?: string
  password?: string
}

export function makeUser(overrides: MakeUserInput = {}) {
  return {
    name: overrides.name ?? 'John Doe',
    email: overrides.email ?? `john-${Date.now()}@example.com`,
    password: overrides.password ?? '123456',
  }
}

// test/factories/make-delivery.ts
interface MakeDeliveryInput {
  recipientName?: string
  address?: string
  city?: string
  zipCode?: string
}

export function makeDelivery(overrides: MakeDeliveryInput = {}) {
  return {
    recipientName: overrides.recipientName ?? 'Maria Silva',
    address: overrides.address ?? 'Rua das Flores, 123',
    city: overrides.city ?? 'São Paulo',
    zipCode: overrides.zipCode ?? '01001-000',
  }
}
```

## Helper de autenticação reutilizável

```typescript
// test/helpers/authenticate.ts
import request from 'supertest'
import { app } from '@/app'
import { makeUser } from '../factories/make-user'

export async function createAndAuthenticate(app: Express) {
  const user = makeUser()

  await request(app).post('/users').send(user)

  const sessionResponse = await request(app)
    .post('/sessions')
    .send({ email: user.email, password: user.password })

  return {
    token: sessionResponse.body.token,
    user,
  }
}
```

## Usando o helper em qualquer controller

```typescript
// Qualquer controller novo segue este padrão mínimo:
describe('PackageController', () => {
  let token: string

  beforeAll(async () => {
    const auth = await createAndAuthenticate(app)
    token = auth.token
  })

  it('should create a package', async () => {
    const response = await request(app)
      .post('/packages')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Encomenda A', weight: 2.5 })

    expect(response.status).toBe(201)
  })

  // ... mesmo padrão para list, update, delete
})
```
# Code Examples: Testes Automatizados em Node.js

## Setup inicial do Jest em projeto Node.js

### Instalacao

```bash
npm install --save-dev jest @types/jest ts-jest
```

### Configuracao (jest.config.ts)

```typescript
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.spec.ts', '**/*.test.ts'],
}
```

### Script no package.json

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch"
  }
}
```

## Setup do SuperTest

### Instalacao

```bash
npm install --save-dev supertest @types/supertest
```

### Separar app do server (fundamental para SuperTest)

```typescript
// src/app.ts — exporta o app sem iniciar o servidor
import express from 'express'

const app = express()
app.use(express.json())

// rotas aqui
app.post('/users', async (req, res) => {
  // implementacao
})

export { app }
```

```typescript
// src/server.ts — inicia o servidor
import { app } from './app'

app.listen(3000, () => {
  console.log('Server running on port 3000')
})
```

```typescript
// src/__tests__/users.spec.ts — testa sem iniciar servidor
import request from 'supertest'
import { app } from '../app'

describe('Users API', () => {
  it('should create a user', async () => {
    const response = await request(app)
      .post('/users')
      .send({ name: 'Maria', email: 'maria@test.com' })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
    expect(response.body.name).toBe('Maria')
  })
})
```

## Teste unitario basico com Jest

```typescript
// src/utils/format-date.ts
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

// src/utils/format-date.spec.ts
import { formatDate } from './format-date'

describe('formatDate', () => {
  it('should format date as YYYY-MM-DD', () => {
    const date = new Date('2026-03-01T10:00:00Z')
    expect(formatDate(date)).toBe('2026-03-01')
  })
})
```

## Simulando falha intencional

```typescript
describe('calculateDiscount', () => {
  it('should apply 10% discount', () => {
    const result = calculateDiscount(100, 0.1)
    expect(result).toBe(90)
  })

  // Teste que DEVE falhar se a validacao nao existir
  it('should throw for negative discount', () => {
    expect(() => calculateDiscount(100, -0.1)).toThrow()
  })

  // Teste que DEVE falhar se o limite nao for respeitado
  it('should not allow discount greater than 100%', () => {
    expect(() => calculateDiscount(100, 1.5)).toThrow()
  })
})
```

## Teste e2e completo com caminho feliz e falha

```typescript
import request from 'supertest'
import { app } from '../app'

describe('POST /users', () => {
  // Caminho feliz
  it('should create user with valid data', async () => {
    const response = await request(app)
      .post('/users')
      .send({ name: 'João', email: 'joao@test.com' })

    expect(response.status).toBe(201)
    expect(response.body).toEqual(
      expect.objectContaining({
        name: 'João',
        email: 'joao@test.com',
      })
    )
  })

  // Caminho de falha — campos obrigatorios ausentes
  it('should return 400 when name is missing', async () => {
    const response = await request(app)
      .post('/users')
      .send({ email: 'joao@test.com' })

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('error')
  })

  // Caminho de falha — email invalido
  it('should return 400 for invalid email', async () => {
    const response = await request(app)
      .post('/users')
      .send({ name: 'João', email: 'not-an-email' })

    expect(response.status).toBe(400)
  })
})
```

## Organizacao de pastas para testes

```
src/
├── __tests__/          # Testes e2e
│   └── users.spec.ts
├── utils/
│   ├── format-date.ts
│   └── format-date.spec.ts   # Teste unitario ao lado do arquivo
├── services/
│   ├── user-service.ts
│   └── user-service.spec.ts  # Teste unitario/integracao
├── app.ts              # App separado do server
└── server.ts           # Apenas inicializacao
```
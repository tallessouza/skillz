# Code Examples: Tipos de Testes Automatizados

## Teste Unitario — Funcao com responsabilidade unica

### Validar email
```typescript
// A funcao tem UMA responsabilidade: validar formato de email
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Teste unitario
describe('validateEmail', () => {
  test('returns true for valid email', () => {
    expect(validateEmail('user@example.com')).toBe(true)
  })

  test('returns false for invalid email', () => {
    expect(validateEmail('invalid')).toBe(false)
    expect(validateEmail('user@')).toBe(false)
    expect(validateEmail('@example.com')).toBe(false)
  })

  test('returns false for empty string', () => {
    expect(validateEmail('')).toBe(false)
  })
})
```

### Verificar se usuario existe
```typescript
// Funcao com responsabilidade unica: verificar existencia
function checkUserExists(users: User[], email: string): boolean {
  return users.some(user => user.email === email)
}

// Teste unitario
describe('checkUserExists', () => {
  const users = [
    { id: '1', email: 'existing@test.com', name: 'Test User' },
  ]

  test('returns true when user exists', () => {
    expect(checkUserExists(users, 'existing@test.com')).toBe(true)
  })

  test('returns false when user does not exist', () => {
    expect(checkUserExists(users, 'new@test.com')).toBe(false)
  })
})
```

### Verificar se produto esta cadastrado
```typescript
function isProductRegistered(products: Product[], productName: string): boolean {
  return products.some(
    product => product.name.toLowerCase() === productName.toLowerCase()
  )
}

describe('isProductRegistered', () => {
  const products = [{ id: '1', name: 'Notebook', price: 2500 }]

  test('returns true for registered product', () => {
    expect(isProductRegistered(products, 'Notebook')).toBe(true)
  })

  test('is case-insensitive', () => {
    expect(isProductRegistered(products, 'notebook')).toBe(true)
  })

  test('returns false for unregistered product', () => {
    expect(isProductRegistered(products, 'Tablet')).toBe(false)
  })
})
```

## Teste de Integracao — Unidades trabalhando juntas

### Fluxo de login (exemplo do instrutor)
```typescript
// Cada funcao e uma unidade
function findUserByEmail(users: User[], email: string): User | undefined {
  return users.find(user => user.email === email)
}

function verifyPassword(user: User, password: string): boolean {
  return user.password === password // simplificado — use bcrypt em producao
}

function generateToken(user: User): string {
  return `token-${user.id}-${Date.now()}`
}

// loginUser integra as tres unidades
function loginUser(
  users: User[],
  email: string,
  password: string
): { user: User; token: string } | { error: string } {
  const user = findUserByEmail(users, email)
  if (!user) return { error: 'User not found' }

  const isPasswordValid = verifyPassword(user, password)
  if (!isPasswordValid) return { error: 'Invalid password' }

  const token = generateToken(user)
  return { user, token }
}

// Teste de integracao — testa as etapas trabalhando juntas
describe('loginUser (integration)', () => {
  const users = [
    { id: '1', email: 'user@test.com', password: 'secret123', name: 'Test' },
  ]

  test('returns user and token for valid credentials', () => {
    const result = loginUser(users, 'user@test.com', 'secret123')

    expect(result).toHaveProperty('user')
    expect(result).toHaveProperty('token')
    expect((result as any).user.email).toBe('user@test.com')
  })

  test('returns error when user not found', () => {
    const result = loginUser(users, 'unknown@test.com', 'secret123')

    expect(result).toEqual({ error: 'User not found' })
  })

  test('returns error for wrong password', () => {
    const result = loginUser(users, 'user@test.com', 'wrong')

    expect(result).toEqual({ error: 'Invalid password' })
  })
})
```

## Teste End-to-End — Simulando o usuario final

### Autenticacao via API (exemplo do instrutor)
```typescript
import request from 'supertest'
import { app } from '../app'

describe('Authentication E2E', () => {
  test('user can authenticate and receive user data', async () => {
    // Simula o que um usuario real faria: enviar credenciais
    const response = await request(app)
      .post('/auth/login')
      .send({
        email: 'user@test.com',
        password: 'secret123',
      })

    // Verifica se voltou os dados do usuario (como instrutor descreveu)
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('user')
    expect(response.body.user).toHaveProperty('email', 'user@test.com')
    expect(response.body).toHaveProperty('token')
  })

  test('user receives error for invalid credentials', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        email: 'user@test.com',
        password: 'wrongpassword',
      })

    expect(response.status).toBe(401)
    expect(response.body).toHaveProperty('error')
  })
})
```

### Variacao: E2E com cadastro completo
```typescript
describe('User Registration E2E', () => {
  test('new user can register and then login', async () => {
    // Passo 1: Cadastro (simula usuario preenchendo formulario)
    const registerResponse = await request(app)
      .post('/auth/register')
      .send({
        name: 'New User',
        email: 'newuser@test.com',
        password: 'secure123',
      })

    expect(registerResponse.status).toBe(201)
    expect(registerResponse.body.user).toHaveProperty('id')

    // Passo 2: Login (simula usuario fazendo login apos cadastro)
    const loginResponse = await request(app)
      .post('/auth/login')
      .send({
        email: 'newuser@test.com',
        password: 'secure123',
      })

    expect(loginResponse.status).toBe(200)
    expect(loginResponse.body).toHaveProperty('token')
  })
})
```

## Comparacao lado a lado

```typescript
// MESMA funcionalidade, tres niveis de teste:

// 1. UNITARIO — testa a validacao isolada
test('validateEmail rejects invalid format', () => {
  expect(validateEmail('bad')).toBe(false)
})

// 2. INTEGRACAO — testa validacao + busca + verificacao juntas
test('login rejects user with invalid email', () => {
  const result = loginUser(users, 'bad', 'pass')
  expect(result).toEqual({ error: 'User not found' })
})

// 3. E2E — testa do ponto de vista do usuario final
test('API rejects login with invalid email', async () => {
  const response = await request(app)
    .post('/auth/login')
    .send({ email: 'bad', password: 'pass' })
  expect(response.status).toBe(400)
})
```
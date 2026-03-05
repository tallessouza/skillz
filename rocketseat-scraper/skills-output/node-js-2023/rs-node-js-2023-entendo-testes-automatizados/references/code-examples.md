# Code Examples: Testes Automatizados

## Exemplo conceitual: teste unitario de funcao utilitaria

O instrutor usa o exemplo de uma funcao de formatacao de data que e usada em varios locais da aplicacao:

```typescript
// utils/format-date.ts
// Uma funcao utilitaria pura — candidata perfeita para teste unitario
export function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
```

```typescript
// utils/format-date.test.ts
// Teste unitario: testa a funcao SOZINHA, sem contexto
// Nao testa onde ela e usada, nao testa a rota que lista datas
import { formatDate } from './format-date'

test('should format date as YYYY-MM-DD', () => {
  const input = new Date(2023, 5, 15) // 15 de junho de 2023
  const result = formatDate(input)
  expect(result).toBe('2023-06-15')
})

test('should pad single digit month and day', () => {
  const input = new Date(2023, 0, 5) // 5 de janeiro de 2023
  const result = formatDate(input)
  expect(result).toBe('2023-01-05')
})
```

**Ponto-chave do instrutor:** "Voce nao testa aonde essa funcao esta sendo utilizada. Voce nao testa se la na rota que lista as datas a funcao retornou corretamente. Nao, voce testa especificamente aquela funcao sozinha, sem contexto."

## Exemplo conceitual: teste de integracao

Quando varias funcoes trabalham juntas:

```typescript
// Teste de integracao: testa a comunicacao entre service e repository
// Funcao A chama Funcao B chama Funcao C — testadas juntas
import { CreateUserService } from './create-user-service'
import { InMemoryUsersRepository } from './in-memory-users-repository'

test('should create user and persist to repository', async () => {
  const repository = new InMemoryUsersRepository()
  const service = new CreateUserService(repository)

  const user = await service.execute({
    name: 'Diego',
    email: 'diego@rocketseat.com.br',
  })

  expect(user.id).toBeDefined()
  expect(repository.users).toHaveLength(1)
})
```

## Exemplo conceitual: teste e2e no back-end

O instrutor explica que no back-end, e2e simula o front-end fazendo chamadas HTTP:

```typescript
// Teste e2e: simula o front-end fazendo chamada HTTP real
// Testa de ponta a ponta: rota → service → banco de dados → resposta
import request from 'supertest'
import { app } from './app'

test('should be able to create a new transaction', async () => {
  // Simula exatamente o que o front-end faria
  const response = await request(app.server)
    .post('/transactions')
    .send({
      title: 'Freelance',
      amount: 5000,
      type: 'credit',
    })

  expect(response.statusCode).toBe(201)
})

test('should be able to list all transactions', async () => {
  // Primeiro cria uma transacao (como o usuario faria)
  await request(app.server)
    .post('/transactions')
    .send({
      title: 'Freelance',
      amount: 5000,
      type: 'credit',
    })

  // Depois lista (como o usuario faria)
  const listResponse = await request(app.server)
    .get('/transactions')

  expect(listResponse.statusCode).toBe(200)
  expect(listResponse.body.transactions).toHaveLength(1)
})
```

## Comparacao: e2e front-end vs back-end

O instrutor faz uma distincao importante:

```typescript
// E2E NO FRONT-END (exemplo com Cypress/Playwright)
// Abre um navegador real (muitas vezes headless)
test('should login successfully', async () => {
  await page.goto('/login')
  await page.fill('#email', 'diego@rocketseat.com.br')
  await page.fill('#password', 'senha123')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL('/dashboard')
})

// E2E NO BACK-END (exemplo com supertest)
// Faz chamada HTTP real — porque o "usuario" do back-end e o front-end
test('should login successfully', async () => {
  const response = await request(app.server)
    .post('/sessions')
    .send({
      email: 'diego@rocketseat.com.br',
      password: 'senha123',
    })

  expect(response.statusCode).toBe(200)
  expect(response.body.token).toBeDefined()
})
```

## Calculo de escala mencionado pelo instrutor

```
Cenario Rocketseat:
- 2000+ testes no back-end Node.js
- Se todos fossem e2e: ~500ms por teste
- Total: 2000 × 500ms = 1.000.000ms = 1000s ≈ 16 minutos

Cenario com piramide:
- 1600 unitarios × 5ms   =  8.000ms  =   8s
- 300 integracao × 50ms   = 15.000ms  =  15s
- 100 e2e × 500ms         = 50.000ms  =  50s
- Total:                                  73s ≈ 1.2 minutos
```
---
name: rs-node-js-2023-testes-e2e-perguntas
description: "Applies NestJS E2E testing patterns for authenticated endpoints when writing controller tests. Use when user asks to 'write e2e test', 'test controller', 'test authenticated route', 'test NestJS endpoint', or 'add integration test'. Covers authentication setup in tests, JWTService token generation, Prisma database seeding and assertions. Make sure to use this skill whenever creating NestJS controller E2E tests that require authentication. Not for unit tests, service tests, or non-NestJS frameworks."
---

# Testes E2E de Controllers Autenticados no NestJS

> Ao escrever testes E2E para rotas autenticadas, configure autenticacao dentro do proprio teste usando JWTService e Prisma, nunca dependendo de rotas de login.

## Rules

1. **Crie o usuario direto no banco** — use `prisma.user.create()` no teste, nao chame a rota de registro, porque o teste deve ser independente de outros endpoints
2. **Gere o token via JWTService** — use `jwt.sign({ sub: user.id })`, nao chame a rota de autenticacao, porque isola o teste do fluxo de login
3. **Senha nao precisa de hash em testes que nao testam login** — use senha plain como `'123456'`, porque o hash so importa quando o fluxo de autenticacao e testado
4. **Use `.set()` para enviar Authorization header** — `.set('Authorization', \`Bearer ${accessToken}\`)` antes do `.send()`, porque e assim que supertest injeta headers
5. **Verifique no banco apos criacao** — use `prisma.entity.findFirst({ where: ... })` para confirmar que o dado persistiu, porque o status 201 sozinho nao garante persistencia
6. **Use `createMany` para seed de dados em testes de listagem** — crie multiplos registros com `prisma.entity.createMany({ data: [...] })`, porque testes de listagem precisam de dados pre-existentes

## How to write

### Teste de criacao com autenticacao

```typescript
// create-question.controller.e2e-spec.ts
it('[POST] /questions', async () => {
  const user = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    },
  })

  const accessToken = jwt.sign({ sub: user.id })

  const response = await request(app.getHttpServer())
    .post('/questions')
    .set('Authorization', `Bearer ${accessToken}`)
    .send({
      title: 'New question',
      content: 'Question content',
    })

  expect(response.statusCode).toBe(201)

  const questionOnDatabase = await prisma.question.findFirst({
    where: { title: 'New question' },
  })

  expect(questionOnDatabase).toBeTruthy()
})
```

### Teste de listagem com seed

```typescript
// fetch-recent-questions.controller.e2e-spec.ts
it('[GET] /questions', async () => {
  const user = await prisma.user.create({
    data: { name: 'John Doe', email: 'john@example.com', password: '123456' },
  })

  const accessToken = jwt.sign({ sub: user.id })

  await prisma.question.createMany({
    data: [
      { title: 'Question 01', slug: 'question-01', content: 'Content', authorId: user.id },
      { title: 'Question 02', slug: 'question-02', content: 'Content', authorId: user.id },
    ],
  })

  const response = await request(app.getHttpServer())
    .get('/questions')
    .set('Authorization', `Bearer ${accessToken}`)
    .send()

  expect(response.statusCode).toBe(200)
  expect(response.body).toEqual({
    questions: expect.arrayContaining([
      expect.objectContaining({ title: 'Question 01' }),
      expect.objectContaining({ title: 'Question 02' }),
    ]),
  })
})
```

### Setup do modulo de teste

```typescript
let app: INestApplication
let prisma: PrismaService
let jwt: JwtService

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile()

  app = moduleRef.createNestApplication()
  prisma = moduleRef.get(PrismaService)
  jwt = moduleRef.get(JwtService)

  await app.init()
})
```

## Example

**Before (dependendo da rota de login):**
```typescript
// Errado: teste acoplado ao endpoint de autenticacao
const loginResponse = await request(app.getHttpServer())
  .post('/sessions')
  .send({ email: 'john@example.com', password: '123456' })

const token = loginResponse.body.access_token

await request(app.getHttpServer())
  .post('/questions')
  .set('Authorization', `Bearer ${token}`)
  .send({ title: 'New question', content: 'Content' })
```

**After (token gerado diretamente):**
```typescript
// Correto: teste isolado, token gerado via JWTService
const user = await prisma.user.create({
  data: { name: 'John', email: 'john@example.com', password: '123456' },
})

const accessToken = jwt.sign({ sub: user.id })

await request(app.getHttpServer())
  .post('/questions')
  .set('Authorization', `Bearer ${accessToken}`)
  .send({ title: 'New question', content: 'Content' })
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Rota requer autenticacao | Crie usuario no banco + gere token com JWTService |
| Teste de POST/criacao | Verifique status 201 E consulte banco com findFirst |
| Teste de GET/listagem | Seed com createMany, verifique body com arrayContaining |
| Validacao parcial de objetos | Use `expect.objectContaining({ campo: valor })` |
| Senha do usuario no seed | Plain text basta se nao testa login |

## Anti-patterns

| Nunca faca | Faca ao inves |
|------------|---------------|
| Chamar rota de login para obter token no teste | `jwt.sign({ sub: user.id })` direto |
| Verificar apenas status code em POST | Verificar status + consultar banco |
| Criar dados de seed um por um | Usar `createMany` para multiplos registros |
| Validar todas as propriedades do objeto retornado | `expect.objectContaining({ title: '...' })` |
| Hardcodar `perPage: 1` em producao | Usar valor real (ex: 20) e testar com seed adequado |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

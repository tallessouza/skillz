---
name: rs-node-js-2023-testes-e2e-usuarios
description: "Applies NestJS E2E testing patterns when writing end-to-end tests for controllers. Use when user asks to 'write e2e test', 'test controller', 'test route', 'create integration test', or 'test NestJS endpoint'. Covers createTestingModule setup, supertest requests, database assertions with Prisma, and isolated test environments. Make sure to use this skill whenever generating NestJS controller tests or e2e test files. Not for unit tests, mocking services, or frontend testing."
---

# Testes E2E no NestJS

> Testes end-to-end validam rotas HTTP completas, incluindo persistencia no banco de dados, usando ambiente isolado.

## Rules

1. **Use `createTestingModule` em vez de subir o servidor** — porque permite rodar testes em paralelo sem conflito de porta e de forma programatica
2. **Categorize testes E2E no describe** — adicione `(E2E)` no describe para diferenciar quando todos os testes rodam juntos
3. **Use nomes tecnicos nas rotas, nao semanticos** — `[POST] /accounts` em vez de `should create a user`, porque testes de rota sao tecnicos por natureza
4. **Valide alem do status code** — consulte o banco de dados para garantir que o dado foi realmente persistido, porque status 201 nao garante persistencia
5. **Acesse servicos internos via `moduleRef.get()`** — em vez de instanciar Prisma separadamente, porque reutiliza a mesma instancia da aplicacao
6. **Prepare dados no banco antes de testar fluxos dependentes** — para autenticacao, crie o usuario diretamente no banco com senha hasheada antes de testar login

## How to write

### Setup do modulo de teste

```typescript
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { AppModule } from './../app.module'
import request from 'supertest'

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
})
```

### Teste de criacao com validacao no banco

```typescript
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
    where: { email: 'johndoe@example.com' },
  })

  expect(userOnDatabase).toBeTruthy()
})
```

### Teste de autenticacao com dados pre-criados

```typescript
test('[POST] /sessions', async () => {
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
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Testando rota de criacao | Valide status code E consulte banco |
| Testando rota que depende de dados | Crie dados diretamente via Prisma no banco antes |
| Senha no banco de teste | Use `hash()` do bcryptjs, nunca texto puro |
| Verificando existencia no banco | Use `toBeTruthy()` em vez de comparar objeto completo |
| Validando resposta com token | Use `expect.any(String)` para valores dinamicos |
| Nomeando o test | Use formato `[METHOD] /route` |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `it('should create user')` em teste de rota | `test('[POST] /accounts')` |
| Subir servidor com `app.listen(3333)` nos testes | Usar `createTestingModule` + `app.init()` |
| Instanciar `new PrismaClient()` no teste | `moduleRef.get(PrismaService)` |
| Enviar senha em texto puro ao criar usuario no banco | `await hash('123456', 8)` |
| Validar somente `statusCode` na criacao | Validar statusCode + consultar banco |
| Criar instancia separada de dependencias | Pegar do modulo via `.get()` |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

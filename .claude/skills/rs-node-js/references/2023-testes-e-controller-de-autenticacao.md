---
name: rs-node-js-2023-testes-controller-auth
description: "Applies TDD patterns for authentication use cases and controllers in Node.js with SOLID architecture. Use when user asks to 'write auth tests', 'create authentication', 'test use case', 'implement login', or 'create session controller'. Enforces SUT naming, repository-level setup instead of cross-use-case dependencies, semantic REST routes as entities, and proper HTTP status codes. Make sure to use this skill whenever writing tests for use cases or creating authentication controllers in Node/Fastify apps. Not for frontend auth, JWT token generation, or session management logic."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: autenticacao-e-tdd
  tags: [tdd, authentication, use-case, sut, fastify, controller, bcrypt, sessions]
---

# Testes e Controller de Autenticacao

> Testes de use case validam funcionalidades isoladamente usando repositorios em memoria, sem depender de rotas HTTP ou outros use cases.

## Rules

1. **Nomeie a variavel principal como `sut`** — System Under Test identifica o que esta sendo testado, porque ao copiar testes entre arquivos voce nunca esquece de renomear a variavel principal
2. **Nunca chame outro use case dentro do teste** — use o repositorio diretamente para setup, porque chamar RegisterUseCase dentro do teste de autenticacao testa dois use cases ao mesmo tempo
3. **Faca hash da senha no setup do teste** — ao criar usuario via repositorio direto, envie `password_hash` (nao plaintext), porque o use case de autenticacao compara hashes
4. **Teste o caminho feliz primeiro** — `it should be able to authenticate`, depois os casos de erro com credenciais invalidas
5. **Use `expect().rejects.toBeInstanceOf()`** — para validar que erros especificos sao lancados nos casos de falha
6. **Rotas como entidades, nao verbos** — `/sessions` (criando uma sessao) ao inves de `/authenticate`, porque REST e sobre recursos

## How to write

### Teste de use case com SUT

```typescript
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

beforeEach(() => {
  usersRepository = new InMemoryUsersRepository()
  sut = new AuthenticateUseCase(usersRepository)
})
```

### Setup via repositorio direto (sem usar outro use case)

```typescript
// Crie o usuario direto no repositorio com hash da senha
await usersRepository.create({
  name: 'John Doe',
  email: 'johndoe@example.com',
  password_hash: await hash('123456', 6),
})

// Agora teste a autenticacao
const { user } = await sut.execute({
  email: 'johndoe@example.com',
  password: '123456',
})
```

### Controller de autenticacao

```typescript
export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = authenticateBodySchema.parse(request.body)

  try {
    const authenticateUseCase = makeAuthenticateUseCase()
    await authenticateUseCase.execute({ email, password })
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: err.message })
    }
    throw err
  }

  return reply.status(200).send()
}
```

### Rota semantica

```typescript
// POST /sessions — "criando uma sessao"
app.post('/sessions', authenticate)

// NAO: POST /authenticate — "criando um authenticate" nao faz sentido
```

## Example

**Before (testando dois use cases juntos):**
```typescript
const registerUseCase = new RegisterUseCase(usersRepository)
await registerUseCase.execute({ name: 'John', email: 'j@e.com', password: '123456' })
const result = await authenticateUseCase.execute({ email: 'j@e.com', password: '123456' })
```

**After (setup isolado via repositorio):**
```typescript
await usersRepository.create({
  name: 'John',
  email: 'j@e.com',
  password_hash: await hash('123456', 6),
})
const { user } = await sut.execute({ email: 'j@e.com', password: '123456' })
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Teste precisa de dados pre-existentes | Crie direto no repositorio in-memory |
| Variavel principal do teste | Nomeie como `sut` |
| Rota de autenticacao | Use `POST /sessions` |
| Sucesso sem criacao de recurso | Retorne status 200 (nao 201) |
| Erro de credenciais | Retorne status 400 Bad Request |
| Copiar teste de outro arquivo | `sut` evita esquecimento de renomear |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `const authenticateUseCase = ...` no teste | `const sut = ...` |
| `await registerUseCase.execute(...)` no teste de auth | `await usersRepository.create(...)` |
| `app.post('/authenticate', ...)` | `app.post('/sessions', ...)` |
| `reply.status(201)` para login | `reply.status(200)` para login |
| `password: '123456'` no create do repo | `password_hash: await hash('123456', 6)` |

## Troubleshooting

### Teste de autenticacao falha com InvalidCredentialsError inesperado
**Symptom:** `expect().rejects.toBeInstanceOf(InvalidCredentialsError)` nao e lancado, ou o teste passa quando deveria falhar
**Cause:** O usuario foi criado via outro use case (RegisterUseCase) em vez de diretamente no repositorio, testando dois use cases simultaneamente
**Fix:** Crie o usuario direto no repositorio com `password_hash: await hash('123456', 6)` em vez de chamar outro use case

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

---
name: rs-node-js-2023-testes-cadastro-auth
description: "Enforces unit testing patterns for registration and authentication use cases in clean architecture NestJS apps. Use when user asks to 'test authentication', 'test registration', 'write use case tests', 'test signup login', or 'create specs for auth'. Applies patterns: in-memory repositories, fake hashers/encryptors, factory functions, password hashing verification. Make sure to use this skill whenever writing tests for user registration or authentication use cases. Not for E2E tests, controller tests, or integration tests."
---

# Testes de Cadastro e Autenticacao

> Testes unitarios de use cases de auth usam repositorios in-memory, fake cryptography e factories para isolar comportamento de dominio.

## Rules

1. **Crie repositorios in-memory por entidade** — `InMemoryStudentsRepository` implementa a interface `StudentsRepository`, porque testes unitarios nunca tocam banco de dados
2. **Use fakes para criptografia** — `FakeHasher` e `FakeEncrypter` substituem implementacoes reais, porque testes devem ser deterministicos e rapidos
3. **Use factories para criar entidades** — `makeStudent()` gera entidades com dados faker e aceita overrides parciais, porque evita repetir setup em cada teste
4. **Hash a senha antes de salvar no repositorio** — ao testar autenticacao, o student no repositorio deve ter a senha com hash aplicado, porque o use case compara hashes
5. **Verifique comportamento, nao implementacao** — teste que `result.isRight()` e que o valor retornado corresponde ao item salvo no repositorio
6. **Teste o hashing separadamente** — um teste dedicado verifica que a senha foi hasheada ao registrar, porque garante que o pipeline de seguranca funciona

## How to write

### Teste de registro (RegisterStudent)

```typescript
let repository: InMemoryStudentsRepository
let fakeHasher: FakeHasher
let sut: RegisterStudentUseCase

beforeEach(() => {
  repository = new InMemoryStudentsRepository()
  fakeHasher = new FakeHasher()
  sut = new RegisterStudentUseCase(repository, fakeHasher)
})

it('should be able to register a new student', async () => {
  const result = await sut.execute({
    name: 'John Doe',
    email: 'john@example.com',
    password: '123456',
  })

  expect(result.isRight()).toBe(true)
  expect(result.value).toEqual({
    student: repository.items[0],
  })
})

it('should hash student password upon registration', async () => {
  await sut.execute({
    name: 'John Doe',
    email: 'john@example.com',
    password: '123456',
  })

  const hashedPassword = await fakeHasher.hash('123456')
  expect(repository.items[0].password).toEqual(hashedPassword)
})
```

### Teste de autenticacao (AuthenticateStudent)

```typescript
let repository: InMemoryStudentsRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter
let sut: AuthenticateStudentUseCase

beforeEach(() => {
  repository = new InMemoryStudentsRepository()
  fakeHasher = new FakeHasher()
  fakeEncrypter = new FakeEncrypter()
  sut = new AuthenticateStudentUseCase(repository, fakeHasher, fakeEncrypter)
})

it('should be able to authenticate a student', async () => {
  const student = makeStudent({
    email: 'john@example.com',
    password: await fakeHasher.hash('123456'),
  })

  repository.items.push(student)

  const result = await sut.execute({
    email: 'john@example.com',
    password: '123456',
  })

  expect(result.isRight()).toBe(true)
  expect(result.value).toEqual({
    accessToken: expect.any(String),
  })
})
```

## Example

**Before (sem factory, senha sem hash):**
```typescript
it('should authenticate', async () => {
  // Bug: senha salva sem hash, autenticacao vai falhar
  repository.items.push(Student.create({
    name: 'John',
    email: 'john@example.com',
    password: '123456',
  }))

  const result = await sut.execute({
    email: 'john@example.com',
    password: '123456',
  })
})
```

**After (com factory e hash correto):**
```typescript
it('should authenticate', async () => {
  const student = makeStudent({
    email: 'john@example.com',
    password: await fakeHasher.hash('123456'),
  })

  repository.items.push(student)

  const result = await sut.execute({
    email: 'john@example.com',
    password: '123456',
  })

  expect(result.isRight()).toBe(true)
  expect(result.value).toEqual({
    accessToken: expect.any(String),
  })
})
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Use case tem dependencia de crypto | Crie fake que concatena sufixo (ex: `${value}-hashed`) |
| Teste precisa de entidade pre-existente | Use factory `makeEntity()` com overrides |
| Teste de autenticacao | Salve student com senha hasheada antes de autenticar |
| Verificar token retornado | `expect.any(String)` e suficiente para testes unitarios |
| Repositorio in-memory nao existe | Copie de outro existente, use replace all com preserve case |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Salvar senha plain text no repo para teste de auth | `await fakeHasher.hash('123456')` antes de salvar |
| Criar entidade manualmente em cada teste | Usar `makeStudent({ overrides })` |
| Validar formato JWT em teste unitario | `expect.any(String)` — validacao de formato e para E2E |
| Instanciar dependencias fora do `beforeEach` | Sempre resetar no `beforeEach` para isolamento |
| Usar `repository.create()` e `items.push()` intercambiavelmente sem pensar | `create()` dispara side effects do repo, `items.push()` e direto — escolha conforme intencao |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

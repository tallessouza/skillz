---
name: rs-node-js-2023-casos-uso-auth-cadastro
description: "Enforces clean architecture use case patterns for authentication and registration in NestJS/Node.js. Use when user asks to 'create a use case', 'implement authentication', 'register user', 'login endpoint', 'sign up flow', or any auth-related feature. Applies rules: gateway contracts over direct implementations, semantic error classes per use case, Either pattern for error handling, identifier-based error messages. Make sure to use this skill whenever building auth use cases or domain logic with repository pattern. Not for controller/route layer, database schemas, or JWT configuration."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: use-cases
  tags: [authentication, registration, either-pattern, gateway, hash, encrypter, nestjs]
---

# Casos de Uso: Autenticação e Cadastro

> Casos de uso encapsulam regras de negócio usando contratos (repositories e gateways), nunca implementações concretas.

## Rules

1. **Use cases recebem contratos, nunca implementações** — injete `StudentsRepository`, `HashGenerator`, `HashComparer`, `Encrypter`, porque isso permite trocar implementações sem alterar regras de negócio
2. **Erros semânticos por caso de uso** — crie classes como `StudentAlreadyExistsError`, `WrongCredentialsError` em `use-cases/errors/`, porque erros genéricos não comunicam o que aconteceu
3. **Erros de autenticação são genéricos para o usuário** — nunca retorne "user not found" ou "password does not match" separadamente, use `WrongCredentialsError` para ambos, porque isso previne enumeração de usuários
4. **Erros compartilhados vão para `core/errors`** — erros usados por múltiplos use cases ficam na pasta core, erros específicos ficam na pasta do use case
5. **Use Either pattern (Left/Right)** — retorne `left(error)` para falhas e `right(value)` para sucesso, porque permite type-safe error handling sem exceptions
6. **Erros recebem identifier genérico** — use `identifier` no constructor do erro em vez de `email`, porque o campo de login pode mudar para username ou CPF no futuro
7. **Hash e comparação são gateways separados** — `HashGenerator` para cadastro, `HashComparer` para login, `Encrypter` para token, porque cada operação tem responsabilidade distinta
8. **UniqueEntityId usa toString()** — ao passar IDs para gateways como o Encrypter, converta com `.toString()`, porque gateways esperam primitivos

## How to write

### Use case de cadastro (Register)

```typescript
export class RegisterStudent {
  constructor(
    private studentsRepository: StudentsRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({ name, email, password }: RegisterStudentRequest):
    Promise<Either<StudentAlreadyExistsError, { student: Student }>> {

    const studentWithSameEmail =
      await this.studentsRepository.findByEmail(email)

    if (studentWithSameEmail) {
      return left(new StudentAlreadyExistsError(email))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const student = Student.create({ name, email, password: hashedPassword })

    await this.studentsRepository.create(student)

    return right({ student })
  }
}
```

### Use case de autenticação (Authenticate)

```typescript
export class AuthenticateStudent {
  constructor(
    private studentsRepository: StudentsRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({ email, password }: AuthenticateStudentRequest):
    Promise<Either<WrongCredentialsError, { accessToken: string }>> {

    const student = await this.studentsRepository.findByEmail(email)

    if (!student) {
      return left(new WrongCredentialsError())
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      student.password,
    )

    if (!isPasswordValid) {
      return left(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: student.id.toString(),
    })

    return right({ accessToken })
  }
}
```

### Classe de erro semântico

```typescript
export class StudentAlreadyExistsError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Student "${identifier}" already exists.`)
  }
}

export class WrongCredentialsError extends Error implements UseCaseError {
  constructor() {
    super('Credentials are not valid.')
  }
}
```

## Example

**Before (lógica no controller):**
```typescript
@Post('/accounts')
async create(@Body() body) {
  const userExists = await this.prisma.user.findUnique({ where: { email: body.email } })
  if (userExists) throw new ConflictException()
  const hash = await bcrypt.hash(body.password, 8)
  await this.prisma.user.create({ data: { name: body.name, email: body.email, password: hash } })
}
```

**After (use case isolado):**
```typescript
// Use case recebe contratos, controller apenas orquestra
const result = await this.registerStudent.execute({
  name: body.name,
  email: body.email,
  password: body.password,
})

if (result.isLeft()) {
  throw new ConflictException(result.value.message)
}
```

## Heuristics

| Situação | Faça |
|----------|------|
| Cadastro de entidade | Verifique duplicata antes, retorne erro semântico |
| Autenticação/login | Use mesmo erro para "não encontrado" e "senha errada" |
| Senha recebida | Gere hash no cadastro, compare no login — gateways separados |
| Geração de token | Use Encrypter, passe ID como string primitiva |
| Erro usado em 1 use case | Pasta `use-cases/errors/` |
| Erro usado em N use cases | Pasta `core/errors/` |

## Anti-patterns

| Nunca escreva | Escreva ao invés |
|---------------|------------------|
| `throw new ConflictException()` no use case | `return left(new StudentAlreadyExistsError(email))` |
| `throw new Error('User not found')` na auth | `return left(new WrongCredentialsError())` |
| `bcrypt.hash()` direto no use case | `this.hashGenerator.hash(password)` via contrato |
| `jwt.sign()` direto no use case | `this.encrypter.encrypt(payload)` via contrato |
| `prisma.user.create()` no use case | `this.studentsRepository.create(student)` via repositório |
| `new Error('email already taken')` | `new StudentAlreadyExistsError(email)` com classe própria |

## Troubleshooting

### Use case lanca erro inesperado
**Symptom:** Teste falha com erro nao tratado no use case
**Cause:** Entidade dependente nao foi criada no repositorio in-memory antes de executar
**Fix:** Pre-seed o repositorio com todas as entidades necessarias usando factories antes de chamar `sut.execute()`

### Comparacao de ID falha silenciosamente
**Symptom:** `authorId !== entity.authorId` sempre retorna true mesmo com IDs corretos
**Cause:** `entity.authorId` e um UniqueEntityID, nao uma string
**Fix:** Use `.toString()` na comparacao: `entity.authorId.toString() !== authorId`

## Deep reference library

- [deep-explanation.md](mdc:data/skills/node-js-2023/rs-node-js-2023-casos-de-uso-autenticacao-e-cadastro/references/deep-explanation.md) — Raciocinio completo, analogias e edge cases
- [code-examples.md](mdc:data/skills/node-js-2023/rs-node-js-2023-casos-de-uso-autenticacao-e-cadastro/references/code-examples.md) — Todos os exemplos de codigo expandidos com variacoes

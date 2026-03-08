---
name: rs-node-js-2023-gateways-de-criptografia
description: "Enforces cryptography gateway patterns in Clean Architecture NestJS applications. Use when user asks to 'add authentication', 'implement login', 'hash password', 'generate JWT token', 'create user registration', or any auth-related feature. Applies rules: crypto functions never called directly from use cases, abstract contracts as gateways, Interface Segregation for hash/compare separation. Make sure to use this skill whenever implementing authentication or cryptography in layered architectures. Not for HTTP controller logic, database schema design, or frontend auth flows."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: cryptography-gateways
  tags: [cryptography, bcrypt, jwt, nestjs, clean-architecture, interface-segregation, solid]
---

# Gateways de Criptografia

> Funcoes de criptografia nunca sao chamadas diretamente pelo caso de uso — sempre atraves de um gateway (contrato abstrato) na camada de dominio.

## Rules

1. **Crie contratos abstratos para criptografia** — `abstract class Encrypter`, `abstract class HashGenerator`, porque o caso de uso nunca pode depender diretamente de Bcrypt ou JWT
2. **Coloque contratos em `domain/application/cryptography/`** — ao lado dos repositorios, porque sao gateways da mesma natureza (portas entre caso de uso e infraestrutura)
3. **Aplique Interface Segregation** — separe `HashGenerator` (gerar hash) de `HashComparer` (comparar hash), porque uma classe pode precisar de apenas um dos dois
4. **Implemente na camada de infra** — a classe concreta que usa Bcrypt/JWT fica em `infra/`, implementando os contratos abstratos, porque criptografia e detalhe de implementacao
5. **Use abstract class ao inves de interface** — no NestJS, injecao de dependencia nao funciona com interfaces TypeScript, porque interfaces nao existem em runtime

## How to write

### Contrato do Encrypter (JWT)

```typescript
// domain/application/cryptography/encrypter.ts
export abstract class Encrypter {
  abstract encrypt(payload: Record<string, unknown>): Promise<string>
}
```

### Contratos de Hash (Interface Segregation)

```typescript
// domain/application/cryptography/hash-generator.ts
export abstract class HashGenerator {
  abstract hash(plain: string): Promise<string>
}

// domain/application/cryptography/hash-comparer.ts
export abstract class HashComparer {
  abstract compare(plain: string, hash: string): Promise<boolean>
}
```

### Uso no caso de uso

```typescript
// domain/application/use-cases/register-student.ts
export class RegisterStudentUseCase {
  constructor(
    private studentsRepository: StudentsRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({ name, email, password }: RegisterStudentRequest) {
    const existingStudent = await this.studentsRepository.findByEmail(email)
    if (existingStudent) {
      return left(new StudentAlreadyExistsError(email))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const student = Student.create({ name, email, password: hashedPassword })
    await this.studentsRepository.create(student)

    return right({ student })
  }
}
```

## Example

**Before (crypto acoplado no controller):**
```typescript
// Controller chamando Bcrypt e JWT diretamente
import { compare } from 'bcryptjs'
import { JwtService } from '@nestjs/jwt'

async authenticate(body) {
  const user = await this.prisma.user.findUnique({ where: { email } })
  const isPasswordValid = await compare(body.password, user.password)
  const token = await this.jwt.signAsync({ sub: user.id })
}
```

**After (com gateways):**
```typescript
// Caso de uso usa contratos abstratos
export class AuthenticateStudentUseCase {
  constructor(
    private studentsRepository: StudentsRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({ email, password }: AuthenticateRequest) {
    const student = await this.studentsRepository.findByEmail(email)
    if (!student) return left(new WrongCredentialsError())

    const isPasswordValid = await this.hashComparer.compare(password, student.password)
    if (!isPasswordValid) return left(new WrongCredentialsError())

    const accessToken = await this.encrypter.encrypt({ sub: student.id.toString() })
    return right({ accessToken })
  }
}
```

## Heuristics

| Situation | Do |
|-----------|-----|
| Caso de uso precisa gerar hash | Injete `HashGenerator` |
| Caso de uso precisa comparar senha | Injete `HashComparer` |
| Caso de uso precisa gerar token | Injete `Encrypter` |
| Classe concreta faz hash e compare | Implemente ambos contratos na mesma classe |
| Novo tipo de criptografia necessario | Crie novo contrato abstrato em `cryptography/` |

## Anti-patterns

| Never write | Write instead |
|-------------|---------------|
| `import { hash } from 'bcryptjs'` no use case | `this.hashGenerator.hash(password)` via contrato |
| `this.jwtService.signAsync()` no use case | `this.encrypter.encrypt(payload)` via contrato |
| `interface Encrypter {}` no NestJS | `abstract class Encrypter {}` porque DI precisa de runtime token |
| Um contrato `Hasher` com `hash()` e `compare()` | Dois contratos: `HashGenerator` e `HashComparer` (ISP) |
| Bcrypt importado no domain | Bcrypt apenas em `infra/cryptography/bcrypt-hasher.ts` |

## Troubleshooting

### NestJS nao resolve a dependencia do contrato de criptografia
**Symptom:** Erro Nest can't resolve dependencies of UseCase ao injetar HashGenerator ou Encrypter
**Cause:** O contrato foi definido como interface TypeScript em vez de abstract class, e interfaces nao existem em runtime
**Fix:** Use abstract class em vez de interface para os contratos de criptografia, porque o NestJS precisa de um token em runtime para DI

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

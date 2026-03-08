---
name: rs-node-js-2023-refactor-auth-controller
description: "Enforces clean architecture controller refactoring pattern in NestJS when user asks to 'refactor controller', 'use use case in controller', 'remove prisma from controller', 'clean architecture NestJS', or 'dependency injection NestJS'. Applies rules: controllers call use cases not repositories, register providers in module, create repository implementations with mappers, import required modules. Make sure to use this skill whenever refactoring NestJS controllers to clean architecture. Not for creating use cases from scratch, domain entity design, or testing."
metadata:
  author: Rocketseat
  version: 2.0.0
  course: node-js-2023
  module: controller-refactoring-auth
  tags: [nestjs, controller, clean-architecture, use-case, dependency-injection, mapper, module]
---

# Refatorando Controllers para Use Cases (NestJS Clean Architecture)

> Controllers delegam para use cases, nunca acessam repositorios ou servicos de infraestrutura diretamente.

## Rules

1. **Controller chama use case, nunca Prisma/JWT direto** — porque o controller e camada de apresentacao, nao de logica de negocio
2. **Registre use cases como providers no module** — no `HttpModule`, adicione cada use case nos `providers`, porque NestJS precisa saber injetar
3. **Crie repository implementations com mappers** — `PrismaStudentsRepository` implementa `StudentsRepository`, porque a camada de dominio nao conhece Prisma
4. **Exporte repositories no DatabaseModule** — `provide: StudentsRepository, useClass: PrismaStudentsRepository` + exports, porque outros modulos precisam da injecao
5. **Importe modulos de dependencia** — se o use case depende de `HashGenerator`, importe `CryptographicModule` no `HttpModule`, porque NestJS resolve dependencias pelo grafo de modulos
6. **Nomes podem diferir entre dominio e persistencia** — entidade `Student` pode mapear para tabela `User`, porque sao camadas independentes

## How to write

### Controller refatorado

```typescript
@Controller('/sessions')
export class AuthenticateController {
  constructor(
    private authenticateStudent: AuthenticateStudentUseCase,
  ) {}

  @Post()
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body

    const result = await this.authenticateStudent.execute({ email, password })

    if (result.isLeft()) {
      throw new Error() // tratativa de erro vem depois
    }

    const { accessToken } = result.value

    return { access_token: accessToken }
  }
}
```

### Module com providers e imports

```typescript
@Module({
  imports: [DatabaseModule, CryptographicModule],
  controllers: [AuthenticateController, CreateAccountController],
  providers: [RegisterStudentUseCase, AuthenticateStudentUseCase],
})
export class HttpModule {}
```

### Repository implementation com mapper

```typescript
@Injectable()
export class PrismaStudentsRepository implements StudentsRepository {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<Student | null> {
    const user = await this.prisma.user.findUnique({ where: { email } })
    if (!user) return null
    return PrismaStudentMapper.toDomain(user)
  }

  async create(student: Student): Promise<void> {
    const data = PrismaStudentMapper.toPrisma(student)
    await this.prisma.user.create({ data })
  }
}
```

### Mapper entre dominio e persistencia

```typescript
export class PrismaStudentMapper {
  static toDomain(raw: PrismaUser): Student {
    return Student.create({
      name: raw.name,
      email: raw.email,
      password: raw.password,
    }, new UniqueEntityID(raw.id))
  }

  static toPrisma(student: Student): Prisma.UserUncheckedCreateInput {
    return {
      id: student.id.toString(),
      name: student.name,
      email: student.email,
      password: student.password,
    }
  }
}
```

### DatabaseModule com provide/useClass

```typescript
@Module({
  providers: [
    PrismaService,
    { provide: StudentsRepository, useClass: PrismaStudentsRepository },
    { provide: QuestionsRepository, useClass: PrismaQuestionsRepository },
  ],
  exports: [PrismaService, StudentsRepository, QuestionsRepository],
})
export class DatabaseModule {}
```

## Example

**Before (controller acoplado):**
```typescript
@Post()
async handle(@Body() body) {
  const { email, password } = body
  const user = await this.prisma.user.findUnique({ where: { email } })
  const isValid = await compare(password, user.password)
  const token = this.jwt.sign({ sub: user.id })
  return { access_token: token }
}
```

**After (controller com use case):**
```typescript
@Post()
async handle(@Body() body) {
  const { email, password } = body
  const result = await this.authenticateStudent.execute({ email, password })
  if (result.isLeft()) throw new Error()
  const { accessToken } = result.value
  return { access_token: accessToken }
}
```

## Heuristics

| Situacao | Faca |
|----------|------|
| Controller importa PrismaService | Refatore para use case |
| Controller importa JwtService | Mova logica de token para use case |
| NestJS erro "can't resolve dependencies" | Verifique imports de modulos e providers |
| Erro "argument X at index N" | Module pai nao importa o modulo que exporta X |
| Entidade tem nome diferente no banco | Crie mapper com toDomain/toPrisma |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| `this.prisma.user.findUnique()` no controller | `this.authenticateStudent.execute()` |
| `this.jwt.sign()` no controller | Use case retorna `accessToken` no result |
| Registrar use case sem importar modulos de dependencia | Importe `DatabaseModule` e `CryptographicModule` |
| Exportar apenas `PrismaService` no DatabaseModule | Exporte tambem os repositories abstratos |
| Mapear 1:1 nome da tabela para entidade | Use mapper — nomes podem diferir entre camadas |

## Troubleshooting

### NestJS erro "Nest can't resolve dependencies of UseCase"
**Symptom:** Ao iniciar a aplicacao, NestJS lanca erro dizendo que nao consegue resolver dependencias do use case
**Cause:** O modulo que registra o use case nao importa os modulos que exportam as dependencias (DatabaseModule, CryptographicModule)
**Fix:** Adicione os modulos necessarios no array `imports` do `HttpModule`: `imports: [DatabaseModule, CryptographicModule]`

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

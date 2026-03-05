# Code Examples: Refatorando Controller de Autenticacao

## 1. Controller antes da refatoracao

```typescript
@Controller('/sessions')
export class AuthenticateController {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body

    const user = await this.prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      throw new UnauthorizedException('User credentials do not match.')
    }

    const isPasswordValid = await compare(password, user.password)

    if (!isPasswordValid) {
      throw new UnauthorizedException('User credentials do not match.')
    }

    const accessToken = this.jwt.sign({ sub: user.id })

    return { access_token: accessToken }
  }
}
```

## 2. Controller depois da refatoracao

```typescript
@Controller('/sessions')
export class AuthenticateController {
  constructor(
    private authenticateStudent: AuthenticateStudentUseCase,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body

    const result = await this.authenticateStudent.execute({
      email,
      password,
    })

    if (result.isLeft()) {
      throw new Error() // tratativa de erros vem depois
    }

    const { accessToken } = result.value

    return { access_token: accessToken }
  }
}
```

## 3. HttpModule com todos os providers e imports

```typescript
@Module({
  imports: [DatabaseModule, CryptographicModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionsController,
  ],
  providers: [
    RegisterStudentUseCase,
    AuthenticateStudentUseCase,
  ],
})
export class HttpModule {}
```

## 4. PrismaStudentsRepository completo

```typescript
@Injectable()
export class PrismaStudentsRepository implements StudentsRepository {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<Student | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return null
    }

    return PrismaStudentMapper.toDomain(user)
  }

  async create(student: Student): Promise<void> {
    const data = PrismaStudentMapper.toPrisma(student)

    await this.prisma.user.create({
      data,
    })
  }
}
```

## 5. PrismaStudentMapper completo

```typescript
import { User as PrismaUser, Prisma } from '@prisma/client'
import { Student } from '@/domain/forum/enterprise/entities/student'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export class PrismaStudentMapper {
  static toDomain(raw: PrismaUser): Student {
    return Student.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
      },
      new UniqueEntityID(raw.id),
    )
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

## 6. DatabaseModule com provide/useClass

```typescript
@Module({
  providers: [
    PrismaService,
    {
      provide: QuestionsRepository,
      useClass: PrismaQuestionsRepository,
    },
    {
      provide: StudentsRepository,
      useClass: PrismaStudentsRepository,
    },
  ],
  exports: [
    PrismaService,
    QuestionsRepository,
    StudentsRepository,
  ],
})
export class DatabaseModule {}
```

## 7. Tecnica de criacao rapida: find-and-replace

O instrutor usa uma tecnica pratica para criar novos repositories:

1. Copiar arquivo existente (`prisma-questions-repository.ts`)
2. Abrir find-and-replace com "Match Case" ativado
3. Substituir `Question` → `Student` (PascalCase)
4. Substituir `question` → `student` (camelCase)
5. Ajustar metodos especificos (ex: `findBySlug` → `findByEmail`)
6. Criar mapper correspondente com mesmo processo

Isso garante que todos os repositories seguem o mesmo padrao estrutural.

## 8. Debugging de dependency injection

Quando o NestJS mostra:

```
Nest can't resolve dependencies of RegisterStudentUseCase (?).
Please make sure that the argument StudentsRepository at index 0
is available in the HttpModule context.
```

Checklist de resolucao:
1. O `DatabaseModule` tem o `provide: StudentsRepository`? → Adicionar
2. O `DatabaseModule` exporta `StudentsRepository`? → Adicionar no exports
3. O `HttpModule` importa `DatabaseModule`? → Adicionar no imports
4. O `HttpModule` importa `CryptographicModule`? → Se use case depende de hash/crypto

Quando mostra interrogacao `(?)` na posicao do argumento, significa que o NestJS nao encontrou provider para aquela dependencia no contexto do modulo.
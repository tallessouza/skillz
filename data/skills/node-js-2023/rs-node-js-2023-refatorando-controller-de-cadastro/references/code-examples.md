# Code Examples: Refatorando Controllers para Clean Architecture

## Exemplo completo da aula

### Controller ANTES da refatoracao

```typescript
import { Body, Controller, Post } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { hash } from 'bcryptjs'

@Controller('/accounts')
export class CreateAccountController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async handle(@Body() body: CreateAccountBody) {
    const { name, email, password } = body

    const hashedPassword = await hash(password, 8)

    await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })
  }
}
```

### Controller DEPOIS da refatoracao

```typescript
import { Body, ConflictException, Controller, Post } from '@nestjs/common'
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student'

@Controller('/accounts')
export class CreateAccountController {
  constructor(private registerStudent: RegisterStudentUseCase) {}

  @Post()
  async handle(@Body() body: CreateAccountBody) {
    const { name, email, password } = body

    const result = await this.registerStudent.execute({
      name,
      email,
      password,
    })

    if (result.isLeft()) {
      throw new ConflictException()
    }
  }
}
```

## Checklist de refatoracao para outros controllers

Aplicando o mesmo padrao para qualquer controller:

```typescript
// 1. Identificar o use case correspondente
// CreateAccountController → RegisterStudentUseCase
// AuthenticateController → AuthenticateStudentUseCase
// CreateQuestionController → CreateQuestionUseCase

// 2. Trocar injecao no constructor
constructor(private createQuestion: CreateQuestionUseCase) {}

// 3. Chamar execute() com os parametros do body
const result = await this.createQuestion.execute({
  authorId: userId,
  title,
  content,
})

// 4. Tratar Result
if (result.isLeft()) {
  // mapear erro do dominio para erro HTTP
  throw new BadRequestException()
}

// 5. Retornar dados se necessario
return { questionId: result.value.question.id.toString() }
```

## Comandos de validacao

```bash
# Testar manualmente (criar conta via HTTP)
# POST /accounts com body { name, email, password }

# Rodar testes E2E
pnpm run test:e2e

# Rodar testes unitarios
pnpm run test
```

## Variacao: controller que retorna dados

```typescript
@Controller('/questions')
export class FetchRecentQuestionsController {
  constructor(private fetchRecentQuestions: FetchRecentQuestionsUseCase) {}

  @Get()
  async handle(@Query('page') page: number) {
    const result = await this.fetchRecentQuestions.execute({ page })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return { questions: result.value.questions.map(QuestionPresenter.toHTTP) }
  }
}
```
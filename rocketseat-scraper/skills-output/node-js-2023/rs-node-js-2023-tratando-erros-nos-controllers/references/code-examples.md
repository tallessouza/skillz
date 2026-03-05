# Code Examples: Tratando Erros nos Controllers

## Exemplo 1: AuthenticateController

```typescript
import { UnauthorizedException, BadRequestException } from '@nestjs/common'
import { WrongCredentialsError } from '@/domain/forum/application/use-cases/errors/wrong-credentials-error'

@Controller('/sessions')
export class AuthenticateController {
  constructor(private authenticateStudent: AuthenticateStudentUseCase) {}

  @Post()
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email, password } = body

    const result = await this.authenticateStudent.execute({ email, password })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { accessToken } = result.value

    return { access_token: accessToken }
  }
}
```

## Exemplo 2: CreateAccountController

```typescript
import { ConflictException, BadRequestException } from '@nestjs/common'
import { StudentAlreadyExistsError } from '@/domain/forum/application/use-cases/errors/student-already-exists-error'

@Controller('/accounts')
export class CreateAccountController {
  constructor(private registerStudent: RegisterStudentUseCase) {}

  @Post()
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, email, password } = body

    const result = await this.registerStudent.execute({ name, email, password })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case StudentAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
```

**Resultado HTTP ao tentar email duplicado:**
```json
{
  "message": "Student \"Diego 5\" already exists.",
  "error": "Conflict",
  "statusCode": 409
}
```

## Exemplo 3: Controllers sem erros tipados

```typescript
// CreateQuestionController
@Controller('/questions')
export class CreateQuestionController {
  constructor(private createQuestion: CreateQuestionUseCase) {}

  @Post()
  async handle(@Body() body: CreateQuestionBodySchema) {
    const result = await this.createQuestion.execute({ ... })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}

// FetchRecentQuestionsController
@Controller('/questions')
export class FetchRecentQuestionsController {
  constructor(private fetchRecentQuestions: FetchRecentQuestionsUseCase) {}

  @Get()
  async handle(@Query() query: PageQuerySchema) {
    const result = await this.fetchRecentQuestions.execute({ page: query.page })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { questions } = result.value

    return { questions: questions.map(QuestionPresenter.toHTTP) }
  }
}
```

## Tabela de mapeamento completa

| Erro de Dominio | Excecao HTTP | Status Code | Contexto |
|-----------------|-------------|-------------|----------|
| `WrongCredentialsError` | `UnauthorizedException` | 401 | Login com credenciais invalidas |
| `StudentAlreadyExistsError` | `ConflictException` | 409 | Cadastro com email duplicado |
| Sem erro tipado | `BadRequestException` | 400 | Fallback para erros genericos |
| Erro nao tratado | (automatico NestJS) | 500 | InternalServerError |
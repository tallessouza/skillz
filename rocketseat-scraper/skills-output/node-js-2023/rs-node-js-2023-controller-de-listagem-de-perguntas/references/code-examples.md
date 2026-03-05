# Code Examples: Controller de Listagem com Paginacao

## Exemplo completo do controller

```typescript
// fetch-recent-questions.controller.ts
import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { z } from 'zod'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
    const perPage = 1 // Na aula usou 1 para teste, em producao usar 20

    const questions = await this.prisma.question.findMany({
      take: perPage,
      skip: (page - 1) * perPage,
      orderBy: {
        createdAt: 'desc',
      },
    })

    return { questions }
  }
}
```

## Registro no AppModule

```typescript
// app.module.ts
@Module({
  controllers: [
    CreateQuestionController,
    FetchRecentQuestionsController, // Adicionar aqui
  ],
})
export class AppModule {}
```

## ZodValidationPipe com suporte a transform

```typescript
// zod-validation-pipe.ts
import { PipeTransform, BadRequestException } from '@nestjs/common'
import { ZodError, ZodSchema } from 'zod'

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      // IMPORTANTE: return aqui para que transforms funcionem
      return this.schema.parse(value)
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          message: 'Validation failed',
          statusCode: 400,
          errors: error.flatten().fieldErrors,
        })
      }

      throw new BadRequestException('Validation failed')
    }
  }
}
```

## Teste via HTTP client

```http
### Fetch Recent Questions (sem page — usa default 1)
GET http://localhost:3333/questions
Authorization: Bearer {{token}}

### Fetch Recent Questions (page 1)
GET http://localhost:3333/questions?page=1
Authorization: Bearer {{token}}

### Fetch Recent Questions (page 2)
GET http://localhost:3333/questions?page=2
Authorization: Bearer {{token}}
```

## Variacao: paginacao com total count

```typescript
@Get()
async handle(@Query('page', queryValidationPipe) page: PageQueryParamSchema) {
  const perPage = 20

  const [questions, total] = await Promise.all([
    this.prisma.question.findMany({
      take: perPage,
      skip: (page - 1) * perPage,
      orderBy: { createdAt: 'desc' },
    }),
    this.prisma.question.count(),
  ])

  // Extensivel sem quebrar contrato — motivo de retornar objeto
  return { questions, total, page, perPage }
}
```

## Variacao: multiplos query params validados

```typescript
const listQuestionsSchema = z.object({
  page: z.string().optional().default('1').transform(Number).pipe(z.number().min(1)),
  perPage: z.string().optional().default('20').transform(Number).pipe(z.number().min(1).max(100)),
  orderBy: z.enum(['createdAt', 'title']).optional().default('createdAt'),
})
```